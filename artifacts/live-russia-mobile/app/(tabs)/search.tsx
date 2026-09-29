import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getListKnowledgeQueryKey, useListKnowledge } from '@workspace/api-client-react';
import { Screen } from '@/components/Screen';
import { Surface } from '@/components/Surface';
import { useAccount } from '@/context/AccountContext';
import { useColors } from '@/hooks/useColors';

const categories = ['Все', 'Команды', 'Цены', 'Регламент', 'Premium'];

export default function SearchScreen() {
  const colors = useColors();
  const { account } = useAccount();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');
  const params = { search: search || undefined, category: category === 'Все' ? undefined : category };
  const query = useListKnowledge(params, { query: { staleTime: 15_000, queryKey: getListKnowledgeQueryKey(params) } });
  const results = useMemo(() => (query.data ?? []).filter((item) => account?.isPremium || !item.isPremium), [account?.isPremium, query.data]);
  return (
    <Screen>
      <View style={styles.heading}><Text style={[styles.eyebrow, { color: colors.primary }]}>БАЗА ЗНАНИЙ</Text><Text style={[styles.title, { color: colors.foreground }]}>Что нужно найти?</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Ищите по команде, цене или формулировке вопроса.</Text></View>
      <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="search" size={19} color={colors.mutedForeground} /><TextInput value={search} onChangeText={setSearch} placeholder="Например, VIP или возврат" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} /></View>
      <View style={styles.categories}>{categories.map((item) => <Pressable key={item} onPress={() => setCategory(item)} style={[styles.category, { backgroundColor: category === item ? colors.primary : colors.secondary }]}><Text style={[styles.categoryText, { color: category === item ? colors.primaryForeground : colors.secondaryForeground }]}>{item}</Text></Pressable>)}</View>
      {query.isLoading ? <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} /> : results.length === 0 ? <Surface style={styles.empty}><Feather name="search" size={24} color={colors.primary} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Ничего не найдено</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Попробуйте другой запрос или снимите фильтр категории.</Text></Surface> : results.map((item) => <Surface key={item.id} style={styles.result}><View style={styles.resultHeader}><Text style={[styles.resultCategory, { color: colors.primary }]}>{item.category.toUpperCase()}</Text>{item.isPremium && <View style={[styles.premium, { backgroundColor: colors.accent }]}><Feather name="star" size={12} color={colors.accentForeground} /><Text style={[styles.premiumText, { color: colors.accentForeground }]}>PREMIUM</Text></View>}</View><Text style={[styles.resultTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[styles.resultAnswer, { color: colors.mutedForeground }]}>{item.answer}</Text><View style={styles.tags}>{item.tags.map((tag) => <Text key={tag} style={[styles.tag, { color: colors.mutedForeground, backgroundColor: colors.secondary }]}>#{tag}</Text>)}</View></Surface>)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 7 },
  eyebrow: { fontSize: 11, letterSpacing: 1.2, fontWeight: '800' },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 15, lineHeight: 21 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 54, paddingHorizontal: 16, borderWidth: 1, borderRadius: 16 },
  input: { flex: 1, fontSize: 15 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  category: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 14 },
  categoryText: { fontSize: 12, fontWeight: '700' },
  result: { gap: 10, padding: 16 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultCategory: { fontSize: 10, letterSpacing: 1, fontWeight: '800' },
  premium: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 10 },
  premiumText: { fontSize: 9, fontWeight: '800' },
  resultTitle: { fontSize: 17, fontWeight: '800', lineHeight: 22 },
  resultAnswer: { fontSize: 14, lineHeight: 21 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { fontSize: 11, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 5, overflow: 'hidden' },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 28 },
  emptyTitle: { fontSize: 17, fontWeight: '800' },
  emptyText: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});