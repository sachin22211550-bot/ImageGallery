import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { RadioButton } from '../components/RadioButton';
import { Dropdown } from '../components/Dropdown';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';

const CITIES = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
];

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user ? { ...user } : {
    fullName: '',
    email: '',
    gender: 'male',
    mobileNumber: '',
    address: '',
    city: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editedUser?.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!editedUser?.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(editedUser.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!editedUser?.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(editedUser.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile Number must be exactly 10 digits';
    }

    if (!editedUser?.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!editedUser?.city) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!editedUser || !validateForm()) return;

    setLoading(true);
    try {
      await updateUser(editedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
    setErrors({});
  };

  const handleLogout = async () => {
    console.log('Logout button pressed');
    try {
      console.log('Calling logout function...');
      await logout();
      console.log('Logout function completed');
      // Force page reload on web to clear all state
      if (typeof window !== 'undefined') {
        console.log('Reloading page...');
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={64} color="#007AFF" />
          </View>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!isEditing && (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={styles.editButton}
              >
                <Ionicons name="create-outline" size={20} color="#007AFF" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.themeToggleContainer}>
            <Text style={styles.themeLabel}>Dark Mode</Text>
            <TouchableOpacity
              onPress={toggleTheme}
              style={styles.themeToggle}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isDarkMode ? 'moon' : 'sunny'}
                size={24}
                color={isDarkMode ? '#0A84FF' : '#FF9500'}
              />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={editedUser.fullName}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, fullName: text })
                }
                error={errors.fullName}
              />

              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={editedUser.email}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, email: text })
                }
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.genderContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.radioGroup}>
                  <RadioButton
                    label="Male"
                    selected={editedUser.gender === 'male'}
                    onPress={() =>
                      setEditedUser({ ...editedUser, gender: 'male' })
                    }
                  />
                  <RadioButton
                    label="Female"
                    selected={editedUser.gender === 'female'}
                    onPress={() =>
                      setEditedUser({ ...editedUser, gender: 'female' })
                    }
                  />
                  <RadioButton
                    label="Other"
                    selected={editedUser.gender === 'other'}
                    onPress={() =>
                      setEditedUser({ ...editedUser, gender: 'other' })
                    }
                  />
                </View>
              </View>

              <Input
                label="Mobile Number"
                placeholder="Enter 10-digit mobile number"
                value={editedUser.mobileNumber}
                onChangeText={(text) =>
                  setEditedUser({
                    ...editedUser,
                    mobileNumber: text.replace(/\D/g, ''),
                  })
                }
                error={errors.mobileNumber}
                keyboardType="numeric"
                maxLength={10}
              />

              <Input
                label="Address"
                placeholder="Enter your address"
                value={editedUser.address}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, address: text })
                }
                error={errors.address}
              />

              <Dropdown
                label="City"
                selectedValue={editedUser.city}
                onValueChange={(value) =>
                  setEditedUser({ ...editedUser, city: value })
                }
                options={CITIES}
              />
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}

              <View style={styles.buttonGroup}>
                <Button
                  title="Save"
                  onPress={handleSave}
                  loading={loading}
                  style={styles.saveButton}
                />
                <Button
                  title="Cancel"
                  onPress={handleCancel}
                  variant="outline"
                  style={styles.cancelButton}
                />
              </View>
            </>
          ) : (
            <View style={styles.infoContainer}>
              <InfoRow label="Full Name" value={user.fullName} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Gender" value={user.gender} />
              <InfoRow label="Mobile Number" value={user.mobileNumber} />
              <InfoRow label="Address" value={user.address} />
              <InfoRow label="City" value={user.city} />
            </View>
          )}
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </ScrollView>
    </View>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 8,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 16,
  },
  themeLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  themeToggle: {
    padding: 8,
  },
  infoContainer: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  genderContainer: {
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  logoutButton: {
    marginTop: 8,
  },
});
