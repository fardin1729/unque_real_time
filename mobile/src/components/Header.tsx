import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { ConnectionStatusType } from '../types/lead';

interface HeaderProps {
  status: ConnectionStatusType;
  serverUrl: string;
  onOpenSettings: () => void;
  onSimulateLead: () => void;
  isSimulating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  serverUrl,
  onOpenSettings,
  onSimulateLead,
  isSimulating = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'connected') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.35,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [status]);

  const getStatusDetails = () => {
    if (status === 'connected') {
      return {
        label: 'Live Connected',
        color: THEME.colors.success,
        bg: THEME.colors.successBg,
      };
    } else if (status === 'connecting') {
      return {
        label: 'Connecting...',
        color: THEME.colors.warning,
        bg: THEME.colors.warningBg,
      };
    } else {
      return {
        label: 'Disconnected',
        color: THEME.colors.error,
        bg: THEME.colors.errorBg,
      };
    }
  };

  const statusInfo = getStatusDetails();
  const cleanServerUrl = serverUrl.replace(/^https?:\/\//, '');

  return (
    <View style={styles.headerBox}>
      <View style={styles.topRow}>
        <View style={styles.brandBox}>
          <View style={styles.fbIconBox}>
            <MaterialCommunityIcons name="facebook" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.appTitle}>Meta Lead Stream</Text>
            <Text style={styles.appSubtitle}>Real-time Lead Webhook Ingestion</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.testBtn}
            onPress={onSimulateLead}
            disabled={isSimulating}
            activeOpacity={0.7}
          >
            <Feather
              name="zap"
              size={15}
              color={isSimulating ? THEME.colors.textMuted : THEME.colors.accent}
            />
            <Text style={[styles.testBtnText, { color: THEME.colors.accent }]}>
              {isSimulating ? 'Sending...' : 'Test Lead'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={onOpenSettings}
            activeOpacity={0.7}
          >
            <Feather name="settings" size={18} color={THEME.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}
        onPress={onOpenSettings}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.statusDot,
            { backgroundColor: statusInfo.color, opacity: pulseAnim },
          ]}
        />
        <Text style={[styles.statusText, { color: statusInfo.color }]}>
          {statusInfo.label}
        </Text>
        <Text style={styles.serverText} numberOfLines={1}>
          • {cleanServerUrl}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    backgroundColor: THEME.colors.backgroundSecondary,
    paddingTop: Platform.OS === 'ios' ? 12 : 14,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.cardBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fbIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: THEME.colors.metaBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: 0.2,
  },
  appSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  testBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingsBtn: {
    padding: 8,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.actionBg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: THEME.borderRadius.full,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  serverText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginLeft: 5,
    maxWidth: 180,
  },
});
