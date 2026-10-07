import {Sparkles} from 'lucide-react';
import type {ReactNode} from 'react';

export function Header({children}: {children?: ReactNode}) {
  return (
    <header className="topbar">
      <a className="logo" href="#/">
        <Sparkles size={18} />
        voodoo
      </a>
      <div className="topbar-slot">{children}</div>
    </header>
  );
}
