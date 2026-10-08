import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = path.dirname(new URL(import.meta.url).pathname);
const customer = '3714098258';
const serviceAccount = 'REDACTED_SERVICE_ACCOUNT';
const identity = execFileSync('gcloud', ['auth', 'list', '--filter=status:ACTIVE', '--format=value(account)'], {encoding: 'utf8'}).trim();
const personal = execFileSync('gcloud', ['auth', 'print-access-token', '--quiet'], {encoding: 'utf8'}).trim();
const authResponse = await fetch(`https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount}:generateAccessToken`, {
  method: 'POST',
  headers: {Authorization: `Bearer ${personal}`, 'Content-Type': 'application/json'},
  body: JSON.stringify({scope: ['https://www.googleapis.com/auth/adwords'], lifetime: '3600s'}),
});
const auth = await authResponse.json();
if (!authResponse.ok || !auth.accessToken) throw new Error(`IAM authorization failed (${authResponse.status})`);

// One cluster per video type. Each keyword maps to a type we could build as a template.
const clusters = {
  'YouTube intro / outro': ['youtube intro template', 'youtube outro template', 'youtube end screen template', 'intro video template', 'channel intro template'],
  'Logo reveal / animation': ['logo reveal', 'logo animation', 'logo reveal template', 'logo animation template', 'animated logo maker', 'logo intro'],
  'Kinetic typography / lyric': ['kinetic typography', 'kinetic typography template', 'lyric video template', 'lyric video maker', 'text animation template', 'animated text video'],
  'Countdown / timer': ['countdown video', 'countdown timer video', 'countdown template', 'new year countdown video', 'launch countdown'],
  'Product launch / promo': ['product launch video', 'product video template', 'promo video template', 'product promo video', 'product teaser video'],
  'App / SaaS demo': ['app promo video', 'app preview video', 'saas demo video', 'product demo video', 'app store preview video', 'explainer video template'],
  'Social ad / sale': ['sale video template', 'black friday video', 'facebook ad video template', 'instagram ad template', 'flash sale video'],
  'Reels / TikTok / Shorts': ['instagram reel templates', 'tiktok templates', 'youtube shorts template', 'reels template', 'story video template'],
  'Event / webinar promo': ['event promo video', 'webinar promo video', 'event invitation video', 'conference promo video', 'save the date video'],
  'Data / stats recap': ['animated infographic', 'infographic video', 'animated chart video', 'data visualization video', 'year in review video', 'wrapped template'],
  'Lower thirds / titles': ['lower thirds', 'lower third template', 'title animation', 'title sequence template', 'opening titles'],
  'Testimonial / quote': ['testimonial video template', 'quote video maker', 'customer testimonial video', 'review video template'],
  'Real estate listing': ['real estate video template', 'property video template', 'real estate promo video', 'listing video'],
  'Restaurant / menu': ['restaurant promo video', 'menu video template', 'digital menu board video', 'food promo video'],
  'Podcast / audiogram': ['podcast intro', 'podcast video template', 'audiogram', 'podcast clip template'],
  'Hiring / job post': ['hiring video', 'job announcement video', 'we are hiring video', 'recruitment video template'],
  'Birthday / wedding / invite': ['birthday video template', 'wedding invitation video', 'invitation video maker', 'anniversary video template'],
  'Gaming / stream overlays': ['twitch intro', 'stream starting soon screen', 'gaming intro template', 'stream overlay animation'],
  'Slideshow / photo': ['slideshow template', 'photo slideshow maker', 'video slideshow template'],
  'Transitions': ['transition template', 'video transitions pack', 'glitch transition'],
};

const base = {language: 'languageConstants/1000', geoTargetConstants: ['geoTargetConstants/2840'], keywordPlanNetwork: 'GOOGLE_SEARCH', includeAdultKeywords: false};
const all = [...new Set(Object.values(clusters).flat())];
const results = [];
for (let i = 0; i < all.length; i += 10) {
  const response = await fetch(`https://googleads.googleapis.com/v25/customers/${customer}:generateKeywordHistoricalMetrics`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${auth.accessToken}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({...base, keywords: all.slice(i, i + 10), historicalMetricsOptions: {yearMonthRange: {start: {year: 2025, month: 'SEPTEMBER'}, end: {year: 2026, month: 'AUGUST'}}}}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Ads failed (${response.status}): ${JSON.stringify(data.error)}`);
  results.push(...(data.results ?? []));
  await new Promise((resolve) => setTimeout(resolve, 1300));
}

const byText = new Map(results.map((r) => [r.text, r.keywordMetrics ?? {}]));
const rows = [];
for (const [cluster, kws] of Object.entries(clusters)) {
  for (const keyword of kws) {
    const m = byText.get(keyword) ?? {};
    const monthly = (m.monthlySearchVolumes ?? []).map((x) => Number(x.monthlySearches ?? 0));
    const firstHalf = monthly.slice(0, 6).reduce((a, b) => a + b, 0);
    const secondHalf = monthly.slice(6).reduce((a, b) => a + b, 0);
    rows.push({
      cluster, keyword,
      searches: m.avgMonthlySearches == null ? null : Number(m.avgMonthlySearches),
      competition: m.competition ?? null,
      competitionIndex: m.competitionIndex == null ? null : Number(m.competitionIndex),
      highBidUsd: m.highTopOfPageBidMicros ? Number(m.highTopOfPageBidMicros) / 1e6 : null,
      trend6m: firstHalf ? Math.round((secondHalf / firstHalf - 1) * 100) : null,
      peakMonth: monthly.length ? (m.monthlySearchVolumes[monthly.indexOf(Math.max(...monthly))].month) : null,
    });
  }
}
fs.writeFileSync(path.join(root, 'raw', 'video-types-ads.json'), JSON.stringify({checkedAt: new Date().toISOString(), identity, geo: 'United States', language: 'English', range: '2025-09 to 2026-08', clusters, results}, null, 2));
fs.writeFileSync(path.join(root, 'video-types.json'), JSON.stringify(rows, null, 2));

const summary = Object.keys(clusters).map((cluster) => {
  const r = rows.filter((x) => x.cluster === cluster && x.searches != null);
  const total = r.reduce((a, b) => a + b.searches, 0);
  const comp = r.length ? Math.round(r.reduce((a, b) => a + (b.competitionIndex ?? 0) * b.searches, 0) / Math.max(total, 1)) : null;
  const top = [...r].sort((a, b) => b.searches - a.searches)[0];
  return {cluster, total, weightedCompetition: comp, top: top ? `${top.keyword} (${top.searches})` : '-'};
}).sort((a, b) => b.total - a.total);
console.table(summary);
console.table(rows.filter((r) => r.searches).sort((a, b) => b.searches - a.searches).map(({cluster, ...r}) => r));
