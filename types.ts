
export type CardType = 'news' | 'weather' | 'welcome' | 'internal';

export interface WelcomeCardData {
  id: string;
  companyName: string;
  teamName: string;
  welcomeMessage: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  source: string;
  url?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  high: number;
  low: number;
  imageUrl?: string;
}

export interface InternalPanel {
  id: string;
  title: string;
  sharedBy: string;
  category: string;
  content: string;
  url?: string;
  imageUrl?: string;
  summary?: string;
}

export interface TimeOverlay {
  id: string;
  label: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface AppSettings {
  newsSource: string;
  welcomeCards: WelcomeCardData[];
  showWelcomePanel: boolean;
  location: string;
  autoPlayInterval: number;
  transitionSpeed: number;
  internalPanels: InternalPanel[];
  customNews: NewsItem[];
  timeOverlays: TimeOverlay[];
}

export interface CarouselItem {
  type: CardType;
  data: any;
  id: string;
}
