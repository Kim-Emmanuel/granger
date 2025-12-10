
import React, { useState, useRef, useEffect } from 'react';
import { ProgramItem, EventItem, TestimonialItem, SessionItem, SaleItem } from '../types';
import { ProgramCard } from './ProgramCard';
import { Plus, Trash2, Save, Layout, Search, ArrowLeft, Calendar, MessageSquare, Zap, Star, Upload, Sun, Moon, Image as ImageIcon, ChevronLeft, Eye, Edit3, ShoppingBag, Shirt, BarChart3, Users, Globe, Activity, Clock, PieChart, Layers } from 'lucide-react';
import { getAnalyticsData } from '../services/analyticsService';

interface AdminDashboardProps {
  programs: ProgramItem[];
  setPrograms: (items: ProgramItem[]) => void;
  events: EventItem[];
  setEvents: (items: EventItem[]) => void;
  testimonials: TestimonialItem[];
  setTestimonials: (items: TestimonialItem[]) => void;
  sessions: SessionItem[];
  setSessions: (items: SessionItem[]) => void;
  sales: SaleItem[];
  setSales: (items: SaleItem[]) => void;
  onExit: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

type Tab = 'analytics' | 'programs' | 'events' | 'testimonials' | 'sessions' | 'sales';
type MobileView = 'list' | 'editor';

// Default Templates
const emptyProgram: ProgramItem = {
  id: 0,
  category: 'Training',
  style: 'dark',
  title: 'New Program',
  subtitle: 'Subtitle',
  live: false,
  buttonText: 'Join Now',
  iconType: 'zap'
};

const emptyEvent: EventItem = {
    id: 0,
    title: 'New Event',
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000',
    tags: ['Tag 1'],
    date: 'JAN 01',
    time: '10:00 AM',
    location: 'Location',
    spotsLeft: 50,
    totalSpots: 100,
    price: "$0.00"
};

const emptyTestimonial: TestimonialItem = {
    id: 0,
    text: "Review text goes here...",
    author: "New User",
    role: "Member",
    rating: 5,
    avatar: "https://i.pravatar.cc/150"
};

const emptySession: SessionItem = {
    id: 0,
    title: "New Session",
    subtitle: "Description...",
    price: "$99",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1000"
};

const emptySale: SaleItem = {
    id: 0,
    title: "Special Sale",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1000",
    category: "Category",
    discount: "50%",
    audience: "Everyone",
    buttonText: "Shop Now"
};

// Reusable Input Component for Branding Consistency
const InputField = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
    <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</label>
        {type === 'textarea' ? (
             <textarea 
                rows={4} 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-orange transition-colors"
                placeholder={placeholder}
             />
        ) : (
             <input 
                type={type} 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-orange transition-colors"
                placeholder={placeholder}
             />
        )}
    </div>
);

// Image Upload Component
const ImageInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-2">
           <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</label>
           <div className="flex gap-2">
             <div className="relative flex-1">
                <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded p-3 pl-9 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-orange transition-colors font-mono truncate"
                    placeholder="https:// or upload ->"
                />
             </div>
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center shrink-0"
                title="Upload Local Image"
             >
                <Upload size={18} className="text-gray-600 dark:text-gray-300"/>
             </button>
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
             />
           </div>
        </div>
    )
}

// --- ANALYTICS COMPONENT ---
const AnalyticsView = ({ isDark }: { isDark: boolean }) => {
    const [data, setData] = useState(getAnalyticsData());
    
    useEffect(() => {
        const interval = setInterval(() => {
            setData(getAnalyticsData());
        }, 3000); // Refresh "live" data frequently
        return () => clearInterval(interval);
    }, []);

    const maxVisitors = Math.max(...data.dailyStats.map(d => d.visitors)) * 1.2;

    return (
        <div className="p-4 md:p-8 overflow-y-auto h-full pb-20">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className={`text-2xl md:text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Analytics Overview</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Real-time performance metrics</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-mint/10 rounded-full border border-brand-mint/20">
                         <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-brand-mint opacity-75 animate-ping"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-mint"></span>
                         </span>
                         <span className="text-[10px] font-bold uppercase tracking-wide text-brand-mint">{data.realtime.activeUsers} Active Now</span>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Visitors', value: data.totalStats.visitors, change: '+12%', icon: Users, color: 'text-blue-500' },
                        { label: 'Engagement Rate', value: '68%', change: '+5%', icon: Activity, color: 'text-brand-orange' },
                        { label: 'Avg Session', value: data.totalStats.avgDuration, change: '-2%', icon: Clock, color: 'text-purple-500' },
                        { label: 'Bounce Rate', value: data.totalStats.bounceRate, change: '-4%', icon: ArrowLeft, color: 'text-red-500' },
                    ].map((stat, i) => (
                        <div key={i} className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-gray-100'} shadow-sm`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-white/5 ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Traffic Chart */}
                    <div className={`lg:col-span-2 p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-gray-100'} shadow-sm`}>
                        <div className="flex justify-between items-center mb-8">
                             <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Weekly Traffic</h3>
                             <button className="text-xs font-bold text-gray-500 hover:text-brand-orange uppercase tracking-wide">View Report</button>
                        </div>
                        
                        <div className="h-64 w-full relative">
                            {/* Simple SVG Line Chart */}
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Grid Lines */}
                                {[0, 25, 50, 75, 100].map(y => (
                                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="0.5" />
                                ))}
                                
                                {/* Bars (for visitors) */}
                                {data.dailyStats.map((d, i) => {
                                    const height = (d.visitors / maxVisitors) * 100;
                                    const x = (i / (data.dailyStats.length - 1)) * 100;
                                    return (
                                        <g key={i}>
                                            <rect 
                                                x={x - 2} 
                                                y={100 - height} 
                                                width="4" 
                                                height={height} 
                                                className="fill-brand-orange opacity-20 hover:opacity-40 transition-opacity cursor-pointer" 
                                                rx="2"
                                            />
                                        </g>
                                    );
                                })}

                                {/* Line (for pageviews - just mocking a line here for visual) */}
                                <polyline 
                                    points={data.dailyStats.map((d, i) => `${(i / (data.dailyStats.length - 1)) * 100},${100 - ((d.pageViews / (maxVisitors * 2)) * 100)}`).join(' ')}
                                    fill="none"
                                    stroke="#4aa5d6"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                            
                            {/* X-Axis Labels */}
                            <div className="flex justify-between mt-4">
                                {data.dailyStats.map((d, i) => (
                                    <span key={i} className="text-[9px] font-bold uppercase text-gray-400">{d.date}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section Engagement - New Component */}
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-gray-100'} shadow-sm flex flex-col`}>
                        <div className="flex items-center gap-2 mb-6">
                            <Layers size={18} className="text-gray-400"/>
                            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Section Popularity</h3>
                        </div>
                        
                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px]">
                            {data.sectionEngagement.map((section, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-bold mb-1.5">
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{section.section}</span>
                                        <div className="flex gap-2">
                                            <span className="text-gray-400 font-normal">{section.views} views</span>
                                            <span className="text-brand-blue">{section.percentage}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${i === 0 ? 'bg-brand-orange' : 'bg-brand-blue'}`} 
                                            style={{ width: `${section.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* Geo Stats */}
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-gray-100'} shadow-sm flex flex-col`}>
                        <div className="flex items-center gap-2 mb-6">
                            <Globe size={18} className="text-gray-400"/>
                            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Top Locations</h3>
                        </div>
                        
                        <div className="flex-1 space-y-5">
                            {data.geoStats.map((geo, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-bold mb-1.5">
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{geo.country}</span>
                                        <span className="text-gray-500">{geo.percentage}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-brand-blue rounded-full" 
                                            style={{ width: `${geo.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Live Events Log */}
                    <div className={`lg:col-span-2 rounded-3xl border overflow-hidden ${isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-gray-100'} shadow-sm`}>
                        <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-100'} flex justify-between items-center`}>
                            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Live Event Log</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-mint animate-pulse">● Monitoring</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-2">
                            <table className="w-full text-left border-collapse">
                                <thead className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    <tr>
                                        <th className="p-4">Event Name</th>
                                        <th className="p-4">Metadata</th>
                                        <th className="p-4 text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {data.recentEvents.length > 0 ? data.recentEvents.map((e) => (
                                        <tr key={e.id} className={`border-b border-dashed last:border-0 ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                                            <td className={`p-4 font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{e.name}</td>
                                            <td className="p-4 text-xs font-mono text-gray-500 truncate max-w-[200px]">{JSON.stringify(e.data) || '-'}</td>
                                            <td className="p-4 text-right text-xs text-gray-500">{new Date(e.timestamp).toLocaleTimeString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-gray-500 text-xs uppercase tracking-widest">No events tracked yet...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    programs, setPrograms, 
    events, setEvents,
    testimonials, setTestimonials,
    sessions, setSessions,
    sales, setSales,
    onExit, isDark, toggleTheme
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('analytics'); // Default to Analytics
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editItem, setEditItem] = useState<any>(null);
  
  // Mobile View Logic: 'list' is default. 'editor' shows when item selected.
  const [mobileView, setMobileView] = useState<MobileView>('list');
  const [showPreviewOnMobile, setShowPreviewOnMobile] = useState(false);

  useEffect(() => {
    setSelectedId(null);
    setEditItem(null);
    setMobileView('list');
  }, [activeTab]);

  const getList = () => {
      switch(activeTab) {
          case 'programs': return programs;
          case 'events': return events;
          case 'testimonials': return testimonials;
          case 'sessions': return sessions;
          case 'sales': return sales;
          default: return [];
      }
  };

  const getFilteredList = () => {
      const list = getList();
      return list.filter((item: any) => 
        (item.title || item.author || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  const handleSelect = (id: number) => {
    setSelectedId(id);
    const item = getList().find((p: any) => p.id === id);
    if (item) setEditItem({ ...item });
    setMobileView('editor'); // Switch to editor on mobile
    setShowPreviewOnMobile(false); // Reset preview toggle
  };

  const handleBackToList = () => {
    setMobileView('list');
  };

  const handleAddNew = () => {
    const list = getList();
    const newId = Math.max(...list.map((p: any) => p.id), 0) + 1;
    let newItem;

    if (activeTab === 'programs') newItem = { ...emptyProgram, id: newId };
    else if (activeTab === 'events') newItem = { ...emptyEvent, id: newId };
    else if (activeTab === 'testimonials') newItem = { ...emptyTestimonial, id: newId };
    else if (activeTab === 'sales') newItem = { ...emptySale, id: newId };
    else newItem = { ...emptySession, id: newId };

    updateList([...list, newItem]);
    setSelectedId(newId);
    setEditItem(newItem);
    setMobileView('editor');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const newList = getList().filter((p: any) => p.id !== id);
      updateList(newList);
      if (selectedId === id) {
        setSelectedId(null);
        setEditItem(null);
        setMobileView('list');
      }
    }
  };

  const updateList = (newList: any[]) => {
      if (activeTab === 'programs') setPrograms(newList);
      else if (activeTab === 'events') setEvents(newList);
      else if (activeTab === 'testimonials') setTestimonials(newList);
      else if (activeTab === 'sales') setSales(newList);
      else setSessions(newList);
  };

  const handleChange = (field: string, value: any) => {
    if (!editItem) return;
    setEditItem({ ...editItem, [field]: value });
  };

  const handleSave = () => {
    if (!editItem) return;
    const list = getList();
    const newList = list.map((p: any) => p.id === editItem.id ? editItem : p);
    updateList(newList);
    // Simple visual feedback
    const btn = document.getElementById('save-btn');
    if(btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Saved!';
        setTimeout(() => btn.innerHTML = originalText, 1500);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col font-sans transition-colors duration-300 ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-slate-900'}`}>
      
      {/* CMS Header */}
      <div className={`h-16 flex items-center justify-between px-4 md:px-6 backdrop-blur-md border-b transition-colors duration-300 ${isDark ? 'bg-zinc-900/80 border-white/10' : 'bg-white/80 border-gray-200'} shrink-0`}>
        <div className="flex items-center gap-4 md:gap-6 overflow-hidden">
          
          {/* Mobile Back Button */}
          {mobileView === 'editor' && activeTab !== 'analytics' && (
              <button 
                onClick={handleBackToList}
                className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"
              >
                  <ChevronLeft size={20} />
              </button>
          )}

          <div className={`flex items-center gap-3 ${mobileView === 'editor' ? 'hidden md:flex' : 'flex'}`}>
             <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-bold text-white shadow-lg shadow-brand-orange/20 shrink-0">CMS</div>
             <span className="font-bold tracking-wide hidden lg:block whitespace-nowrap">Granger Manager</span>
          </div>
          
          {/* Tabs - Scrollable on mobile */}
          <div className={`flex rounded-lg p-1 overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-none ${isDark ? 'bg-black/40' : 'bg-gray-200/50'} ${mobileView === 'editor' && activeTab !== 'analytics' ? 'hidden md:flex' : 'flex'}`}>
             {['analytics', 'programs', 'events', 'testimonials', 'sessions', 'sales'].map((tab) => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as Tab)} 
                    className={`px-3 sm:px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all duration-300 whitespace-nowrap shrink-0 ${
                        activeTab === tab 
                        ? 'bg-white text-black shadow-sm scale-105' 
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                 >
                    {tab === 'analytics' && <BarChart3 size={14}/>}
                    {tab === 'programs' && <Layout size={14}/>}
                    {tab === 'events' && <Calendar size={14}/>}
                    {tab === 'testimonials' && <MessageSquare size={14}/>}
                    {tab === 'sessions' && <Zap size={14}/>}
                    {tab === 'sales' && <ShoppingBag size={14}/>}
                    <span className="hidden sm:inline">{tab}</span>
                 </button>
             ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
             {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
                {isDark ? <Moon size={16} className="text-white"/> : <Sun size={16} className="text-brand-orange"/>}
            </button>

            <button 
                onClick={onExit}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-brand-orange transition-colors"
            >
            <ArrowLeft size={14} /> <span className="hidden md:inline">Exit</span>
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Render Analytics Full View if active */}
        {activeTab === 'analytics' ? (
            <div className="w-full h-full bg-gray-50 dark:bg-zinc-950">
                <AnalyticsView isDark={isDark} />
            </div>
        ) : (
            <>
                {/* Sidebar List (Master View) */}
                <div className={`
                    flex-col border-r transition-all duration-300
                    ${mobileView === 'list' ? 'flex w-full' : 'hidden md:flex md:w-80'} 
                    ${isDark ? 'bg-zinc-900/30 border-white/10' : 'bg-gray-100/50 border-gray-200'}
                `}>
                <div className={`p-4 border-b space-y-4 shrink-0 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder={`Search ${activeTab}...`} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full border rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-brand-orange transition-colors ${isDark ? 'bg-black/20 border-white/10 text-gray-300' : 'bg-white border-gray-200 text-slate-800'}`}
                    />
                    </div>
                    <button 
                    onClick={handleAddNew}
                    className="w-full flex items-center justify-center gap-2 bg-brand-dark dark:bg-white text-white dark:text-black py-2.5 rounded-md text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-sm"
                    >
                    <Plus size={14} /> Add New
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {getFilteredList().map((item: any) => (
                    <div 
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 group border ${
                            selectedId === item.id 
                            ? 'bg-brand-blue/10 border-brand-blue/30' 
                            : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                    >
                        <div className="flex flex-col truncate pr-2">
                        <span className={`text-sm font-bold truncate ${selectedId === item.id ? 'text-brand-blue dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-gray-200'}`}>
                            {item.title || item.author || 'Untitled'}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider truncate">{item.category || item.role || item.subtitle || 'General'}</span>
                        </div>
                        {selectedId === item.id && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            className="p-2 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                        )}
                    </div>
                    ))}
                </div>
                </div>

                {/* Editor Area (Detail View) */}
                <div className={`
                    flex-1 flex flex-col lg:flex-row overflow-hidden
                    ${mobileView === 'editor' ? 'flex' : 'hidden md:flex'}
                    ${!editItem ? 'md:items-center md:justify-center' : ''}
                `}>
                {editItem ? (
                    <>
                    {/* Form Scroll Area */}
                    <div className={`flex-1 overflow-y-auto p-4 md:p-8 border-r transition-colors duration-300 ${isDark ? 'bg-zinc-900/10 border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className="max-w-2xl mx-auto space-y-8 pb-20 lg:pb-0"> {/* Padding bottom for mobile sticky button if needed */}
                        <div className="flex justify-between items-center sticky top-0 z-20 pb-4 backdrop-blur-sm bg-inherit">
                            <div>
                                <h2 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit {activeTab.slice(0, -1)}</h2>
                                <span className="text-xs text-gray-500 font-mono uppercase">ID: {editItem.id}</span>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-2">
                                {/* Mobile Preview Toggle */}
                                <button 
                                    onClick={() => setShowPreviewOnMobile(!showPreviewOnMobile)}
                                    className={`lg:hidden p-2 rounded-full border ${showPreviewOnMobile ? 'bg-brand-orange text-white border-brand-orange' : 'border-gray-300 text-gray-500 dark:border-white/20'}`}
                                >
                                    {showPreviewOnMobile ? <Edit3 size={18}/> : <Eye size={18}/>}
                                </button>
                                
                                <button 
                                id="save-btn"
                                onClick={handleSave}
                                className="flex items-center gap-2 bg-brand-orange text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-lg shadow-brand-orange/20 hover:bg-orange-600 hover:scale-105 transition-all"
                                >
                                <Save size={16} /> <span className="hidden sm:inline">Save</span>
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Form Fields based on Active Tab */}
                        {/* Hide form if mobile preview mode is active */}
                        <div className={`space-y-6 ${showPreviewOnMobile ? 'hidden lg:block' : 'block'}`}>
                            {/* Common Fields */}
                            {(activeTab === 'programs' || activeTab === 'events' || activeTab === 'sessions' || activeTab === 'sales') && (
                                <InputField label={activeTab === 'sales' ? "Badge Title" : "Title"} value={editItem.title} onChange={(val: string) => handleChange('title', val)} />
                            )}

                            {/* Programs Form */}
                            {activeTab === 'programs' && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <InputField label="Category" value={editItem.category} onChange={(val: string) => handleChange('category', val)} />
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Style</label>
                                            <select 
                                                value={editItem.style} 
                                                onChange={(e) => handleChange('style', e.target.value)} 
                                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-orange transition-colors"
                                            >
                                                <option value="dark">Dark</option>
                                                <option value="image">Image</option>
                                            </select>
                                        </div>
                                    </div>
                                    {editItem.style === 'dark' && (
                                        <>
                                            <InputField label="Subtitle" value={editItem.subtitle} onChange={(val: string) => handleChange('subtitle', val)} />
                                            <InputField label="Button Text" value={editItem.buttonText} onChange={(val: string) => handleChange('buttonText', val)} />
                                        </>
                                    )}
                                    {editItem.style === 'image' && (
                                        <ImageInput label="Card Image" value={editItem.image} onChange={(val) => handleChange('image', val)} />
                                    )}
                                </>
                            )}

                            {/* Events Form */}
                            {activeTab === 'events' && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <InputField label="Category" value={editItem.category} onChange={(val: string) => handleChange('category', val)} />
                                        <InputField label="Date (e.g. OCT 24)" value={editItem.date} onChange={(val: string) => handleChange('date', val)} />
                                    </div>
                                    
                                    <ImageInput label="Event Image" value={editItem.image} onChange={(val) => handleChange('image', val)} />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <InputField label="Price" value={editItem.price} onChange={(val: string) => handleChange('price', val)} />
                                        <InputField label="Location" value={editItem.location} onChange={(val: string) => handleChange('location', val)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <InputField label="Spots Left" type="number" value={editItem.spotsLeft} onChange={(val: string) => handleChange('spotsLeft', parseInt(val))} />
                                        <InputField label="Total Spots" type="number" value={editItem.totalSpots} onChange={(val: string) => handleChange('totalSpots', parseInt(val))} />
                                    </div>
                                </>
                            )}

                            {/* Testimonials Form */}
                            {activeTab === 'testimonials' && (
                                <>
                                    <InputField label="Review Text" type="textarea" value={editItem.text} onChange={(val: string) => handleChange('text', val)} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <InputField label="Author Name" value={editItem.author} onChange={(val: string) => handleChange('author', val)} />
                                        <InputField label="Role / Location" value={editItem.role} onChange={(val: string) => handleChange('role', val)} />
                                    </div>
                                    <ImageInput label="Avatar Image" value={editItem.avatar} onChange={(val) => handleChange('avatar', val)} />
                                    <InputField label="Rating (0-5)" type="number" value={editItem.rating} onChange={(val: string) => handleChange('rating', parseFloat(val))} />
                                </>
                            )}

                            {/* Sessions Form */}
                            {activeTab === 'sessions' && (
                                <>
                                    <InputField label="Subtitle / Description" value={editItem.subtitle} onChange={(val: string) => handleChange('subtitle', val)} />
                                    <InputField label="Price" value={editItem.price} onChange={(val: string) => handleChange('price', val)} />
                                    <ImageInput label="Session Image" value={editItem.image} onChange={(val) => handleChange('image', val)} />
                                </>
                            )}

                            {/* Sales Form */}
                            {activeTab === 'sales' && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <InputField label="Category" value={editItem.category} onChange={(val: string) => handleChange('category', val)} />
                                        <InputField label="Audience" value={editItem.audience} onChange={(val: string) => handleChange('audience', val)} />
                                    </div>
                                    
                                    <ImageInput label="Product Image" value={editItem.image} onChange={(val) => handleChange('image', val)} />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <InputField label="Discount Text" value={editItem.discount} onChange={(val: string) => handleChange('discount', val)} />
                                        <InputField label="Button Text" value={editItem.buttonText} onChange={(val: string) => handleChange('buttonText', val)} />
                                    </div>
                                </>
                            )}
                        </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    {/* Visible on Desktop. Visible on Mobile only if toggled via eye icon */}
                    <div className={`
                        w-full lg:w-[400px] xl:w-[450px] border-t lg:border-t-0 lg:border-l flex flex-col transition-colors duration-300
                        ${isDark ? 'bg-black/20 border-white/10' : 'bg-gray-100 border-gray-200'}
                        ${showPreviewOnMobile ? 'flex h-full' : 'hidden lg:flex'}
                    `}>
                        <div className={`p-4 border-b text-center text-xs font-bold uppercase tracking-widest text-gray-500 shrink-0 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                        Live Preview
                        </div>
                        <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-50 relative overflow-y-auto">
                        {/* Background for preview area to ensure contrast regardless of theme */}
                        <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-900 opacity-50 z-0"></div>
                        
                        <div className="relative z-10 w-full flex justify-center h-full items-center">
                            {activeTab === 'programs' && (
                                <div className="w-full max-w-[320px] sm:max-w-[380px] h-[450px] sm:h-[500px]">
                                    <ProgramCard item={editItem} className="w-full h-full shadow-2xl" />
                                </div>
                            )}

                            {activeTab === 'events' && (
                                <div className="w-full max-w-sm h-auto rounded-3xl overflow-hidden relative group shadow-2xl bg-[#1a1a1c]">
                                    <div className="h-[250px] sm:h-[300px] relative">
                                        <img src={editItem.image} className="absolute inset-0 w-full h-full object-cover" alt="Preview"/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                        <div className="absolute top-4 left-4 right-4 flex justify-between">
                                            <div className="bg-white/10 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase text-white">{editItem.category}</div>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <h3 className="text-xl sm:text-2xl font-bold leading-none mb-2">{editItem.title}</h3>
                                            <div className="flex justify-between items-center text-xs">
                                                <span>{editItem.location}</span>
                                                <span className="font-bold">{editItem.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'testimonials' && (
                                <div className="bg-white text-black p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm">
                                    <h3 className="text-lg sm:text-xl font-medium leading-tight mb-6">"{editItem.text}"</h3>
                                    <div className="flex items-center gap-4">
                                            <img src={editItem.avatar} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" alt="User"/>
                                            <div>
                                                <div className="font-bold text-sm">{editItem.author}</div>
                                                <div className="text-xs text-gray-500">{editItem.role}</div>
                                            </div>
                                            <div className="ml-auto flex gap-1 items-center bg-brand-orange/10 px-2 py-1 rounded text-brand-orange text-xs font-bold">
                                                <Star size={10} fill="currentColor"/> {editItem.rating}
                                            </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'sessions' && (
                                <div className="w-full max-w-sm h-[350px] sm:h-[400px] relative rounded-3xl overflow-hidden shadow-2xl">
                                    <img src={editItem.image} className="absolute inset-0 w-full h-full object-cover" alt="Preview"/>
                                    <div className="absolute inset-0 bg-black/40"></div>
                                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white z-10">
                                        <div className="flex justify-between">
                                            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase">Featured</span>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">{editItem.title}</div>
                                            <div className="text-sm opacity-80 mb-4">{editItem.subtitle}</div>
                                            <div className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold inline-block">
                                                {editItem.price}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'sales' && (
                                <div className="w-full max-w-sm h-[450px] relative rounded-[2.5rem] overflow-hidden group shadow-xl bg-brand-orange">
                                    <div className="absolute inset-0">
                                        <img 
                                        src={editItem.image} 
                                        className="w-full h-full object-cover saturate-[1.2]"
                                        alt={editItem.title}
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
                                    
                                    <div className="absolute top-8 right-8 z-20">
                                        <div className="bg-white/95 backdrop-blur px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wide text-brand-dark flex items-center gap-2 shadow-sm">
                                            <div className="bg-brand-orange p-1 rounded-full text-white"><Shirt size={10} strokeWidth={3}/></div> {editItem.title}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6 z-20">
                                        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 shadow-lg">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{editItem.category}</span>
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-mint border border-white/20"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-orange border border-white/20"></div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-4xl font-bold text-brand-dark tracking-tighter">{editItem.discount}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{editItem.audience}</span>
                                                </div>
                                                
                                                <button className="bg-brand-blue text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-2">
                                                    <Plus size={12} strokeWidth={3} /> {editItem.buttonText}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        </div>
                    </div>
                    </>
                ) : (
                    <div className={`flex-1 flex items-center justify-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <div className="text-center">
                        <Layout size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-sm font-medium uppercase tracking-widest">Select an item to edit</p>
                    </div>
                    </div>
                )}
                </div>
            </>
        )}
      </div>
      <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
      `}</style>
    </div>
  );
};
