import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import { MagicLinkScreenProps } from '../types/auth';

const MagicLinkScreen: React.FC<MagicLinkScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendLink = async (): Promise<void> => {
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'flashfood://auth-callback',
      },
    });

    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <View style={styles.container}>
      {sent ? (
        <Text style={styles.successText}>
          Check your email for the magic link! If you don't see it, check your spam folder.
        </Text>
      ) : (
        <>
          <TextInput
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <Button
            title={loading ? "Sending..." : "Send Magic Link"}
            onPress={handleSendLink}
            disabled={loading || !email.includes('@')}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default MagicLinkScreen;