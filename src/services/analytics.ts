const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';
export const analyticsConfigured = /^G-[A-Z0-9]+$/.test(measurementId);
let loaded = false;
let lastPage: string | null = null;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};
const target = window as AnalyticsWindow;
function pageContext() {
  const page = location.pathname.startsWith('/s/') ? 'shared-video' : location.hash.startsWith('#/v/') ? 'editor' : location.hash === '#/privacy' ? 'privacy' : 'gallery';
  return {
    page_title: `cliphou.se | ${page}`,
    page_location: `${location.origin}${import.meta.env.BASE_URL}#/${page}`,
    page_referrer: document.referrer ? new URL(document.referrer).origin : '',
  };
}

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
    ...pageContext(),
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
}

type EventName = 'page_view' | 'bookmark_add' | 'bookmark_remove' | 'login' | 'share_publish' | 'editor_open' | 'text_edit' | 'color_edit' | 'image_edit' | 'save_video' | 'agent_link_copy' | 'template_brief_copy' | 'agent_handoff_open' | 'agent_handoff_reject' | 'source_download' | 'mp4_export';

function landingPage() {
  try { return sessionStorage.getItem('cliphouse:landing') ?? ''; } catch { return ''; }
}

export function track(name: EventName, params: Record<string, string> = {}) {
  if (!analyticsConfigured) return;
  startAnalytics();
  // No account identifiers, search queries, or edited text enter Analytics.
  const landing = landingPage();
  target.gtag?.('event', name, {...pageContext(), ...(landing ? {landing_page: landing} : {}), ...params});
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
