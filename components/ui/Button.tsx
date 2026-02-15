import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
    size?: 'sm' | 'md' | 'lg';
    prefixIcon?: ReactNode;
    suffixIcon?: ReactNode;
    href?: string;
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    prefixIcon,
    suffixIcon,
    href,
    className = '',
    ...props
}: ButtonProps) => {
    // Base styles
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full tracking-wide active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    // Size styles
    const sizeStyles = {
        sm: "text-sm px-4 py-2 gap-2",
        md: "text-base px-6 py-3 gap-2.5",
        lg: "text-lg px-8 py-4 gap-3",
    };

    // Variant styles
    const variantStyles = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-md",
        secondary: "bg-secondary text-black hover:bg-secondary/80 shadow-md",
        outline: "border border-current bg-transparent hover:bg-white/10",
        ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
        white: "bg-white text-black hover:bg-secondary hover:text-white shadow-lg hover:shadow-xl",
    };

    const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

    // Render as Link if href is provided
    if (href) {
        return (
            <Link href={href} className={combinedClasses} role="button">
                {prefixIcon && <span className="shrink-0">{prefixIcon}</span>}
                <span>{children}</span>
                {suffixIcon && <span className="shrink-0">{suffixIcon}</span>}
            </Link>
        );
    }

    // Render as classic button
    return (
        <button className={combinedClasses} {...props}>
            {prefixIcon && <span className="shrink-0">{prefixIcon}</span>}
            <span>{children}</span>
            {suffixIcon && <span className="shrink-0">{suffixIcon}</span>}
        </button>
    );
};

export default Button;
