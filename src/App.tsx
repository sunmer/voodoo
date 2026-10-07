import {useEffect, useState} from 'react';
import {Gallery} from './ui/Gallery';
import {Editor} from './ui/Editor';
import {entries} from './catalog/catalog';

const readRoute = () => decodeURIComponent(location.hash.replace(/^#\/?v\//, '').replace(/^#\/?/, ''));

export function App() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const entry = entries.find((e) => e.id === route);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [entry?.id]);

  return entry ? <Editor key={entry.id} entry={entry} /> : <Gallery />;
}
