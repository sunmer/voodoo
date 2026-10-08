import {useEffect, useState} from 'react';
import {variants} from './catalog/catalog';
import {Editor} from './ui/Editor';
import {Gallery} from './ui/Gallery';
import {SiteFooter, PrivacyPage} from './ui/Privacy';
import {trackPage} from './services/analytics';
import {SharedVideo} from './ui/SharedVideo';
import {SavedVideo} from './ui/SavedVideo';
import {BenchmarkBanner} from './ui/BenchmarkBanner';

type Route = {view: 'editor'; id: string} | {view: 'shared'; id: string; openShare?: boolean} | {view: 'saved'; id: string} | {view: 'gallery'; params: URLSearchParams} | {view: 'privacy'};

function readRoute(): Route {
  const shared = location.pathname.match(/^\/s\/([A-Za-z0-9_-]{24,64})\/?$/);
  if (shared && !location.hash) return {view: 'shared', id: shared[1]};
  const hash = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  const saved = hash.match(/^d\/([A-Za-z0-9_-]{24,64})$/);
  if (saved) return {view: 'saved', id: saved[1]};
  const published = hash.match(/^s\/([A-Za-z0-9_-]{24,64})(\?share=1)?$/);
  if (published) return {view: 'shared', id: published[1], openShare: !!published[2]};
  if (hash === 'privacy') return {view: 'privacy'};
  const m = hash.match(/^v\/([^?]+)/);
  if (m) return {view: 'editor', id: m[1]};
  return {view: 'gallery', params: new URLSearchParams(hash.split('?')[1] ?? '')};
}

export function App() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const variant = route.view === 'editor' ? variants.find((v) => v.id === route.id) : undefined;
  useEffect(() => {
    window.scrollTo(0, 0);
    if (route.view !== 'shared') document.title = variant ? `${variant.title} | cliphou.se` : route.view === 'privacy' ? 'Privacy | cliphou.se' : 'cliphou.se';
    trackPage(route.view === 'shared' ? 'shared-video' : route.view === 'privacy' ? 'privacy' : variant?.id);
  }, [variant?.id, route.view]);

  const template = route.view === 'gallery' ? route.params.get('template') : null;
  return <>
    <BenchmarkBanner />
    {route.view === 'saved' ? <SavedVideo key={route.id} id={route.id} /> : route.view === 'shared' ? <SharedVideo key={route.id} id={route.id} openShare={route.openShare} /> : variant ? <Editor key={variant.id} variant={variant} /> : route.view === 'privacy' ? <PrivacyPage /> : <Gallery key={template ?? 'all'} initialTemplate={template} />}
    <SiteFooter />
  </>;
}
