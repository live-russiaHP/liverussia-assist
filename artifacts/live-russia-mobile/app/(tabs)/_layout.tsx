import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  const colors = useColors();
  const isWeb = Platform.OS === 'web';
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) =>
            <Feather name="grid" size={21} color={color} />,
        }}
      />
      <Tabs.Screen name="search" options={{ title: 'Поиск', tabBarIcon: ({ color }) => <Feather name="search" size={21} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль', tabBarIcon: ({ color }) => <Feather name="user" size={21} color={color} /> }} />
    </Tabs>
  );
}
