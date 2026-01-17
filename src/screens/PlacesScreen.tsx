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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { PLACES, type Place } from '../data/places';
import { markPlaceVisited } from '../utils/achievementProgress';

type Props = NativeStackScreenProps<RootStackParamList, 'Places'>;

const DEER = require('../assets/deer.png');
const RED = '#ef2b2b';
const EXTRA_SCROLL = 40;

export default function PlacesScreen({ navigation }: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmall = height <= 700;
  const isTiny = height <= 640;

  const [tipVisible, setTipVisible] = useState(true);

  const sizes = useMemo(() => {
    const padH = isTiny ? 14 : isSmall ? 16 : 18;

    const cardH = isTiny ? 136 : isSmall ? 150 : 172;
    const imgH = isTiny ? 88 : isSmall ? 102 : 118;
    const bottomH = Math.max(44, cardH - imgH);

    const titleSize = isTiny ? 12 : 13;
    const openW = isTiny ? 38 : 42;
    const openH = isTiny ? 30 : 34;
    const openR = isTiny ? 16 : 18;

    const tipDeer = isTiny ? 52 : 56;

    return { padH, cardH, imgH, bottomH, titleSize, openW, openH, openR, tipDeer };
  }, [isSmall, isTiny]);

  const enter = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    enter.setValue(0);
    Animated.timing(enter, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const onOpenPlace = useCallback(
    async (place: Place) => {
      try {
        await markPlaceVisited(place.id); 
      } catch {}
      navigation.navigate('PlaceDetail', { placeId: place.id, title: place.title });
    },
    [navigation],
  );

  const renderItem = ({ item, index }: { item: Place; index: number }) => {
    const delay = Math.min(index * 45, 420);

    const translateY = enter.interpolate({
      inputRange: [0, 1],
      outputRange: [14 + delay / 30, 0],
    });

    const scale = enter.interpolate({
      inputRange: [0, 1],
      outputRange: [0.98, 1],
    });

    const opacity = enter.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        style={[
          styles.rowCard,
          {
            height: sizes.cardH,
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <Image source={item.image} style={[styles.rowImage, { height: sizes.imgH }]} resizeMode="cover" />

        <View style={[styles.rowBottom, { height: sizes.bottomH }]}>
          <Text style={[styles.rowTitle, { fontSize: sizes.titleSize }]} numberOfLines={2}>
            {item.title} ({item.country})
          </Text>

          <Pressable
            style={[styles.rowOpenBtn, { width: sizes.openW, height: sizes.openH, borderRadius: sizes.openR }]}
            onPress={() => onOpenPlace(item)}
          >
            <Text style={styles.rowOpenText}>›</Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  const headerOpacity = enter;
  const headerTranslate = enter.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslate }] }}>
        <View style={[styles.topBar, { paddingHorizontal: sizes.padH }]}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.topTitle}>Places</Text>

          <View style={styles.spacer} />
        </View>

        {tipVisible && (
          <View style={[styles.tip, { marginHorizontal: sizes.padH }]}>
            <Image
              source={DEER}
              style={{ width: sizes.tipDeer, height: sizes.tipDeer, marginRight: 10 }}
              resizeMode="contain"
            />
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.tipTitle, { fontSize: isTiny ? 11 : 12 }]}>Daily tip</Text>
              <Text style={[styles.tipText, { fontSize: isTiny ? 10.5 : 11 }]}>
                Look carefully: some places can feel like{'\n'}home — even if you have never been there.
              </Text>
            </View>
            <Pressable style={styles.tipClose} onPress={() => setTipVisible(false)}>
              <Text style={styles.tipCloseText}>×</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>

      <FlatList
        data={PLACES}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: sizes.padH,
          paddingTop: tipVisible ? 10 : 12,
          paddingBottom:
            Math.max(14, (insets.bottom || 0) + (Platform.OS === 'ios' ? 6 : 10)) + EXTRA_SCROLL,
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: isTiny ? 10 : 12 }} />}
      />
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
    marginTop: 8,
    borderRadius: 18,
    backgroundColor: '#f0a018',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipTitle: { color: '#111', fontWeight: '900', marginBottom: 4 },
  tipText: { color: '#111', lineHeight: 14, fontWeight: '600' },
  tipClose: {
    width: 30,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  tipCloseText: { color: '#111', fontSize: 20, fontWeight: '900', marginTop: -2 },

  rowCard: { width: '100%', borderRadius: 22, backgroundColor: '#2b2b2b', overflow: 'hidden' },
  rowImage: { width: '100%' },

  rowBottom: { paddingLeft: 14, paddingRight: 12, flexDirection: 'row', alignItems: 'center' },
  rowTitle: { color: '#fff', fontWeight: '800', flex: 1, paddingRight: 10 },

  rowOpenBtn: { backgroundColor: RED, alignItems: 'center', justifyContent: 'center' },
  rowOpenText: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: -1 },
});
