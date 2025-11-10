import React, { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-3 py-2 bg-bg-primary border rounded-md text-text-primary placeholder-text-secondary',
            'focus:outline-none focus:border-accent-emphasis focus:ring-1 focus:ring-accent-emphasis',
            'transition-colors',
            error ? 'border-danger' : 'border-border-default',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-text-secondary">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
