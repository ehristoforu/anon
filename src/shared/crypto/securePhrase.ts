const WORDS = [
  'amber', 'anchor', 'apricot', 'arch', 'aurora', 'bamboo', 'barley', 'beacon', 'birch', 'blade',
  'bloom', 'brisk', 'cactus', 'candle', 'canvas', 'cedar', 'cinder', 'cipher', 'clover', 'comet',
  'coral', 'crystal', 'dawn', 'delta', 'drift', 'echo', 'ember', 'fable', 'feather', 'fjord',
  'flora', 'frost', 'galaxy', 'garden', 'glacier', 'glimmer', 'granite', 'harbor', 'hazel', 'horizon',
  'indigo', 'ivory', 'jasmine', 'juniper', 'keystone', 'lagoon', 'lantern', 'lilac', 'lumen', 'marble',
  'meadow', 'meteor', 'mist', 'nebula', 'nectar', 'nova', 'onyx', 'opal', 'orchid', 'oyster',
  'paradox', 'pearl', 'pine', 'plasma', 'prairie', 'quartz', 'raven', 'ripple', 'sable', 'saffron',
  'sierra', 'silk', 'solstice', 'spruce', 'starlight', 'stone', 'summit', 'tango', 'thistle', 'tidal',
  'topaz', 'trident', 'umbra', 'velvet', 'violet', 'vortex', 'willow', 'xenon', 'yonder', 'zephyr'
];

export const generateSecurePhrase = (): string => {
  const random = new Uint32Array(14);
  crypto.getRandomValues(random);
  const words = Array.from(random).map((value) => WORDS[value % WORDS.length]);
  return words.join(' ');
};
