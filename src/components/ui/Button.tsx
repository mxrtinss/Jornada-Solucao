import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "info" | "success" | "warning" | "danger";
  size?: "default" | "sm" | "lg";
  leftIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", leftIcon, children, ...props }, ref) => {
    const variants = {
      primary: "bg-teal-600 text-white hover:bg-teal-700",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      outline: "border border-gray-300 hover:bg-gray-50",
      ghost: "hover:bg-gray-100",
      info: "bg-blue-600 text-white hover:bg-blue-700",
      success: "bg-green-600 text-white hover:bg-green-700",
      warning: "bg-yellow-600 text-white hover:bg-yellow-700",
      danger: "bg-red-600 text-white hover:bg-red-700"
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8"
    }

    return (
      <button
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

