import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { AuthCallbackScreenProps } from '../types/auth';

const AuthCallbackScreen: React.FC<AuthCallbackScreenProps> = ({ route, navigation }) => {
  const { url } = route.params;

  useEffect(() => {
    const handleAuth = async (): Promise<void> => {
      try {
        const { data: { session }, error } = await supabase.auth.getSessionFromUrl({ url });
        
        if (error) throw error;
        if (session) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      } catch (error) {
        navigation.navigate('MagicLink');
      }
    };

    handleAuth();
  }, [url, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Signing you in...</Text>
    </View>
  );
};

export default AuthCallbackScreen;