import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAccount } from '@/context/AccountContext';
import { useColors } from '@/hooks/useColors';

export default function EntryScreen() {
  const { account, isLoading } = useAccount();
  const colors = useColors();
  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  return <Redirect href={account ? '/(tabs)' : '/onboarding'} />;
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center' } });