import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { PLACES, type Place, MARKERS, DEFAULT_REGION } from '../data/places';

type Props = NativeStackScreenProps<RootStackParamList, 'InteractiveMap'>;

const CARD = '#2b2b2b';
const RED = '#ef2b2b';
const TIP_BG = '#f0a018';
const DEER = require('../assets/deer.png');

export default function InteractiveMapScreen({ navigation }: Props) {
  const { height, width } = useWindowDimensions();
  
  const [tipVisible, setTipVisible] = useState(true);
  const [selected, setSelected] = useState<Place | null>(null);

  const isTiny = height <= 640;
  const isSmall = height <= 720;
  const padH = isTiny ? 12 : 18;
  const topBarH = isTiny ? 54 : 64;
  const backBtnS = isTiny ? 40 : 46;
  const tipImgS = isTiny ? 50 : 66;

  const mapH = useMemo(() => {
    if (isTiny) {
      return height - topBarH - (tipVisible ? 100 : 40) - 40 - 30;
    }
    const baseH = isSmall ? height * 0.72 : height * 0.76;
    return baseH - 30;
  }, [height, topBarH, tipVisible, isTiny, isSmall]);

  const mapRef = useRef<MapView>(null);
  const regionRef = useRef<Region>(DEFAULT_REGION);

  const a = useRef(new Animated.Value(0)).current;
  const tipA = useRef(new Animated.Value(0)).current;
  const modalA = useRef(new Animated.Value(0)).current;
  const controlsA = useRef(new Animated.Value(0)).current;

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const applyRegion = useCallback((r: Region, animated = true) => {
    regionRef.current = r;
    mapRef.current?.animateToRegion(r, animated ? 250 : 0);
  }, []);

  const zoomBy = useCallback((factor: number) => {
    const r = regionRef.current;
    const next: Region = {
      ...r,
      latitudeDelta: clamp(r.latitudeDelta * factor, 0.01, 120),
      longitudeDelta: clamp(r.longitudeDelta * factor, 0.01, 120),
    };
    applyRegion(next, true);
  }, [applyRegion]);

  const fitAll = useCallback((animated = true) => {
    const m = mapRef.current;
    if (!m || !MARKERS?.length) return;
    m.fitToCoordinates(
      MARKERS.map((p) => ({ latitude: p.latitude, longitude: p.longitude })),
      {
        edgePadding: { top: 60, right: 40, bottom: 180, left: 40 },
        animated,
      }
    );
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(a, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(tipA, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(controlsA, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => fitAll(false), 150);
    return () => clearTimeout(t);
  }, [fitAll, a, tipA, controlsA]);

  const showModal = useCallback((p: Place) => {
    setSelected(p);
    modalA.setValue(0);
    Animated.spring(modalA, { toValue: 1, damping: 15, useNativeDriver: true }).start();
  }, [modalA]);

  const closeModal = useCallback(() => {
    Animated.timing(modalA, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setSelected(null));
  }, [modalA]);

  const modalImgH = isTiny ? 70 : 92;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={[styles.topBar, { height: topBarH, paddingHorizontal: padH }]}>
        <Pressable style={[styles.backBtn, { width: backBtnS, height: backBtnS }]} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={[styles.topTitle, { fontSize: isTiny ? 17 : 20 }]}>Interactive map</Text>
        <View style={{ width: backBtnS }} />
      </View>

      {tipVisible && (
        <Animated.View style={{ marginHorizontal: padH, opacity: tipA, transform: [{ translateY: tipA.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}>
          <View style={styles.tip}>
            <Image source={DEER} style={{ width: tipImgS, height: tipImgS, marginRight: 10 }} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.tipText, { fontSize: isTiny ? 11 : 13 }]}>
                Tap on the pins. Each one is a possible journey.
              </Text>
            </View>
            <Pressable style={styles.tipClose} onPress={() => setTipVisible(false)}>
              <Text style={styles.tipCloseText}>×</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      <Animated.View style={[styles.mapWindow, { height: mapH, marginTop: tipVisible ? 10 : 12, marginHorizontal: padH, opacity: a, transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }] }]}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={DEFAULT_REGION}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          onPress={() => selected && closeModal()}
          onRegionChangeComplete={(r) => { regionRef.current = r; }}
          onMapReady={() => fitAll(false)}
        >
          {PLACES.map((p) => (
            <Marker key={p.id} coordinate={{ latitude: p.lat, longitude: p.lng }} onPress={() => showModal(p)} />
          ))}
        </MapView>

        <Animated.View style={[styles.controls, { opacity: controlsA }]} pointerEvents="box-none">
          <View style={styles.ctrlCol}>
            <Pressable style={styles.ctrlBtn} onPress={() => zoomBy(0.6)}><Text style={styles.ctrlText}>＋</Text></Pressable>
            <Pressable style={[styles.ctrlBtn, { marginTop: 8 }]} onPress={() => zoomBy(1.4)}><Text style={styles.ctrlText}>－</Text></Pressable>
            <Pressable style={[styles.ctrlBtn, { marginTop: 8 }]} onPress={() => fitAll(true)}><Text style={styles.ctrlText}>◎</Text></Pressable>
          </View>
        </Animated.View>

        {selected && (
          <Animated.View style={[styles.modal, { width: width - padH * 4, opacity: modalA, transform: [{ translateY: modalA.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
            <View style={styles.modalCard}>
              <Pressable style={styles.modalClose} onPress={closeModal}><Text style={styles.modalCloseText}>×</Text></Pressable>
              <Image source={selected.image} style={[styles.modalImg, { height: modalImgH }]} resizeMode="cover" />
              <View style={styles.modalBottom}>
                <Text style={styles.modalTitle} numberOfLines={1}>{selected.title}</Text>
                <Pressable style={styles.modalOpen} onPress={() => navigation.navigate('PlaceDetail', { placeId: selected.id, title: selected.title })}>
                  <Text style={styles.modalOpenText}>›</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  topBar: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
  backText: { color: '#fff', fontSize: 28, fontWeight: '300', marginTop: -4 },
  topTitle: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '800' },
  tip: { borderRadius: 20, backgroundColor: TIP_BG, padding: 10, flexDirection: 'row', alignItems: 'center' },
  tipText: { color: '#111', fontWeight: '800' },
  tipClose: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' },
  tipCloseText: { color: '#111', fontSize: 18, fontWeight: '900' },
  mapWindow: { borderRadius: 24, overflow: 'hidden', backgroundColor: '#1a1a1a' },
  controls: { position: 'absolute', right: 12, top: 12 },
  ctrlCol: { borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.4)', padding: 6 },
  ctrlBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: RED, alignItems: 'center', justifyContent: 'center' },
  ctrlText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  modal: { position: 'absolute', bottom: 12, alignSelf: 'center' },
  modalCard: { borderRadius: 20, backgroundColor: CARD, overflow: 'hidden' },
  modalClose: { position: 'absolute', top: 8, left: 8, zIndex: 10, width: 28, height: 28, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  modalImg: { width: '100%' },
  modalBottom: { height: 50, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' },
  modalTitle: { color: '#fff', fontWeight: '800', flex: 1, fontSize: 13 },
  modalOpen: { width: 36, height: 28, borderRadius: 14, backgroundColor: RED, alignItems: 'center', justifyContent: 'center' },
  modalOpenText: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: -2 }
});