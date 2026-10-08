import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(root, 'raw');
const envFile = '/Users/nimaboustanian/Projects/lovd-by-ai-28/supabase/.env';
const env = Object.fromEntries(fs.readFileSync(envFile, 'utf8').split('\n').filter((l) => /^[A-Z0-9_]+=/.test(l)).map((l) => {
  const i = l.indexOf('=');
  return [l.slice(0, i), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
}));
const bright = env.BRIGHTDATA_API_KEY;
const serpapi = env.SERPAPI_API_KEY;
const zone = env.BRIGHTDATA_SERP_ZONE || 'serp_api2';
if (!bright || !serpapi) throw new Error('Missing BrightData or SerpApi configuration');

const queries = [
  'canva alternative', 'open source canva alternative', 'canva video templates', 'free video templates',
  'motion graphics templates', 'ai motion graphics generator', 'remotion templates', 'claude video generator',
  'instagram reel templates', 'product launch video template',
];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function serp(query) {
  const q = new URLSearchParams({q: query, brd_ai_overview: '2', gl: 'us', hl: 'en'});
  const response = await fetch(`https://api.brightdata.com/serp/req?zone=${encodeURIComponent(zone)}`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${bright}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({query: Object.fromEntries(q), country: 'us', brd_json: 'json'}),
  });
  const text = await response.text();
  const id = response.headers.get('x-response-id') || response.headers.get('x-brd-response-id') || JSON.parse(text || '{}').response_id;
  if (!response.ok || !id) throw new Error(`BrightData request failed for ${query}: ${response.status} ${text.slice(0, 200)}`);
  for (let i = 0; i < 60; i++) {
    await sleep(3000);
    const result = await fetch(`https://api.brightdata.com/serp/get_result?zone=${encodeURIComponent(zone)}&response_id=${encodeURIComponent(id)}`, {
      headers: {Authorization: `Bearer ${bright}`},
    });
    const body = await result.text();
    if (result.status === 102 || result.status === 202 || /pending|not ready/i.test(body.slice(0, 200))) continue;
    if (!result.ok) throw new Error(`BrightData result failed for ${query}: ${result.status} ${body.slice(0, 200)}`);
    let data = JSON.parse(body);
    if (data.body) data = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
    return data;
  }
  throw new Error(`BrightData timed out for ${query}`);
}

const serpPath = path.join(out, 'brightdata-serps.json');
const previous = fs.existsSync(serpPath) ? JSON.parse(fs.readFileSync(serpPath, 'utf8')).serps : [];
const serps = previous.filter((x) => x.data);
const pending = queries.filter((q) => !serps.some((x) => x.query === q));
const settled = await Promise.allSettled(pending.map(async (query) => {
  const data = await serp(query);
  const organic = data.organic ?? data.organic_results ?? [];
  console.log(query, organic.slice(0, 5).map((r) => new URL(r.link ?? r.url).hostname).join(', '));
  return {query, data};
}));
for (const [i, result] of settled.entries()) {
  if (result.status === 'fulfilled') serps.push(result.value);
  else serps.push({query: pending[i], error: result.reason.message});
}
fs.writeFileSync(serpPath, JSON.stringify({checkedAt: new Date().toISOString(), provider: 'BrightData SERP API', zone, geo: 'US', language: 'en', serps}, null, 2));
if (serps.some((x) => x.error)) console.log('failed', serps.filter((x) => x.error).map((x) => x.query).join(', '));
if (process.env.SKIP_TRENDS) process.exit(0);

const trendSets = [
  ['canva alternative', 'canva video templates', 'motion graphics templates', 'remotion', 'ai motion graphics'],
  ['ai video generator', 'capcut templates', 'canva video editor', 'video templates', 'remotion'],
];
const trends = [];
for (const set of trendSets) {
  const p = new URLSearchParams({engine: 'google_trends', q: set.join(','), geo: 'US', hl: 'en', date: 'today 5-y', data_type: 'TIMESERIES', api_key: serpapi});
  const response = await fetch(`https://serpapi.com/search.json?${p}`);
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(`Trends failed: ${data.error ?? response.status}`);
  delete data.search_parameters?.api_key;
  trends.push({set, data});
}
fs.writeFileSync(path.join(out, 'google-trends.json'), JSON.stringify({checkedAt: new Date().toISOString(), provider: 'SerpApi Google Trends', geo: 'US', range: 'today 5-y', trends}, null, 2));
console.log('trends saved');
