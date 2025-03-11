import React, { useEffect } from 'react';

interface GoogleAdProps {
  client: string;
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

const GoogleAd: React.FC<GoogleAdProps> = ({
  client,
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}) => {
  useEffect(() => {
    // Load Google AdSense script if it hasn't been loaded yet
    const hasAdScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
    
    if (!hasAdScript) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
    
    // Push the ad to Google AdSense
    try {
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
    } catch (error) {
      console.error('Error loading Google AdSense:', error);
    }
  }, [client]);

  return (
    <div className={`google-ad ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default GoogleAd;

// Add the adsbygoogle type to the Window interface
declare global {
  interface Window {
    adsbygoogle: any[];
  }
} 