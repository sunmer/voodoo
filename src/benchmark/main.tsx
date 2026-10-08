import {createRoot, hydrateRoot} from 'react-dom/client';
import {BenchmarkPage} from './BenchmarkPage';
import '@fontsource-variable/archivo';
import '../article.css';

const root = document.getElementById('root')!;
const edition = /\/benchmark\/2026-10\/?$/.test(location.pathname);
const page = <BenchmarkPage base={import.meta.env.BASE_URL} edition={edition} />;
if (root.hasChildNodes()) hydrateRoot(root, page);
else createRoot(root).render(page);
