import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const env = Object.fromEntries(fs.readFileSync('/Users/nimaboustanian/Projects/lovd-by-ai-28/supabase/.env', 'utf8').split('\n').filter((l) => /^[A-Z0-9_]+=/.test(l)).map((l) => {
  const i = l.indexOf('=');
  return [l.slice(0, i), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
}));
// Check whether high-volume terms are really video-template intent.
const queries = ['slideshow template', 'audiogram', 'lower thirds', 'launch countdown', 'logo animation', 'lyric video maker',
  'kinetic typography', 'youtube end screen template', 'opening titles', 'tiktok templates', 'countdown video', 'logo reveal', 'title animation'];
const serps = await Promise.all(queries.map(async (query) => {
  const params = new URLSearchParams({engine: 'google', q: query, gl: 'us', hl: 'en', google_domain: 'google.com', num: '10', api_key: env.SERPAPI_API_KEY});
  const response = await fetch(`https://serpapi.com/search.json?${params}`);
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(`${query}: ${data.error ?? response.status}`);
  delete data.search_parameters?.api_key;
  return {query, data};
}));
fs.writeFileSync(path.join(root, 'raw', 'intent-serps.json'), JSON.stringify({checkedAt: new Date().toISOString(), provider: 'SerpApi Google Search', geo: 'US', serps}, null, 2));
for (const {query, data} of serps) {
  const organic = (data.organic_results ?? []).slice(0, 7).map((r) => `  ${r.position}. ${new URL(r.link).hostname} - ${r.title}`);
  console.log(`\n${query} | video results: ${data.inline_videos ? 'yes' : 'no'}\n${organic.join('\n')}`);
}
