import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, BookOpen, ShoppingCart, RotateCw } from 'lucide-react';
import { MangaFormat, MangaItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface LookInsideModalProps {
  manga: MangaItem | null;
  onClose: () => void;
  onAddToCart: (manga: MangaItem, format: MangaFormat) => void;
}

export const LookInsideModal: React.FC<LookInsideModalProps> = ({
  manga,
  onClose,
  onAddToCart,
}) => {
  const { t, formatPrice, translateFormat } = useLanguage();
  if (!manga) return null;

  const pages = [
    manga.coverImage,
    ...manga.previewImages,
    'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=900&auto=format&fit=crop&q=80'
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.0, Math.max(0.8, prev + delta)));
  };

  return (
    <div
      id="look-inside-modal"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden font-sans"
    >
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#131921] text-white rounded-xl shadow-2xl flex flex-col border border-gray-700 overflow-hidden text-left">
        {/* Top Controls Bar */}
        <div className="bg-[#232F3E] px-4 py-3 border-b border-gray-700 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <BookOpen className="w-5 h-5 text-[#FF9900] flex-shrink-0" />
            <div className="truncate">
              <span className="font-bold text-white truncate">{manga.title}</span>
              <span className="ml-2 text-xs text-gray-400 font-serif hidden sm:inline">{manga.japaneseTitle}</span>
            </div>
          </div>

          {/* Reading direction hint */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded">
            <RotateCw className="w-3.5 h-3.5" />
            <span>{t.readingDirectionHint}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-black/40 rounded border border-gray-600 p-0.5">
              <button
                id="zoom-out-btn"
                onClick={() => handleZoom(-0.2)}
                className="p-1 text-gray-300 hover:text-white cursor-pointer"
                title={t.zoomOut}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs px-1 text-gray-400 font-mono">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                id="zoom-in-btn"
                onClick={() => handleZoom(0.2)}
                className="p-1 text-gray-300 hover:text-white cursor-pointer"
                title={t.zoomIn}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Close Button */}
            <button
              id="look-inside-close-btn"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Canvas Area */}
        <div className="flex-1 relative bg-[#0B0E14] overflow-auto flex items-center justify-center p-4">
          <div
            className="transition-transform duration-200 flex items-center justify-center max-h-full max-w-full"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={pages[currentPage]}
              alt={`Page ${currentPage + 1}`}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-auto object-contain rounded shadow-2xl border border-gray-800"
            />
          </div>

          {/* Page Turn Controls */}
          <button
            id="reader-prev-page-btn"
            onClick={prevPage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full border border-gray-600 hover:border-[#FF9900] transition cursor-pointer"
            title="Previous Page (◀)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            id="reader-next-page-btn"
            onClick={nextPage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full border border-gray-600 hover:border-[#FF9900] transition cursor-pointer"
            title="Next Page (▶)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Bar: Page Indicator & Add to Cart */}
        <div className="bg-[#1A2332] px-4 py-3 border-t border-gray-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-gray-300 font-medium">
              {t.pageOf.replace('{current}', (currentPage + 1).toString()).replace('{total}', pages.length.toString())}
            </span>
            <div className="flex gap-1">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                    currentPage === idx ? 'bg-[#FF9900] w-4' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-gray-400">{translateFormat(manga.formats[0].format)}: </span>
              <span className="text-[#FF9900] font-black text-sm">
                {formatPrice(manga.formats[0].price)}
              </span>
            </div>

            <button
              id="reader-add-to-cart-btn"
              onClick={() => {
                onAddToCart(manga, manga.formats[0].format);
                onClose();
              }}
              className="bg-[#FFD814] hover:bg-[#F7CA00] text-black font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow cursor-pointer text-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{t.addToCart}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
