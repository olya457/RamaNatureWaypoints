import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  Easing,
  Share,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

const LOGO = require('../assets/logo.png');
const RED = '#ef2b2b';

export default function AboutScreen({ navigation }: Props) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isTiny = height <= 640;
  const isSmall = height <= 700;

  const padH = isTiny ? 14 : isSmall ? 16 : 18;
  const topBarH = 64; 
  const backBtnSize = 44;
  const backIconSize = 32;
  const titleFontSize = 20;
  const logoW = Math.min(width * (isTiny ? 0.60 : 0.56), isTiny ? 240 : 280);
  const logoH = Math.floor(logoW * 0.50);
  const bodySize = isTiny ? 12 : 13;
  const lineH = isTiny ? 16 : 19;
  const btnH = isTiny ? 46 : 52;
  const btnW = Math.min(isTiny ? 200 : 240, width - padH * 2);
  const headerA = useRef(new Animated.Value(0)).current;
  const logoA = useRef(new Animated.Value(0)).current;
  const textA = useRef(new Animated.Value(0)).current;
  const btnA = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(70, [
      Animated.timing(headerA, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(logoA, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(textA, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.timing(btnA, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  }, []);

  const onShare = useCallback(async () => {
    try {
      await Share.share({
        message: 'Roma: Nature Waypoints — a calm guide to nature places.',
      });
    } catch {}
  }, []);

  const paragraphs = useMemo(
    () => [
      'Roma: Nature Waypoints is an app for those who love to explore nature at their own pace. It brings together forests, mountains, reserves and wild corners of the world.',
      'The app helps you find interesting places, save your favorite locations and return to them when you need silence, space or inspiration.',
      'Rama is your silent companion on this journey. He does not rush or lead by the rules — he is just there while you build your own map of nature trails.',
      'Roma: Nature Waypoints is designed for calm exploration, planning and pleasant discoveries — without unnecessary noise.',
    ],
    [],
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <Animated.View style={[styles.topBar, { height: topBarH, paddingHorizontal: padH, opacity: headerA }]}>
        <Pressable 
          style={[styles.backBtn, { width: backBtnSize, height: backBtnSize }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backText, { fontSize: backIconSize }]}>‹</Text>
        </Pressable>
        <Text style={[styles.topTitle, { fontSize: titleFontSize }]}>About</Text>
        <View style={{ width: backBtnSize }} />
      </Animated.View>

      <View style={[styles.body, { paddingHorizontal: padH }]}>
  
        <Animated.View style={[styles.logoWrap, { opacity: logoA, transform: [{ scale: logoA.interpolate({inputRange:[0,1], outputRange:[0.95, 1]}) }] }]}>
          <Image source={LOGO} style={{ width: logoW, height: logoH }} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={[styles.textWrap, { opacity: textA, marginTop: -10 }]}>
          {paragraphs.map((p, idx) => (
            <Text key={idx} style={[styles.p, { fontSize: bodySize, lineHeight: lineH, marginBottom: isTiny ? 8 : 12 }]}>
              {p}
            </Text>
          ))}
        </Animated.View>

        <Animated.View style={[styles.btnWrap, { opacity: btnA, marginTop: isTiny ? 10 : 20 }]}>
          <Pressable style={[styles.shareBtn, { height: btnH, width: btnW }]} onPress={onShare}>
            <Text style={styles.shareText}>Share</Text>
          </Pressable>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  backBtn: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  backText: { color: '#fff', fontWeight: '300', marginTop: -6 },
  topTitle: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '800' },

  body: { flex: 1, alignItems: 'center' },
  
  logoWrap: { 
    marginTop: 10,
    width: '100%', 
    alignItems: 'center' 
  },

  textWrap: { 
    width: '100%',
  },

  p: { 
    color: 'rgba(255,255,255,0.75)', 
    fontWeight: '500', 
    textAlign: 'left' 
  },

  btnWrap: {
    width: '100%',
    alignItems: 'center',
  },
  shareBtn: {
    borderRadius: 18,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});