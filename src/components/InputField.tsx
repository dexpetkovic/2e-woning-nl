import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  optional?: boolean;
  help?: string;
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
  help,
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

  // flex-col + mt-auto on the input wrapper keeps the input pinned to the
  // bottom of the cell, so inputs across a grid row line up even when one
  // label wraps to two lines.
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 mb-1.5">
        <label className="text-[12.5px] text-appleGray-700 font-medium leading-tight">
          {label}
          {optional && <span className="text-appleGray-500 ml-1 font-normal">({t('optional')})</span>}
        </label>
        {help && (
          <span className="font-mono text-[10.5px] uppercase tracking-[.1em] text-appleGray-500 leading-tight">
            {help}
          </span>
        )}
      </div>
      <div className="relative mt-auto">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-appleGray-500 font-mono text-sm pointer-events-none">
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
          className="w-full pl-7 pr-3.5 py-3 border border-appleGray-200 rounded-xl bg-white font-mono text-[15px] font-medium text-appleGray-900 focus:outline-none focus:border-appleGray-900 focus:ring-[3px] focus:ring-accent-500/20 transition-all"
        />
      </div>
    </div>
  );
};

export default InputField;
