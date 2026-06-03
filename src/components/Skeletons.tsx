const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-bordeaux/10 rounded ${className}`} />
);

export const HeroSkeleton = () => (
  <section className="relative bg-gradient-hero overflow-hidden">
    <div className="container grid md:grid-cols-2 gap-12 items-center py-16 md:py-24">
      <div className="space-y-8 order-2 md:order-1">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-px w-10" />
          <SkeletonBlock className="h-3 w-48" />
        </div>
        <div className="space-y-3">
          <SkeletonBlock className="h-12 w-72" />
          <SkeletonBlock className="h-12 w-56" />
          <SkeletonBlock className="h-12 w-64" />
        </div>
        <SkeletonBlock className="h-16 w-full max-w-md" />
        <div className="flex flex-wrap gap-4 pt-2">
          <SkeletonBlock className="h-12 w-44" />
          <SkeletonBlock className="h-12 w-44" />
        </div>
        <div className="flex items-center gap-8 pt-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-8 w-16" />
            <SkeletonBlock className="h-3 w-28" />
          </div>
          <SkeletonBlock className="h-10 w-px" />
          <div className="space-y-2">
            <SkeletonBlock className="h-8 w-16" />
            <SkeletonBlock className="h-3 w-28" />
          </div>
        </div>
      </div>
      <div className="relative order-1 md:order-2">
        <SkeletonBlock className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[640px]" />
      </div>
    </div>
  </section>
);

export const PromiseSkeleton = () => (
  <section className="border-y border-border">
    <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonBlock className="h-6 w-6 rounded-full" />
          <div className="space-y-1.5 flex-1">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const ProductGridSkeleton = () => (
  <section className="container py-20 md:py-28">
    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
      <SkeletonBlock className="h-3 w-32 mx-auto" />
      <SkeletonBlock className="h-10 w-72 mx-auto" />
      <SkeletonBlock className="h-4 w-56 mx-auto" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-4">
          <SkeletonBlock className="aspect-[4/5] w-full" />
          <div className="space-y-2 px-1">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const CategoriesSkeleton = () => (
  <section className="bg-cream py-20 md:py-28">
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div className="space-y-3">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-10 w-64" />
        </div>
        <SkeletonBlock className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="relative block aspect-[3/4] overflow-hidden"
            style={{ marginTop: i % 2 === 0 ? 0 : "2rem" }}
          >
            <SkeletonBlock className="w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const AtelierSkeleton = () => (
  <section className="container py-20 md:py-28">
    <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
      <div className="relative">
        <SkeletonBlock className="w-full h-[300px] sm:h-[400px] md:h-[500px]" />
      </div>
      <div className="space-y-6">
        <SkeletonBlock className="h-3 w-32" />
        <SkeletonBlock className="h-10 w-64" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-full" />
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-6 w-16" />
              <SkeletonBlock className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const TestimonialsSkeleton = () => (
  <section className="bg-gradient-blush py-20 md:py-28">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <SkeletonBlock className="h-3 w-48 mx-auto" />
        <SkeletonBlock className="h-10 w-64 mx-auto" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-ivory p-5 sm:p-6 md:p-8 shadow-soft space-y-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, j) => (
                <SkeletonBlock key={j} className="h-3.5 w-3.5" />
              ))}
            </div>
            <SkeletonBlock className="h-16 w-full" />
            <div className="pt-4 border-t border-border space-y-1.5">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const PageSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`container py-20 md:py-28 ${className}`}>
    <div className="max-w-3xl mx-auto space-y-6">
      <SkeletonBlock className="h-3 w-32" />
      <SkeletonBlock className="h-10 w-72" />
      <SkeletonBlock className="h-4 w-56" />
      {[...Array(6)].map((_, i) => (
        <SkeletonBlock key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="container py-12 md:py-20">
    <div className="grid md:grid-cols-2 gap-12 md:gap-20">
      <SkeletonBlock className="aspect-[4/5] w-full" />
      <div className="space-y-6">
        <SkeletonBlock className="h-3 w-32" />
        <SkeletonBlock className="h-8 w-64" />
        <SkeletonBlock className="h-6 w-32" />
        <SkeletonBlock className="h-20 w-full" />
        <SkeletonBlock className="h-12 w-full" />
        <SkeletonBlock className="h-12 w-48" />
      </div>
    </div>
  </div>
);
