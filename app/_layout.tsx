import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {ConvexReactClient} from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import Paths from '@/components/paths';
export const unstable_settings = {
  	anchor: '(tabs)',
};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  	unsavedChangesWarning: false,
});
const secureStorage = {
	getItem: SecureStore.getItemAsync,
	setItem: SecureStore.setItemAsync,
	removeItem: SecureStore.deleteItemAsync,
};
SplashScreen.preventAutoHideAsync();
export default function RootLayout() { 
	const colorScheme = useColorScheme();

	return (
		<ConvexAuthProvider client={convex} 
			storage={
					Platform.OS === "android" || Platform.OS === "ios"
					? secureStorage
					: undefined
				}
			>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<Paths/>
				<StatusBar style="auto" />
			</ThemeProvider>
		</ConvexAuthProvider>
	);
}
