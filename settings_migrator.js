'use strict';

const DefaultSettings = {
  enabled: true,
  // from: https://teralore.com/us/gatherables/
  plants: [
    { id: 1, category: 'plants', name: 'Harmony Grass' },
    { id: 2, category: 'plants', name: 'Wild Cobseed' },
    { id: 3, category: 'plants', name: 'Wild Veridia' },
    { id: 4, category: 'plants', name: 'Orange Mushroom' },
    { id: 5, category: 'plants', name: 'Moongourd' },
    { id: 6, category: 'plants', name: 'Apple Tree' },
  ],
  mining: [
    { id: 101, category: 'mining', name: 'Plain Stone' },
    { id: 102, category: 'mining', name: 'Cobala Ore' },
    { id: 103, category: 'mining', name: 'Shadmetal Ore' },
    { id: 104, category: 'mining', name: 'Xermetal Ore' },
    { id: 105, category: 'mining', name: 'Normetal Ore' },
    { id: 106, category: 'mining', name: 'Galborne Ore' },
  ],
  energy: [
    { id: 201, category: 'energy', name: 'Achromic Essence' },
    { id: 202, category: 'energy', name: 'Crimson Essence' },
    { id: 203, category: 'energy', name: 'Earth Essence' },
    { id: 204, category: 'energy', name: 'Azure Essence' },
    { id: 205, category: 'energy', name: 'Opal Essence' },
    { id: 206, category: 'energy', name: 'Obsidian Essence' },
  ]
};

function MigrateSettings(from_ver, to_ver, settings) {
  if (from_ver === undefined) {
    return Object.assign(Object.assign({}, DefaultSettings), settings);
  }
  else if (from_ver === null) {
    return DefaultSettings;
  }
  else {
    if (from_ver + 1 < to_ver) {
      settings = MigrateSettings(from_ver, from_ver + 1, settings);
      return MigrateSettings(from_ver + 1, to_ver, settings);
    }
    switch (to_ver) {
      //
    }

    return settings;
  }
}

module.exports = MigrateSettings;