
export interface ActivityStat {
  label: string;
  value: number;
  unit: string;
  color: string;
}

export interface NavLink {
  label: string;
  href: string;
  isNew?: boolean;
  action?: () => void;
}

export interface ProgramItem {
  id: number;
  category: string;
  style: "dark" | "image";
  subtitle?: string;
  title: string;
  live?: boolean;
  avatars?: number[];
  buttonText?: string;
  iconType?: 'trophy' | 'zap' | 'sparkles' | 'none';
  image?: string;
  stats?: { main: string; sub: string; badge: string };
  location?: string;
}

export interface EventItem {
  id: number;
  title: string;
  category: string;
  image: string;
  tags?: string[];
  date: string;
  time: string;
  location: string;
  spotsLeft: number;
  totalSpots: number;
  price: string;
}

export interface TestimonialItem {
  id: number;
  text: string;
  author: string;
  role: string;
  rating: number;
  avatar: string;
}

export interface SessionItem {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  image: string;
}

export interface SaleItem {
  id: number;
  title: string; // Badge text e.g. "February Sale"
  image: string;
  category: string;
  discount: string;
  audience: string;
  buttonText: string;
}

// Analytics Types
export interface AnalyticsEvent {
  id: string;
  name: string;
  timestamp: number;
  data?: any;
}

export interface DailyVisitorData {
  date: string;
  visitors: number;
  pageViews: number;
}

export interface GeoLocationData {
  country: string;
  visitors: number;
  percentage: number;
}

export interface SectionEngagement {
  section: string;
  views: number;
  percentage: number;
}
