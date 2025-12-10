
import { AnalyticsEvent, DailyVisitorData, GeoLocationData, SectionEngagement } from "../types";

// Mock historical data generation
const generateDailyData = (): DailyVisitorData[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    date: day,
    visitors: Math.floor(Math.random() * 800) + 1200,
    pageViews: Math.floor(Math.random() * 2000) + 3000,
  }));
};

const mockGeoData: GeoLocationData[] = [
  { country: 'United States', visitors: 12500, percentage: 45 },
  { country: 'United Kingdom', visitors: 5400, percentage: 20 },
  { country: 'Germany', visitors: 3200, percentage: 12 },
  { country: 'Canada', visitors: 2100, percentage: 8 },
  { country: 'Japan', visitors: 1500, percentage: 5 },
  { country: 'Others', visitors: 2800, percentage: 10 },
];

// In-memory state for the session
let sessionEvents: AnalyticsEvent[] = [];

// Initialize with some baseline data so the chart isn't empty
const sectionViews: Record<string, number> = {
  'Hero': 1450, 
  'Features': 1200,
  'Program': 980,
  'Tracking': 850,
  'Events': 720,
  'Testimonials': 600,
  'Footer': 450
};

export const trackEvent = (name: string, data?: any) => {
  const event: AnalyticsEvent = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    timestamp: Date.now(),
    data
  };
  sessionEvents.unshift(event); // Add to beginning for "recent" display
  // Keep size manageable
  if (sessionEvents.length > 50) sessionEvents = sessionEvents.slice(0, 50);
  
  // Log to console for dev verification
  // console.log(`[Analytics] ${name}`, data);
};

export const trackSectionView = (section: string) => {
    // Increment local view count
    if (!sectionViews[section]) sectionViews[section] = 0;
    sectionViews[section]++;
    
    // Log the event as well
    trackEvent('Section View', { section });
};

export const getAnalyticsData = () => {
  // Calculate engagement percentages
  const totalViews = Object.values(sectionViews).reduce((a, b) => a + b, 0);
  const sectionEngagement: SectionEngagement[] = Object.entries(sectionViews)
    .map(([section, views]) => ({
        section,
        views,
        percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0
    }))
    .sort((a, b) => b.views - a.views);

  return {
    dailyStats: generateDailyData(),
    geoStats: mockGeoData,
    recentEvents: sessionEvents,
    sectionEngagement,
    realtime: {
      activeUsers: Math.floor(Math.random() * 20) + 85, // Mock active users fluctuation
    },
    totalStats: {
        visitors: "28.5k",
        bounceRate: "42%",
        avgDuration: "4m 12s",
        growth: "+12.5%"
    }
  };
};
