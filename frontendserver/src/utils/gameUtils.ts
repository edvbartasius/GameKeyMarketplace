import { Game, GameData } from './types';

export const getPlatformIcon = (platformName: string): string | null => {
  const normalized = platformName.toLowerCase().trim();

  // Map alternative names to canonical platform names
  const platformAliases: { [key: string]: string } = {
    'playstation': 'playstation',
    'psn': 'playstation',
    'ps': 'playstation',
    'xbox': 'xbox',
    'xbl': 'xbox',
    'xbox live': 'xbox',
    'steam': 'steam',
    'epic games': 'epic games',
    'epic': 'epic games',
    'gog': 'gog',
    'gog.com': 'gog',
    'nintendo': 'nintendo',
    'switch': 'nintendo',
    'origin': 'origin',
    'ea app': 'ea app',
    'ea': 'ea app'
  };

  const iconMap: { [key: string]: string } = {
    'steam': 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
    'playstation': 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg',
    'xbox': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg',
    'epic games': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg',
    'gog': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/GOG.com_logo.svg',
    'nintendo': 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg',
    'origin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Electronic-Arts-Logo.svg/1024px-Electronic-Arts-Logo.svg.png',
    'ea app': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Electronic-Arts-Logo.svg/1024px-Electronic-Arts-Logo.svg.png'
  };

  const canonicalName = platformAliases[normalized];
  return canonicalName ? iconMap[canonicalName] : null;
};

// Transform backend GameData to frontend Game type
export const transformGameData = (gameData: GameData): Game => {
  const discountedPrice = gameData.has_discount && gameData.discount_percentage > 0
    ? gameData.from_price * (1 - gameData.discount_percentage / 100)
    : null;

  return {
    id: gameData.game_id,
    name: `${gameData.title} ${gameData.platform} Key ${gameData.region}`,
    image: `/images/${gameData.image_url}` || 'https://placehold.co/400x800/4618ac/fad318/png?text=No\nImage',
    platform: {
      name: gameData.platform,
      icon: getPlatformIcon(gameData.platform)
    },
    price: gameData.from_price,
    discountedPrice,
    inStock: gameData.has_keys,
    region: gameData.region,
    regionAvailable: gameData.region_available
  };
};