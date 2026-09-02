import React, { useState } from 'react';
import { Star, Eye, ShoppingCart, Check } from 'lucide-react';
import { MangaFormat, MangaItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  manga: MangaItem;
  onSelectManga: (manga: MangaItem) => void;
  onAddToCart: (format: MangaFormat) => void;
  onOpenLookInside: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  manga,
  onSelectManga,
  onAddToCart,
  onOpenLookInside,
}) => {
  const { t, formatPrice, translateFormat } = useLanguage();
  const [selectedFormat, setSelectedFormat] = useState<MangaFormat>(
    manga?.formats?.[0]?.format || 'Paperback'
  );
  const [isAdded, setIsAdded] = useState(false);

  const activeFormatObj =
    manga?.formats?.find((f) => f.format === selectedFormat) ||
    manga?.formats?.[0] || {
      format: 'Paperback',
      price: 9.99,
      originalPrice: 9.99,
      savingsPercent: 0,
      inStock: true,
      stockCount: 10,
    };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(selectedFormat);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleLookInsideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenLookInside();
  };

  return (
    <div
      id={`product-card-${manga.id}`}
      onClick={() => onSelectManga(manga)}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col p-4 cursor-pointer text-left font-sans w-full"
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] w-full mx-auto mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={manga.coverImage}
          alt={manga.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {manga.isBestSeller && (
            <div className="bg-[#FF9900] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              #{manga.rank}
            </div>
          )}
        </div>

        {/* Look Inside Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <button
            id={`look-inside-btn-${manga.id}`}
            onClick={handleLookInsideClick}
            className="bg-white/90 hover:bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Eye className="w-4 h-4" />
            <span>{t.lookInside}</span>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-[#FF9900] transition-colors">
          {manga.title}
        </h3>

        <p className="text-xs text-gray-500 font-medium mt-1">
          {manga.author}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex text-[#FF9900]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(manga.rating) ? 'fill-[#FF9900]' : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">
            ({manga.ratingCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-black text-gray-900">
            {formatPrice(activeFormatObj.price)}
          </span>
          {activeFormatObj.originalPrice > activeFormatObj.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(activeFormatObj.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <button
          id={`add-to-cart-btn-${manga.id}`}
          onClick={handleAddClick}
          disabled={isAdded}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            isAdded
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 hover:bg-[#FF9900] text-gray-900 hover:text-white'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>{t.addedToCart}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>{t.addToCart}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
