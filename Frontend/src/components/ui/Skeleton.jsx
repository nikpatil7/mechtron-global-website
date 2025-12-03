export function Skeleton({ className = '', variant = 'rectangular', animation = true }) {
  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200';
  
  const variantClasses = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
    card: 'rounded-xl'
  };

  const animClass = animation ? 'animate-pulse' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animClass} ${className}`}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <Skeleton className="w-full h-56" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <Skeleton variant="circular" className="w-16 h-16 mb-4" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="bg-white p-10 md:p-14 rounded-2xl shadow-2xl border border-gray-200">
      <div className="flex justify-center gap-2 mb-8">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="circular" className="w-5 h-5" />
        ))}
      </div>
      <Skeleton className="h-6 w-full mb-4 mx-auto max-w-3xl" />
      <Skeleton className="h-6 w-5/6 mb-4 mx-auto max-w-3xl" />
      <Skeleton className="h-6 w-4/6 mb-10 mx-auto max-w-3xl" />
      <div className="flex items-center justify-center gap-4">
        <Skeleton variant="circular" className="w-16 h-16" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="container-custom py-12">
      <Skeleton className="h-8 w-32 mb-6" />
      <Skeleton className="h-12 w-3/4 mb-4" />
      <Skeleton className="h-5 w-48 mb-8" />
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Skeleton className="w-full h-96 rounded-2xl" />
        <div className="space-y-6">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/6" />
          <div className="grid grid-cols-2 gap-4 pt-6">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function InquiryCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex gap-3">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  );
}
