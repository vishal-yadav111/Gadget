"use client";

export default function SectionSkeleton() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center py-20 px-6 md:px-12 bg-brand-bg-deep/30 relative overflow-hidden animate-pulse">
      <div className="max-w-7xl mx-auto w-full space-y-8 flex flex-col items-center">
        {/* Eyebrow placeholder */}
        <div className="h-6 w-32 bg-slate-200 rounded-full" />
        
        {/* Title placeholder */}
        <div className="h-12 w-2/3 sm:w-1/2 bg-slate-200 rounded-lg" />
        
        {/* Desc placeholder */}
        <div className="h-4 w-3/4 sm:w-1/3 bg-slate-100 rounded" />
        
        {/* Grid placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-10">
          <div className="h-48 bg-slate-100/80 rounded-2xl border border-brand-border/40" />
          <div className="h-48 bg-slate-100/80 rounded-2xl border border-brand-border/40" />
          <div className="h-48 bg-slate-100/80 rounded-2xl border border-brand-border/40" />
        </div>
      </div>
    </div>
  );
}
