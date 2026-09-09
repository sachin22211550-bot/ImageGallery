import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.outerCircle, selected && styles.outerCircleSelected]}>
        {selected && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  outerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  outerCircleSelected: {
    borderColor: '#007AFF',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});
