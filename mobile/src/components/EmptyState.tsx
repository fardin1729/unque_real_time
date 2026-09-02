import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface EmptyStateProps {
  onSimulateLead: () => void;
  isSimulating?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onSimulateLead,
  isSimulating = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons
          name="radar"
          size={46}
          color={THEME.colors.metaBlue}
        />
      </View>

      <Text style={styles.heading}>Waiting for New Leads...</Text>
      <Text style={styles.subtext}>
        Submit a test form in the Meta Lead Ads Testing Tool or click below to simulate a live lead.
      </Text>

      <View style={styles.stepBox}>
        <View style={styles.singleStep}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepTitle}>Meta Webhook receives lead event</Text>
        </View>
        <View style={styles.singleStep}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepTitle}>Backend fetches contact fields from Graph API</Text>
        </View>
        <View style={styles.singleStep}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepTitle}>Socket.io pushes lead straight to this screen</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={onSimulateLead}
        disabled={isSimulating}
        activeOpacity={0.8}
      >
        <Feather name="zap" size={16} color="#FFFFFF" />
        <Text style={styles.actionButtonText}>
          {isSimulating ? 'Sending...' : 'Simulate Test Lead'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(24, 119, 242, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(24, 119, 242, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  stepBox: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: 14,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    gap: 10,
  },
  singleStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.colors.primary,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  stepTitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: THEME.borderRadius.md,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
