import React from "react";

export const ProductSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 animate-pulse">
        <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3 w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-full" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-6 w-2/3" />
        <div className="flex justify-between gap-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

export const CartItemSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border rounded-lg animate-pulse">
        <div className="h-24 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-2/3" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-3 w-1/2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

export const FormSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i}>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-1/4" />
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    ))}
    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full" />
  </div>
);

export const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mt-4" />
        <div className="space-y-2 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          ))}
        </div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full mt-6" />
      </div>
    </div>
  </div>
);
