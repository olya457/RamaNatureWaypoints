import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  useWindowDimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

type Page = {
  key: string;
  image: any;
  text: string;
  button: string;
};

export default function OnboardingScreen({ navigation }: Props) {
  const { height } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const isSmall = height <= 700;

  const circleSize = isSmall ? 210 : 240;
  const imageSize = isSmall ? 160 : 185;

  const cardRadius = isSmall ? 16 : 18;
  const cardHPad = isSmall ? 16 : 18;
  const cardVPadTop = isSmall ? 12 : 14;
  const cardVPadBottom = isSmall ? 16 : 18;

  const cardTextSize = isSmall ? 12.5 : 13;
  const cardLineHeight = isSmall ? 17 : 18;

  const buttonHeight = isSmall ? 44 : 46;
  const buttonMinW = isSmall ? 140 : 150;

  const cardMarginBottom = (isSmall ? 10 : 18) + 20;

  const pages = useMemo<Page[]>(
    () => [
      {
        key: '1',
        image: require('../assets/onboard1.png'),
        text:
          'Hello. I am Rama, a deer who leads the way to where nature remains real. Here are forests, mountains, reserves and wild places from all over the world, so that you can discover them at your own pace - without rushing or noise.',
        button: 'Next',
      },
      {
        key: '2',
        image: require('../assets/onboard2.png'),
        text:
          "Each place here has its own point on the planet, a short story and atmosphere. This is not a list or a guide - it is a space where you can find places that resonate with you.",
        button: 'Good',
      },
      {
        key: '3',
        image: require('../assets/onboard3.png'),
        text:
          "Open the map - and you will see all the locations as landmarks on your way. Save the ones you don’t want to lose, and return to them when you need silence, space or inspiration.",
        button: 'Continue',
      },
      {
        key: '4',
        image: require('../assets/onboard4.png'),
        text:
          "I will be there when you discover new places and mark those you have already visited. As you travel, you’ll collect badges - like the peaceful traces of your journey through the world.",
        button: 'Okay',
      },
      {
        key: '5',
        image: require('../assets/onboard5.png'),
        text:
          "Your profile exists only for this app. You can add a name, a photo, and a few words about yourself - or leave it minimal. There's no need to reveal too much here. This is a space for your routes, not for other people's eyes.",
        button: 'Start',
      },
    ],
    []
  );

  const page = pages[index];
  const fade = useRef(new Animated.Value(1)).current;
  const rise = useRef(new Animated.Value(0)).current;

  const playAppear = () => {
    fade.setValue(0);
    rise.setValue(10);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goNext = () => {
    if (index >= pages.length - 1) {
      navigation.replace('Register');
      return;
    }
    setIndex((prev) => {
      const next = prev + 1;
      return next;
    });
    playAppear();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.page}>
    
        <View style={[styles.topArea, { paddingTop: isSmall ? 10 : 18 }]}>
          <Animated.View
            style={[
              styles.circle,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                opacity: fade,
                transform: [{ translateY: rise }],
              },
            ]}
          >
            <Image source={page.image} style={{ width: imageSize, height: imageSize }} resizeMode="contain" />
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.card,
            {
              marginBottom: cardMarginBottom,
              borderRadius: cardRadius,
              paddingHorizontal: cardHPad,
              paddingTop: cardVPadTop,
              paddingBottom: cardVPadBottom,
              opacity: fade,
              transform: [{ translateY: rise }],
            },
          ]}
        >
          <View style={styles.dotsRow}>
            {pages.map((p, i) => {
              const active = i === index;
              return <View key={p.key} style={[styles.dot, active ? styles.dotActive : styles.dotIdle]} />;
            })}
          </View>

          <Text style={[styles.cardText, { fontSize: cardTextSize, lineHeight: cardLineHeight }]}>
            {page.text}
          </Text>

          <Pressable style={[styles.mainBtn, { height: buttonHeight, minWidth: buttonMinW }]} onPress={goNext}>
            <Text style={styles.mainBtnText}>{page.button}</Text>
          </Pressable>
        </Animated.View>

        <View style={{ height: isSmall ? 6 : 10 }} />
      </View>
    </SafeAreaView>
  );
}


const ORANGE = '#f6a019';
const CARD = '#2e2f31';
const RED = '#ef2b2b';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  page: { flex: 1, justifyContent: 'space-between' },

  topArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  circle: { backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },

  card: { marginHorizontal: 16, backgroundColor: CARD },

  dotsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 },

  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: RED },
  dotIdle: { backgroundColor: 'rgba(255,255,255,0.25)' },

  cardText: { color: 'rgba(255,255,255,0.85)', marginBottom: 16 },

  mainBtn: {
    alignSelf: 'center',
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
