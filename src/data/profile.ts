import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfile = {
  nickname: string;
  about: string;
  avatarUri?: string;
};

export const PROFILE_KEY = 'user_profile_v1';

export const DEFAULT_PROFILE: UserProfile = {
  nickname: '',
  about: '',
  avatarUri: undefined,
};

export async function readProfile(): Promise<UserProfile> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const obj = JSON.parse(raw) as Partial<UserProfile>;
    return {
      nickname: typeof obj.nickname === 'string' ? obj.nickname : '',
      about: typeof obj.about === 'string' ? obj.about : '',
      avatarUri: typeof obj.avatarUri === 'string' ? obj.avatarUri : undefined,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function writeProfile(p: UserProfile) {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  } catch {}
}

export async function resetProfile() {
  try {
    await AsyncStorage.removeItem(PROFILE_KEY);
  } catch {}
}
