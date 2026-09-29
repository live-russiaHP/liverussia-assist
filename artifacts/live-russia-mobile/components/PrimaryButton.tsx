import { ActivityIndicator, Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';
import { useColors } from '@/hooks/useColors';

type Props = PressableProps & { label: string; loading?: boolean; tone?: 'primary' | 'secondary' };

export function PrimaryButton({ label, loading, tone = 'primary', style, disabled, ...props }: Props) {
  const colors = useColors();
  const isPrimary = tone === 'primary';
  return (
    <Pressable
      {...props}
      disabled={disabled || loading}
      style={(state) => [
        styles.button,
        { backgroundColor: isPrimary ? colors.primary : colors.secondary, opacity: state.pressed || disabled ? 0.72 : 1 },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.primaryForeground : colors.secondaryForeground} />
      ) : (
        <Text style={[styles.label, { color: isPrimary ? colors.primaryForeground : colors.secondaryForeground }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontWeight: '700' },
});