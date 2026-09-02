import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Lead } from '../types/lead';
import { THEME } from '../constants/theme';

interface LeadCardProps {
  lead: Lead;
  isNew?: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, isNew = false }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const scaleAnim = useRef(new Animated.Value(isNew ? 0.9 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const highlightAnim = useRef(new Animated.Value(isNew ? 1 : 0)).current;

  useEffect(() => {
    if (isNew) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(highlightAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isNew]);

  const copyToClipboard = async (text: string, fieldType: string) => {
    if (!text) return;
    try {
      await Clipboard.setStringAsync(text);
      setCopiedField(fieldType);
      setTimeout(() => {
        setCopiedField(null);
      }, 1500);
    } catch (e) {
      console.log('Clipboard error:', e);
    }
  };

  const openDialer = (phoneNumber: string) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber.replace(/[^\d+]/g, '')}`).catch(() => {});
    }
  };

  const openEmailApp = (emailAddress: string) => {
    if (emailAddress) {
      Linking.openURL(`mailto:${emailAddress}`).catch(() => {});
    }
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'ML';
    const words = nameStr.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  const formatTime = (timeStr: string) => {
    try {
      const dt = new Date(timeStr);
      if (isNaN(dt.getTime())) return 'Just now';
      return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (err) {
      return 'Just now';
    }
  };

  const borderColor = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [THEME.colors.cardBorder, THEME.colors.cardBorderHighlight],
  });

  const backgroundColor = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [THEME.colors.card, THEME.colors.cardHighlight],
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Animated.View style={[styles.card, { borderColor, backgroundColor }]}>
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(lead.fullName)}</Text>
            </View>
            <View style={styles.nameDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.fullNameText} numberOfLines={1}>
                  {lead.fullName || 'New Lead'}
                </Text>
                {isNew && (
                  <View style={styles.newTag}>
                    <Text style={styles.newTagText}>NEW</Text>
                  </View>
                )}
              </View>
              <Text style={styles.companyText} numberOfLines={1}>
                {lead.company || lead.formName || 'Meta Lead Form'}
              </Text>
            </View>
          </View>

          <View style={styles.timeTag}>
            <Feather name="clock" size={10} color={THEME.colors.textMuted} />
            <Text style={styles.timeText}>{formatTime(lead.receivedAt || lead.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.contactBox}>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => openEmailApp(lead.email)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Feather name="mail" size={12} color={THEME.colors.primaryLight} />
            </View>
            <Text style={styles.contactText} numberOfLines={1}>
              {lead.email || 'No email given'}
            </Text>
            <TouchableOpacity
              style={styles.copyBtn}
              onPress={() => copyToClipboard(lead.email, 'email')}
            >
              <Feather
                name={copiedField === 'email' ? 'check' : 'copy'}
                size={11}
                color={copiedField === 'email' ? THEME.colors.success : THEME.colors.textMuted}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => openDialer(lead.phoneNumber)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Feather name="phone" size={12} color={THEME.colors.accent} />
            </View>
            <Text style={styles.contactText} numberOfLines={1}>
              {lead.phoneNumber || 'No phone given'}
            </Text>
            <TouchableOpacity
              style={styles.copyBtn}
              onPress={() => copyToClipboard(lead.phoneNumber, 'phone')}
            >
              <Feather
                name={copiedField === 'phone' ? 'check' : 'copy'}
                size={11}
                color={copiedField === 'phone' ? THEME.colors.success : THEME.colors.textMuted}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.formBadge}>
            <MaterialCommunityIcons name="form-select" size={11} color={THEME.colors.textSecondary} />
            <Text style={styles.formBadgeText} numberOfLines={1}>
              {lead.formName || 'Meta Ad Form'}
            </Text>
          </View>

          <View style={[styles.sourceBadge, lead.isSimulated ? styles.simulatedBadge : styles.liveBadge]}>
            <Text style={lead.isSimulated ? styles.simulatedText : styles.liveText}>
              {lead.isSimulated ? 'Mock Enriched' : 'Meta Graph API'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
  },
  card: {
    borderRadius: THEME.borderRadius.lg,
    padding: 13,
    borderWidth: 1,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  nameDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fullNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    flexShrink: 1,
  },
  companyText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  newTag: {
    backgroundColor: THEME.colors.success,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  newTagText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '800',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: THEME.borderRadius.full,
  },
  timeText: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  contactBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: THEME.borderRadius.md,
    padding: 7,
    gap: 4,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  iconContainer: {
    width: 20,
    alignItems: 'center',
  },
  contactText: {
    flex: 1,
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyBtn: {
    padding: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '55%',
  },
  formBadgeText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  sourceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.sm,
  },
  simulatedBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
  },
  simulatedText: {
    color: '#C084FC',
    fontSize: 10,
    fontWeight: '600',
  },
  liveBadge: {
    backgroundColor: 'rgba(24, 119, 242, 0.12)',
  },
  liveText: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '600',
  },
});
