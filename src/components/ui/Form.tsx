import React from 'react';

// Label Component
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ children, required, className = '', ...props }) => (
  <label className={`block text-xs font-bold text-stone-700 mb-1 ${className}`} {...props}>
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className = '',
      containerClassName = '',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-stone-400 pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            required={required}
            className={`w-full text-sm bg-white border rounded-xl px-3 py-2.5 transition-all text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 disabled:bg-stone-100 disabled:text-stone-500 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon ? 'pr-9' : ''} ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'border-stone-300 focus:border-amber-800 focus:ring-amber-800/20'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-stone-400 pointer-events-none flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-stone-500 mt-1">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', containerClassName = '', id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          required={required}
          className={`w-full text-sm bg-white border rounded-xl p-3 transition-all text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 disabled:bg-stone-100 disabled:cursor-not-allowed ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-stone-300 focus:border-amber-800 focus:ring-amber-800/20'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-stone-500 mt-1">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// Select Component
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options?: SelectOption[];
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      children,
      className = '',
      containerClassName = '',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <select
          id={inputId}
          ref={ref}
          required={required}
          className={`w-full text-sm bg-white border rounded-xl px-3 py-2.5 transition-all text-stone-900 focus:outline-none focus:ring-2 disabled:bg-stone-100 disabled:cursor-not-allowed ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-stone-300 focus:border-amber-800 focus:ring-amber-800/20'
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error ? (
          <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-stone-500 mt-1">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = 'Select';

// Checkbox Component
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  sublabel?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, sublabel, error, className = '', id, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div>
        <label htmlFor={inputId} className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            id={inputId}
            type="checkbox"
            ref={ref}
            className={`mt-0.5 rounded text-amber-800 focus:ring-amber-800/30 w-4 h-4 cursor-pointer border-stone-300 ${className}`}
            {...props}
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800">{label}</span>
            {sublabel && <p className="text-stone-500 text-[11px] mt-0.5">{sublabel}</p>}
          </div>
        </label>
        {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
