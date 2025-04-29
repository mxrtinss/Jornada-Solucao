import React from 'react';

interface DateTimeInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  max?: string;
  min?: string;
  required?: boolean;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  max,
  min,
  required = false,
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="datetime-local"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className={`
          block w-full rounded-md sm:text-sm py-2 px-3
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-0
          touch-manipulation
        `}
        required={required}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default DateTimeInput;
