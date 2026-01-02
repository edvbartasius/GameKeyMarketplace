export interface SearchResult {
  id: number;
  name: string; // Format: "Title <platform> Key <REGION>"
  title: string;
  platform: string;
  region: string;
  image_url: string;
  from_price: number;
  has_discount: boolean;
  discount_percentage: number;
  has_keys: boolean;
}

export interface GameData{
  game_id: number;
  title: string;
  platform: string;
  region: string;
  region_available: boolean;
  image_url: string;
  from_price: number;
  has_discount: boolean;
  discount_percentage: number;
  has_keys: boolean;
}

export interface Platform {
  name: string;
  icon: string | null;
}

export interface Game {
  id: number;
  name: string;
  image: string;
  platform: Platform;
  price: number;
  discountedPrice: number | null;
  inStock: boolean;
  region: string;
  regionAvailable: boolean;
}