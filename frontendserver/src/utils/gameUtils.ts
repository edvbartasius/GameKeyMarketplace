import { Game } from '../components/GameCards/GameCards';

export const getPlatformIcon = (platformName: string): string => {
  const iconMap: { [key: string]: string } = {
    'Steam': 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
    'PlayStation': 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg',
    'Xbox': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg',
    'Epic Games': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg',
    'GOG': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/GOG.com_logo.svg',
    'Nintendo': 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg'
  };
  return iconMap[platformName] || '';
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

// Filter games by platform
export const getGamesByPlatform = (platformName: string): Game[] => {
  return sampleGames.filter(game => game.platform.name === platformName);
};

// Filter games by stock status
export const getInStockGames = (): Game[] => {
  return sampleGames.filter(game => game.inStock);
};

// Filter games with discounts
export const getDiscountedGames = (): Game[] => {
  return sampleGames.filter(game => game.discountedPrice !== null);
};
