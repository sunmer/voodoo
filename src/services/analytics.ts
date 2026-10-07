const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';
export const analyticsConfigured = /^G-[A-Z0-9]+$/.test(measurementId);
let loaded = false;
let lastPage: string | null = null;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};
const target = window as AnalyticsWindow;

export function startAnalytics() {
  if (loaded || !analyticsConfigured) return;
  loaded = true;
  target.dataLayer ??= [];
  target.gtag = function () { target.dataLayer!.push(arguments); };
  target.gtag('consent', 'default', {
    analytics_storage: 'granted', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  });
  target.gtag('js', new Date());
  target.gtag('config', measurementId, {
    send_page_view: false, allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
}

export function track(name: 'page_view' | 'bookmark_add' | 'bookmark_remove' | 'login' | 'download_props', params: Record<string, string> = {}) {
  if (!analyticsConfigured) return;
  startAnalytics();
  // No account identifiers, search queries, or edited text enter Analytics.
  target.gtag?.('event', name, params);
}

export function trackPage(id?: string) {
  if (!analyticsConfigured) return;
  const page = id ?? 'gallery';
  if (lastPage === page) return;
  lastPage = page;
  track('page_view', {
    page_title: id ? `cliphou.se | ${id}` : 'cliphou.se',
    page_location: `${location.origin}${import.meta.env.BASE_URL}${id === 'privacy' ? '#/privacy' : id ? `#/v/${id}` : '#/'}`,
    page_referrer: document.referrer ? new URL(document.referrer).origin : '',
  });
}
