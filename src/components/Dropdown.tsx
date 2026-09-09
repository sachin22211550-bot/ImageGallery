import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ViewStyle } from 'react-native';

interface DropdownProps {
  label?: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: string[];
  style?: ViewStyle;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  selectedValue,
  onValueChange,
  options,
  style,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectedText}>{selectedValue || 'Select City'}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  index < options.length - 1 && styles.optionBorder,
                ]}
                onPress={() => {
                  onValueChange(option);
                  setIsOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    maxHeight: '50%',
    overflow: 'hidden',
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
