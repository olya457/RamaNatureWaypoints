import AsyncStorage from '@react-native-async-storage/async-storage';

export const VISITED_KEY = 'visited_places_v1';

export type HornTierId = 'first' | 'forest' | 'wild' | 'deep' | 'guide';

export type HornTier = {
  id: HornTierId;
  need: number;      
  title: string;
  desc: string;
};

export const HORN_TIERS: HornTier[] = [
  {
    id: 'first',
    need: 1,
    title: 'First Trail',
    desc:
      'The first horn is thin, clean, not yet heavy.\n' +
      'A symbol of the moment when you stopped just looking and took the first step into the real world.',
  },
  {
    id: 'forest',
    need: 3,
    title: 'Forest Path',
    desc:
      'The horns become wider, with soft curves, like tree branches.\n' +
      'You are no longer a random guest - you have a route.',
  },
  {
    id: 'wild',
    need: 5,
    title: 'Wild Heart',
    desc:
      'The horns acquire a deep red-gold shine.\n' +
      'This is a sign that nature is not a background for you, but a feeling.',
  },
  {
    id: 'deep',
    need: 8,
    title: 'Deep Explorer',
    desc:
      "The horns become more massive, with an inner light.\n" +
      "You don't just mark places - you live them.",
  },
  {
    id: 'guide',
    need: 12,
    title: 'Rama Guide',
    desc:
      'The biggest, cleanest horns.\n' +
      'You walk as if you know exactly where you are.',
  },
];

async function readIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(VISITED_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

async function writeIds(ids: string[]) {
  try {
    await AsyncStorage.setItem(VISITED_KEY, JSON.stringify(ids));
  } catch {}
}

export function getUnlockedTierIds(count: number): HornTierId[] {
  return HORN_TIERS.filter((t) => count >= t.need).map((t) => t.id);
}

export async function markPlaceVisited(placeId: string): Promise<number> {
  if (!placeId) return (await readIds()).length;

  const ids = await readIds();
  if (ids.includes(placeId)) return ids.length;

  const next = [...ids, placeId];
  await writeIds(next);
  return next.length;
}

export async function getVisitedCount(): Promise<number> {
  const ids = await readIds();
  return ids.length;
}

export async function getVisitedIds(): Promise<string[]> {
  return await readIds();
}

export async function resetVisited() {
  try {
    await AsyncStorage.removeItem(VISITED_KEY);
  } catch {}
}
