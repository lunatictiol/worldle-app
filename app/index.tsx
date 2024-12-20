import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "@/assets/images/wordle-icon.svg";
import { Link } from "expo-router";
import {format} from 'date-fns'
import { useColorScheme } from "react-native";
import ThemedText from "@/components/ThemedText";
import { useRef } from "react";
import  { BottomSheetModal } from "@gorhom/bottom-sheet";
import SubscribeModal from "@/components/SubscribeModal";

import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Animated, { FadeIn, FadeInDown, FadeInRight } from "react-native-reanimated";

export default function Index() {
  const colorScheme = useColorScheme();
  const subModalRef = useRef<BottomSheetModal>(null)
  const handlePresentModal = ()=>subModalRef.current?.present()
  const {signOut} = useAuth()

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
  return (
    <View style={styles.container}>
      <SubscribeModal ref={subModalRef}/>
      <Animated.View style={styles.header} entering={FadeInDown}>
        <Icon width={100} height={100} />
        <ThemedText style={styles.title}>Wordle Clone</ThemedText>
        <Text style={styles.text}>Get a chance to guess a 5-letter word</Text>
      </Animated.View>
      <View style={styles.menu}>
      <Link href={'/game'} style={[styles.btn,{backgroundColor: colorScheme =='light'?'#000':'#4a4a4a'}]} asChild>
      <AnimatedTouchableOpacity entering={FadeInRight}>
        <Text style={[styles.btnText,styles.primaryText]}>Play</Text>
      </AnimatedTouchableOpacity>
      </Link>
      <SignedOut>
      <Link href={'/login'} style={styles.btn} asChild>
      <AnimatedTouchableOpacity entering={FadeInRight.delay(100)} >
        <Text style={styles.btnText}>Login</Text>
      </AnimatedTouchableOpacity>
      </Link>
      </SignedOut>
      <SignedIn>
      <AnimatedTouchableOpacity style={styles.btn}  entering={FadeInRight.delay(100)} onPress={()=>signOut()}>
        <ThemedText style={styles.btnText}>Sign out</ThemedText>
      </AnimatedTouchableOpacity>
      </SignedIn>
      <AnimatedTouchableOpacity  entering={FadeInRight.delay(200)} style={styles.btn} onPress={handlePresentModal}>
        <ThemedText style={styles.btnText}>Subscribe</ThemedText>
      </AnimatedTouchableOpacity>
      </View>
      <Animated.View  entering={FadeIn.delay(400)} style={styles.footer} >
      <ThemedText style={styles.footerDate}>{format(new Date(),'MMMM d, yyyy')}</ThemedText>
      <ThemedText style={styles.footerText}>No.1</ThemedText>
      <ThemedText style={styles.footerText}>Made by sabiq</ThemedText>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 50,
  },
  header: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
  },
  text: {
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_500Medium',
  },
  menu: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btn: {
    justifyContent: 'center',
    borderRadius: 30,
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    width: '60%',
    maxWidth: 200,
  },
  btnText: {
    padding: 14,
    fontSize: 16,
    fontWeight: 'semibold',
    color: '#333',
  },
  
  primaryText: {
    color: '#fff',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerDate: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
  },
});
