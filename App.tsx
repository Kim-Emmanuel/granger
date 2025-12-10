
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Program } from './components/Program';
import { Tracking } from './components/Tracking';
import { Events } from './components/Events';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { ScrollToTop } from './components/ScrollToTop';
import { AdminDashboard } from './components/AdminDashboard';
import { ProgramItem, EventItem, TestimonialItem, SessionItem, SaleItem } from './types';
import { trackEvent } from './services/analyticsService';

// Initial Data
const initialPrograms: ProgramItem[] = [
	{
		id: 1,
		category: "Community",
		style: "dark",
		subtitle: "Sportcenter",
		title: "The coach experts and simple software Command for better sportainment.",
		live: true,
		avatars: [11, 12, 33],
		buttonText: "granger.com",
        iconType: 'zap'
	},
	{
		id: 2,
		category: "Training",
		style: "image",
		title: "Chemistry Sports Partner",
		image: "https://images.unsplash.com/photo-1599474924187-334a405be2ce?q=80&w=1000&auto=format&fit=crop",
		stats: { main: "2.88k", sub: "Membership", badge: "+1.2k" },
		location: "New York, US",
	},
	{
		id: 3,
		category: "Training",
		style: "image",
		title: "Marathon Pro Training",
		image: "https://images.unsplash.com/photo-1552674605-46d531d0654c?q=80&w=1000&auto=format&fit=crop",
		stats: { main: "42km", sub: "Distance", badge: "Elite" },
		location: "London, UK",
	},
	{
		id: 4,
		category: "Training",
		style: "dark",
		subtitle: "Masterclass",
		title: "Learn from the legends. Exclusive access to pro-athlete routines.",
		buttonText: "Join Class",
        iconType: 'trophy'
	},
	{
		id: 5,
		category: "Wellness",
		style: "dark",
		subtitle: "Mental Wellness",
		title: "Mind & Body Sync. Meditation for high performance athletes.",
		buttonText: "Start Now",
        iconType: 'sparkles'
	},
	{
		id: 6,
		category: "Wellness",
		style: "image",
		title: "Nutrition Workshops",
		image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
		stats: { main: "100+", sub: "Recipes", badge: "New" },
		location: "Online",
	},
	{
		id: 7,
		category: "Community",
		style: "image",
		title: "Global Run Club",
		image: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?q=80&w=1000&auto=format&fit=crop",
		stats: { main: "15k", sub: "Runners", badge: "Hot" },
		location: "Worldwide",
	},
];

const initialEvents: EventItem[] = [
  { 
      id: 1, 
      title: 'Online Fitness Challenge', 
      category: 'Virtual', 
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
      tags: ['Global Access', 'Free Entry'],
      date: 'OCT 24',
      time: '10:00 AM',
      location: 'Zoom / App',
      spotsLeft: 450,
      totalSpots: 1000,
      price: "Free"
  },
  { 
      id: 2, 
      title: 'Youth Sports Camp - 20yo', 
      category: 'Community', 
      image: 'https://images.unsplash.com/photo-1530915518997-64662adc2471?q=80&w=1000&auto=format&fit=crop',
      tags: ['Coach & Trainer', 'Solid Community', 'Team Uniform'],
      date: 'NOV 02',
      time: '08:00 AM',
      location: 'San Diego, CA',
      spotsLeft: 12,
      totalSpots: 50,
      price: "$45.00"
  },
  { 
      id: 3, 
      title: 'Obstacle Course Race', 
      category: 'Physical', 
      image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1000&auto=format&fit=crop',
      tags: ['Outdoor', 'High Intensity'],
      date: 'NOV 15',
      time: '07:30 AM',
      location: 'Mud Creek Park',
      spotsLeft: 85,
      totalSpots: 200,
      price: "$89.00"
  },
  { 
      id: 4, 
      title: 'Sport x Game Day', 
      category: 'Hybrid', 
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop',
      tags: ['Fun', 'Family'],
      date: 'DEC 10',
      time: '01:00 PM',
      location: 'City Stadium',
      spotsLeft: 20,
      totalSpots: 500,
      price: "$25.00"
  },
  { 
      id: 5, 
      title: 'Trainer Meet & Greet', 
      category: 'Social', 
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop',
      tags: ['Networking', 'Pro Tips'],
      date: 'JAN 05',
      time: '06:00 PM',
      location: 'The Grand Hall',
      spotsLeft: 5,
      totalSpots: 30,
      price: "$150.00"
  },
];

const initialTestimonials: TestimonialItem[] = [
  {
    id: 1,
    text: "The activity tracker keeps me on track, and the community pushes me to keep going. It’s the perfect mix of fun and fitness.",
    author: "Benedeta Chan",
    role: "Housewife in China",
    rating: 4.5,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    text: "I've never felt more connected to my training stats. The AI insights are genuinely game-changing for my marathon prep.",
    author: "Marcus Thorne",
    role: "Pro Athlete, UK",
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    text: "Granger isn't just an app, it's a lifestyle. The events are impeccably organized and the energy is unmatched.",
    author: "Sarah Jenkins",
    role: "Yoga Instructor",
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
  }
];

const initialSessions: SessionItem[] = [
  {
    id: 1,
    title: "Single Session",
    subtitle: "Individualized Training - Beginner",
    price: "$99",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Pro Camp",
    subtitle: "Elite Performance Group",
    price: "$149",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Mind Body",
    subtitle: "Holistic Wellness Retreat",
    price: "$299",
    image: "https://images.unsplash.com/photo-1599474924187-334a405be2ce?q=80&w=1000&auto=format&fit=crop"
  }
];

const initialSales: SaleItem[] = [
  {
    id: 1,
    title: "February Sale",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1000&auto=format&fit=crop",
    category: "Tennis Outdoor",
    discount: "86%",
    audience: "Member",
    buttonText: "Boost"
  }
];

function App() {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [heroStart, setHeroStart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Lifted Data State
  const [programs, setPrograms] = useState<ProgramItem[]>(initialPrograms);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [sessions, setSessions] = useState<SessionItem[]>(initialSessions);
  const [sales, setSales] = useState<SaleItem[]>(initialSales);

  useEffect(() => {
    // Analytics: Track Page Load
    trackEvent('Page View', { page: 'Home' });

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleSplashComplete = () => {
    setLoading(false);
    setHeroStart(true);
  };

  if (isAdmin) {
    return (
        <AdminDashboard 
            programs={programs} setPrograms={setPrograms}
            events={events} setEvents={setEvents}
            testimonials={testimonials} setTestimonials={setTestimonials}
            sessions={sessions} setSessions={setSessions}
            sales={sales} setSales={setSales}
            onExit={() => setIsAdmin(false)} 
            isDark={isDark}
            toggleTheme={toggleTheme}
        />
    );
  }

  return (
    <div className="w-full min-h-screen relative bg-gray-50 dark:bg-brand-dark text-slate-900 dark:text-white transition-colors duration-500 font-sans selection:bg-brand-orange selection:text-white">
      {loading && <SplashScreen onComplete={handleSplashComplete} />}
      
      <Navbar 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        onEnterAdmin={() => setIsAdmin(true)} 
      />
      
      <main>
        <Hero startAnimation={heroStart} />
        <Features sales={sales} />
        <Program programs={programs} />
        <Tracking />
        <Events events={events} />
        <Testimonials testimonials={testimonials} sessions={sessions} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
