import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  useWindowDimensions,
  Animated,
  Easing,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;
type ActiveField = 'name' | 'about';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type StoredProfile = {
  name: string;
  about: string;
  photoUri: string | null;
};

const PROFILE_KEY = 'profile_v1';

export default function RegisterScreen({ navigation }: Props) {
  const { height, width } = useWindowDimensions();
  const isSmall = height <= 700;
  const isTiny = height <= 640;

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [activeField, setActiveField] = useState<ActiveField>('name');

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_KEY);
        if (!raw) return;
        const p = JSON.parse(raw) as StoredProfile;
        if (p?.name) setName(String(p.name));
        if (p?.about) setAbout(String(p.about));
        if (p?.photoUri) setPhotoUri(String(p.photoUri));
      } catch {}
    })();
  }, []);

  const canContinue = useMemo(() => name.trim().length > 0, [name]);

  const androidTopOffset = Platform.OS === 'android' ? 10 : 0;
  const contentTop = (isTiny ? 6 : isSmall ? 10 : 18) + androidTopOffset;
  const contentHPad = isTiny ? 14 : isSmall ? 16 : 20;
  const photoSize = isTiny ? 96 : isSmall ? 108 : 120;
  const photoRadius = photoSize / 2;
  const inputH = isTiny ? 42 : isSmall ? 46 : 48;
  const aboutH = isTiny ? 60 : isSmall ? 66 : 72;
  const tipH = isTiny ? 74 : isSmall ? 82 : 96; 
  const btnH = isTiny ? 46 : isSmall ? 48 : 52;

  const kbCols = 7;
  const kbPadH = isTiny ? 6 : isSmall ? 7 : 8;
  const kbPadV = isTiny ? 4 : isSmall ? 5 : 6;
  const kbGap = isTiny ? 3 : isSmall ? 4 : 5;
  const kbKeyH = isTiny ? 24 : isSmall ? 26 : 30;
  const actionRowH = isTiny ? 20 : isSmall ? 22 : 24;

  const kbKeyW = useMemo(() => {
    const containerW = width - contentHPad * 2 - kbPadH * 2;
    const totalGaps = kbGap * (kbCols - 1);
    const w = Math.floor((containerW - totalGaps) / kbCols);
    return Math.max(isTiny ? 28 : isSmall ? 30 : 34, Math.min(isTiny ? 46 : 52, w));
  }, [width, contentHPad, kbPadH, kbGap, kbCols, isSmall, isTiny]);

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(14)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardRise = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(cardFade, { toValue: 1, duration: 340, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(cardRise, { toValue: 0, duration: 340, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, []);

  const pickPhoto = async () => {
    try {
      const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.9 });
      if (res.didCancel) return;
      const asset = res.assets?.[0];
      if (!asset?.uri) return;
      setPhotoUri(asset.uri);
    } catch {
      Alert.alert('Error', 'Cannot open gallery');
    }
  };

  const getValue = () => (activeField === 'name' ? name : about);
  const setValue = (v: string) => (activeField === 'name' ? setName(v) : setAbout(v));

  const onKey = (ch: string) => {
    const v = getValue();
    const max = activeField === 'name' ? 18 : 80;
    if (v.length >= max) return;
    setValue(v + ch);
  };

  const onSpace = () => {
    const v = getValue();
    if (!v.length || v.endsWith(' ')) return;
    onKey(' ');
  };

  const onDelete = () => {
    const v = getValue();
    if (!v.length) return;
    setValue(v.slice(0, -1));
  };

  const onContinue = async () => {
    if (!canContinue) return;
    const payload: StoredProfile = { name: name.trim(), about: about.trim(), photoUri: photoUri ?? null };
    try { await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(payload)); } catch {}
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: contentTop, paddingHorizontal: contentHPad, paddingBottom: 10 }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.Text style={[styles.title, { opacity: fade, transform: [{ translateY: rise }] }]}>
            REGISTRATION
          </Animated.Text>

          <Pressable style={styles.photoWrap} onPress={pickPhoto}>
            {!photoUri ? (
              <Animated.View style={[styles.photoCard, { width: photoSize, height: photoSize, borderRadius: 18, opacity: fade, transform: [{ translateY: rise }] }]}>
                <Text style={styles.photoIcon}>📷</Text>
                <Text style={[styles.photoText, { fontSize: isTiny ? 11 : 12 }]}>Profile photo</Text>
              </Animated.View>
            ) : (
              <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }] }}>
                <Image source={{ uri: photoUri }} style={{ width: photoSize, height: photoSize, borderRadius: photoRadius }} resizeMode="cover" />
              </Animated.View>
            )}
          </Pressable>

          <Animated.View style={[styles.fields, { opacity: cardFade, transform: [{ translateY: cardRise }] }]}>
            <Pressable
              style={[styles.fakeInput, { height: inputH }, activeField === 'name' && styles.fakeInputActive]}
              onPress={() => setActiveField('name')}
            >
              <Text style={[styles.fakeText, name ? styles.fakeValue : styles.fakePlaceholder]}>
                {name ? name : 'Nickname'}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.fakeInput, styles.fakeAbout, { height: aboutH }, activeField === 'about' && styles.fakeInputActive]}
              onPress={() => setActiveField('about')}
            >
              <Text numberOfLines={3} style={[styles.fakeText, about ? styles.fakeValue : styles.fakePlaceholder]}>
                {about ? about : 'About me'}
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.tipWrap, { opacity: cardFade, transform: [{ translateY: cardRise }] }]}>
            <Image
              source={require('../assets/reg_deer_tip.png')}
              style={[styles.tipImage, { height: tipH }]}
              resizeMode="contain"
            />
          </Animated.View>
        </ScrollView>

        <View style={[
          styles.bottomBar, 
          { 
            paddingHorizontal: contentHPad, 
            marginBottom: Platform.OS === 'android' ? 20 : 0 
          }
        ]}>
          <View style={[styles.keyboardCompact, { paddingHorizontal: kbPadH, paddingVertical: kbPadV }]}>
            <View style={[styles.kTopRow, { height: actionRowH }]}>
              <Text style={[styles.kHint, { fontSize: isTiny ? 10 : 11 }]}>
                {activeField === 'name' ? 'Nickname' : 'About'}
              </Text>
              <Pressable style={[styles.kActionBtn, { height: actionRowH }]} onPress={onDelete}>
                <Text style={[styles.kActionText, { fontSize: isTiny ? 10 : 11 }]}>Delete</Text>
              </Pressable>
            </View>
            <View style={[styles.kGrid, { gap: kbGap }]}>
              {ALPHABET.map((ch) => (
                <Pressable key={ch} style={[styles.kKey, { width: kbKeyW, height: kbKeyH }]} onPress={() => onKey(ch)}>
                  <Text style={[styles.kKeyText, { fontSize: isTiny ? 11 : 12 }]}>{ch}</Text>
                </Pressable>
              ))}
              <Pressable style={[styles.kKey, styles.kSpace, { height: kbKeyH }]} onPress={onSpace}>
                <Text style={[styles.kKeyText, { fontSize: isTiny ? 11 : 12 }]}>SPACE</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={[styles.btn, { height: btnH }, !canContinue && styles.btnDisabled]}
            onPress={onContinue}
            disabled={!canContinue}
          >
            <Text style={[styles.btnText, { fontSize: isTiny ? 13 : 15 }]}>Continue</Text>
          </Pressable>
          <View style={{ height: Platform.OS === 'ios' ? 4 : 2 }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const CARD_BG = '#2e2f31';
const RED = '#ef2b2b';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  flex: { flex: 1 },
  content: { alignItems: 'center' },
  title: { color: 'rgba(255,255,255,0.85)', fontSize: 14, letterSpacing: 1.5, marginBottom: 14 },
  photoWrap: { width: '100%', alignItems: 'center', marginBottom: 12 },
  photoCard: { backgroundColor: RED, alignItems: 'center', justifyContent: 'center', gap: 4 },
  photoIcon: { fontSize: 20 },
  photoText: { color: '#fff', opacity: 0.9 },
  fields: { width: '100%', gap: 8, marginBottom: 10 },
  fakeInput: { width: '100%', borderRadius: 14, paddingHorizontal: 14, backgroundColor: CARD_BG, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  fakeAbout: { alignItems: 'flex-start', justifyContent: 'flex-start', paddingTop: 10, paddingBottom: 10 },
  fakeInputActive: { borderColor: 'rgba(80, 170, 255, 0.9)', borderWidth: 2 },
  fakeText: { fontSize: 13 },
  fakePlaceholder: { color: 'rgba(255,255,255,0.25)' },
  fakeValue: { color: 'rgba(255,255,255,0.9)' },
  tipWrap: { width: '100%', marginTop: 4, marginBottom: 10 },
  tipImage: { width: '100%', borderRadius: 16 },
  bottomBar: { backgroundColor: '#000', paddingTop: 6, paddingBottom: 6 },
  keyboardCompact: { backgroundColor: '#0f0f10', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 8 },
  kTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  kHint: { color: 'rgba(255,255,255,0.55)' },
  kActionBtn: { paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#1b1b1c', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  kActionText: { color: '#fff', fontWeight: '800' },
  kGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  kKey: { borderRadius: 11, backgroundColor: '#1b1b1c', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  kKeyText: { color: 'rgba(255,255,255,0.92)', fontWeight: '800' },
  kSpace: { width: '100%', marginTop: 2 },
  btn: { borderRadius: 16, paddingHorizontal: 28, backgroundColor: RED, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', minWidth: 170 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '800' },
});