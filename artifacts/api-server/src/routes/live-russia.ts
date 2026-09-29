import { Router, type IRouter } from "express";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, assistantAccounts, knowledgeItems } from "@workspace/db";
import {
  UpdateAccountAccessBody,
  RegisterAccountBody,
  UpdateAccountBody,
  GetAccountParams,
  GetKnowledgeParams,
  GetKnowledgeResponse,
  CreateKnowledgeBody,
  CreateKnowledgeResponse,
  UpdateKnowledgeBody,
  UpdateKnowledgeResponse,
  ListAccountsResponse,
  ListKnowledgeQueryParams,
  ListKnowledgeResponse,
  RegisterAccountResponse,
  UpdateAccountAccessParams,
  UpdateAccountAccessResponse,
  UpdateAccountParams,
  UpdateAccountResponse,
  GetAccountResponse,
  GetDashboardStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
let seedPromise: Promise<void> | null = null;

const seedKnowledge = [
  {
    title: "Как открыть меню команд?",
    answer:
      "Откройте раздел «Команды» в нижней навигации. В поиске можно вводить название, часть команды или ключевое слово из вопроса.",
    category: "Команды",
    tags: ["меню", "поиск", "команды"],
    isPremium: false,
  },
  {
    title: "Как выдать стартовый набор?",
    answer:
      "Используйте /starterpack с ID игрока. Перед выдачей проверьте, что игрок находится на сервере и у него нет активного набора.",
    category: "Команды",
    tags: ["starterpack", "набор", "игрок"],
    isPremium: false,
  },
  {
    title: "Стоимость VIP-статуса",
    answer:
      "VIP на 30 дней — 499 ₽. VIP+ на 30 дней — 899 ₽. Перед оплатой уточните сервер и срок действия.",
    category: "Цены",
    tags: ["vip", "цена", "оплата"],
    isPremium: false,
  },
  {
    title: "Как оформить возврат?",
    answer:
      "Проверьте номер заказа, статус платежа и причину обращения. Возврат передаётся старшему помощнику после проверки.",
    category: "Регламент",
    tags: ["возврат", "платёж", "заказ"],
    isPremium: true,
  },
  {
    title: "Команды старшего помощника",
    answer:
      "Раздел для старших помощников: /warn, /mute, /checklogs и /transfercase. Используйте только по регламенту и фиксируйте причину.",
    category: "Premium",
    tags: ["старший", "модерация", "логи"],
    isPremium: true,
  },
];

async function ensureSeed(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const [{ value: knowledgeCount }] = await db
        .select({ value: count() })
        .from(knowledgeItems);
      if (Number(knowledgeCount) === 0) {
        await db.insert(knowledgeItems).values(seedKnowledge);
      }

      const [{ value: accountCount }] = await db
        .select({ value: count() })
        .from(assistantAccounts);
      if (Number(accountCount) === 0) {
        await db.insert(assistantAccounts).values({
          accountNumber: "LR-ADMIN-001",
          displayName: "Live Russia Admin",
          username: "admin",
          role: "admin",
          isPremium: true,
          status: "active",
        });
      }
    })();
  }
  await seedPromise;
}

function mapKnowledge(item: typeof knowledgeItems.$inferSelect) {
  return {
    id: item.id,
    title: item.title,
    answer: item.answer,
    category: item.category,
    tags: item.tags,
    isPremium: item.isPremium,
    updatedAt: item.updatedAt.toISOString(),
  };
}

function mapAccount(account: typeof assistantAccounts.$inferSelect) {
  return {
    accountNumber: account.accountNumber,
    displayName: account.displayName,
    username: account.username,
    role: account.role as "assistant" | "admin",
    isPremium: account.isPremium,
    status: account.status as "active" | "blocked",
    createdAt: account.createdAt.toISOString(),
    lastSeenAt: account.lastSeenAt.toISOString(),
  };
}

router.get("/knowledge", async (req, res): Promise<void> => {
  await ensureSeed();
  const parsed = ListKnowledgeQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, category } = parsed.data;
  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(knowledgeItems.title, `%${search}%`),
        ilike(knowledgeItems.answer, `%${search}%`),
        sql`${search} = ANY(${knowledgeItems.tags})`,
      ),
    );
  }
  if (category) conditions.push(eq(knowledgeItems.category, category));

  const rows = await db
    .select()
    .from(knowledgeItems)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(knowledgeItems.updatedAt));
  res.json(ListKnowledgeResponse.parse(rows.map(mapKnowledge)));
});

router.post("/knowledge", async (req, res): Promise<void> => {
  await ensureSeed();
  const parsed = CreateKnowledgeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db
    .insert(knowledgeItems)
    .values({
      title: parsed.data.title.trim(),
      answer: parsed.data.answer.trim(),
      category: parsed.data.category.trim(),
      tags: parsed.data.tags.map((tag) => tag.trim()).filter(Boolean),
      isPremium: parsed.data.isPremium,
    })
    .returning();
  res.status(201).json(CreateKnowledgeResponse.parse(mapKnowledge(item)));
});

router.patch("/knowledge/:id", async (req, res): Promise<void> => {
  await ensureSeed();
  const params = GetKnowledgeParams.safeParse(req.params);
  const body = UpdateKnowledgeBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid knowledge update" });
    return;
  }
  const [item] = await db
    .update(knowledgeItems)
    .set({
      ...(body.data.title === undefined ? {} : { title: body.data.title.trim() }),
      ...(body.data.answer === undefined ? {} : { answer: body.data.answer.trim() }),
      ...(body.data.category === undefined ? {} : { category: body.data.category.trim() }),
      ...(body.data.tags === undefined ? {} : { tags: body.data.tags.map((tag) => tag.trim()).filter(Boolean) }),
      ...(body.data.isPremium === undefined ? {} : { isPremium: body.data.isPremium }),
      updatedAt: new Date(),
    })
    .where(eq(knowledgeItems.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Knowledge item not found" });
    return;
  }
  res.json(UpdateKnowledgeResponse.parse(mapKnowledge(item)));
});

router.delete("/knowledge/:id", async (req, res): Promise<void> => {
  await ensureSeed();
  const parsed = GetKnowledgeParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.delete(knowledgeItems).where(eq(knowledgeItems.id, parsed.data.id)).returning({ id: knowledgeItems.id });
  if (!item) {
    res.status(404).json({ error: "Knowledge item not found" });
    return;
  }
  res.status(204).send();
});

router.get("/knowledge/:id", async (req, res): Promise<void> => {
  await ensureSeed();
  const parsed = GetKnowledgeParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(knowledgeItems)
    .where(eq(knowledgeItems.id, parsed.data.id));
  if (!row) {
    res.status(404).json({ error: "Knowledge item not found" });
    return;
  }
  res.json(GetKnowledgeResponse.parse(mapKnowledge(row)));
});

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  await ensureSeed();
  const [{ value: totalKnowledge }] = await db
    .select({ value: count() })
    .from(knowledgeItems);
  const [{ value: commandCount }] = await db
    .select({ value: count() })
    .from(knowledgeItems)
    .where(eq(knowledgeItems.category, "Команды"));
  const [{ value: priceCount }] = await db
    .select({ value: count() })
    .from(knowledgeItems)
    .where(eq(knowledgeItems.category, "Цены"));
  const [{ value: premiumCount }] = await db
    .select({ value: count() })
    .from(assistantAccounts)
    .where(eq(assistantAccounts.isPremium, true));
  const [{ value: totalAccounts }] = await db
    .select({ value: count() })
    .from(assistantAccounts);
  const [{ value: activeAccounts }] = await db
    .select({ value: count() })
    .from(assistantAccounts)
    .where(eq(assistantAccounts.status, "active"));

  res.json(
    GetDashboardStatsResponse.parse({
      totalKnowledge: Number(totalKnowledge),
      commandCount: Number(commandCount),
      priceCount: Number(priceCount),
      premiumCount: Number(premiumCount),
      totalAccounts: Number(totalAccounts),
      activeAccounts: Number(activeAccounts),
    }),
  );
});

router.post("/accounts/register", async (req, res): Promise<void> => {
  await ensureSeed();
  const parsed = RegisterAccountBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const role = parsed.data.role === "admin" ? "admin" : "assistant";
  const [account] = await db
    .insert(assistantAccounts)
    .values({
      accountNumber: `LR-${Math.floor(10000 + Math.random() * 89999)}`,
      displayName: parsed.data.displayName.trim(),
      username: parsed.data.username.trim().toLowerCase(),
      role,
      isPremium: role === "admin",
      status: "active",
    })
    .returning();
  res.status(201).json(RegisterAccountResponse.parse(mapAccount(account)));
});

router.get("/accounts/:accountNumber", async (req, res): Promise<void> => {
  await ensureSeed();
  const parsed = GetAccountParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [account] = await db
    .select()
    .from(assistantAccounts)
    .where(eq(assistantAccounts.accountNumber, parsed.data.accountNumber));
  if (!account) {
    res.status(404).json({ error: "Account not found" });
    return;
  }
  await db
    .update(assistantAccounts)
    .set({ lastSeenAt: new Date() })
    .where(eq(assistantAccounts.id, account.id));
  res.json(GetAccountResponse.parse(mapAccount(account)));
});

router.patch("/accounts/:accountNumber", async (req, res): Promise<void> => {
  await ensureSeed();
  const params = UpdateAccountParams.safeParse(req.params);
  const body = UpdateAccountBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid account update" });
    return;
  }
  const [account] = await db
    .update(assistantAccounts)
    .set({
      ...(body.data.displayName ? { displayName: body.data.displayName.trim() } : {}),
      ...(body.data.username ? { username: body.data.username.trim().toLowerCase() } : {}),
      lastSeenAt: new Date(),
    })
    .where(eq(assistantAccounts.accountNumber, params.data.accountNumber))
    .returning();
  if (!account) {
    res.status(404).json({ error: "Account not found" });
    return;
  }
  res.json(UpdateAccountResponse.parse(mapAccount(account)));
});

router.get("/admin/accounts", async (_req, res): Promise<void> => {
  await ensureSeed();
  const accounts = await db
    .select()
    .from(assistantAccounts)
    .orderBy(asc(assistantAccounts.createdAt));
  res.json(ListAccountsResponse.parse(accounts.map(mapAccount)));
});

router.patch("/admin/accounts/:accountNumber/access", async (req, res): Promise<void> => {
  await ensureSeed();
  const params = UpdateAccountAccessParams.safeParse(req.params);
  const body = UpdateAccountAccessBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid access update" });
    return;
  }
  const [account] = await db
    .update(assistantAccounts)
    .set({
      ...(body.data.isPremium === undefined ? {} : { isPremium: body.data.isPremium }),
      ...(body.data.role === undefined ? {} : { role: body.data.role }),
      ...(body.data.status === undefined ? {} : { status: body.data.status }),
      lastSeenAt: new Date(),
    })
    .where(eq(assistantAccounts.accountNumber, params.data.accountNumber))
    .returning();
  if (!account) {
    res.status(404).json({ error: "Account not found" });
    return;
  }
  res.json(UpdateAccountAccessResponse.parse(mapAccount(account)));
});

export default router;