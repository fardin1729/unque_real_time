import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { Lead } from '../types/lead';

interface StatsSummaryProps {
  leads: Lead[];
  isConnected: boolean;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  leads,
  isConnected,
}) => {
  const totalLeadsCount = leads.length;
  const mockCount = leads.filter((l) => l.isSimulated).length;
  const liveGraphCount = totalLeadsCount - mockCount;

  return (
    <View style={styles.container}>
      <View style={styles.cardBox}>
        <View style={styles.cardHeader}>
          <Feather name="users" size={13} color={THEME.colors.primaryLight} />
          <Text style={styles.cardLabel}>Total Leads</Text>
        </View>
        <Text style={styles.cardValue}>{totalLeadsCount}</Text>
      </View>

      <View style={styles.cardBox}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="lightning-bolt" size={14} color={THEME.colors.accent} />
          <Text style={styles.cardLabel}>Graph API</Text>
        </View>
        <Text style={[styles.cardValue, { color: THEME.colors.accent }]}>{liveGraphCount}</Text>
      </View>

      <View style={styles.cardBox}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons
            name={isConnected ? 'wifi-check' : 'wifi-off'}
            size={14}
            color={isConnected ? THEME.colors.success : THEME.colors.error}
          />
          <Text style={styles.cardLabel}>Stream</Text>
        </View>
        <Text
          style={[
            styles.cardValue,
            { color: isConnected ? THEME.colors.success : THEME.colors.error, fontSize: 13, marginTop: 2 },
          ]}
        >
          {isConnected ? 'Active' : 'Offline'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: THEME.colors.background,
  },
  cardBox: {
    flex: 1,
    backgroundColor: THEME.colors.backgroundSecondary,
    borderRadius: THEME.borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
});
