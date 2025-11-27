export interface ActivityStat {
  label: string;
  value: number;
  unit: string;
  color: string;
}

export interface EventItem {
  id: number;
  title: string;
  category: string;
  image: string;
  tags?: string[];
}

export interface NavLink {
  label: string;
  href: string;
  isNew?: boolean;
}