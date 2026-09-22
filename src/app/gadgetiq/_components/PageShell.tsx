import React from "react";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function PageShell({ children, className = "", id }: PageShellProps) {
  return (
    <section id={id} className={`relative z-10 px-5 py-20 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
