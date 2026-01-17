import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import LoaderScreen from '../screens/LoaderScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';

import InteractiveMapScreen from '../screens/InteractiveMapScreen';
import PlacesScreen from '../screens/PlacesScreen';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';

import AchievementScreen from '../screens/AchievementScreen';
import SavedPlacesScreen from '../screens/SavedPlacesScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Loader"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Loader" component={LoaderScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="InteractiveMap" component={InteractiveMapScreen} />
      <Stack.Screen name="Places" component={PlacesScreen} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />

      <Stack.Screen name="Achievement" component={AchievementScreen} />
      <Stack.Screen name="SavedPlaces" component={SavedPlacesScreen} />
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}
