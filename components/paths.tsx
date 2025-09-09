import {AuthLoading, useQuery} from 'convex/react';
import { Stack } from 'expo-router';
import { api } from '@/convex/_generated/api';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import OverlayLoading from './shared/overlay_loading';
export const unstable_settings = {
    anchor: '(tabs)',
};
SplashScreen.preventAutoHideAsync();
export default function Paths() { 
    const isAuthenticated = useQuery(api.auth.isAuthenticated)
    const [loaded] = useFonts({
        MontserratBlack: require('../assets/fonts/Montserrat-Black.ttf'),
        MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
        MontserratExtraBold: require('../assets/fonts/Montserrat-ExtraBold.ttf'),
        MontserratExtraLight: require('../assets/fonts/Montserrat-ExtraLight.ttf'),
        MontserratLight: require('../assets/fonts/Montserrat-Light.ttf'),
        MontserratMedium: require('../assets/fonts/Montserrat-Medium.ttf'),
        MontserratRegular: require('../assets/fonts/Montserrat-Regular.ttf'),
        MontserratSemiBold: require('../assets/fonts/Montserrat-SemiBold.ttf'),
        MontserratThin: require('../assets/fonts/Montserrat-Thin.ttf'),
    });
    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded || isAuthenticated===undefined) {
        return null;
    }
    
    return (
        <>
            <AuthLoading>
                <OverlayLoading/>
            </AuthLoading>
            <Stack>
                <Stack.Protected guard={isAuthenticated===true}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                    <Stack.Screen name="[auctionID]" options={{ presentation: 'modal', title: 'Modal' }} />
                </Stack.Protected>
                <Stack.Protected guard={!isAuthenticated}>
                    <Stack.Screen name='sign-in' options={{headerShown: false}} />
                </Stack.Protected>
            </Stack>
        </>
    );
}
