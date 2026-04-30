import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  optional?: boolean;
  className?: string;
}

const formatForDisplay = (value: number): string => {
  if (value === 0) return '';
  return value.toLocaleString('nl-NL', { maximumFractionDigits: 2 });
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = '0',
  optional = false,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const [focused, setFocused] = useState(false);

  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^0-9.]/g, '');
    const numeric = sanitized === '' ? 0 : parseFloat(sanitized);
    if (!isNaN(numeric)) {
      onChange(numeric);
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-appleGray-700 mb-2 font-medium text-base">
        {label}
        {optional && <span className="text-appleGray-400 text-sm ml-1">({t('optional')})</span>}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-appleGray-400 text-lg pointer-events-none">
          €
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={focused ? (numericValue === 0 ? '' : String(numericValue)) : formatForDisplay(numericValue)}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3.5 border border-appleGray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-lg transition-all hover:border-appleGray-300"
        />
      </div>
    </div>
  );
};

export default InputField;
