'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  placement: 'top-banner' | 'sidebar' | 'in-article' | 'between-cards' | 'footer';
  className?: string;
  style?: React.CSSProperties;
}

const adSizes: Record<AdSlotProps['placement'], { width: string; height: string; label: string }> = {
  'top-banner': { width: '728px', height: '90px', label: 'Leaderboard 728×90' },
  sidebar: { width: '300px', height: '250px', label: 'Medium Rectangle 300×250' },
  'in-article': { width: '468px', height: '60px', label: 'Banner 468×60' },
  'between-cards': { width: '728px', height: '90px', label: 'Leaderboard 728×90' },
  footer: { width: '728px', height: '90px', label: 'Leaderboard 728×90' },
};

export default function AdSlot({ placement, className = '', style }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  
  // Map placements to specific slot IDs from env
  const getSlotId = (p: string) => {
    switch(p) {
      case 'in-article': return process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE || process.env.NEXT_PUBLIC_AD_SLOT_AUTO;
      case 'top-banner': return process.env.NEXT_PUBLIC_AD_SLOT_POSTER || process.env.NEXT_PUBLIC_AD_SLOT_AUTO;
      default: return process.env.NEXT_PUBLIC_AD_SLOT_AUTO;
    }
  };

  const slotId = getSlotId(placement);
  const size = adSizes[placement];

  useEffect(() => {
    // Push AdSense ad
    if (clientId && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [clientId, slotId]);

  if (clientId) {
    return (
      <div className={`ad-container overflow-hidden w-full flex justify-center ${className}`} style={style}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', ...style }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Placeholder for development
  return (
    <div
      ref={adRef}
      className={`ad-placeholder bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 text-xs gap-1 ${className}`}
      style={{ width: size.width, height: size.height, maxWidth: '100%', ...style }}
    >
      <span className="font-semibold uppercase tracking-wider">Advertisement</span>
      <span>{size.label}</span>
    </div>
  );
}
