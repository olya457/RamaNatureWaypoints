import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Animated,
  Easing,
  Share,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { getPlaceById } from '../data/places';
import { markPlaceVisited } from '../utils/achievementProgress';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceDetail'>;

const SAVED_KEY = 'saved_places_v1';

const RED = '#ef2b2b';
const ORANGE = '#f0a018';
const CARD = '#2b2b2b';

const ICON_SHARE = require('../assets/icon_share.png');
const ICON_SAVE = require('../assets/icon_save.png');
const ICON_SAVE_ACTIVE = require('../assets/icon_save_active.png');
const ICON_MAP = require('../assets/icon_map.png');

async function readSaved(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

async function writeSaved(ids: string[]) {
  try {
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(ids));
  } catch {}
}

export default function PlaceDetailScreen({ route, navigation }: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmall = height <= 700;
  const isTiny = height <= 640;

  const padH = isTiny ? 14 : isSmall ? 16 : 18;
  const imageH = isTiny ? 145 : isSmall ? 165 : 185;

  const placeId = route.params?.placeId ?? 'yellowstone';
  const place = useMemo(() => getPlaceById(placeId), [placeId]);

  const title = place?.title ?? route.params?.title ?? 'Place';
  const coordsText = place ? `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}` : '—';

  const lat = place?.lat ?? 0;
  const lng = place?.lng ?? 0;

  const initialRegion: Region = useMemo(
    () => ({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.35,
      longitudeDelta: 0.35,
    }),
    [lat, lng],
  );

  const mapRef = useRef<MapView | null>(null);
  const [saved, setSaved] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    a.setValue(0);
    Animated.timing(a, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [a, placeId]);

  useEffect(() => {
    (async () => {
      const ids = await readSaved();
      setSaved(ids.includes(placeId));
    })();
  }, [placeId]);

  useEffect(() => {
    setShowMap(false);
  }, [placeId]);

  useEffect(() => {
    (async () => {
      try {
        await markPlaceVisited(placeId);
      } catch {}
    })();
  }, [placeId]);

  const toggleSaved = useCallback(async () => {
    const ids = await readSaved();
    const next = ids.includes(placeId) ? ids.filter((x) => x !== placeId) : [...ids, placeId];
    await writeSaved(next);
    setSaved(next.includes(placeId));
  }, [placeId]);

  const onShare = useCallback(async () => {
    try {
      const message = `${title}\nCoordinates: ${coordsText}\n\n${place?.description ?? ''}`;
      await Share.share({ message });
    } catch {}
  }, [title, coordsText, place?.description]);

  const toggleMap = useCallback(() => setShowMap((v) => !v), []);

  useEffect(() => {
    if (!showMap || !place) return;
    requestAnimationFrame(() => {
      mapRef.current?.animateToRegion(initialRegion, 280);
    });
  }, [showMap, place, initialRegion]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={[styles.topBar, { paddingHorizontal: padH }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.topTitle}>Places</Text>

        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: padH,
          paddingBottom: Math.max(16, (insets.bottom || 0) + (Platform.OS === 'ios' ? 10 : 12)),
        }}
      >
        <Animated.View
          style={{
            opacity: a,
            transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
          }}
        >
          <View style={[styles.mediaWrap, { height: imageH }]}>
            {showMap && place ? (
              <MapView
                ref={(r) => {
                  mapRef.current = r;
                }}
                style={styles.map}
                initialRegion={initialRegion}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              >
                <Marker coordinate={{ latitude: lat, longitude: lng }} />
              </MapView>
            ) : place?.image ? (
              <Image source={place.image} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={[styles.image, { backgroundColor: '#333' }]} />
            )}
          </View>

          <View style={styles.card}>
            <Text style={[styles.title, { fontSize: isTiny ? 18 : 20 }]} numberOfLines={2}>
              {title}
            </Text>
            <Text style={[styles.coords, { fontSize: isTiny ? 14 : 15 }]}>{coordsText}</Text>
            <Text
              style={[styles.desc, { fontSize: isTiny ? 13 : 14, lineHeight: isTiny ? 19 : 21 }]}
              numberOfLines={isTiny ? 10 : 12}
            >
              {place?.description ?? 'No description'}
            </Text>
          </View>

          <View style={[styles.actionsRow, { marginTop: isTiny ? 12 : 16 }]}>
            <Pressable style={styles.iconBtn} onPress={onShare}>
              <Image source={ICON_SHARE} style={styles.iconImg} resizeMode="contain" />
            </Pressable>

            <Pressable style={[styles.iconBtn, saved ? styles.iconBtnSaved : null]} onPress={toggleSaved}>
              <Image
                source={saved ? ICON_SAVE_ACTIVE : ICON_SAVE}
                style={[styles.iconImg, saved ? styles.iconImgSaved : null]}
                resizeMode="contain"
              />
            </Pressable>

            <Pressable style={[styles.iconBtn, showMap ? styles.iconBtnMapOn : null]} onPress={toggleMap}>
              <Image source={ICON_MAP} style={styles.iconImg} resizeMode="contain" />
            </Pressable>
          </View>

          <View style={{ height: 20 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  topBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  backText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -6,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  spacer: { width: 44 },

  mediaWrap: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: CARD,
    marginTop: 6,
  },
  image: { width: '100%', height: '100%' },
  map: { width: '100%', height: '100%' },

  card: {
    marginTop: 12,
    borderRadius: 22,
    backgroundColor: CARD,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },
  title: { color: '#fff', fontWeight: '800', marginBottom: 8 },
  coords: { color: ORANGE, fontWeight: '900', marginBottom: 10 },
  desc: { color: 'rgba(255,255,255,0.85)' },

  actionsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  iconBtn: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnSaved: { backgroundColor: ORANGE },
  iconBtnMapOn: { backgroundColor: 'rgba(255,255,255,0.15)' },
  iconImg: { width: 26, height: 26, tintColor: '#fff' },
  iconImgSaved: { tintColor: '#000' },
});
