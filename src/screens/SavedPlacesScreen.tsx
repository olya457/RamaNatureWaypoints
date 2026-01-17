import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { PLACES, type Place } from '../data/places';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedPlaces'>;

const SAVED_KEY = 'saved_places_v1';
const RED = '#ef2b2b';
const CARD = '#2b2b2b';
const TIP_BG = '#f0a018';
const DEER = require('../assets/deer.png');

async function readSaved(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}

export default function SavedPlacesScreen({ navigation }: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmall = height <= 700;
  const isTiny = height <= 640;

  const padH = isTiny ? 14 : isSmall ? 16 : 18;
  const cardH = isTiny ? 140 : isSmall ? 156 : 172;
  const imgH = isTiny ? 92 : isSmall ? 104 : 116;
  const bottomH = cardH - imgH;

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipVisible, setTipVisible] = useState(true);

  const a = useRef(new Animated.Value(0)).current;

  const refresh = useCallback(async () => {
    setLoading(true);
    const ids = await readSaved();
    setSavedIds(ids);
    setLoading(false);

    a.setValue(0);
    Animated.timing(a, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [a]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const savedPlaces: Place[] = useMemo(() => {
    const map = new Map(PLACES.map((p) => [p.id, p] as const));
    return savedIds.map((id) => map.get(id)).filter(Boolean) as Place[];
  }, [savedIds]);

  const renderItem = ({ item, index }: { item: Place; index: number }) => {
    const delay = Math.min(index * 50, 400);
   
    const rowTranslateY = a.interpolate({
        inputRange: [0, 1],
        outputRange: [20 + delay / 10, 0],
    });

    return (
      <Animated.View
        style={[
          styles.rowCard,
          { height: cardH, opacity: a, transform: [{ translateY: rowTranslateY }] },
        ]}
      >
        <Image source={item.image} style={[styles.rowImage, { height: imgH }]} resizeMode="cover" />

        <View style={[styles.rowBottom, { height: bottomH }]}>
          <Text style={[styles.rowTitle, { fontSize: isTiny ? 13 : 15 }]} numberOfLines={1}>
            {item.title} ({item.country})
          </Text>

          <Pressable
            style={styles.rowOpenBtn}
            onPress={() => navigation.navigate('PlaceDetail', { placeId: item.id, title: item.title })}
          >
            <Text style={styles.rowOpenText}>›</Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={[styles.topBar, { paddingHorizontal: padH }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.topTitle}>Saved places</Text>

        <View style={styles.spacer} />
      </View>

      {loading ? (
        <View style={styles.centerWrap}>
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      ) : savedPlaces.length === 0 ? (
        <View style={{ flex: 1 }}>
          <View style={{ height: 18 }} />
          {tipVisible && (
            <Animated.View style={[styles.tip, { marginHorizontal: padH, opacity: a }]}>
              <Image source={DEER} style={styles.tipDeer} resizeMode="contain" />
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.tipText}>
                  It&apos;s empty here for now. Find a place you{'\n'}don&apos;t want to get lost in.
                </Text>
              </View>
              <Pressable style={styles.tipClose} onPress={() => setTipVisible(false)}>
                <Text style={styles.tipCloseText}>×</Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      ) : (
        <FlatList
          data={savedPlaces}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: padH,
            paddingTop: 12,
            paddingBottom: Math.max(20, (insets.bottom || 0) + 20),
          }}
          ItemSeparatorComponent={() => <View style={{ height: isTiny ? 12 : 16 }} />}
        />
      )}
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

  tip: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: TIP_BG,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipDeer: { width: 56, height: 56, marginRight: 12 },
  tipText: { color: '#111', fontSize: 13, lineHeight: 17, fontWeight: '700' },
  tipClose: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  tipCloseText: { color: '#111', fontSize: 22, fontWeight: '900', marginTop: -2 },

  rowCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: CARD,
    overflow: 'hidden',
  },
  rowImage: { width: '100%' },
  rowBottom: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
  },
  rowTitle: { color: '#fff', fontWeight: '800', flex: 1, paddingRight: 12 },

  rowOpenBtn: {
    width: 44,
    height: 32,
    borderRadius: 16,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowOpenText: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: -2 },

  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: 'rgba(255,255,255,0.6)', fontWeight: '700', fontSize: 16 },
});