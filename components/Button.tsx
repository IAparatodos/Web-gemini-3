import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  type = 'button'
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-md flex items-center justify-center gap-2";
  
  let variantStyles = "";
  
  switch (variant) {
    case 'primary':
      // Primary color background, dark text for contrast as per brand guidelines
      variantStyles = "bg-adria-primary text-adria-dark hover:bg-teal-300";
      break;
    case 'secondary':
      variantStyles = "bg-adria-dark text-white hover:bg-adria-secondary";
      break;
    case 'outline':
      variantStyles = "border-2 border-adria-primary text-adria-primary hover:bg-adria-primary hover:text-adria-dark";
      break;
  }

  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};