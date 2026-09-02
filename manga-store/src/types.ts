export type Language = 'pt' | 'en' | 'es' | 'ja';

export type MangaCategory = 
  | 'All'
  | 'Shonen'
  | 'Seinen'
  | 'Dark Fantasy'
  | 'Romance & Shojo'
  | 'Sci-Fi & Cyberpunk'
  | 'Isekai & Fantasy'
  | 'Box Sets & Special Editions'
  | 'Classic & Award Winners';

export const CATEGORIES_LIST: MangaCategory[] = [
  'All',
  'Shonen',
  'Seinen',
  'Dark Fantasy',
  'Romance & Shojo',
  'Sci-Fi & Cyberpunk',
  'Isekai & Fantasy',
  'Box Sets & Special Editions',
  'Classic & Award Winners'
];

export type MangaFormat = 'Paperback' | 'Deluxe Hardcover' | 'Kindle / Digital' | 'Collector Box Set';

export interface MangaFormatOption {
  format: MangaFormat;
  price: number;
  originalPrice: number;
  savingsPercent: number;
  inStock: boolean;
  stockCount: number;
}

export interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  formatPurchased: MangaFormat;
}

export interface MangaItem {
  id: string;
  title: string;
  japaneseTitle: string;
  author: string;
  artist: string;
  publisher: string;
  rank: number; // 1-based rank in Best Sellers
  category: MangaCategory;
  rating: number;
  ratingCount: number;
  ratingDistribution: { [star: number]: number }; // percentage 5..1
  coverImage: string;
  previewImages: string[];
  synopsis: string;
  formats: MangaFormatOption[];
  tags: string[];
  releaseDate: string;
  pages: number;
  isbn: string;
  ageRating: string;
  isAmazonChoice?: boolean;
  isBestSeller?: boolean;
  bestSellerCategory?: string;
  isPrimeEligible: boolean;
  volumesCount: number;
  currentVolume: number;
  featuredQuote: string;
  animeAdaptation: string;
  reviews: ReviewItem[];
  frequentlyBoughtTogetherIds?: string[];
}

export interface CartItem {
  mangaId: string;
  manga: MangaItem;
  format: MangaFormat;
  price: number;
  quantity: number;
  volumeNumber: number;
}

export interface OrderItem {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  deliveryEstimate: string;
  trackingNumber: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
}
