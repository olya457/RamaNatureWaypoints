import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
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
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'MyProfile'>;
type ActiveField = 'name' | 'about';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const PROFILE_KEY = 'profile_v1';
const CARD_BG = '#2e2f31';
const RED = '#ef2b2b';

export default function MyProfileScreen({ navigation }: Props) {
  const { height, width } = useWindowDimensions();

  const isTiny = height <= 640;
  const isMini = height <= 590;
  const isMicro = height <= 560;

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [activeField, setActiveField] = useState<ActiveField>('name');
  const [loadedOnce, setLoadedOnce] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(PROFILE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setName(p?.name ?? '');
        setAbout(p?.about ?? '');
        setPhotoUri(p?.photoUri ?? null);
      }
    } catch {
    } finally {
      setLoadedOnce(true);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadProfile(); }, [loadProfile]));

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  const contentHPad = isMicro ? 12 : isMini ? 14 : isTiny ? 16 : 20;
  const photoSize = isMicro ? 72 : isMini ? 80 : isTiny ? 92 : 110;
  const inputH = isMicro ? 38 : isMini ? 40 : isTiny ? 44 : 48;
  const aboutH = isMicro ? 50 : isMini ? 54 : isTiny ? 60 : 72;
  const btnH = isMicro ? 42 : isMini ? 44 : isTiny ? 46 : 52;

  const kbPadH = isMicro ? 6 : isMini ? 7 : 8;
  const kbGap = isMicro ? 4 : isMini ? 5 : 6;
  const kbKeyH = isMicro ? 22 : isMini ? 24 : isTiny ? 26 : 30;
  const kbCols = 7;

  const kbKeyW = useMemo(() => {
    const containerW = width - contentHPad * 2 - kbPadH * 2;
    const totalGaps = kbGap * (kbCols - 1);
    return Math.floor((containerW - totalGaps) / kbCols);
  }, [width, contentHPad, kbPadH, kbGap]);

  const fade = useRef(new Animated.Value(0)).current;
  const caretA = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(caretA, { toValue: 0, duration: 520, useNativeDriver: true }),
        Animated.timing(caretA, { toValue: 1, duration: 520, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const pickPhoto = async () => {
    try {
      const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.9 });
      if (!res.didCancel && res.assets?.[0]?.uri) setPhotoUri(res.assets[0].uri);
    } catch { Alert.alert('Error', 'Gallery error'); }
  };

  const onKey = (ch: string) => {
    const v = activeField === 'name' ? name : about;
    const max = activeField === 'name' ? 18 : 80;
    if (v.length >= max) return;
    activeField === 'name' ? setName(v + ch) : setAbout(v + ch);
  };

  const onSave = async () => {
    if (!canSave) return;
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify({ name: name.trim(), about: about.trim(), photoUri }));
      navigation.goBack();
    } catch {}
  };

  const androidTopShift = Platform.OS === 'android' ? 10 : 0;
  const androidBottomShift = Platform.OS === 'android' ? 40 : 0;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <View style={[styles.topBar, { paddingHorizontal: contentHPad, height: (isMicro ? 56 : 60) + androidTopShift }]}>
          <Pressable style={[styles.backBtn, { marginTop: androidTopShift }]} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={[styles.topTitle, { marginTop: androidTopShift }]}>My profile</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={[styles.main, { paddingHorizontal: contentHPad, paddingTop: 6 + androidTopShift }]}>
          <Animated.View style={{ opacity: fade, width: '100%', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>MY PROFILE</Text>
            
            <Pressable style={styles.photoWrap} onPress={pickPhoto}>
              <View style={[styles.photoBox, { width: photoSize, height: photoSize, borderRadius: photoSize / 2 }]}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={{ width: photoSize, height: photoSize, borderRadius: photoSize / 2 }} />
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: isMicro ? 18 : 22 }}>📷</Text>
                    <Text style={styles.photoHint}>Profile photo</Text>
                  </View>
                )}
              </View>
            </Pressable>

            <View style={styles.fields}>
              <Pressable style={[styles.fakeInput, { height: inputH }, activeField === 'name' && styles.activeField]} onPress={() => setActiveField('name')}>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldText, !name && styles.placeholder]} numberOfLines={1}>{name || 'Nickname'}</Text>
                  {activeField === 'name' && <Animated.View style={[styles.caret, { opacity: caretA }]} />}
                </View>
              </Pressable>

              <Pressable style={[styles.fakeInput, { height: aboutH, alignItems: 'flex-start', paddingTop: 10 }, activeField === 'about' && styles.activeField]} onPress={() => setActiveField('about')}>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldText, !about && styles.placeholder]} numberOfLines={3}>{about || 'About me'}</Text>
                  {activeField === 'about' && <Animated.View style={[styles.caret, { opacity: caretA }]} />}
                </View>
              </Pressable>
            </View>
          </Animated.View>
        </View>

        <View style={[styles.bottomBar, { paddingHorizontal: contentHPad, marginBottom: androidBottomShift }]}>
          <View style={[styles.keyboardCompact, { paddingHorizontal: kbPadH, paddingVertical: isMicro ? 4 : 6 }]}>
            <View style={styles.kTop}>
              <Text style={styles.kHint}>{activeField === 'name' ? 'Nickname' : 'About'}</Text>
              <Pressable style={styles.kDel} onPress={() => (activeField === 'name' ? setName(name.slice(0, -1)) : setAbout(about.slice(0, -1)))}>
                <Text style={styles.kDelText}>Delete</Text>
              </Pressable>
            </View>
            <View style={[styles.kGrid, { gap: kbGap }]}>
              {ALPHABET.map(ch => (
                <Pressable key={ch} style={[styles.kKey, { width: kbKeyW, height: kbKeyH }]} onPress={() => onKey(ch)}>
                  <Text style={styles.kKeyText}>{ch}</Text>
                </Pressable>
              ))}
              <Pressable style={[styles.kKey, { width: '100%', marginTop: 2, height: kbKeyH }]} onPress={() => onKey(' ')}>
                <Text style={styles.kKeyText}>SPACE</Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={[styles.btn, { height: btnH }, !canSave && styles.btnDisabled]} onPress={onSave} disabled={!canSave}>
            <Text style={styles.btnText}>Save</Text>
          </Pressable>
          <View style={{ height: Platform.OS === 'ios' ? 4 : 2 }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  flex: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)' },
  backText: { color: '#fff', fontSize: 26, fontWeight: '900' },
  topTitle: { color: '#fff', fontWeight: '700', fontSize: 18 },
  main: { flex: 1, alignItems: 'center' },
  sectionTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, letterSpacing: 1.5, marginBottom: 10 },
  photoWrap: { marginBottom: 15 },
  photoBox: { backgroundColor: RED, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photoHint: { color: '#fff', fontSize: 10, fontWeight: '700', marginTop: 2 },
  fields: { width: '100%', gap: 8 },
  fakeInput: { width: '100%', borderRadius: 14, paddingHorizontal: 14, backgroundColor: CARD_BG, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', justifyContent: 'center' },
  activeField: { borderColor: '#50aaff', borderWidth: 2 },
  fieldRow: { flexDirection: 'row', alignItems: 'center' },
  fieldText: { color: '#fff', fontSize: 13, flex: 1 },
  placeholder: { color: 'rgba(255,255,255,0.25)' },
  caret: { width: 2, height: 16, backgroundColor: '#fff', marginLeft: 4 },
  bottomBar: { paddingBottom: 4 },
  keyboardCompact: { backgroundColor: '#0f0f10', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 6 },
  kTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  kHint: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700' },
  kDel: { backgroundColor: '#1b1b1c', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  kDelText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  kGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  kKey: { backgroundColor: '#1b1b1c', borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  kKeyText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  btn: { borderRadius: 16, backgroundColor: RED, alignItems: 'center', justifyContent: 'center', minWidth: 170, alignSelf: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 15 }
});