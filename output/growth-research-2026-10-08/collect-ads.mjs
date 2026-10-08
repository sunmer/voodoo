import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(root, 'raw');
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
if (!authResponse.ok || !auth.accessToken) throw new Error(`IAM authorization failed (${authResponse.status}): ${JSON.stringify(auth.error)}`);

const base = {
  language: 'languageConstants/1000',
  geoTargetConstants: ['geoTargetConstants/2840'],
  keywordPlanNetwork: 'GOOGLE_SEARCH',
  includeAdultKeywords: false,
};
const keywords = [
  'canva alternative', 'open source canva alternative', 'canva open source alternative', 'free canva alternative',
  'canva video editor', 'canva video templates', 'canva alternative for video', 'video template', 'video templates',
  'free video templates', 'motion graphics templates', 'free motion graphics templates', 'animated video templates',
  'video maker templates', 'online video maker', 'free video maker', 'ai video generator', 'ai video maker',
  'ai motion graphics', 'ai motion graphics generator', 'motion graphics generator', 'remotion', 'remotion templates',
  'react video templates', 'code video templates', 'open source video editor', 'open source video templates',
  'after effects templates', 'free after effects templates', 'premiere pro templates', 'capcut templates',
  'instagram reel templates', 'tiktok video templates', 'youtube intro templates', 'product launch video template',
  'saas product video', 'app promo video template', 'social media video templates', 'ad video templates',
  'claude video generator', 'claude motion graphics', 'chatgpt video generator', 'text to video templates',
];

async function ads(method, body) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`https://googleads.googleapis.com/v25/customers/${customer}:${method}`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${auth.accessToken}`, 'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (response.ok) return {status: response.status, requestId: response.headers.get('request-id'), data};
    if (response.status !== 429 && response.status < 500) throw new Error(`${method} failed (${response.status}): ${JSON.stringify(data.error)}`);
    await new Promise((resolve) => setTimeout(resolve, 10_000 * (attempt + 1)));
  }
  throw new Error(`${method} failed after retries`);
}

const history = [];
for (let i = 0; i < keywords.length; i += 10) {
  history.push(await ads('generateKeywordHistoricalMetrics', {
    ...base,
    keywords: keywords.slice(i, i + 10),
    historicalMetricsOptions: {yearMonthRange: {start: {year: 2025, month: 'SEPTEMBER'}, end: {year: 2026, month: 'AUGUST'}}},
  }));
  await new Promise((resolve) => setTimeout(resolve, 1300));
}
const ideaSeeds = ['canva alternative', 'video templates', 'motion graphics templates', 'ai video generator', 'remotion templates'];
const ideas = await ads('generateKeywordIdeas', {...base, keywordSeed: {keywords: ideaSeeds}, pageSize: 1000});

const metric = (r) => r.keywordMetrics ?? r.keywordIdeaMetrics ?? {};
const row = (r) => ({
  keyword: r.text,
  avgMonthlySearches: metric(r).avgMonthlySearches == null ? null : Number(metric(r).avgMonthlySearches),
  competition: metric(r).competition ?? null,
  competitionIndex: metric(r).competitionIndex ?? null,
  lowTopBidUsd: metric(r).lowTopOfPageBidMicros ? Number(metric(r).lowTopOfPageBidMicros) / 1e6 : null,
  highTopBidUsd: metric(r).highTopOfPageBidMicros ? Number(metric(r).highTopOfPageBidMicros) / 1e6 : null,
  monthly: metric(r).monthlySearchVolumes?.map((m) => ({year: m.year, month: m.month, searches: Number(m.monthlySearches ?? 0)})) ?? [],
});
const historyRows = history.flatMap((x) => x.data.results ?? []).map(row).sort((a, b) => (b.avgMonthlySearches ?? -1) - (a.avgMonthlySearches ?? -1));
const ideaRows = (ideas.data.results ?? []).map(row).filter((r) => r.avgMonthlySearches != null).sort((a, b) => b.avgMonthlySearches - a.avgMonthlySearches);
fs.writeFileSync(path.join(out, 'google-ads.json'), JSON.stringify({checkedAt: new Date().toISOString(), identity, serviceAccount, customer, geo: 'United States', language: 'English', network: 'Google Search', range: '2025-09 to 2026-08', keywords, ideaSeeds, history, ideas}, null, 2));
fs.writeFileSync(path.join(root, 'keyword-metrics.json'), JSON.stringify({historyRows, ideaRows: ideaRows.slice(0, 300)}, null, 2));
console.log(JSON.stringify({identity, history: historyRows.map(({monthly, ...r}) => r), ideaCount: ideaRows.length}, null, 2));
