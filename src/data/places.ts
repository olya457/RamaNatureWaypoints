import type { ImageSourcePropType } from 'react-native';

export type Place = {
  id: string;
  title: string;
  country: string;
  lat: number;
  lng: number;
  description: string;
  image: ImageSourcePropType;
};

function n(v: number) {
  return Number.isFinite(v) ? v : 0;
}

export const PLACES: Place[] = [
  {
    id: 'yellowstone',
    title: 'Yellowstone National Park',
    country: 'USA',
    lat: 44.428,
    lng: -110.5885,
    image: require('../assets/yellowstone1.png'),
    description:
      'Yellowstone is a place where the earth behaves like a living being: steam rises from cracks, water suddenly changes color, and the silence is sometimes broken by the dull “breathing” of geysers. Here it is easy to feel that nature is not a scenery, but a powerful process. Morning is the best time to walk: the coolness keeps the fog low, and the landscape seems different than during the day. In the valleys you can see bison, and near the rivers - the cautious tracks of animals that come to the water when there are fewer people. Yellowstone is not about “checking off a list”, but about the moment when you suddenly stop rushing and just observe.',
  },
  {
    id: 'banff',
    title: 'Banff National Park',
    country: 'Canada',
    lat: 51.4968,
    lng: -115.9281,
    image: require('../assets/banff.png'),
    description:
      "Banff is a mountain discipline of beauty: the lakes here look as if someone turned up the saturation, and the rocks stand like guardians of silence. The water in Lake Louise and Moraine often seems unreal, but the “trick” is simple — glacial origin and fine stone dust that scatters light. Walks in Banff love an early start: the sun slowly illuminates the peaks, and you can see how the day “gathers”. It’s good to plan routes for yourself here: if you want an easy trail, you’ll find one, if you want height and wind, you’ll find one too. Banff teaches a simple thing: sometimes the best plan is to stop and let nature speak first.",
  },
  {
    id: 'bialowieza',
    title: 'Białowieża Forest',
    country: 'Poland',
    lat: 52.7,
    lng: 23.9,
    image: require('../assets/bialowieza.png'),
    description:
      "Białowieża is a forest that doesn’t try to be comfortable. It ages beautifully: with fallen trees, moss covering everything with a soft blanket, and the feeling that it has its own inner rhythm. In such places, a person is not a “host”, but a guest who was lucky enough to enter quietly. If you walk slowly, you notice small things: how the light changes between the trunks, how the damp bark smells, how the bird’s noise suddenly subsides — and it becomes important not to make unnecessary movements. Białowieża is not about spectacles, but about depth. Here it is easy to remember that nature is not a background for a photo, but a whole story that lasts longer than our plans.",
  },
  {
    id: 'sequoia',
    title: 'Sequoia and Kings Canyon',
    country: 'USA',
    lat: 36.4864,
    lng: -118.5658,
    image: require('../assets/sequoia.png'),
    description:
      'Here, the trees are not “big” — they scale your sense of self. The sequoias stand as if time has learned to walk slowly and confidently. When you look up, your neck gets tired before the height ends. The trails pass through the shade, where the air is thicker and cooler, and the ground seems softer because of the needles and pollen. In Kings Canyon, the landscape changes dramatically: from forest “halls” to stone depths where you can hear water and wind. This place is suitable for an internal reboot: you don’t need entertainment, because the very fact of “being close” to such life forms already works as a pause for the brain.',
  },
  {
    id: 'plitvice',
    title: 'Plitvice Lakes',
    country: 'Croatia',
    lat: 44.88,
    lng: 15.616,
    image: require('../assets/plitvice.png'),
    description:
      'Plitvice is water that cannot stand still. It cascades down, gathers in transparent bowls, falls again - and all this sounds like an endless natural soundtrack. Wooden decks lead so close to the streams that it seems: take a step - and the water will touch your shoes. The color of the lakes changes not according to “filters”, but according to light and depth: in the morning it is softer, in the afternoon - brighter, in cloudy weather - almost mysterious. It is important not to go fast here: the beauty of Plitvice is not in one “frame”, but in how the landscape is constantly rebuilt before your eyes. This is a place about movement and lightness.',
  },
  {
    id: 'torres',
    title: 'Torres del Paine',
    country: 'Chile',
    lat: -51.253,
    lng: -72.304,
    image: require('../assets/torres.png'),
    description:
      'Patagonia is a land of wind, and Torres del Paine doesn’t pretend to be gentle. The sky here can change in an hour, and that’s where its charm lies: you’re seeing real weather, not a forecast. The towering cliffs look as if they were carved out of stone specifically for powerful stories. The lakes are cold and clear, and the landscape is contrasting: glaciers, steppe areas, mountain ranges, steel-colored water. This is a place for people who love nature honestly — without embellishment. Torres del Paine teaches a simple lesson: hold on tight to your laces, to your attention, and to the moment when you stand and just watch.',
  },
  {
    id: 'fiordland',
    title: 'Fiordland National Park',
    country: 'New Zealand',
    lat: -45.415,
    lng: 167.718,
    image: require('../assets/fiordland.png'),
    description:
      'Fiordland is like a green theater, where the main roles are played by rocks, rain and fog. Here, humidity is like a separate element: the leaves shine, moss grows abundantly, and waterfalls appear after the rain where yesterday there was just a wall. The fjords create a sense of depth - not only geographical, but also internal: you seem to enter a place that keeps silence for special days. Even a short walk along the trail gives the feeling of being “far from everything”, although civilization is not that far away. Fiordland is about slow attention: here the beauty is not “once”, but constantly, if you look.',
  },
  {
    id: 'zhangjiajie',
    title: 'Zhangjiajie National Park',
    country: 'China',
    lat: 29.344,
    lng: 110.481,
    image: require('../assets/zhangjiajie.png'),
    description:
      'These stone pillars look as if someone lifted the mountains vertically and left them in the air. In Zhangjiajie, space creates illusions: fog hides the bases of the rocks, and it seems that they are suspended. The forests here are dense, the air is often humid, and the light is soft - it makes the landscape cinematic without any special effects. A good time to walk is in the morning or after a rain, when the fog is “working” at full speed. This is a place of another scale: you feel like you are inside a huge natural architecture. And although there are viewing points here, the best feeling comes on the trails, where you can hear footsteps, the wind and your own rhythm.',
  },
  {
    id: 'manu',
    title: 'Manu National Park',
    country: 'Peru, Amazon',
    lat: -12.2,
    lng: -71.6,
    image: require('../assets/manu.png'),
    description:
      'Manu is the Amazon that sounds. Here the forest is not silent: birds, insects, water, invisible movements in the crowns - everything creates the feeling that life is happening around you on many “floors” at the same time. You look ahead and understand: somewhere nearby there is something that you do not notice, because it lives by its own rules and does not like to rush. The morning hours are especially valuable here, when it is cooler and the activity of nature is more noticeable. Manu is not a place for noise. It is an experience of attentiveness: you learn to listen, look at the details, notice small signs. And then the forest seems to “open up” a little - not completely, but enough for you to remember it for a long time.',
  },
  {
    id: 'galapagos',
    title: 'Galapagos Islands',
    country: 'Ecuador',
    lat: -0.9538,
    lng: -90.9656,
    image: require('../assets/galapagos.png'),
    description:
      'The Galapagos is a nature that does not play “show off”. Animals here often do not react to humans as sharply as in other places, and this is strangely touching: you feel like a guest in a world where the rules have long been written without you. Volcanic shores, black stone, turquoise water - the contrasts are strong, but not glaring. It is important not to rush here: sit down, look at the wave, at the movement in the water, at the shadow of the clouds. The Galapagos do not require activity every minute - they give a different type of rest, calm and honest. This is a place where you suddenly start thinking not about “content”, but about how beautifully the world is arranged when it is not disturbed.',
  },
  {
    id: 'serengeti',
    title: 'Serengeti',
    country: 'Tanzania',
    lat: -2.3333,
    lng: 34.8333,
    image: require('../assets/serengeti.png'),
    description:
      'The Serengeti is a space that never ends. Here the horizon is wide, the sky is high, and the grass moves in the wind like a wave. The feeling of freedom comes instantly: as if you have lifted the invisible pressure of the city from your shoulders. In the Serengeti, nature works in large scenes: herds, predators, the silence before movement, a sudden burst of life near the water. But there are also small moments: a bird on a dry branch, a footprint in the dust, a calm evening chill. This is a place about balance: you see the power of life and its fragility at the same time. The Serengeti does not “impress” you — it rebuilds your sense of scale.',
  },
  {
    id: 'kruger',
    title: 'Kruger National Park',
    country: 'South Africa',
    lat: -23.9884,
    lng: 31.5547,
    image: require('../assets/kruger.png'),
    description:
      'Kruger is about mindfulness and respect. Nature here is not “for people,” it’s just there, and you adapt to it: to time, silence, distance. The landscape changes from open areas to denser areas, and each has its own atmosphere. The best thing about Kruger is the feeling of being an observer: you’re not directing events, you’re noticing them. It’s a strange but very pure kind of joy. Early morning and late evening often offer the most “alive” moments: the light is low, the shadows are long, the air is cooler. Kruger is about the discipline of stillness: less noise, more eyes and heart.',
  },
].map((p) => ({
  ...p,
  lat: n(p.lat),
  lng: n(p.lng),
}));

export const DAILY_FACTS: string[] = [
  'In a dense forest, the air can be more humid and milder than in an open field, even in the heat.',
  'After rain, forests can feel quieter because leaves absorb sound and the ground becomes softer.',
  'Morning light often looks warmer because it passes through more atmosphere near the horizon.',
  'A calm walk is not about distance. It is about attention and noticing small changes around you.',
  'Mountain lakes can look brighter because fine mineral particles scatter light in a special way.',
];

export const MARKERS = PLACES.map((p) => ({
  id: p.id,
  title: p.title,
  country: p.country,
  latitude: p.lat,
  longitude: p.lng,
}));

export const DEFAULT_REGION = (() => {
  const coords = MARKERS.filter(
    (m) => Number.isFinite(m.latitude) && Number.isFinite(m.longitude),
  );

  if (coords.length === 0) {
    return { latitude: 0, longitude: 0, latitudeDelta: 80, longitudeDelta: 80 };
  }

  const lat = coords.reduce((s, c) => s + c.latitude, 0) / coords.length;
  const lng = coords.reduce((s, c) => s + c.longitude, 0) / coords.length;

  return {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 80, 
    longitudeDelta: 80,
  };
})();

export function getPlaceById(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}
