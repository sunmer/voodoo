import {ArrowUpRight, Scissors} from 'lucide-react';
import React, {type ReactNode} from 'react';

export function ArticleLayout({base, children}: {base: string; children: ReactNode}) {
  return <div className="article-site">
    <a className="article-skip" href="#article">Skip to content</a>
    <header className="article-header">
      <a className="article-brand" href={base}><Scissors size={22} aria-hidden="true" />cliphou.se</a>
      <nav aria-label="Main navigation">
        <a href={`${base}benchmark/`} aria-current="page">Benchmark</a>
        <a href={base}>Templates <ArrowUpRight size={14} aria-hidden="true" /></a>
      </nav>
    </header>
    <main id="article" className="article-main">{children}</main>
    <footer className="article-footer">
      <a className="article-brand" href={base}><Scissors size={18} aria-hidden="true" />cliphou.se</a>
      <nav aria-label="Footer">
        <a href={`${base}about/`}>About</a>
        <a href={`${base}benchmark/`}>Benchmark</a>
        <a href={`${base}license/`}>License</a>
        <a href={`${base}#/privacy`}>Privacy</a>
      </nav>
    </footer>
  </div>;
}
