import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, ArrowRight } from 'lucide-react';
import { MangaItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeroCarouselProps {
  onSelectManga?: (manga: MangaItem) => void;
  onOpenBestSellers?: () => void;
  allManga?: MangaItem[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onSelectManga,
  onOpenBestSellers,
  allManga = [],
}) => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-1',
      badge: t.heroSlide1Badge,
      title: t.heroSlide1Title,
      subtitle: t.heroSlide1Sub,
      ctaText: t.heroSlide1Cta,
      bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#0A0F1D]',
      accentColor: '#FF9900',
      featuredMangaId: 'one-piece-vol-105',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'slide-2',
      badge: t.heroSlide2Badge,
      title: t.heroSlide2Title,
      subtitle: t.heroSlide2Sub,
      ctaText: t.heroSlide2Cta,
      bgGradient: 'from-[#1C1917] via-[#292524] to-[#0C0A09]',
      accentColor: '#FEBD69',
      featuredMangaId: 'frieren-vol-1',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'slide-3',
      badge: t.heroSlide3Badge,
      title: t.heroSlide3Title,
      subtitle: t.heroSlide3Sub,
      ctaText: t.heroSlide3Cta,
      bgGradient: 'from-[#111827] via-[#1F2937] to-[#030712]',
      accentColor: '#FFD814',
      featuredMangaId: 'berserk-deluxe-vol-1',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];
  const featuredItem =
    allManga && allManga.length > 0
      ? allManga.find((m) => m?.id === slide?.featuredMangaId) || allManga[0]
      : undefined;

  return (
    <div id="hero-carousel-section" className="relative w-full overflow-hidden font-sans">
      {/* Slide Container */}
      <div
        className={`relative bg-gradient-to-r ${slide.bgGradient} text-white flex items-center transition-all duration-700 ease-in-out`}
        style={{ minHeight: 'clamp(220px, 40vw, 400px)' }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-luminosity bg-cover bg-center pointer-events-none transition-all duration-1000"
          style={{ backgroundImage: `url(${slide.image})` }}
        />

        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#EAEDED] via-transparent to-transparent opacity-90 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-5 z-10">
          {/* Left: Text */}
          <div className="w-full sm:max-w-xl text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-[#FF9900]/20 border border-[#FF9900] px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-[#FF9900] tracking-wide uppercase shadow-xs">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {slide.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg line-clamp-3 sm:line-clamp-none">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                id="hero-cta-button"
                onClick={() => featuredItem && onSelectManga?.(featuredItem)}
                className="bg-[#FF9900] hover:bg-[#E68A00] text-black font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Right: Featured Manga Card (hidden on very small screens) */}
          {featuredItem && (
            <div
              onClick={() => onSelectManga?.(featuredItem)}
              className="hidden sm:flex bg-white/10 hover:bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-xl items-center gap-4 cursor-pointer transition-all hover:scale-[1.02] max-w-xs w-full flex-shrink-0"
            >
              <img
                src={featuredItem.coverImage}
                alt={featuredItem.title}
                referrerPolicy="no-referrer"
                className="w-20 md:w-24 h-28 md:h-32 object-cover rounded shadow-md border border-white/10 flex-shrink-0"
              />
              <div className="text-left space-y-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FF9900] text-black px-2 py-0.5 rounded inline-block">
                  Rank #{featuredItem.rank} Best Seller
                </span>
                <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                  {featuredItem.title}
                </h3>
                <p className="text-[11px] text-gray-300 line-clamp-1">{featuredItem.author}</p>
                <div className="flex items-center gap-1 text-xs text-[#FF9900]">
                  <span>★ {featuredItem.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-300">
                    ({featuredItem.ratingCount.toLocaleString()})
                  </span>
                </div>
                <div className="text-xs font-bold text-amber-300 pt-0.5">✓prime Next-Day</div>
              </div>
            </div>
          )}
        </div>

        {/* Arrows */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
          }
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full cursor-pointer transition z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full cursor-pointer transition z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === i ? 'w-6 bg-[#FF9900]' : 'w-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
