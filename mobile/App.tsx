import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  Animated,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Header } from './src/components/Header';
import { LeadCard } from './src/components/LeadCard';
import { EmptyState } from './src/components/EmptyState';
import { StatsSummary } from './src/components/StatsSummary';
import { ServerConfigModal } from './src/components/ServerConfigModal';
import {
  connectSocket,
  disconnectSocket,
  fetchHistoricalLeads,
  triggerMockLead,
  DEFAULT_BACKEND_URL,
} from './src/services/socket';
import { Lead, ConnectionStatusType } from './src/types/lead';
import { THEME } from './src/constants/theme';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newestLeadId, setNewestLeadId] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatusType>('connecting');
  const [serverUrl, setServerUrl] = useState<string>(DEFAULT_BACKEND_URL);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const toastAnim = useRef(new Animated.Value(-60)).current;

  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 12,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(toastAnim, {
        toValue: -60,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setToastMessage(''));
  };

  const handleIncomingLead = useCallback((newLead: Lead) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
    }

    setNewestLeadId(newLead.id);

    setLeads((prevLeads) => {
      const filtered = prevLeads.filter((item) => item.id !== newLead.id);
      return [newLead, ...filtered];
    });

    showToast(`New Lead: ${newLead.fullName || 'Lead'} (${newLead.company || newLead.formName || 'Meta'})`);
  }, []);

  useEffect(() => {
    connectSocket(serverUrl, {
      onStatusChange: (newStatus) => setStatus(newStatus),
      onNewLead: handleIncomingLead,
    });

    fetchHistoricalLeads(serverUrl).then((initialLeads) => {
      if (initialLeads && initialLeads.length > 0) {
        setLeads(initialLeads);
      }
    });

    return () => {
      disconnectSocket();
    };
  }, [serverUrl, handleIncomingLead]);

  const handleSimulateLead = async () => {
    setIsSimulating(true);
    try {
      await triggerMockLead(serverUrl);
    } catch (err) {
      console.log('Error while simulating lead:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.backgroundSecondary} />

      {toastMessage !== '' && (
        <Animated.View style={[styles.toastBox, { transform: [{ translateY: toastAnim }] }]}>
          <Text style={styles.toastText} numberOfLines={1}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}

      <Header
        status={status}
        serverUrl={serverUrl}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSimulateLead={handleSimulateLead}
        isSimulating={isSimulating}
      />

      <StatsSummary leads={leads} isConnected={status === 'connected'} />

      <View style={styles.feedWrapper}>
        <View style={styles.feedHeaderRow}>
          <Text style={styles.feedHeading}>Live Leads Feed</Text>
          <Text style={styles.liveTag}>Real-Time</Text>
        </View>

        <FlatList
          data={leads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LeadCard lead={item} isNew={item.id === newestLeadId} />
          )}
          contentContainerStyle={leads.length === 0 ? styles.emptyFeedStyle : styles.listFeedStyle}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState onSimulateLead={handleSimulateLead} isSimulating={isSimulating} />
          }
        />
      </View>

      <ServerConfigModal
        visible={isSettingsOpen}
        currentUrl={serverUrl}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newUrl) => setServerUrl(newUrl)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  toastBox: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 20,
    right: 20,
    zIndex: 99,
    backgroundColor: THEME.colors.metaBlue,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 9,
    paddingHorizontal: 14,
    elevation: 6,
  },
  toastText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  feedWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  feedHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  liveTag: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.accent,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
  },
  listFeedStyle: {
    paddingBottom: 20,
  },
  emptyFeedStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
