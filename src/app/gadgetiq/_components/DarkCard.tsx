import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function DarkCard({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-[22px] border border-[#DDE4F3] bg-white text-[#17284D] shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
