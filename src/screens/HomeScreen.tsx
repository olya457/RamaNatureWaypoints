import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ImageBackground,
  ScrollView,
  Animated,
  Easing,
  Share,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type StoredProfile = {
  name: string;
  about: string;
  photoUri: string | null;
};

const PROFILE_KEY = 'profile_v1';
const AVATAR_FALLBACK = require('../assets/avatar_fallback.png');
const DEER = require('../assets/deer.png');
const MAP_PREVIEW = require('../assets/map_preview.png');
const PLACES_PREVIEW = require('../assets/yellowstone1.png');
const TROPHY = require('../assets/trophy.png');

const FACTS: string[] = [
  'In a dense forest, the air can be more\nhumid and milder than in an open field,\neven in the heat.',
  'After rain, forests can feel quieter because\nleaves absorb sound and the ground\nbecomes softer.',
  'Morning light in nature often feels warmer\nbecause it passes through more atmosphere\nnear the horizon.',
  'A calm walk is not about distance.\nIt is about attention and noticing\nsmall changes around you.',
  'Mountain lakes can look brighter because\nfine mineral particles scatter light\nin a special way.',
  'Fog often forms near rivers at dawn because\ncool air meets warmer water surface.',
  'In windy regions, trees can grow with a\npermanent lean — shaped by years of weather.',
  'Quiet trails feel different because your\nbrain stops filtering small sounds.',
];

function pickRandomFact(prev?: string) {
  if (FACTS.length === 0) return '';
  if (FACTS.length === 1) return FACTS[0];
  let next = FACTS[Math.floor(Math.random() * FACTS.length)];
  if (prev && next === prev) next = FACTS[(FACTS.indexOf(next) + 1) % FACTS.length];
  return next;
}

export default function HomeScreen({ navigation }: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmall = height <= 700;
  const isTiny = height <= 640;

  const padH = isTiny ? 14 : isSmall ? 16 : 18;
  const cardH = isTiny ? 92 : isSmall ? 98 : 104;
  const pillH = isTiny ? 40 : 44;

  const deerSize = isTiny ? 66 : isSmall ? 72 : 78;
  const pillRight = isTiny ? 16 : isSmall ? 18 : 20;

  const [profileName, setProfileName] = useState('IVAN');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const [fact, setFact] = useState<string>(() => pickRandomFact());
  const [factVisible, setFactVisible] = useState(true);

  const headA = useRef(new Animated.Value(0)).current;
  const factA = useRef(new Animated.Value(0)).current;
  const mapA = useRef(new Animated.Value(0)).current;
  const placesA = useRef(new Animated.Value(0)).current;
  const achA = useRef(new Animated.Value(0)).current;
  const bottomA = useRef(new Animated.Value(0)).current;

  const animStyle = (v: Animated.Value, fromY = 10) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [fromY, 0] }) }],
  });

  const runEnter = useCallback(() => {
    [headA, factA, mapA, placesA, achA, bottomA].forEach((v) => v.setValue(0));

    const mk = (v: Animated.Value, delay: number) =>
      Animated.timing(v, {
        toValue: 1,
        duration: 320,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      });

    Animated.stagger(85, [
      mk(headA, 0),
      mk(factA, 0),
      mk(mapA, 0),
      mk(placesA, 0),
      mk(achA, 0),
      mk(bottomA, 0),
    ]).start();
  }, [headA, factA, mapA, placesA, achA, bottomA]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;

      (async () => {
 
        try {
          const raw = await AsyncStorage.getItem(PROFILE_KEY);
          if (alive && raw) {
            const p = JSON.parse(raw) as StoredProfile;
            if (typeof p?.name === 'string' && p.name.trim().length) setProfileName(p.name.trim());
            if (typeof p?.photoUri === 'string' && p.photoUri.length) setAvatarUri(p.photoUri);
          }
        } catch {}

        if (alive) {
          setFact((prev) => pickRandomFact(prev));
          setFactVisible(true);
        }

        if (alive) runEnter();
      })();

      return () => {
        alive = false;
      };
    }, [runEnter])
  );

  const onShareFact = async () => {
    try {
      await Share.share({ message: `Daily fact:\n${fact}` });
    } catch {}
  };

  const onCloseFact = () => setFactVisible(false);

  const onShowFact = () => {
    setFactVisible(true);
    factA.setValue(0);
    Animated.timing(factA, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const headerFont = isTiny ? 18 : 20;

  const factFont = isTiny ? 10 : 11;

  const profileBtnH = isTiny ? 52 : 56;
  const bottomBtnH = isTiny ? 48 : 52;

  const bottomSpacer = useMemo(() => {
    const extra = Platform.OS === 'ios' ? 6 : 4;
    return Math.max(extra, insets.bottom ? insets.bottom * 0.25 : extra);
  }, [insets.bottom]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: isTiny ? 8 : isSmall ? 12 : 18,
          paddingBottom: 18,
          paddingHorizontal: padH,
        }}
      >
      
        <Animated.View style={animStyle(headA, 12)}>
          <View style={styles.headerRow}>
            <Image source={avatarUri ? { uri: avatarUri } : AVATAR_FALLBACK} style={styles.avatar} />
            <Text style={[styles.hello, { fontSize: headerFont }]}>
              HELLO, {profileName.toUpperCase()}
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={[animStyle(factA, 12), { marginTop: isTiny ? 10 : 14 }]}>
          {factVisible ? (
            <View style={styles.factCard}>
              <Image source={DEER} style={{ width: deerSize, height: deerSize, marginRight: 12 }} resizeMode="contain" />

              <View style={styles.factMain}>
                <Text style={styles.factTitle}>Daily fact</Text>
                <Text style={[styles.factText, { fontSize: factFont }]}>{fact}</Text>
              </View>

              <View style={styles.factActions}>
                <Pressable style={styles.factIconBtn} onPress={onShareFact}>
                  <Text style={styles.factIconText}>⤴︎</Text>
                </Pressable>

                <Pressable style={[styles.factIconBtn, { marginTop: 8 }]} onPress={onCloseFact}>
                  <Text style={styles.factCloseText}>×</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable onPress={onShowFact} style={styles.showFactBtn}>
              <Text style={styles.showFactText}>Show daily fact</Text>
            </Pressable>
          )}
        </Animated.View>

        <View style={{ height: isTiny ? 10 : 14 }} />

        <Animated.View style={animStyle(mapA, 14)}>
          <Pressable style={[styles.bigCard, { height: cardH }]} onPress={() => navigation.navigate('InteractiveMap')}>
            <ImageBackground source={MAP_PREVIEW} style={styles.bigCardBg} imageStyle={styles.bigCardImg}>
              <View style={[styles.pillRightAbs, { height: pillH, borderRadius: pillH / 2, right: pillRight }]}>
                <Text style={[styles.pillText, { fontSize: isTiny ? 12 : 13 }]}>Interactive map</Text>
              </View>
            </ImageBackground>
          </Pressable>
        </Animated.View>

        <Animated.View style={animStyle(placesA, 14)}>
          <Pressable style={[styles.bigCard, { height: cardH }]} onPress={() => navigation.navigate('Places')}>
            <ImageBackground source={PLACES_PREVIEW} style={styles.bigCardBg} imageStyle={styles.bigCardImg}>
              <View style={[styles.pillRightAbs, { height: pillH, borderRadius: pillH / 2, right: pillRight }]}>
                <Text style={[styles.pillText, { fontSize: isTiny ? 12 : 13 }]}>Places</Text>
              </View>
            </ImageBackground>
          </Pressable>
        </Animated.View>

        <Animated.View style={animStyle(achA, 14)}>
          <Pressable style={[styles.bigCard, styles.achievementCard, { height: cardH }]} onPress={() => navigation.navigate('Achievement')}>
            <View style={styles.achievementRow}>
              <Image
                source={TROPHY}
                style={{
                  width: isTiny ? 78 : isSmall ? 84 : 90,
                  height: isTiny ? 60 : isSmall ? 64 : 70,
                }}
                resizeMode="contain"
              />

              <View style={[styles.pillRightStatic, { height: pillH, borderRadius: pillH / 2 }]}>
                <Text style={[styles.pillText, { fontSize: isTiny ? 12 : 13 }]}>Achievement</Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        <View style={{ height: isTiny ? 10 : 12 }} />

        <Animated.View style={animStyle(bottomA, 14)}>
          <Pressable style={[styles.profileBtn, { height: profileBtnH }]} onPress={() => navigation.navigate('MyProfile')}>
            <Text style={[styles.profileBtnText, { fontSize: isTiny ? 13 : 14 }]}>My profile</Text>
          </Pressable>

          <View style={styles.bottomRow}>
            <Pressable style={[styles.smallRedBtn, { height: bottomBtnH }]} onPress={() => navigation.navigate('SavedPlaces')}>
              <Text style={[styles.smallRedText, { fontSize: isTiny ? 13 : 14 }]}>Saved places</Text>
            </Pressable>

            <Pressable style={[styles.smallRedBtn, { height: bottomBtnH }]} onPress={() => navigation.navigate('About')}>
              <Text style={[styles.smallRedText, { fontSize: isTiny ? 13 : 14 }]}>About</Text>
            </Pressable>
          </View>

          <View style={{ height: bottomSpacer }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const RED = '#ef2b2b';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 10 },
  hello: { color: '#fff', letterSpacing: 1, fontWeight: '500' },

  factCard: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: '#f0a018',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  factMain: { flex: 1, paddingRight: 10 },
  factTitle: { color: '#111', fontWeight: '700', marginBottom: 6 },
  factText: { color: '#111', lineHeight: 14 },
  factActions: { width: 34, alignItems: 'center', justifyContent: 'center' },
  factIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  factIconText: { color: '#111', fontSize: 16, fontWeight: '900' },
  factCloseText: { color: '#111', fontSize: 20, fontWeight: '900', marginTop: -2 },

  showFactBtn: {
    width: '100%',
    height: 54,
    borderRadius: 18,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showFactText: { color: '#fff', fontWeight: '800' },

  bigCard: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#2b2b2b',
    marginBottom: 12,
  },
  bigCardBg: { flex: 1, justifyContent: 'center' },
  bigCardImg: { borderRadius: 18 },

  pillRightAbs: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -22 }],
    minWidth: 180,
    paddingHorizontal: 22,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pillRightStatic: {
    minWidth: 180,
    paddingHorizontal: 22,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: { color: '#fff', fontWeight: '700' },

  achievementCard: { backgroundColor: '#1b1b1c' },
  achievementRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  profileBtn: {
    width: '100%',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#f5a019',
  },
  profileBtnText: { color: '#fff', fontWeight: '700' },

  bottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  smallRedBtn: {
    width: '48.5%',
    borderRadius: 18,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallRedText: { color: '#fff', fontWeight: '700' },
});
