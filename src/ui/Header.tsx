import {Scissors} from 'lucide-react';
import type {ReactNode} from 'react';
import {AccountButton} from './Account';

export function Header({children}: {children?: ReactNode}) {
  return (
    <header className="topbar">
      <a className="logo" href="#/">
        <Scissors size={22} />
        cliphou.se
      </a>
      <div className="topbar-slot">{children}</div>
      <AccountButton />
    </header>
  );
}
