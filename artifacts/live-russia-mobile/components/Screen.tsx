import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, contentContainerStyle, ...props }: ScrollViewProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      {...props}
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 106 }, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function Section({ children }: { children: React.ReactNode }) {
  return <View style={styles.section}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 18 },
  section: { gap: 10 },
});