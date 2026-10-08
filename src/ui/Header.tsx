import {FlaskConical, Scissors} from 'lucide-react';
import type {ReactNode} from 'react';
import {AccountButton} from './Account';

export function Header({children}: {children?: ReactNode}) {
  return (
    <header className="topbar">
      <a className="logo" href="#/">
        <Scissors size={22} />
        cliphou.se
      </a>
      <a href={`${import.meta.env.BASE_URL}benchmark/`} className="icon-btn" aria-label="Motion Graphics Benchmark" title="Motion Graphics Benchmark"><FlaskConical size={17} /></a>
      <div className="topbar-slot">{children}</div>
      <AccountButton />
    </header>
  );
}
