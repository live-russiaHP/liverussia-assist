import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { getListKnowledgeQueryKey, useListKnowledge, createKnowledge, updateKnowledge, deleteKnowledge } from '@workspace/api-client-react';
import type { KnowledgeItem } from '@workspace/api-client-react';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen, Section } from '@/components/Screen';
import { Surface } from '@/components/Surface';
import { useColors } from '@/hooks/useColors';

const emptyForm = { title: '', answer: '', category: 'Команды', tags: '', isPremium: false };

type FormState = typeof emptyForm;

export default function RulesEditorScreen() {
  const colors = useColors();
  const queryClient = useQueryClient();
  const rules = useListKnowledge(undefined, { query: { staleTime: 15_000 } });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const reset = () => { setEditingId(null); setForm(emptyForm); };
  const edit = (item: KnowledgeItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, answer: item.answer, category: item.category, tags: item.tags.join(', '), isPremium: item.isPremium });
  };
  const save = async () => {
    if (form.title.trim().length < 2 || form.answer.trim().length < 2 || !form.category.trim()) {
      Alert.alert('Заполните правило', 'Укажите заголовок, текст и категорию.');
      return;
    }
    setSaving(true);
    const data = {
      title: form.title.trim(),
      answer: form.answer.trim(),
      category: form.category.trim(),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      isPremium: form.isPremium,
    };
    try {
      if (editingId === null) await createKnowledge(data);
      else await updateKnowledge(editingId, data);
      await queryClient.invalidateQueries({ queryKey: getListKnowledgeQueryKey() });
      reset();
      Alert.alert('Готово', editingId === null ? 'Правило добавлено.' : 'Правило обновлено.');
    } catch {
      Alert.alert('Не удалось сохранить', 'Проверьте соединение с сервером.');
    } finally {
      setSaving(false);
    }
  };
  const remove = (item: KnowledgeItem) => {
    Alert.alert('Удалить правило?', item.title, [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: async () => {
        try {
          await deleteKnowledge(item.id);
          await queryClient.invalidateQueries({ queryKey: getListKnowledgeQueryKey() });
          if (editingId === item.id) reset();
        } catch {
          Alert.alert('Ошибка', 'Не удалось удалить правило.');
        }
      } },
    ]);
  };

  return (
    <Screen>
      <View style={styles.heading}><Text style={[styles.eyebrow, { color: colors.primary }]}>РЕДАКТОР БАЗЫ</Text><Text style={[styles.title, { color: colors.foreground }]}>{editingId === null ? 'Добавить правило' : 'Изменить правило'}</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Создавайте команды, цены и регламенты в одном формате.</Text></View>
      <Section>
        <TextInput value={form.title} onChangeText={(title) => setForm((current) => ({ ...current, title }))} placeholder="Заголовок правила" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} />
        <TextInput value={form.answer} onChangeText={(answer) => setForm((current) => ({ ...current, answer }))} placeholder="Текст правила или ответа" placeholderTextColor={colors.mutedForeground} multiline textAlignVertical="top" style={[styles.input, styles.answer, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} />
        <TextInput value={form.category} onChangeText={(category) => setForm((current) => ({ ...current, category }))} placeholder="Категория: Команды, Цены, Регламент" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} />
        <TextInput value={form.tags} onChangeText={(tags) => setForm((current) => ({ ...current, tags }))} placeholder="Теги через запятую" placeholderTextColor={colors.mutedForeground} autoCapitalize="none" style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} />
        <Pressable onPress={() => setForm((current) => ({ ...current, isPremium: !current.isPremium }))} style={[styles.premium, { backgroundColor: form.isPremium ? colors.accent : colors.secondary }]}><Feather name="star" size={16} color={form.isPremium ? colors.accentForeground : colors.mutedForeground} /><Text style={[styles.premiumText, { color: form.isPremium ? colors.accentForeground : colors.secondaryForeground }]}>{form.isPremium ? 'Premium-правило' : 'Обычное правило'}</Text></Pressable>
        <PrimaryButton label={editingId === null ? 'Добавить правило' : 'Сохранить изменения'} onPress={save} loading={saving} />
        {editingId !== null && <Pressable onPress={reset} style={styles.cancel}><Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Отменить редактирование</Text></Pressable>}
      </Section>
      <Section>
        <View style={styles.listHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Правила в базе</Text><Text style={[styles.count, { color: colors.mutedForeground }]}>{rules.data?.length ?? 0}</Text></View>
        {(rules.data ?? []).map((item) => <Surface key={item.id} style={styles.rule}><Pressable onPress={() => edit(item)} style={styles.ruleCopy}><Text style={[styles.category, { color: colors.primary }]}>{item.category}</Text><Text style={[styles.ruleTitle, { color: colors.foreground }]}>{item.title}</Text><Text numberOfLines={2} style={[styles.ruleAnswer, { color: colors.mutedForeground }]}>{item.answer}</Text></Pressable><Pressable onPress={() => remove(item)} hitSlop={10}><Feather name="trash-2" size={18} color={colors.destructive} /></Pressable></Surface>)}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 7 },
  eyebrow: { fontSize: 11, letterSpacing: 1.2, fontWeight: '800' },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 15, lineHeight: 21 },
  input: { minHeight: 54, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 15 },
  answer: { minHeight: 130, paddingTop: 15 },
  premium: { minHeight: 48, borderRadius: 14, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  premiumText: { fontSize: 13, fontWeight: '800' },
  cancel: { alignItems: 'center', paddingVertical: 8 },
  cancelText: { fontSize: 13, fontWeight: '700' },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  count: { fontSize: 13, fontWeight: '700' },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  ruleCopy: { flex: 1, gap: 4 },
  category: { fontSize: 10, letterSpacing: 1, fontWeight: '800' },
  ruleTitle: { fontSize: 15, fontWeight: '800' },
  ruleAnswer: { fontSize: 12, lineHeight: 17 },
});
