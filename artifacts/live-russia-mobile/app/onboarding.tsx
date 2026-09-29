import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAccount } from '@/context/AccountContext';
import { useColors } from '@/hooks/useColors';

export default function OnboardingScreen() {
  const colors = useColors();
  const { register } = useAccount();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'assistant' | 'admin'>('assistant');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (name.trim().length < 2 || username.trim().length < 2) {
      Alert.alert('Заполните профиль', 'Укажите имя и рабочий ник минимум из двух символов.');
      return;
    }
    setLoading(true);
    try {
      await register({ displayName: name.trim(), username: username.trim(), role });
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Не удалось создать аккаунт', 'Проверьте соединение и попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <KeyboardAwareScrollViewCompat contentContainerStyle={styles.content} bottomOffset={20}>
        <View style={styles.brand}>
          <View style={[styles.mark, { backgroundColor: colors.primary }]}><Text style={[styles.markText, { color: colors.primaryForeground }]}>L</Text></View>
          <Text style={[styles.kicker, { color: colors.primary }]}>LIVE RUSSIA / ASSISTANT HUB</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Рабочее место помощника</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Создайте профиль один раз — номер аккаунта сохранится на этом устройстве.</Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.foreground }]}>Как к вам обращаться?</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Например, Алексей" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} />
          <Text style={[styles.label, { color: colors.foreground }]}>Рабочий ник</Text>
          <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="Например, alexey_lr" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} />
          <Text style={[styles.label, { color: colors.foreground }]}>Тип доступа</Text>
          <View style={styles.roles}>
            {(['assistant', 'admin'] as const).map((item) => (
              <Text
                key={item}
                onPress={() => setRole(item)}
                style={[styles.role, { color: role === item ? colors.primaryForeground : colors.mutedForeground, backgroundColor: role === item ? colors.primary : colors.secondary }]}
              >
                {item === 'assistant' ? 'Помощник' : 'Администратор'}
              </Text>
            ))}
          </View>
          <PrimaryButton label="Создать аккаунт" onPress={submit} loading={loading} />
          <Text style={[styles.note, { color: colors.mutedForeground }]}>Администратор видит управление аккаунтами и может выдавать Premium.</Text>
        </View>
      </KeyboardAwareScrollViewCompat>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 24, justifyContent: 'center', gap: 34 },
  brand: { gap: 12 },
  mark: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  markText: { fontSize: 28, fontWeight: '800' },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { fontSize: 34, fontWeight: '800', lineHeight: 39 },
  subtitle: { fontSize: 16, lineHeight: 23 },
  form: { gap: 10 },
  label: { fontSize: 13, fontWeight: '700', marginTop: 6 },
  input: { minHeight: 54, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 16 },
  roles: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  role: { paddingVertical: 13, paddingHorizontal: 15, borderRadius: 14, fontSize: 14, fontWeight: '700', overflow: 'hidden' },
  note: { fontSize: 12, lineHeight: 17, textAlign: 'center', paddingHorizontal: 12 },
});