import { StyleSheet, View, type ViewProps } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function Surface({ style, ...props }: ViewProps) {
  const colors = useColors();
  return <View {...props} style={[styles.surface, { backgroundColor: colors.card, borderColor: colors.border }, style]} />;
}

const styles = StyleSheet.create({
  surface: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
  },
});