import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const FormField = forwardRef(({ 
  label, 
  name, 
  type = 'text', 
  error, 
  required = false,
  placeholder,
  description,
  className,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          ref={ref}
          id={name}
          name={name}
          placeholder={placeholder}
          aria-label={label || name}
          aria-describedby={error ? `${name}-error` : description ? `${name}-description` : undefined}
          className={cn(
            "w-full px-3 py-2 border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-colors resize-none",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
      ) : (
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          aria-label={label || name}
          aria-describedby={error ? `${name}-error` : description ? `${name}-description` : undefined}
          className={cn(
            "w-full px-3 py-2 border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-colors",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
      )}
      
      {description && (
        <p id={`${name}-description`} className="text-xs text-foreground/60">{description}</p>
      )}
      
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1" role="alert">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField; 