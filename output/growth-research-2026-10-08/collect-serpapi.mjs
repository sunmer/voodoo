import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const env = Object.fromEntries(fs.readFileSync('/Users/nimaboustanian/Projects/lovd-by-ai-28/supabase/.env', 'utf8').split('\n').filter((l) => /^[A-Z0-9_]+=/.test(l)).map((l) => {
  const i = l.indexOf('=');
  return [l.slice(0, i), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
}));
const queries = [
  'canva alternative', 'open source canva alternative', 'canva video templates', 'free video templates',
  'motion graphics templates', 'ai motion graphics generator', 'remotion templates', 'claude video generator',
  'instagram reel templates', 'product launch video template',
];
const serps = await Promise.all(queries.map(async (query) => {
  const params = new URLSearchParams({engine: 'google', q: query, gl: 'us', hl: 'en', google_domain: 'google.com', num: '10', api_key: env.SERPAPI_API_KEY});
  const response = await fetch(`https://serpapi.com/search.json?${params}`);
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(`${query}: ${data.error ?? response.status}`);
  delete data.search_parameters?.api_key;
  return {query, data};
}));
fs.writeFileSync(path.join(root, 'raw', 'serpapi-serps.json'), JSON.stringify({checkedAt: new Date().toISOString(), provider: 'SerpApi Google Search', geo: 'US', language: 'en', serps}, null, 2));
for (const {query, data} of serps) {
  const organic = (data.organic_results ?? []).slice(0, 8).map((r) => `${r.position}. ${new URL(r.link).hostname} - ${r.title}`);
  console.log(`\n${query}\nAI overview: ${data.ai_overview ? 'yes' : 'no'}\n${organic.join('\n')}`);
}
