import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loader'>;

export default function LoaderScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 5000);

    return () => clearTimeout(t);
  }, [navigation]);

  const html = useMemo(() => {
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        --color: #fd7000;
        --size: 12px;
        --time: 1s;
      }

      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: #090707;
      }

      main {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #090707;
      }

      .dank-ass-loader {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .row {
        display: flex;
      }

      .arrow {
        width: 0;
        height: 0;
        margin: 0 calc(var(--size) / -2);
        border-left: var(--size) solid transparent;
        border-right: var(--size) solid transparent;
        border-bottom: calc(var(--size) * 1.8) solid var(--color);
        animation: blink var(--time) infinite;
        filter: drop-shadow(0 0 calc(var(--size) * 1.5) var(--color));
        opacity: 0.1;
      }

      .arrow.down { transform: rotate(180deg); }

      .outer-1 { animation-delay: calc(-1 * (var(--time) / 18) * 1); }
      .outer-2 { animation-delay: calc(-1 * (var(--time) / 18) * 2); }
      .outer-3 { animation-delay: calc(-1 * (var(--time) / 18) * 3); }
      .outer-4 { animation-delay: calc(-1 * (var(--time) / 18) * 4); }
      .outer-5 { animation-delay: calc(-1 * (var(--time) / 18) * 5); }
      .outer-6 { animation-delay: calc(-1 * (var(--time) / 18) * 6); }
      .outer-7 { animation-delay: calc(-1 * (var(--time) / 18) * 7); }
      .outer-8 { animation-delay: calc(-1 * (var(--time) / 18) * 8); }
      .outer-9 { animation-delay: calc(-1 * (var(--time) / 18) * 9); }
      .outer-10 { animation-delay: calc(-1 * (var(--time) / 18) * 10); }
      .outer-11 { animation-delay: calc(-1 * (var(--time) / 18) * 11); }
      .outer-12 { animation-delay: calc(-1 * (var(--time) / 18) * 12); }
      .outer-13 { animation-delay: calc(-1 * (var(--time) / 18) * 13); }
      .outer-14 { animation-delay: calc(-1 * (var(--time) / 18) * 14); }
      .outer-15 { animation-delay: calc(-1 * (var(--time) / 18) * 15); }
      .outer-16 { animation-delay: calc(-1 * (var(--time) / 18) * 16); }
      .outer-17 { animation-delay: calc(-1 * (var(--time) / 18) * 17); }
      .outer-18 { animation-delay: calc(-1 * (var(--time) / 18) * 18); }

      .inner-1 { animation-delay: calc(-1 * (var(--time) / 6) * 1); }
      .inner-2 { animation-delay: calc(-1 * (var(--time) / 6) * 2); }
      .inner-3 { animation-delay: calc(-1 * (var(--time) / 6) * 3); }
      .inner-4 { animation-delay: calc(-1 * (var(--time) / 6) * 4); }
      .inner-5 { animation-delay: calc(-1 * (var(--time) / 6) * 5); }
      .inner-6 { animation-delay: calc(-1 * (var(--time) / 6) * 6); }

      @keyframes blink {
        0%   { opacity: 0.1; }
        30%  { opacity: 1; }
        100% { opacity: 0.1; }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="dank-ass-loader" aria-label="loader">
      
        <div class="row">
          <div class="arrow outer-1"></div>
          <div class="arrow outer-2"></div>
          <div class="arrow outer-3"></div>
          <div class="arrow outer-4"></div>
          <div class="arrow outer-5"></div>
          <div class="arrow outer-6"></div>
        </div>

        <div class="row">
          <div class="arrow down outer-7"></div>
          <div class="arrow down outer-8"></div>
          <div class="arrow down outer-9"></div>
          <div class="arrow down outer-10"></div>
          <div class="arrow down outer-11"></div>
          <div class="arrow down outer-12"></div>
        </div>

        <div class="row">
          <div class="arrow outer-13"></div>
          <div class="arrow outer-14"></div>
          <div class="arrow outer-15"></div>
          <div class="arrow outer-16"></div>
          <div class="arrow outer-17"></div>
          <div class="arrow outer-18"></div>
        </div>

        <div style="height: 10px"></div>
        <div class="row">
          <div class="arrow inner-1"></div>
          <div class="arrow inner-2"></div>
          <div class="arrow inner-3"></div>
        </div>
        <div class="row">
          <div class="arrow down inner-4"></div>
          <div class="arrow down inner-5"></div>
          <div class="arrow down inner-6"></div>
        </div>
      </div>
    </main>
  </body>
</html>`;
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.webWrap}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.web}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          androidLayerType="hardware"
          javaScriptEnabled
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webWrap: {
    width: 240,
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#090707',
  },
  web: {
    backgroundColor: 'transparent',
  },
});
