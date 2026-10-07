import {useEffect, useState} from 'react';
import {variants} from './catalog/catalog';
import {Editor} from './ui/Editor';
import {Gallery} from './ui/Gallery';
import {SiteFooter, PrivacyPage} from './ui/Privacy';
import {trackPage} from './services/analytics';

type Route = {view: 'editor'; id: string} | {view: 'gallery'; params: URLSearchParams} | {view: 'privacy'};

function readRoute(): Route {
  const hash = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
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
    document.title = variant ? `${variant.title} | cliphou.se` : route.view === 'privacy' ? 'Privacy | cliphou.se' : 'cliphou.se';
    trackPage(route.view === 'privacy' ? 'privacy' : variant?.id);
  }, [variant?.id, route.view]);

  const template = route.view === 'gallery' ? route.params.get('template') : null;
  return <>
    {variant ? <Editor key={variant.id} variant={variant} /> : route.view === 'privacy' ? <PrivacyPage /> : <Gallery key={template ?? 'all'} initialTemplate={template} />}
    <SiteFooter />
  </>;
}
