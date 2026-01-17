import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { getVisitedCount, getUnlockedTierIds, HORN_TIERS, type HornTierId } from '../utils/achievementProgress';

type Props = NativeStackScreenProps<RootStackParamList, 'Achievement'>;

const CARD = '#2b2b2b';
const RED = '#ef2b2b';
const TIP_BG = '#f0a018';

const DEER = require('../assets/deer.png');

const HORN_IMG: Record<HornTierId, any> = {
  first: require('../assets/horn_first.png'),
  forest: require('../assets/horn_forest.png'),
  wild: require('../assets/horn_wild.png'),
  deep: require('../assets/horn_deep.png'),
  guide: require('../assets/horn_guide.png'),
};

const HORN_LOCKED_IMG: Record<HornTierId, any> = {
  first: require('../assets/horn_first_locked.png'),
  forest: require('../assets/horn_forest_locked.png'),
  wild: require('../assets/horn_wild_locked.png'),
  deep: require('../assets/horn_deep_locked.png'),
  guide: require('../assets/horn_guide_locked.png'),
};

export default function AchievementScreen({ navigation }: Props) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isTiny = height <= 640;  
  const isSmall = height <= 700;

  const padH = isTiny ? 14 : isSmall ? 16 : 18;

  const topBarH = isTiny ? 56 : isSmall ? 58 : 62;
  const backSize = isTiny ? 40 : isSmall ? 44 : 46;
  const backIcon = isTiny ? 24 : 26;
  const titleSize = isTiny ? 18 : isSmall ? 19 : 20;

  const tipH = isTiny ? 78 : isSmall ? 86 : 96;
  const deerSize = isTiny ? 52 : isSmall ? 58 : 64;

  const cardRadius = 22;
  const cardPadV = isTiny ? 12 : isSmall ? 14 : 16;
  const cardPadH = isTiny ? 14 : isSmall ? 16 : 18;

  const hornSize = useMemo(() => {
    const maxByWidth = Math.floor(width - padH * 2 - cardPadH * 2);
    const base = isTiny ? 140 : isSmall ? 160 : 190;
    return Math.max(isTiny ? 120 : 140, Math.min(base, maxByWidth));
  }, [width, padH, cardPadH, isTiny, isSmall]);

  const btnH = isTiny ? 40 : isSmall ? 44 : 48;
  const btnW = Math.min(isTiny ? 168 : 190, width - padH * 2);

  const titleCard = isTiny ? 16 : 18;
  const descSize = isTiny ? 11 : 12;
  const descLine = isTiny ? 15 : 16;

  const [tipVisible, setTipVisible] = useState(true);
  const [visitedCount, setVisitedCount] = useState(0);

  const unlocked = useMemo(() => new Set(getUnlockedTierIds(visitedCount)), [visitedCount]);

  const a = useRef(new Animated.Value(0)).current;
  const tipA = useRef(new Animated.Value(0)).current;

  const refresh = useCallback(async () => {
    const c = await getVisitedCount();
    setVisitedCount(c);

    a.setValue(0);
    tipA.setValue(0);

    Animated.parallel([
      Animated.timing(a, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(tipA, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [a, tipA]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const onShare = useCallback(
    async (tierId: HornTierId) => {
      const tier = HORN_TIERS.find((t) => t.id === tierId);
      if (!tier) return;

      const msg =
        `${tier.title}\n\n` +
        `${tier.desc}\n\n` +
        `Progress: ${visitedCount}/12 places`;

      try {
        await Share.share({ message: msg });
      } catch {}
    },
    [visitedCount],
  );

  const bottomPad = Math.max(12, (insets.bottom || 0) + (Platform.OS === 'ios' ? 10 : 12));

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={[styles.topBar, { height: topBarH, paddingHorizontal: padH }]}>
        <Pressable
          style={[styles.backBtn, { width: backSize, height: backSize, borderRadius: 14 }]}
          onPress={() => navigation.goBack()}
          hitSlop={10}
        >
          <Text style={[styles.backText, { fontSize: backIcon }]}>‹</Text>
        </Pressable>

        <Text style={[styles.topTitle, { fontSize: titleSize }]}>Achievement</Text>

        <View style={{ width: backSize }} />
      </View>

      {tipVisible && (
        <Animated.View
          style={{
            marginHorizontal: padH,
            marginTop: isTiny ? 8 : 10,
            opacity: tipA,
            transform: [{ translateY: tipA.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
          }}
        >
          <View style={[styles.tip, { minHeight: tipH }]}>
            <Image source={DEER} style={{ width: deerSize, height: deerSize, marginRight: 12 }} resizeMode="contain" />
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.tipText, { fontSize: isTiny ? 11 : 12, lineHeight: isTiny ? 15 : 16 }]}>
                Each horn here is not a decoration. It is{'\n'}the trace of your path.
              </Text>
            </View>
            <Pressable style={styles.tipClose} onPress={() => setTipVisible(false)} hitSlop={10}>
              <Text style={styles.tipCloseText}>×</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      <Animated.View
        style={{
          flex: 1,
          opacity: a,
          transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: padH,
            paddingTop: tipVisible ? (isTiny ? 10 : 12) : 14,
            paddingBottom: bottomPad,
          }}
        >
          {HORN_TIERS.map((tier, idx) => {
            const isUnlocked = unlocked.has(tier.id);
            const img = isUnlocked ? HORN_IMG[tier.id] : HORN_LOCKED_IMG[tier.id];
            const delay = Math.min(idx * 50, 200);

            return (
              <Animated.View
                key={tier.id}
                style={{
                  marginBottom: isTiny ? 12 : 14,
                  opacity: a,
                  transform: [
                    {
                      translateY: a.interpolate({
                        inputRange: [0, 1],
                        outputRange: [14 + delay / 25, 0],
                      }),
                    },
                  ],
                }}
              >
                <View
                  style={[
                    styles.card,
                    {
                      borderRadius: cardRadius,
                      paddingVertical: cardPadV,
                      paddingHorizontal: cardPadH,
                    },
                  ]}
                >
                  <View style={{ alignItems: 'center' }}>
                    <Image source={img} style={{ width: hornSize, height: hornSize }} resizeMode="contain" />
                  </View>

                  <Text style={[styles.cardTitle, { fontSize: titleCard }]}>{tier.title}</Text>

                  <Text style={[styles.cardDesc, { fontSize: descSize, lineHeight: descLine }]}>
                    {tier.desc}
                  </Text>

                  <Pressable
                    style={[
                      styles.shareBtn,
                      { height: btnH, width: btnW, marginTop: isTiny ? 10 : 14 },
                      !isUnlocked && styles.shareDisabled,
                    ]}
                    disabled={!isUnlocked}
                    onPress={() => onShare(tier.id)}
                  >
                    <Text style={[styles.shareText, !isUnlocked && { opacity: 0.55 }]}>Share</Text>
                  </Pressable>

                  <Text style={[styles.progressText, { marginTop: isTiny ? 8 : 10 }]}>
                    {Math.min(visitedCount, 12)}/12 places • unlock at {tier.need}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  topBar: { flexDirection: 'row', alignItems: 'center' },
  backBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  backText: { color: '#fff', fontWeight: '900', marginTop: -2 },
  topTitle: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '700' },

  tip: {
    borderRadius: 18,
    backgroundColor: TIP_BG,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: { color: '#111', fontWeight: '700' },
  tipClose: {
    width: 30,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  tipCloseText: { color: '#111', fontSize: 20, fontWeight: '900', marginTop: -2 },

  card: {
    backgroundColor: CARD,
    paddingBottom: 12,
    alignItems: 'center',
  },
  cardTitle: {
    marginTop: 10,
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
  },
  cardDesc: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '600',
    textAlign: 'center',
  },

  shareBtn: {
    borderRadius: 16,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareDisabled: { backgroundColor: '#6b2323' },
  shareText: { color: '#fff', fontWeight: '900' },

  progressText: {
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '700',
    fontSize: 11,
  },
});
