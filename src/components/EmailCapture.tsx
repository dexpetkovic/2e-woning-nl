import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

const EmailCapture: React.FC = () => {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="card p-5 bg-accent-500/5 border-accent-500/30">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-accent-500/15 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-appleGray-900 text-sm">{t('email.successTitle')}</p>
            <p className="text-appleGray-600 text-xs mt-0.5 leading-relaxed">{t('email.successBody')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-accent-500/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-appleGray-900 text-sm leading-snug">{t('email.title')}</p>
          <p className="text-appleGray-600 text-[12.5px] mt-0.5 leading-relaxed">{t('email.description')}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
          placeholder={t('email.placeholder')}
          required
          aria-invalid={status === 'error'}
          className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border bg-white text-sm font-sans focus:outline-none transition-all ${
            status === 'error'
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
              : 'border-appleGray-200 hover:border-appleGray-300 focus:border-appleGray-900 focus:ring-[3px] focus:ring-accent-500/20'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn btn-primary text-sm py-2.5 px-5 disabled:opacity-60 whitespace-nowrap justify-center"
        >
          {status === 'loading' ? '…' : t('email.cta')}
        </button>
      </form>
      {status === 'error' && (
        <div className="flex items-start gap-1.5 mt-2.5 text-[12.5px] text-red-600">
          <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
          </svg>
          <span>{t('email.error')}</span>
        </div>
      )}
      <p className="font-mono text-[10px] uppercase tracking-[.14em] text-appleGray-500 mt-3">
        Eén mail · uitschrijven met één klik
      </p>
    </div>
  );
};

export default EmailCapture;
