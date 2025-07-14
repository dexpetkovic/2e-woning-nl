import React from 'react';
import { useTranslation } from 'next-i18next';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  optional?: boolean;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = '0',
  optional = false,
  className = '',
}) => {
  const { t } = useTranslation('common');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters except decimal point
    const sanitizedValue = e.target.value.replace(/[^0-9.]/g, '');
    
    // Convert to number or 0 if empty
    const numericValue = sanitizedValue === '' ? 0 : parseFloat(sanitizedValue);
    
    // Check if it's a valid number
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-appleGray-700 mb-2 font-medium">
        {label}
        {optional && <span className="text-appleGray-400 text-sm ml-1">({t('optional')})</span>}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-appleGray-400 text-lg">
          €
        </span>
        <input
          type="text"
          value={value === 0 ? '' : value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-appleGray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-lg transition-all"
        />
      </div>
    </div>
  );
};

export default InputField; 