import React from "react";

export const Input = React.forwardRef(({
  label,
  error,
  className = "",
  helperText,
  icon: Icon,
  ...props
}, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-2 rounded-lg border transition-colors
          bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-50
          placeholder-slate-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          dark:focus:ring-offset-slate-900
          disabled:opacity-50 disabled:cursor-not-allowed
          ${Icon ? "pl-10" : ""}
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
          }
          ${className}
        `}
        {...props}
      />
    </div>
    {error && (
      <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
    )}
    {helperText && !error && (
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
    )}
  </div>
));

Input.displayName = "Input";

export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  className = "",
  ...props
}, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
    )}
    <select
      ref={ref}
      className={`
        w-full px-4 py-2 rounded-lg border transition-colors
        bg-white dark:bg-slate-800
        text-slate-900 dark:text-slate-50
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        dark:focus:ring-offset-slate-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
        }
        ${className}
      `}
      {...props}
    >
      <option value="">Select an option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
    )}
  </div>
));

Select.displayName = "Select";

export const Textarea = React.forwardRef(({
  label,
  error,
  rows = 4,
  className = "",
  ...props
}, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      rows={rows}
      className={`
        w-full px-4 py-2 rounded-lg border transition-colors resize-none
        bg-white dark:bg-slate-800
        text-slate-900 dark:text-slate-50
        placeholder-slate-400 dark:placeholder-slate-500
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        dark:focus:ring-offset-slate-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
        }
        ${className}
      `}
      {...props}
    />
    {error && (
      <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
    )}
  </div>
));

Textarea.displayName = "Textarea";
