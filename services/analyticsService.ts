
import { AnalyticsEvent, DailyVisitorData, GeoLocationData, SectionEngagement, ButtonAnalytics } from "../types";

// Declare global gtag function for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// --- STATEFUL DATA STORE ---
// We keep these outside functions so they persist during the session
let sessionEvents: AnalyticsEvent[] = [];
let userLocation: { lat: number; long: number } | null = null;
let userCountryDetected = false;

// Initialize mock historical data (Last 30 days)
const generateDailyData = (): DailyVisitorData[] => {
  const data: DailyVisitorData[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: Math.floor(Math.random() * 800) + 1200 + (Math.random() * 500),
      pageViews: Math.floor(Math.random() * 2000) + 3000,
    });
  }
  return data;
};

// Stateful stats
const dailyStatsStore: DailyVisitorData[] = generateDailyData();

const geoStatsStore: GeoLocationData[] = [
  { country: 'United States', visitors: 12500, percentage: 45 },
  { country: 'United Kingdom', visitors: 5400, percentage: 20 },
  { country: 'Germany', visitors: 3200, percentage: 12 },
  { country: 'Canada', visitors: 2100, percentage: 8 },
  { country: 'Japan', visitors: 1500, percentage: 5 },
  { country: 'Others', visitors: 2800, percentage: 10 },
];

const sectionViews: Record<string, number> = {
  'Hero': 1450, 
  'Features': 1200,
  'Program': 980,
  'Tracking': 850,
  'Events': 720,
  'Testimonials': 600,
  'Footer': 450
};

const buttonClicks: Record<string, number> = {
    'Join Class (Program)': 120,
    'Start Now (Program)': 95,
    'Book Now (Events)': 85,
    'Explore More (Footer)': 45
};

// --- GEOLOCATION LOGIC ---

// 1. Precise Location (Lat/Long)
const initPreciseLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                };
                trackEvent('Location Detected', { 
                    lat: position.coords.latitude.toFixed(4), 
                    long: position.coords.longitude.toFixed(4) 
                });
            },
            (error) => console.log("Geo permission denied or error", error)
        );
    }
};

// 2. Country Aggregation (Timezone inference)
const detectAndIncrementCountry = () => {
    if (userCountryDetected) return;
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let detectedCountry = 'Others';
        
        if (timeZone.includes('America') || timeZone.includes('US')) detectedCountry = 'United States';
        else if (timeZone.includes('London') || timeZone.includes('Europe/London')) detectedCountry = 'United Kingdom';
        else if (timeZone.includes('Berlin') || timeZone.includes('Europe')) detectedCountry = 'Germany';
        else if (timeZone.includes('Tokyo') || timeZone.includes('Asia')) detectedCountry = 'Japan';
        else if (timeZone.includes('Canada')) detectedCountry = 'Canada';

        const existing = geoStatsStore.find(g => g.country === detectedCountry);
        if (existing) {
            existing.visitors++;
            // Re-calculate percentages
            const total = geoStatsStore.reduce((sum, item) => sum + item.visitors, 0);
            geoStatsStore.forEach(item => {
                item.percentage = Math.round((item.visitors / total) * 100);
            });
        }
        userCountryDetected = true;
    } catch (e) {
        console.warn("Could not detect country from timezone");
    }
};

// Initialize tracking
if (typeof window !== 'undefined') {
    initPreciseLocation();
    detectAndIncrementCountry();
}

// Helper to safely call gtag
const safeGtag = (command: string, ...args: any[]) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(command, ...args);
  }
};

export const trackEvent = (name: string, data?: any) => {
  // Merge precise location if available
  const eventData = userLocation ? { ...data, ...userLocation } : data;

  // 1. Internal Logging
  const event: AnalyticsEvent = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    timestamp: Date.now(),
    data: eventData
  };
  sessionEvents.unshift(event);
  if (sessionEvents.length > 100) sessionEvents = sessionEvents.slice(0, 100); // Increased log size

  // 2. GA4 Bridge
  if (name === 'Page View') {
    safeGtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...eventData
    });
  } else {
    safeGtag('event', name.replace(/\s+/g, '_').toLowerCase(), {
      event_category: 'interaction',
      event_label: JSON.stringify(eventData),
      ...eventData
    });
  }
};

export const trackSectionView = (section: string) => {
    if (!sectionViews[section]) sectionViews[section] = 0;
    sectionViews[section]++;
    trackEvent('Section View', { section });
    safeGtag('event', 'screen_view', { screen_name: section, app_name: 'Granger Sportainment' });
};

export const trackButtonClick = (label: string, location: string) => {
    const key = `${label} (${location})`;
    if (!buttonClicks[key]) buttonClicks[key] = 0;
    buttonClicks[key]++;
    trackEvent('Button Click', { label, location });
    safeGtag('event', 'click', { event_category: 'Button', event_label: label, event_location: location });
};

export const getAnalyticsData = () => {
  const totalViews = Object.values(sectionViews).reduce((a, b) => a + b, 0);
  const sectionEngagement: SectionEngagement[] = Object.entries(sectionViews)
    .map(([section, views]) => ({
        section,
        views,
        percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0
    }))
    .sort((a, b) => b.views - a.views);

  const topButtons: ButtonAnalytics[] = Object.entries(buttonClicks)
    .map(([key, count]) => {
        const [label, locationRaw] = key.split(' (');
        const location = locationRaw ? locationRaw.replace(')', '') : 'General';
        return { id: key, label, location, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const peakDay = dailyStatsStore.reduce((max, current) => (current.visitors > max.visitors ? current : max), dailyStatsStore[0]);

  return {
    dailyStats: dailyStatsStore,
    geoStats: geoStatsStore,
    recentEvents: sessionEvents,
    sectionEngagement,
    topButtons,
    peakDay,
    realtime: {
      activeUsers: Math.floor(Math.random() * 15) + 85, 
    },
    totalStats: {
        visitors: "28.5k",
        bounceRate: "42%",
        avgDuration: "4m 12s",
        growth: "+12.5%"
    }
  };
};
