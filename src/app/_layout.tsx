import "@/styles/global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Slot } from "expo-router";

// Import your global CSS file

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Slot />
        </GestureHandlerRootView>
    )
};