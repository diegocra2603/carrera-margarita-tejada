import React from 'react';

interface MenuButtonProps {
  href: string;
  variant?: 'primary' | 'secondary';
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'auto' | string;
  children: React.ReactNode;
}

export default function MenuButton({ href, variant = 'primary', width = 'md', children }: MenuButtonProps) {
  const baseClasses = "font-bold py-2 px-6 rounded-full text-sm transition duration-300 ease-in-out";
  
  const variantClasses = {
    primary: "bg-yellow-500 text-blue-900 hover:bg-transparent hover:text-yellow-500 hover:border hover:border-yellow-500",
    secondary: "bg-blue-600 text-white hover:bg-transparent hover:text-blue-600 hover:border hover:border-blue-600"
  };

  const widthClasses = {
    sm: "sm:w-[80px] w-[50px]",
    md: "sm:w-[100px] w-[60px]",
    lg: "sm:w-[120px] w-[80px]",
    xl: "sm:w-[150px] w-[100px]",
    auto: "w-auto",
    custom: typeof width === 'string' && !['sm', 'md', 'lg', 'xl', 'auto'].includes(width) ? `w-[${width}]` : "sm:w-[100px] w-[60px]"
  };

  const finalWidthClass = typeof width === 'string' && !['sm', 'md', 'lg', 'xl', 'auto'].includes(width) 
    ? `w-[${width}]` 
    : widthClasses[width as keyof typeof widthClasses] || widthClasses.md;

  return (
    <button className={finalWidthClass}>
      <a href={href} className={`${baseClasses} ${variantClasses[variant]}`}>
        {children}
      </a>
    </button>
  );
}
