import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useListAccounts, useUpdateAccountAccess } from '@workspace/api-client-react';
import { Screen, Section } from '@/components/Screen';
import { Surface } from '@/components/Surface';
import { useColors } from '@/hooks/useColors';
import { useAccount } from '@/context/AccountContext';

export default function AdminScreen() {
  const colors = useColors();
  const { account } = useAccount();
  const accounts = useListAccounts();
  const access = useUpdateAccountAccess();
  const [selected, setSelected] = useState<string | null>(null);
  if (account?.role !== 'admin') return null;
  const togglePremium = async (accountNumber: string, isPremium: boolean) => {
    setSelected(accountNumber);
    try { await access.mutateAsync({ accountNumber, data: { isPremium: !isPremium } }); await accounts.refetch(); }
    catch { Alert.alert('Ошибка', 'Не удалось изменить доступ.'); }
    finally { setSelected(null); }
  };
  return (
    <Screen>
      <View style={styles.top}><Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.secondary }]}><Feather name="arrow-left" size={18} color={colors.foreground} /></Pressable><View><Text style={[styles.eyebrow, { color: colors.primary }]}>CONTROL ROOM</Text><Text style={[styles.title, { color: colors.foreground }]}>Администратор</Text></View></View>
      <Surface style={[styles.summary, { backgroundColor: colors.primary, borderColor: colors.primary }]}><Text style={[styles.summaryKicker, { color: colors.primaryForeground }]}>УПРАВЛЕНИЕ ДОСТУПОМ</Text><Text style={[styles.summaryTitle, { color: colors.primaryForeground }]}>Premium для команды</Text><Text style={[styles.summaryText, { color: colors.primaryForeground }]}>Выдавайте доступ к закрытым регламентам и командам прямо из списка аккаунтов.</Text></Surface>
      <Section><View style={styles.sectionHead}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Аккаунты</Text><Text style={[styles.count, { color: colors.mutedForeground }]}>{accounts.data?.length ?? 0}</Text></View>{(accounts.data ?? []).map((item) => <Surface key={item.accountNumber} style={styles.account}><View style={[styles.avatar, { backgroundColor: item.role === 'admin' ? colors.accent : colors.secondary }]}><Text style={[styles.avatarText, { color: item.role === 'admin' ? colors.accentForeground : colors.primary }]}>{item.displayName.slice(0, 1).toUpperCase()}</Text></View><View style={styles.copy}><Text style={[styles.name, { color: colors.foreground }]}>{item.displayName}</Text><Text style={[styles.meta, { color: colors.mutedForeground }]}>{item.accountNumber} · @{item.username}</Text></View><Pressable disabled={selected === item.accountNumber} onPress={() => togglePremium(item.accountNumber, item.isPremium)} style={[styles.premiumToggle, { backgroundColor: item.isPremium ? colors.accent : colors.secondary }]}><Feather name="star" size={14} color={item.isPremium ? colors.accentForeground : colors.mutedForeground} /><Text style={[styles.premiumToggleText, { color: item.isPremium ? colors.accentForeground : colors.mutedForeground }]}>{selected === item.accountNumber ? '…' : item.isPremium ? 'ON' : 'OFF'}</Text></Pressable></Surface>)}</Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 10, letterSpacing: 1.1, fontWeight: '800', marginBottom: 5 },
  title: { fontSize: 26, fontWeight: '800' },
  summary: { gap: 9 },
  summaryKicker: { fontSize: 10, letterSpacing: 1.2, fontWeight: '800' },
  summaryTitle: { fontSize: 24, fontWeight: '800' },
  summaryText: { fontSize: 13, lineHeight: 19, opacity: 0.86 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  count: { fontSize: 13, fontWeight: '700' },
  account: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13 },
  avatar: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '800' },
  copy: { flex: 1, gap: 3 },
  name: { fontSize: 14, fontWeight: '800' },
  meta: { fontSize: 11 },
  premiumToggle: { minWidth: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 8, borderRadius: 10 },
  premiumToggleText: { fontSize: 10, fontWeight: '800' },
});