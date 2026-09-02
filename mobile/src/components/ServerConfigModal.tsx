import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface ServerConfigModalProps {
  visible: boolean;
  currentUrl: string;
  onClose: () => void;
  onSave: (newUrl: string) => void;
}

export const ServerConfigModal: React.FC<ServerConfigModalProps> = ({
  visible,
  currentUrl,
  onClose,
  onSave,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);

  const presetOptions = [
    { label: 'Localhost (Web/iOS)', url: 'http://localhost:5000' },
    { label: 'Android Emulator', url: 'http://10.0.2.2:5000' },
  ];

  const handleSaveClick = () => {
    if (urlInput.trim()) {
      onSave(urlInput.trim());
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Backend Server Settings</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                <Feather name="x" size={18} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter backend URL or ngrok / localtunnel address for socket connection.
            </Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={urlInput}
                onChangeText={setUrlInput}
                placeholder="http://localhost:5000"
                placeholderTextColor={THEME.colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>

            <View style={styles.presetRow}>
              {presetOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.presetButton}
                  onPress={() => setUrlInput(item.url)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.presetText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.footerButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveClick}>
                <Text style={styles.saveText}>Save & Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: THEME.colors.backgroundSecondary,
    borderRadius: THEME.borderRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  closeIcon: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: 12,
  },
  inputWrapper: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: 10,
  },
  textInput: {
    height: 40,
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  presetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  presetText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.borderRadius.md,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
