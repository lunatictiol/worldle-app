import { Stack,useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { tokenCache } from "@/utils/cache";
import {
  useFonts,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_900Black,
} from '@expo-google-fonts/frank-ruhl-libre';
import Logo from '@/assets/images/nyt-logo.svg';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Modal, TouchableOpacity, useColorScheme } from "react-native";
import {GestureHandlerRootView } from 'react-native-gesture-handler'
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { TransitionPresets } from '@react-navigation/stack';
import { JsStack } from "@/components/JsStack";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  let [fontsLoaded] = useFonts({
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_900Black,
  });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}
  
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
    <ThemeProvider value={colorScheme == 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{flex:1}}>
        <BottomSheetModalProvider >
    <JsStack>
      <Stack.Screen name="index" options={{headerShown:false}}/>
      <JsStack.Screen
                  name="login"
                  options={{

                    presentation: 'modal',
                    ...TransitionPresets.ModalPresentationIOS,
                    gestureEnabled: true,
                    headerTitle: () => <Logo width={150} height={40} />,
                    headerShadowVisible: false,
                    headerLeft: () => (
                      <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={26} color={Colors.light.gray} />
                      </TouchableOpacity>
                    ),
                  }}
                />
      <Stack.Screen
                  name="game"
                  options={{
                    headerBackTitle: 'Wordle',
                    headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                    headerBackTitleStyle: {
                      fontFamily: 'FrankRuhlLibre_800ExtraBold',
                      fontSize: 26,
                    },
                    title: '',
                  }}
                />           
    </JsStack>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
    
    </ThemeProvider>
    </ClerkLoaded>
    </ClerkProvider>
  
  );
}
