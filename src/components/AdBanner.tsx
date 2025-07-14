import React from 'react';
import { useTranslation } from 'next-i18next';
import GoogleAd from './GoogleAd';

interface AdBannerProps {
  client: string;
  slot: string;
  format?: string;
  responsive?: boolean;
  showTitle?: boolean;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({
  client,
  slot,
  format = 'auto',
  responsive = true,
  showTitle = true,
  className = '',
}) => {
  const { t } = useTranslation('common');
  
  // Don't render anything if client or slot is not available
  if (!client || !slot) {
    return null;
  }
  
  return (
    <div className={`card ${className}`}>
      {showTitle && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-appleGray-500 mb-1">{t('ads.title')}</h4>
          <p className="text-xs text-appleGray-400">{t('ads.description')}</p>
        </div>
      )}
      <div className="ad-container">
        <GoogleAd
          client={client}
          slot={slot}
          format={format}
          responsive={responsive}
        />
      </div>
    </div>
  );
};

export default AdBanner; 