import React, { forwardRef, InputHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

export interface InputFieldProps extends InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
}

const InputField = forwardRef<
  HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement,
  InputFieldProps
>(
  (
    {
      label,
      error,
      icon,
      required,
      as = "input",
      options,
      className = "",
      ...props
    },
    ref,
  ) => {
    // Base classes for the wrapper and label
    const hasError = !!error;

    const inputBaseClasses = `
      w-full px-4 py-3 bg-white border rounded-xl text-sm transition-all duration-200 outline-none
      ${icon ? "pl-11" : ""}
      ${
        hasError
          ? "border-red-500 text-red-900 focus:ring-4 focus:ring-red-500/10 focus:border-red-500"
          : "border-gray-200 text-gray-800 focus:border-primary focus:ring-4 focus:ring-primary/10"
      }
      disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
    `;

    return (
      <div className='w-full flex flex-col space-y-1.5'>
        {/* Label */}
        <label className='text-[11px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center'>
          <span>{label}</span>
          {required && <span className='text-primary ml-1 text-xs'>*</span>}
        </label>

        {/* Input Wrapper */}
        <div className='relative rounded-xl'>
          {/* Icon indicator */}
          {icon && (
            <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400'>
              {icon}
            </div>
          )}

          {/* Render target element */}
          {as === "textarea" ? (
            <textarea
              ref={ref}
              className={`${inputBaseClasses} min-h-[100px] resize-y py-2.5 ${className}`}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : as === "select" ? (
            <select
              ref={ref}
              className={`${inputBaseClasses} appearance-none pr-10 ${className}`}
              {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
            >
              {options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              ref={ref}
              className={`${inputBaseClasses} ${className}`}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {/* Custom Dropdown Chevron Icon for select */}
          {as === "select" && (
            <div className='absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400'>
              <svg
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2.5}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          )}
        </div>

        {/* Dynamic Validation Error Message */}
        {hasError && (
          <div className='flex items-center space-x-1 mt-1 text-xs text-red-600 font-medium animate-fadeIn'>
            <AlertCircle className='h-4 w-4 shrink-0' />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
