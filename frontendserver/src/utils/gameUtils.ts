import { Game, GameData, UserCountry } from './types';
import axios from 'axios';

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
    'switch': 'nintendo'
  };

  const iconMap: { [key: string]: string } = {
    'steam': 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
    'playstation': 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg',
    'xbox': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg',
    'epic games': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg',
    'gog': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/GOG.com_logo.svg',
    'nintendo': 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg'
  };

  const canonicalName = platformAliases[normalized];
  return canonicalName ? iconMap[canonicalName] : null;
};

export const getGeoInfo = async (): Promise<UserCountry | null> => {
    try {
        const response = await axios.get('https://ipapi.co/json/');
        const data = response.data;
        return {
            countryName: data.country_name,
            countryCode: data.country_code
        };
    } catch (error) {
        console.error('Error fetching geo info:', error);
        return null;
    }
};

const isValidCountry = (countryCode: string | undefined, allowedCountries: string[] | undefined): boolean => {
    if (!countryCode || !allowedCountries || allowedCountries.length === 0) {
        return true; // If no restrictions, assume available
    }
    return allowedCountries.includes(countryCode);
};

// Transform backend GameData to frontend Game type
export const transformGameData = (gameData: GameData, userCountryCode?: string): Game => {
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
    allowedCountries: gameData.allowed_country_codes,
    regionAvailable: isValidCountry(userCountryCode, gameData.allowed_country_codes)
  };
};

// Sample game data
export const sampleGames: Game[] = [
  {
    id: 1,
    name: "Cyberpunk 2077",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop",
    platform: { name: "Steam", icon: getPlatformIcon("Steam") },
    price: 59.99,
    discountedPrice: 29.99,
    inStock: true,
    region: "Global",
    regionAvailable: true
  },
  {
    id: 2,
    name: "Elden Ring",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop",
    platform: { name: "PlayStation", icon: getPlatformIcon("PlayStation") },
    price: 49.99,
    discountedPrice: null,
    inStock: true,
    region: "EU",
    regionAvailable: true
  },
  {
    id: 3,
    name: "The Last of Us Part II",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
    platform: { name: "Xbox", icon: getPlatformIcon("Xbox") },
    price: 39.99,
    discountedPrice: null,
    inStock: false,
    region: "US",
    regionAvailable: false
  },
  {
    id: 4,
    name: "God of War Ragnarök",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=600&fit=crop",
    platform: { name: "Steam", icon: getPlatformIcon("Steam") },
    price: 69.99,
    discountedPrice: 45.99,
    inStock: true,
    region: "Global",
    regionAvailable: true
  },
  {
    id: 5,
    name: "Horizon Forbidden West",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
    platform: { name: "PlayStation", icon: getPlatformIcon("PlayStation") },
    price: 59.99,
    discountedPrice: 39.99,
    inStock: true,
    region: "Global",
    regionAvailable: true
  },
  {
    id: 6,
    name: "Starfield",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=600&fit=crop",
    platform: { name: "Xbox", icon: getPlatformIcon("Xbox") },
    price: 69.99,
    discountedPrice: null,
    inStock: true,
    region: "Global",
    regionAvailable: true
  }
];