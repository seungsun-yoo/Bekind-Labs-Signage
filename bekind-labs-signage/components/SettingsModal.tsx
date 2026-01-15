
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Share2, Building2, Plus, Trash2, Zap, Newspaper, RefreshCw, Eye, EyeOff, ImageIcon, CalendarClock } from 'lucide-react';
import { AppSettings, InternalPanel, NewsItem, WelcomeCardData, TimeOverlay } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [fetchingId, setFetchingId] = useState<string | null>(null);

  const fetchMetadata = async (id: string, url: string, type: 'news' | 'internal') => {
    if (!url) return;
    setFetchingId(id);
    try {
      const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.status === 'success') {
        const metadata = data.data;
        if (type === 'news') {
          const updated = formData.customNews.map(item => item.id === id ? {
            ...item,
            title: metadata.title || item.title,
            summary: metadata.description || item.summary,
            imageUrl: metadata.image?.url || item.imageUrl,
            source: metadata.publisher || new URL(url).hostname,
          } : item);
          setFormData({ ...formData, customNews: updated });
        } else {
          const updated = formData.internalPanels.map(item => item.id === id ? {
            ...item,
            title: metadata.title || item.title,
            imageUrl: metadata.image?.url || item.imageUrl,
            content: metadata.description || item.content,
          } : item);
          setFormData({ ...formData, internalPanels: updated });
        }
      }
    } catch (error) {
      console.error("Failed to fetch OGP data", error);
    } finally {
      setFetchingId(null);
    }
  };

  const updateInternalPanel = (index: number, field: keyof InternalPanel, value: string) => {
    const panels = [...formData.internalPanels];
    panels[index] = { ...panels[index], [field]: value };
    setFormData({ ...formData, internalPanels: panels });
  };

  const updateNewsItem = (index: number, field: keyof NewsItem, value: string) => {
    const news = [...formData.customNews];
    news[index] = { ...news[index], [field]: value };
    setFormData({ ...formData, customNews: news });
  };

  const updateWelcomeCard = (index: number, field: keyof WelcomeCardData, value: string) => {
    const cards = [...formData.welcomeCards];
    cards[index] = { ...cards[index], [field]: value };
    setFormData({ ...formData, welcomeCards: cards });
  };

  const updateTimeOverlay = (index: number, field: keyof TimeOverlay, value: string) => {
    const overlays = [...formData.timeOverlays];
    overlays[index] = { ...overlays[index], [field]: value };
    setFormData({ ...formData, timeOverlays: overlays });
  };

  const addPanel = () => {
    if (formData.internalPanels.length + formData.customNews.length + formData.welcomeCards.length >= 12) return;
    const newPanel: InternalPanel = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Announcement",
      sharedBy: "Team Member",
      category: "SHARED",
      content: "",
      url: ""
    };
    setFormData({ ...formData, internalPanels: [...formData.internalPanels, newPanel] });
  };

  const addNews = () => {
    if (formData.internalPanels.length + formData.customNews.length + formData.welcomeCards.length >= 12) return;
    const newNews: NewsItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Article",
      summary: "",
      imageUrl: "https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&q=80&w=1200",
      source: "Feed",
      url: ""
    };
    setFormData({ ...formData, customNews: [...formData.customNews, newNews] });
  };

  const addWelcome = () => {
    if (formData.internalPanels.length + formData.customNews.length + formData.welcomeCards.length >= 12) return;
    const newWelcome: WelcomeCardData = {
      id: Math.random().toString(36).substr(2, 9),
      companyName: "Bekind Labs",
      teamName: "New Team",
      welcomeMessage: "Welcome message here."
    };
    setFormData({ ...formData, welcomeCards: [...formData.welcomeCards, newWelcome] });
  };

  const addTimeOverlay = () => {
    const newOverlay: TimeOverlay = {
      id: Math.random().toString(36).substr(2, 9),
      label: "New Message",
      startTime: "12:00",
      endTime: "13:00"
    };
    setFormData({ ...formData, timeOverlays: [...formData.timeOverlays, newOverlay] });
  };

  const removePanel = (index: number) => setFormData({ ...formData, internalPanels: formData.internalPanels.filter((_, i) => i !== index) });
  const removeNews = (index: number) => setFormData({ ...formData, customNews: formData.customNews.filter((_, i) => i !== index) });
  const removeWelcome = (index: number) => setFormData({ ...formData, welcomeCards: formData.welcomeCards.filter((_, i) => i !== index) });
  const removeTimeOverlay = (index: number) => setFormData({ ...formData, timeOverlays: formData.timeOverlays.filter((_, i) => i !== index) });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-6xl bg-[#080808] border border-white/10 rounded-[40px] shadow-3xl p-10 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-serif text-white tracking-tight italic">System Configuration</h2>
            <p className="text-white/20 text-[9px] tracking-[0.3em] uppercase font-black">v12.0 Performance Engine</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-white/20 transition-all"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 space-y-16 custom-scrollbar">
          {/* Section: Global Physics */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-white/60"><Zap className="w-4 h-4" /><h3 className="text-[10px] font-black uppercase tracking-widest">Motion Dynamics</h3></div>
            <div className="grid grid-cols-2 gap-8 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
              <div className="space-y-3"><span className="text-[9px] text-white/20 uppercase tracking-widest font-black">Rotation Speed</span><input type="range" min="5000" max="60000" step="1000" value={formData.autoPlayInterval} onChange={(e) => setFormData({ ...formData, autoPlayInterval: parseInt(e.target.value) })} className="w-full accent-emerald-500" /><div className="text-[10px] text-white/40">{formData.autoPlayInterval / 1000}s</div></div>
              <div className="space-y-3"><span className="text-[9px] text-white/20 uppercase tracking-widest font-black">Transition ms</span><input type="range" min="200" max="2000" step="100" value={formData.transitionSpeed} onChange={(e) => setFormData({ ...formData, transitionSpeed: parseInt(e.target.value) })} className="w-full accent-blue-500" /><div className="text-[10px] text-white/40">{formData.transitionSpeed}ms</div></div>
            </div>
          </section>

          {/* Section: Schedule Overlays (New) */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/60"><CalendarClock className="w-4 h-4" /><h3 className="text-[10px] font-black uppercase tracking-widest">Schedule Overlays</h3></div>
              <button onClick={addTimeOverlay} className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"><Plus className="w-3.5 h-3.5" /> Add Overlay</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formData.timeOverlays.map((to, idx) => (
                <div key={to.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center"><div className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">Overlay 0{idx + 1}</div><button onClick={() => removeTimeOverlay(idx)} className="text-white/10 hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button></div>
                  <input placeholder="Display Text" value={to.label} onChange={(e) => updateTimeOverlay(idx, 'label', e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[8px] text-white/20 uppercase font-black">Start</span>
                      <input type="time" value={to.startTime} onChange={(e) => updateTimeOverlay(idx, 'startTime', e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white outline-none" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] text-white/20 uppercase font-black">End</span>
                      <input type="time" value={to.endTime} onChange={(e) => updateTimeOverlay(idx, 'endTime', e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white outline-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Welcome Cards */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/60"><Building2 className="w-4 h-4" /><h3 className="text-[10px] font-black uppercase tracking-widest">Welcome Cards</h3></div>
              <div className="flex items-center gap-4">
                <button onClick={() => setFormData({ ...formData, showWelcomePanel: !formData.showWelcomePanel })} className={`px-4 py-2 rounded-full text-[10px] font-black transition-all flex items-center gap-2 ${formData.showWelcomePanel ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/20'}`}>
                  {formData.showWelcomePanel ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {formData.showWelcomePanel ? 'System Active' : 'System Muted'}
                </button>
                <button onClick={addWelcome} className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"><Plus className="w-3.5 h-3.5" /> Add Client Panel</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {formData.welcomeCards.map((wc, idx) => (
                <div key={wc.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-5">
                   <div className="flex justify-between items-center"><div className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.3em]">Client Panel 0{idx + 1}</div><button onClick={() => removeWelcome(idx)} className="text-white/10 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button></div>
                   <input placeholder="Client Name" value={wc.companyName} onChange={(e) => updateWelcomeCard(idx, 'companyName', e.target.value)} className="w-full bg-transparent border-b border-white/10 py-2 text-white font-serif italic text-lg outline-none" />
                   <input placeholder="Project / Team" value={wc.teamName} onChange={(e) => updateWelcomeCard(idx, 'teamName', e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white" />
                   <textarea placeholder="Personalized Message..." value={wc.welcomeMessage} onChange={(e) => updateWelcomeCard(idx, 'welcomeMessage', e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white/40 h-24 resize-none outline-none" />
                </div>
              ))}
            </div>
          </section>

          {/* Section: Global News */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/60"><Newspaper className="w-4 h-4" /><h3 className="text-[10px] font-black uppercase tracking-widest">Global Intelligence</h3></div>
              <button onClick={addNews} className="flex items-center gap-2 px-6 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"><Plus className="w-3.5 h-3.5" /> Append Article</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {formData.customNews.map((news, idx) => (
                <div key={news.id} className="group p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-5">
                  <div className="flex justify-between items-center"><div className="text-[9px] text-blue-500 font-black uppercase tracking-[0.3em]">News 0{idx + 1}</div><button onClick={() => removeNews(idx)} className="text-white/10 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button></div>
                  <div className="flex gap-2">
                    <input placeholder="Sync URL..." value={news.url || ""} onChange={(e) => updateNewsItem(idx, 'url', e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" />
                    <button onClick={() => fetchMetadata(news.id, news.url || "", 'news')} className="px-5 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><RefreshCw className={`w-3.5 h-3.5 ${fetchingId === news.id ? 'animate-spin' : ''}`} /></button>
                  </div>
                  <input placeholder="Headline" value={news.title} onChange={(e) => updateNewsItem(idx, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/10 py-2 text-white font-serif italic text-lg outline-none" />
                  <div className="flex gap-4 items-center">
                    <input placeholder="Visual Asset URL" value={news.imageUrl} onChange={(e) => updateNewsItem(idx, 'imageUrl', e.target.value)} className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white/60" />
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/5">
                       {news.imageUrl && <img src={news.imageUrl} className="w-full h-full object-cover" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Internal Announcements */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/60"><Share2 className="w-4 h-4" /><h3 className="text-[10px] font-black uppercase tracking-widest">Internal Sync</h3></div>
              <button onClick={addPanel} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"><Plus className="w-3.5 h-3.5" /> Shared Event</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {formData.internalPanels.map((panel, idx) => (
                <div key={panel.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-5">
                  <div className="flex justify-between items-center"><div className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.3em]">Internal 0{idx + 1}</div><button onClick={() => removePanel(idx)} className="text-white/10 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button></div>
                  <div className="flex gap-2">
                    <input placeholder="Link URL..." value={panel.url || ""} onChange={(e) => updateInternalPanel(idx, 'url', e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" />
                    <button onClick={() => fetchMetadata(panel.id, panel.url || "", 'internal')} className="px-5 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><RefreshCw className={`w-3.5 h-3.5 ${fetchingId === panel.id ? 'animate-spin' : ''}`} /></button>
                  </div>
                  <input placeholder="Subject" value={panel.title} onChange={(e) => updateInternalPanel(idx, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/10 py-2 text-white font-serif italic text-lg outline-none" />
                  <textarea placeholder="Content..." value={panel.content} onChange={(e) => updateInternalPanel(idx, 'content', e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white/40 h-20 resize-none outline-none" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 pt-10 border-t border-white/5 flex justify-end gap-5">
          <div className="flex-1 flex items-center">
            <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Max Pool: 12 Items Total</span>
          </div>
          <button onClick={onClose} className="px-8 py-3.5 text-white/30 hover:text-white transition-all text-xs font-black uppercase tracking-widest">Discard</button>
          <button onClick={() => onSave(formData)} className="px-14 py-3.5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"><Save className="w-4 h-4" /> Deploy Changes</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;
