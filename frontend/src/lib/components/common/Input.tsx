import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, type = 'text', fullWidth = true, className = '', id, required, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

        const isPassword = type === 'password';
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

        const baseInputStyles = `
            block w-full text-b2 text-text-color
            transition-all duration-200 outline-none
            placeholder:text-gray-400
            
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        `;

        const containerStyles = `${fullWidth ? 'w-full' : 'w-auto'} border border-accent bg-text-muted/5 px-s2 py-s1 rounded-md
        ${error
                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary'
            }`;

        return (
            <div className={containerStyles}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-b3 font-semibold text-text-muted/70 mb-s1 flex items-center gap-1"
                    >
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}

                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        type={inputType}
                        className={`${baseInputStyles} ${className} ${isPassword ? 'pr-12' : ''}`}
                        required={required}
                        {...props}
                    />

                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-s2 flex items-center text-gray-400 hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    )}
                </div>

                {error ? (
                    <p className="mt-s1 text-[12px] text-red-500 font-medium">
                        {error}
                    </p>
                ) : helperText ? (
                    <p className="mt-s1 text-[12px] text-text-muted">
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;