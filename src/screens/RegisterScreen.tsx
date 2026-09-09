import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { RadioButton } from '../components/RadioButton';
import { Dropdown } from '../components/Dropdown';
import { useAuthStore } from '../store/authStore';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

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

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: 'male' as 'male' | 'female' | 'other',
    mobileNumber: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile Number must be exactly 10 digits';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        gender: formData.gender,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        city: formData.city,
        password: formData.password,
      });

      Alert.alert('Success', 'Registration successful!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            error={errors.fullName}
          />

          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.genderContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.radioGroup}>
              <RadioButton
                label="Male"
                selected={formData.gender === 'male'}
                onPress={() => setFormData({ ...formData, gender: 'male' })}
              />
              <RadioButton
                label="Female"
                selected={formData.gender === 'female'}
                onPress={() => setFormData({ ...formData, gender: 'female' })}
              />
              <RadioButton
                label="Other"
                selected={formData.gender === 'other'}
                onPress={() => setFormData({ ...formData, gender: 'other' })}
              />
            </View>
          </View>

          <Input
            label="Mobile Number"
            placeholder="Enter 10-digit mobile number"
            value={formData.mobileNumber}
            onChangeText={(text) => setFormData({ ...formData, mobileNumber: text.replace(/\D/g, '') })}
            error={errors.mobileNumber}
            keyboardType="numeric"
            maxLength={10}
          />

          <Input
            label="Address"
            placeholder="Enter your address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            error={errors.address}
          />

          <Dropdown
            label="City"
            selectedValue={formData.city}
            onValueChange={(value) => setFormData({ ...formData, city: value })}
            options={CITIES}
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

          <Input
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            error={errors.password}
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            error={errors.confirmPassword}
            secureTextEntry
          />

          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          />

          <Button
            title="Already have an account? Login"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  form: {
    flex: 1,
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
  button: {
    marginTop: 8,
  },
});
