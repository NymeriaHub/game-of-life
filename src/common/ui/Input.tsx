import React from 'react';

interface InputProps {
  id?: string;
  label?: string;
  value: string | number | '';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: 'text' | 'number' | 'email' | 'password';
  min?: string | number;
  max?: string | number;
  placeholder?: string;
  className?: string;
}

export const Input = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  disabled = false,
  type = 'text',
  min,
  max,
  placeholder,
  className = '',
}: InputProps) => {
  const baseClasses =
    'w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm ' +
    'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ' +
    'transition-colors duration-200 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 ' +
    'text-gray-900 placeholder-gray-400';

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        min={min}
        max={max}
        placeholder={placeholder}
        className={`${baseClasses} ${className}`}
      />
    </div>
  );
};
