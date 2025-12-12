import { Stack } from 'expo-router'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    )
}

export default RootLayout