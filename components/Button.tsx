import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "py-4 px-6 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/50",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white shadow-slate-900/50",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-red-900/50",
    outline: "bg-transparent border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500/10"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};