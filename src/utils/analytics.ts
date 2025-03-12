import * as amplitude from '@amplitude/analytics-browser';

// Initialize Amplitude with your API key
const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || '';

export const initAnalytics = () => {
  const hasConsented = localStorage.getItem('cookieConsent') === 'true';
  
  if (AMPLITUDE_API_KEY && hasConsented) {
    amplitude.init(AMPLITUDE_API_KEY, undefined, {
      defaultTracking: {
        sessions: true,
        pageViews: true,
        formInteractions: true,
        fileDownloads: true,
      },
    });
  }
};

// Event types for type safety
export enum AnalyticsEvent {
  CALCULATE_TAX = 'calculate_tax',
  RESET_CALCULATOR = 'reset_calculator',
  TOGGLE_FISCAL_PARTNER = 'toggle_fiscal_partner',
  UPDATE_ASSET = 'update_asset',
  CHANGE_LANGUAGE = 'change_language',
  VIEW_PRIVACY = 'view_privacy',
  VIEW_COOKIES = 'view_cookies',
  VIEW_CONTACT = 'view_contact',
  ACCEPT_COOKIES = 'accept_cookies',
  DECLINE_COOKIES = 'decline_cookies',
}

// Event properties interface
export interface EventProperties {
  language?: string;
  previousLanguage?: string;
  assetType?: string;
  assetValue?: number;
  hasFiscalPartner?: boolean;
  totalAssets?: number;
  totalDebts?: number;
  taxAmount?: number;
  path?: string;
}

// Track events with type safety
export const trackEvent = (
  eventName: AnalyticsEvent,
  eventProperties?: EventProperties
) => {
  const hasConsented = localStorage.getItem('cookieConsent') === 'true';
  if (AMPLITUDE_API_KEY && hasConsented) {
    amplitude.track(eventName, eventProperties);
  }
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  const hasConsented = localStorage.getItem('cookieConsent') === 'true';
  if (AMPLITUDE_API_KEY && hasConsented) {
    const identify = new amplitude.Identify();
    Object.entries(properties).forEach(([key, value]) => {
      identify.set(key, value);
    });
    amplitude.identify(identify);
  }
};

// Reset user
export const resetUser = () => {
  const hasConsented = localStorage.getItem('cookieConsent') === 'true';
  if (AMPLITUDE_API_KEY && hasConsented) {
    amplitude.reset();
  }
}; 