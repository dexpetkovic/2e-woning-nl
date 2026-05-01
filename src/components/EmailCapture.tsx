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
      <div className="card bg-accent-500/5 border-accent-500/20 flex items-start gap-4">
        <div className="w-9 h-9 rounded-full bg-accent-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-appleGray-900 text-sm">{t('email.successTitle')}</p>
          <p className="text-appleGray-500 text-xs mt-0.5">{t('email.successBody')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-accent-500/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-appleGray-900 text-sm">{t('email.title')}</p>
          <p className="text-appleGray-500 text-xs mt-0.5">{t('email.description')}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email.placeholder')}
          required
          className="flex-1 px-4 py-2.5 rounded-xl border border-appleGray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn btn-primary text-sm py-2.5 px-5 disabled:opacity-60 whitespace-nowrap"
        >
          {status === 'loading' ? '…' : t('email.cta')}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-500 text-xs mt-2">{t('email.error')}</p>
      )}
    </div>
  );
};

export default EmailCapture;
