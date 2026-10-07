import {useEffect, useState} from 'react';
import {variants} from './catalog/catalog';
import {Editor} from './ui/Editor';
import {Gallery} from './ui/Gallery';

type Route = {view: 'editor'; id: string} | {view: 'gallery'; params: URLSearchParams};

function readRoute(): Route {
  const hash = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
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
  }, [variant?.id]);

  if (variant) return <Editor key={variant.id} variant={variant} />;
  const template = route.view === 'gallery' ? route.params.get('template') : null;
  return <Gallery key={template ?? 'all'} initialTemplate={template} />;
}
