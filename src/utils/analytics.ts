import * as amplitude from '@amplitude/analytics-browser';

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || '';

export const initAnalytics = () => {
  if (AMPLITUDE_API_KEY) {
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

export const trackEvent = (
  eventName: AnalyticsEvent,
  eventProperties?: EventProperties
) => {
  if (AMPLITUDE_API_KEY) {
    amplitude.track(eventName, eventProperties);
  }
};

export const setUserProperties = (properties: Record<string, unknown>) => {
  if (AMPLITUDE_API_KEY) {
    const identify = new amplitude.Identify();
    Object.entries(properties).forEach(([key, value]) => {
      identify.set(key, value as string | number | boolean);
    });
    amplitude.identify(identify);
  }
};

export const resetUser = () => {
  if (AMPLITUDE_API_KEY) {
    amplitude.reset();
  }
};
