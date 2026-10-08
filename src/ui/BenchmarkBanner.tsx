import {ArrowRight} from 'lucide-react';

export function BenchmarkBanner() {
  return (
    <a className="benchmark-banner" href={`${import.meta.env.BASE_URL}benchmark/`}>
      <span><strong>New monthly benchmark:</strong> see which AI models make the best motion graphics before you choose one.</span>
      <span className="benchmark-banner-action">Compare models <ArrowRight size={14} aria-hidden="true" /></span>
    </a>
  );
}
