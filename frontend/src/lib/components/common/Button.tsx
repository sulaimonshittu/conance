import React from 'react';
//import Loader from './Loader';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    loadingText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className = '',
            variant = 'primary',
            size = 'md',
            isLoading = false,
            loadingText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            children,
            disabled,
            type = 'button',
            ...props
        },
        ref
    ) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:bg-gray-500 disabled:cursor-not-allowed active:scale-[0.98]';

        const variants: Record<ButtonVariant, string> = {
            primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
            secondary: 'bg-primary2 text-white hover:bg-primary2/90 focus:ring-primary2',
            outline: 'border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary',
            ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
            danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        };

        const sizes: Record<ButtonSize, string> = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-base',
            lg: 'px-8 py-3.5 text-lg',
        };

        const widthStyles = fullWidth ? 'w-full' : '';

        const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${className}`.trim();

        return (
            <button
                ref={ref}
                type={type}
                className={combinedClassName}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center gap-2 ">
                        {/*
                        <Loader size="sm" />
                         */}
                        {loadingText && <span>{loadingText}</span>}
                    </div>
                ) : (
                    <>
                        {leftIcon && <span className="mr-2">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="ml-2">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;