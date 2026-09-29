import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUpdateAccount } from '@workspace/api-client-react';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen, Section } from '@/components/Screen';
import { Surface } from '@/components/Surface';
import { useAccount } from '@/context/AccountContext';
import { useColors } from '@/hooks/useColors';

export default function ProfileScreen() {
  const colors = useColors();
  const { account, refresh, signOut } = useAccount();
  const update = useUpdateAccount();
  const [name, setName] = useState(account?.displayName ?? '');
  const [username, setUsername] = useState(account?.username ?? '');
  if (!account) return null;
  const save = async () => {
    try {
      await update.mutateAsync({ accountNumber: account.accountNumber, data: { displayName: name, username } });
      await refresh();
      Alert.alert('Сохранено', 'Данные профиля обновлены.');
    } catch { Alert.alert('Не удалось сохранить', 'Проверьте соединение и попробуйте ещё раз.'); }
  };
  const leave = async () => { await signOut(); router.replace('/onboarding'); };
  return (
    <Screen>
      <View style={styles.heading}><Text style={[styles.eyebrow, { color: colors.primary }]}>МОЙ ПРОФИЛЬ</Text><Text style={[styles.title, { color: colors.foreground }]}>Аккаунт помощника</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Ваши данные и уровень доступа.</Text></View>
      <Surface style={styles.accountCard}><View style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{account.displayName.slice(0, 1).toUpperCase()}</Text></View><View style={styles.accountCopy}><Text style={[styles.accountName, { color: colors.foreground }]}>{account.displayName}</Text><Text style={[styles.accountNumber, { color: colors.mutedForeground }]}>{account.accountNumber}</Text></View><View style={[styles.role, { backgroundColor: account.isPremium ? colors.accent : colors.secondary }]}><Text style={[styles.roleText, { color: account.isPremium ? colors.accentForeground : colors.secondaryForeground }]}>{account.isPremium ? 'PREMIUM' : account.role === 'admin' ? 'ADMIN' : 'HELPER'}</Text></View></Surface>
      <Section><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Личные данные</Text><TextInput value={name} onChangeText={setName} placeholder="Имя" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} /><TextInput value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="Рабочий ник" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} /><PrimaryButton label="Сохранить изменения" onPress={save} loading={update.isPending} /></Section>
      {account.role === 'admin' && <Pressable onPress={() => router.push('/admin')} style={[styles.adminButton, { borderColor: colors.primary }]}><Feather name="shield" size={18} color={colors.primary} /><Text style={[styles.adminText, { color: colors.primary }]}>Открыть панель администратора</Text><Feather name="arrow-up-right" size={17} color={colors.primary} /></Pressable>}
      <Pressable onPress={leave} style={styles.leave}><Feather name="log-out" size={16} color={colors.mutedForeground} /><Text style={[styles.leaveText, { color: colors.mutedForeground }]}>Сменить аккаунт на этом устройстве</Text></Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 7 },
  eyebrow: { fontSize: 11, letterSpacing: 1.2, fontWeight: '800' },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 15, lineHeight: 21 },
  accountCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15 },
  avatar: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800' },
  accountCopy: { flex: 1, gap: 3 },
  accountName: { fontSize: 15, fontWeight: '800' },
  accountNumber: { fontSize: 12, letterSpacing: 0.4 },
  role: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 9 },
  roleText: { fontSize: 9, fontWeight: '800' },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  input: { minHeight: 54, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 15 },
  adminButton: { minHeight: 54, borderWidth: 1, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  adminText: { flex: 1, fontSize: 14, fontWeight: '800' },
  leave: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, paddingVertical: 10 },
  leaveText: { fontSize: 12, fontWeight: '600' },
});