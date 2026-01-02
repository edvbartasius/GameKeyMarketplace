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