import { Tabs } from 'expo-router';
import React from 'react';
import {Image} from 'expo-image'
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs screenOptions={{  tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,  headerShown: false, tabBarButton: HapticTab}}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Auctions',
                    tabBarIcon: ({ color }) => <Image source={require('@/assets/images/auction.png')} style={{height:24,width:24}} />,
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: 'Products',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />,
                }}
            />
        </Tabs>
    );
}
