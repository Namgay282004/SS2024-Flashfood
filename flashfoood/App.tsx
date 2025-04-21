import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import MagicLinkScreen from './screens/MagicLinkScreen';
import AuthCallbackScreen from './screens/AuthCallbackScreen';
import { RootStackParamList } from './types/auth';

const Stack = createNativeStackNavigator<RootStackParamList>();

const prefix = Linking.createURL('/');

const App = () => {
  const linking = {
    prefixes: [prefix, 'flashfood://'],
    config: {
      screens: {
        AuthCallback: 'auth-callback',
      },
    },
  };

  useEffect(() => {
    // Handle magic links when app is in background
    const subscription = Linking.addEventListener('url', ({ url }) => {
      if (url.includes('type=magiclink')) {
        // Navigate to AuthCallback screen with the URL
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="MagicLink" component={MagicLinkScreen} />
        <Stack.Screen name="AuthCallback" component={AuthCallbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;