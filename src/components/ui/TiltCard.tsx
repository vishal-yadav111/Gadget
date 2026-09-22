"use client";

import React, { useRef, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface TiltCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = "", ...props }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; rotateX: number; rotateY: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate subtle tilt (-4deg to 4deg)
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = (0.5 - (y / rect.height)) * 8;

    setCoords({ x, y, rotateX, rotateY });
    if (props.onMouseMove) props.onMouseMove(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setCoords(null);
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: coords ? `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg)` : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transition: coords ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
      }}
      className={`group relative overflow-hidden transition-shadow duration-300 ${className}`}
      {...(props as any)}
    >
      {/* Lightweight Spotlight Overlay */}
      {coords && (
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 240px at ${coords.x}px ${coords.y}px, rgba(0, 82, 204, 0.08), transparent 70%)`,
          }}
        />
      )}
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}

