import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  MagicLink: undefined;
  AuthCallback: { url: string };
  Home: undefined;
};

// Define screen props for each screen
export type MagicLinkScreenProps = NativeStackScreenProps<RootStackParamList, 'MagicLink'>;
export type AuthCallbackScreenProps = NativeStackScreenProps<RootStackParamList, 'AuthCallback'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

// Optionally, define a type for navigation props
export type AuthNavigationProps = NativeStackScreenProps<RootStackParamList>;