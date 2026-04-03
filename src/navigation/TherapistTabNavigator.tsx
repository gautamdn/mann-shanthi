import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import PatientListScreen from '../screens/therapist/PatientListScreen';
import AssignScreen from '../screens/therapist/AssignScreen';
import InviteCodesScreen from '../screens/therapist/InviteCodesScreen';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import type { TherapistTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<TherapistTabParamList>();

const TAB_ICONS: Record<keyof TherapistTabParamList, React.ComponentProps<typeof Feather>['name']> = {
  Patients: 'users',
  Assign: 'clipboard',
  Codes: 'key',
};

export function TherapistTabNavigator() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: 'Therapist Dashboard',
        headerRight: () => (
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.switchText}>Client view</Text>
          </TouchableOpacity>
        ),
        tabBarIcon: ({ color, size }) => (
          <Feather name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Patients" component={PatientListScreen} />
      <Tab.Screen name="Assign" component={AssignScreen} />
      <Tab.Screen name="Codes" component={InviteCodesScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.cardBorder,
    paddingTop: spacing.xs,
    height: 85,
  },
  switchButton: {
    marginRight: spacing.md,
  },
  switchText: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
});
