import React from "react";

const Skeleton = ({ className = "", width = "w-full", height = "h-4" }) => {
  return (
    <div
      className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`}
    />
  );
};

export const SkeletonText = ({ lines = 3, className = "" }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? "w-3/4" : "w-full"}
          className="h-4"
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <Skeleton className="h-6 w-3/4 mb-4" />
      <SkeletonText lines={4} className="mb-4" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

export const SkeletonForm = ({ className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <Skeleton className="h-6 w-1/4 mb-6" />
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-10 w-1/3 mx-auto" />
      </div>
    </div>
  );
};

export default Skeleton;
