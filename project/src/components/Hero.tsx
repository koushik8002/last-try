import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>
      <div className="relative px-8 py-16 sm:px-12 sm:py-20 max-w-2xl">
        <span className="inline-block text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4">New Collection</span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
          Discover Products<br />You'll Love
        </h1>
        <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-md leading-relaxed">
          Curated essentials for modern living. Quality craftsmanship, timeless design.
        </p>
        <a
          href="#products"
          className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-400 active:scale-95 transition-all"
        >
          Shop Now <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
