
import { AppSettings, CarouselItem } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  newsSource: 'https://techcrunch.com/feed/',
  welcomeCards: [
    {
      id: 'wc1',
      companyName: 'Bekind Labs',
      teamName: 'Product Design Team',
      welcomeMessage: 'We are delighted to have you with us today.'
    }
  ],
  showWelcomePanel: true,
  location: 'Tokyo, JP',
  autoPlayInterval: 12000,
  transitionSpeed: 800,
  internalPanels: [
    {
      id: 'p1',
      title: "Quarterly Strategy Alignment",
      sharedBy: "Kenji Sato",
      category: "OPERATIONS",
      content: "We will be reviewing our roadmap for Q1 next week. Please ensure all project trackers are updated by Friday EOD."
    }
  ],
  customNews: [
    {
      id: 'cn1',
      title: "The Future of Quantum Computing in Enterprise",
      summary: "Quantum processors are reaching stability levels previously thought impossible, opening doors for real-time encryption and molecular modeling at scale.",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
      source: "TechCrunch",
      url: "https://techcrunch.com"
    }
  ],
  timeOverlays: [
    { id: 'to1', label: "Good Morning", startTime: "08:00", endTime: "09:00" },
    { id: 'to2', label: "Lunch Time", startTime: "11:45", endTime: "12:45" },
    { id: 'to3', label: "Leave Work", startTime: "18:00", endTime: "08:00" }
  ]
};

export const MOCK_WEATHER = (location: string): CarouselItem => ({
  id: 'w1',
  type: 'weather',
  data: {
    temp: 22,
    condition: 'Partly Cloudy',
    location: location,
    high: 26,
    low: 18
  }
});
