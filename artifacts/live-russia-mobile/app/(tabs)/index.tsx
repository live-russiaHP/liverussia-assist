import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useGetDashboardStats, useListKnowledge } from '@workspace/api-client-react';
import { Screen, Section } from '@/components/Screen';
import { Surface } from '@/components/Surface';
import { useAccount } from '@/context/AccountContext';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const { account } = useAccount();
  const stats = useGetDashboardStats();
  const knowledge = useListKnowledge();
  const featured = knowledge.data?.slice(0, 3) ?? [];
  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>LIVE RUSSIA / HUB</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Добрый день, {account?.displayName.split(' ')[0] ?? 'помощник'}</Text>
        </View>
        <View style={[styles.status, { backgroundColor: colors.secondary }]}><View style={[styles.dot, { backgroundColor: colors.primary }]} /><Text style={[styles.statusText, { color: colors.secondaryForeground }]}>онлайн</Text></View>
      </View>
      <Surface style={{ backgroundColor: colors.primary, borderColor: colors.primary, gap: 12 }}>
        <Text style={[styles.heroKicker, { color: colors.primaryForeground }]}>БЫСТРЫЙ ДОСТУП</Text>
        <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>Найдите ответ за несколько секунд.</Text>
        <Text style={[styles.heroText, { color: colors.primaryForeground }]}>Команды, цены и регламенты Live Russia в одном месте.</Text>
        <View style={styles.heroMeta}><Feather name="search" size={16} color={colors.primaryForeground} /><Text style={[styles.heroMetaText, { color: colors.primaryForeground }]}>Откройте вкладку «Поиск»</Text></View>
      </Surface>
      <Section>
        <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Сегодня в базе</Text><Text style={[styles.link, { color: colors.primary }]}>{stats.data?.totalKnowledge ?? '—'} материалов</Text></View>
        <View style={styles.metrics}>
          <Metric label="Команды" value={stats.data?.commandCount ?? '—'} color={colors.primary} />
          <Metric label="Цены" value={stats.data?.priceCount ?? '—'} color={colors.accent} />
          <Metric label="Premium" value={account?.isPremium ? 'Доступен' : 'Нет'} color={colors.primary} />
        </View>
      </Section>
      <Section>
        <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Обновлённые ответы</Text><Feather name="arrow-up-right" size={18} color={colors.mutedForeground} /></View>
        {featured.map((item) => (
          <Surface key={item.id} style={styles.item}>
            <View style={[styles.iconBox, { backgroundColor: item.category === 'Цены' ? colors.accent : colors.secondary }]}><Feather name={item.category === 'Цены' ? 'tag' : 'terminal'} size={17} color={item.category === 'Цены' ? colors.accentForeground : colors.primary} /></View>
            <View style={styles.itemCopy}><Text style={[styles.itemTitle, { color: colors.foreground }]}>{item.title}</Text><Text numberOfLines={2} style={[styles.itemText, { color: colors.mutedForeground }]}>{item.answer}</Text></View>
            {item.isPremium && <Feather name="star" size={16} color={colors.accent} />}
          </Surface>
        ))}
      </Section>
    </Screen>
  );
}

function Metric({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colors = useColors();
  return <Surface style={styles.metric}><Text style={[styles.metricValue, { color }]}>{value}</Text><Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{label}</Text></Surface>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  eyebrow: { fontSize: 11, letterSpacing: 1.2, fontWeight: '800', marginBottom: 7 },
  title: { fontSize: 26, fontWeight: '800', maxWidth: 250 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 8 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  heroKicker: { fontSize: 11, letterSpacing: 1.4, fontWeight: '800' },
  heroTitle: { fontSize: 26, fontWeight: '800', lineHeight: 31 },
  heroText: { fontSize: 14, lineHeight: 20, opacity: 0.85 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 4 },
  heroMetaText: { fontSize: 13, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  link: { fontSize: 12, fontWeight: '700' },
  metrics: { flexDirection: 'row', gap: 10 },
  metric: { flex: 1, padding: 14, gap: 5 },
  metricValue: { fontSize: 17, fontWeight: '800' },
  metricLabel: { fontSize: 11, fontWeight: '600' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  iconBox: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  itemCopy: { flex: 1, gap: 3 },
  itemTitle: { fontSize: 14, fontWeight: '700' },
  itemText: { fontSize: 12, lineHeight: 17 },
});
