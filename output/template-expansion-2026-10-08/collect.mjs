// Keyword refresh for the template expansion (#7).
// Google Ads Keyword Planner: US, English, Google Search, 2025-09 to 2026-08 (same scope as growth-research-2026-10-08).
// SerpApi: top organic results for the lead query of each candidate, to confirm template intent.
// Usage: ADS_SERVICE_ACCOUNT=... SERPAPI_ENV=path/to/.env node output/template-expansion-2026-10-08/collect.mjs [--no-serp]
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = path.dirname(new URL(import.meta.url).pathname);
const customer = '3714098258';
const serviceAccount = process.env.ADS_SERVICE_ACCOUNT;
if (!serviceAccount) throw new Error('Set ADS_SERVICE_ACCOUNT to the Keyword Planner service account.');
const personal = execFileSync('gcloud', ['auth', 'print-access-token', '--quiet'], {encoding: 'utf8'}).trim();
const authResponse = await fetch(`https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount}:generateAccessToken`, {
  method: 'POST', headers: {Authorization: `Bearer ${personal}`, 'Content-Type': 'application/json'},
  body: JSON.stringify({scope: ['https://www.googleapis.com/auth/adwords'], lifetime: '3600s'}),
});
const auth = await authResponse.json();
if (!authResponse.ok) throw new Error(`IAM authorization failed (${authResponse.status})`);

// Candidate template types. The first query is the lead query used for the SERP intent check.
const candidates = {
  'hiring': ['hiring video', 'we are hiring video', 'job announcement video', 'recruitment video template', 'hiring post template'],
  'team-intro': ['team introduction video', 'meet the team video', 'employee spotlight video', 'new employee announcement'],
  'partnership': ['partnership announcement', 'partnership announcement video', 'collaboration announcement'],
  'funding': ['funding announcement', 'funding announcement video', 'we raised announcement'],
  'milestone': ['milestone video', 'company milestone video', 'followers milestone', 'thank you followers video'],
  'case-study': ['case study video', 'case study video template', 'customer story video'],
  'subscribe': ['subscribe button animation', 'subscribe animation', 'like and subscribe animation', 'subscribe reminder'],
  'channel-trailer': ['channel trailer', 'youtube channel trailer', 'channel trailer template'],
  'episode-recap': ['episode recap video', 'weekly recap video', 'recap video template'],
  'chapter-titles': ['youtube chapter title', 'chapter title animation', 'section title animation'],
  'poll': ['poll video', 'this or that video', 'would you rather video template'],
  'giveaway': ['giveaway video', 'giveaway announcement', 'giveaway template', 'giveaway post'],
  'feature-launch': ['feature announcement', 'new feature announcement', 'feature launch video', 'product update video'],
  'pricing': ['pricing video', 'price reveal video', 'pricing announcement'],
  'discount': ['discount video', 'promo code video', 'coupon video', 'discount announcement'],
  'app-promo': ['app promo video', 'app promo video template', 'app advertisement video', 'mobile app promo'],
  'waitlist': ['waitlist announcement', 'coming soon video', 'coming soon template', 'pre launch video'],
  'newsletter': ['newsletter promo video', 'newsletter announcement', 'subscribe to newsletter'],
  'webinar': ['webinar promo video', 'webinar announcement', 'webinar invitation', 'webinar teaser'],
  'speaker': ['speaker announcement', 'speaker announcement template', 'speaker card', 'guest speaker announcement'],
  'agenda': ['event agenda video', 'conference agenda', 'event schedule video'],
  'ticket': ['tickets on sale video', 'ticket launch', 'event announcement video', 'event teaser video'],
  'livestream': ['stream starting soon', 'starting soon screen', 'live stream intro', 'going live video'],
  'thank-you': ['thank you video', 'thank you video template', 'thank you for watching', 'thank you message video'],
  'stat-reveal': ['animated statistics', 'stats video', 'number animation', 'counter animation'],
  'chart-story': ['animated bar chart', 'bar chart race', 'animated chart', 'animated graph video'],
  'timeline': ['timeline video', 'animated timeline', 'timeline video template', 'history timeline video'],
  'before-after': ['before and after video', 'before and after template', 'before after slider video'],
  'tutorial': ['tutorial video template', 'how to video template', 'step by step video', 'tutorial intro'],
  'comparison': ['comparison video', 'versus video', 'vs video template', 'comparison template'],
  'faq': ['faq video', 'q and a video', 'questions and answers video'],
  'quote': ['quote video', 'motivational quote video', 'quote animation', 'quote of the day video'],
  'top-list': ['top 5 video', 'top 10 video template', 'ranking video', 'list video'],
  'cyber-monday': ['cyber monday video', 'cyber monday sale', 'cyber monday template'],
  'holiday-sale': ['christmas sale video', 'holiday sale video', 'christmas promo video'],
  'new-year': ['happy new year video', 'new year video template', 'new year greeting video', 'new year countdown'],
  'valentines': ['valentines day video', 'valentines sale', 'valentines video template'],
  'back-to-school': ['back to school video', 'back to school sale', 'back to school template'],
  'anniversary': ['company anniversary video', 'business anniversary', 'work anniversary video', 'anniversary video template'],
  'birthday': ['happy birthday video', 'birthday video template', 'birthday animation'],
  'event-recap': ['event recap video', 'conference recap video', 'highlight video'],
  'announcement': ['announcement video', 'announcement template', 'big announcement video'],
  'grand-opening': ['grand opening video', 'grand opening announcement', 'store opening video'],
  'flash-sale': ['flash sale video', 'flash sale', 'limited time offer video'],
  'social-post': ['animated social media post', 'animated instagram post', 'linkedin video post'],
  'map-route': ['animated map', 'travel map animation', 'map route animation'],
  'progress': ['progress bar animation', 'loading animation video', 'goal progress video'],
  'date-reveal': ['event date announcement', 'date reveal', 'save the date'],
  'review': ['product review video', 'star rating animation', 'review video template'],
  'mission': ['mission statement video', 'company values video', 'about us video'],
  'menu': ['menu video', 'digital menu board'],
  'real-estate': ['real estate video template', 'just listed video', 'open house video'],
  'gaming': ['gaming intro', 'twitch intro', 'stream overlay'],
  'wedding': ['wedding invitation video', 'save the date video'],
  'quiz': ['quiz video', 'trivia video', 'guess the video'],
  'tips': ['tips video', 'tip of the day', 'did you know video'],
  'job-post': ['job posting template', 'job post linkedin', 'job ad template'],
  'call-to-action': ['call to action animation', 'cta animation', 'link in bio animation'],
  'qr': ['qr code video', 'scan qr code animation'],
  'title-card': ['title card', 'title card template', 'title screen'],
  'credits': ['end credits template', 'rolling credits', 'credits animation'],
};

const base = {language: 'languageConstants/1000', geoTargetConstants: ['geoTargetConstants/2840'], keywordPlanNetwork: 'GOOGLE_SEARCH', includeAdultKeywords: false};
const all = [...new Set(Object.values(candidates).flat())];
const results = [];
for (let i = 0; i < all.length; i += 20) {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(`https://googleads.googleapis.com/v25/customers/${customer}:generateKeywordHistoricalMetrics`, {
      method: 'POST', headers: {Authorization: `Bearer ${auth.accessToken}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({...base, keywords: all.slice(i, i + 20), historicalMetricsOptions: {yearMonthRange: {start: {year: 2025, month: 'SEPTEMBER'}, end: {year: 2026, month: 'AUGUST'}}}}),
    });
    const data = await response.json();
    if (response.ok) { results.push(...(data.results ?? [])); break; }
    if (attempt > 2 || (response.status !== 429 && response.status < 500)) throw new Error(`Ads failed (${response.status}): ${JSON.stringify(data.error)}`);
    await new Promise((r) => setTimeout(r, 10_000 * (attempt + 1)));
  }
  await new Promise((r) => setTimeout(r, 1300));
}
const byText = new Map(results.map((r) => [r.text, r.keywordMetrics ?? {}]));
const rows = Object.entries(candidates).flatMap(([type, kws]) => kws.map((keyword) => {
  const m = byText.get(keyword) ?? {};
  const monthly = (m.monthlySearchVolumes ?? []).map((x) => Number(x.monthlySearches ?? 0));
  return {
    type, keyword,
    searches: m.avgMonthlySearches == null ? null : Number(m.avgMonthlySearches),
    competitionIndex: m.competitionIndex == null ? null : Number(m.competitionIndex),
    highBidUsd: m.highTopOfPageBidMicros ? +(Number(m.highTopOfPageBidMicros) / 1e6).toFixed(2) : null,
    peakMonth: monthly.length ? m.monthlySearchVolumes[monthly.indexOf(Math.max(...monthly))].month : null,
  };
}));
fs.mkdirSync(path.join(root, 'raw'), {recursive: true});
fs.writeFileSync(path.join(root, 'raw/google-ads.json'), JSON.stringify({checkedAt: new Date().toISOString(), customer, geo: 'United States', language: 'English', range: '2025-09 to 2026-08', candidates, results}, null, 2));
fs.writeFileSync(path.join(root, 'keywords.json'), JSON.stringify(rows, null, 2));

if (!process.argv.includes('--no-serp')) {
  const env = Object.fromEntries(fs.readFileSync(process.env.SERPAPI_ENV, 'utf8').split('\n').filter((l) => /^[A-Z0-9_]+=/.test(l)).map((l) => {
    const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
  }));
  const leads = Object.entries(candidates).map(([type, kws]) => ({type, query: kws[0]}));
  const serps = [];
  for (let i = 0; i < leads.length; i += 8) {
    serps.push(...await Promise.all(leads.slice(i, i + 8).map(async ({type, query}) => {
      const params = new URLSearchParams({engine: 'google', q: query, gl: 'us', hl: 'en', google_domain: 'google.com', num: '10', api_key: env.SERPAPI_API_KEY});
      const data = await (await fetch(`https://serpapi.com/search.json?${params}`)).json();
      if (data.error) return {type, query, error: data.error};
      return {type, query, videos: Boolean(data.inline_videos), organic: (data.organic_results ?? []).slice(0, 8).map((r) => ({position: r.position, host: new URL(r.link).hostname, title: r.title}))};
    })));
  }
  fs.writeFileSync(path.join(root, 'raw/serpapi.json'), JSON.stringify({checkedAt: new Date().toISOString(), provider: 'SerpApi Google Search', geo: 'US', serps}, null, 2));
}
console.log(`${rows.length} keywords, ${rows.filter((r) => r.searches).length} with volume`);
