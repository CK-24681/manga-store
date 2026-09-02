import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Zap, 
  Eye, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Send, 
  Plus, 
  Check, 
  Heart,
  Share2,
  BookOpen,
  Calendar,
  Layers,
  Award,
  Film
} from 'lucide-react';
import { MangaFormat, MangaItem, ReviewItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductDetailModalProps {
  manga: MangaItem | null;
  allManga: MangaItem[];
  onClose: () => void;
  onAddToCart: (manga: MangaItem, format: MangaFormat, qty?: number) => void;
  onBuyNow: (manga: MangaItem, format: MangaFormat) => void;
  onOpenLookInside: (manga: MangaItem) => void;
  onSelectRelatedManga: (manga: MangaItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  manga,
  allManga,
  onClose,
  onAddToCart,
  onBuyNow,
  onOpenLookInside,
  onSelectRelatedManga,
}) => {
  const { t, formatPrice, translateFormat, translateCategory, language } = useLanguage();
  if (!manga) return null;

  const [selectedFormat, setSelectedFormat] = useState<MangaFormat>(manga.formats[0].format);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'chronology' | 'specs' | 'reviews'>('details');

  // Review submission state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(manga.reviews || []);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const activeFormat = manga?.formats?.find((f) => f.format === selectedFormat) || manga?.formats?.[0] || { format: 'Paperback', price: 9.99, inStock: true, stockCount: 10, isKindleUnlimited: false };
  const galleryImages = manga ? [manga.coverImage, ...(manga.previewImages || [])] : [];

  // Frequently bought together items
  const relatedItems = ((manga?.frequentlyBoughtTogetherIds) || [])
    .map((id) => (allManga || []).find((m) => m?.id === id))
    .filter(Boolean) as MangaItem[];

  const bundleRawTotal = activeFormat.price + relatedItems.reduce((acc, item) => acc + item.formats[0].price, 0);

  const handleAddToCart = () => {
    onAddToCart(manga, selectedFormat, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddBundleToCart = () => {
    onAddToCart(manga, selectedFormat, 1);
    relatedItems.forEach((rel) => {
      onAddToCart(rel, rel.formats[0].format, 1);
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewContent.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/manga/${manga.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: reviewerName.trim() || 'Verified Reader',
          rating: reviewRating,
          title: reviewTitle,
          content: reviewContent,
          formatPurchased: selectedFormat,
        }),
      });
      const data = await res.json();
      if (data.review) {
        setReviewsList([data.review, ...reviewsList]);
        setReviewTitle('');
        setReviewContent('');
        setReviewerName('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div 
      id="product-detail-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto font-sans"
    >
      <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto border border-gray-300 text-left max-h-[95vh]">
        {/* Amazon Header Bar inside Modal */}
        <div className="bg-[#131921] text-white px-4 py-3 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span className="text-[#FF9900] font-bold">{t.booksBreadcrumb}</span>
            <span>›</span>
            <span>{translateCategory(manga.category)}</span>
            <span>›</span>
            <span className="text-gray-400 font-bold truncate max-w-xs">{manga.title}</span>
          </div>

          <button
            id="close-product-detail-btn"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 bg-white">
          {/* Main Product Layout (3 Columns on Large Screens) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Column 1: Gallery & Look Inside (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-lg flex items-center justify-center group p-2">
                <img
                  src={galleryImages[selectedImgIdx] || manga.coverImage}
                  alt={manga.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-auto object-cover rounded shadow"
                />

                {/* Look Inside Trigger */}
                <button
                  id="modal-look-inside-btn"
                  onClick={() => onOpenLookInside(manga)}
                  className="absolute top-3 left-3 bg-[#131921]/90 hover:bg-black text-amber-400 text-xs font-bold px-3 py-1.5 rounded-md shadow-lg border border-amber-500/50 flex items-center gap-1.5 backdrop-blur-sm cursor-pointer transition-transform hover:scale-105"
                >
                  <Eye className="w-3.5 h-3.5 text-[#FF9900]" />
                  <span>{t.lookInside}</span>
                </button>
              </div>

              {/* Gallery Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto py-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`w-12 h-16 rounded border overflow-hidden transition-all cursor-pointer ${
                        selectedImgIdx === idx
                          ? 'border-[#FF9900] ring-2 ring-[#FF9900]/40'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${idx}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Details & Description (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Title & Creator */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  {manga.title}
                </h1>
                <p className="text-sm text-gray-600 font-serif italic mt-0.5">
                  {manga.japaneseTitle}
                </p>
                <div className="text-xs text-gray-600 mt-1 flex flex-wrap items-center gap-2">
                  <span>
                    {t.authorBy} <strong className="text-[#007185] hover:underline cursor-pointer">{manga.author}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    {t.artistBy} <strong className="text-[#007185] hover:underline cursor-pointer">{manga.artist}</strong>
                  </span>
                </div>
              </div>

              {/* Badges & Rating */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {manga.isBestSeller && (
                  <span className="bg-[#E67A00] text-white font-bold px-2 py-0.5 rounded text-[11px]">
                    {t.bestSellerRankBadge.replace('{rank}', manga.rank.toString())}
                  </span>
                )}
                
                <div className="flex items-center gap-1 text-[#DE7921]">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(manga.rating)
                            ? 'fill-[#DE7921]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-800 ml-1">{manga.rating.toFixed(1)}</span>
                  <span className="text-[#007185] hover:underline cursor-pointer ml-1">
                    ({manga.ratingCount.toLocaleString()} {t.ratingsCount})
                  </span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-3 space-y-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  {t.formatSelectTitle}
                </span>

                {/* Formats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {manga.formats.map((fmt) => (
                    <button
                      key={fmt.format}
                      onClick={() => setSelectedFormat(fmt.format)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        selectedFormat === fmt.format
                          ? 'border-[#FF9900] bg-[#FFF8E7] shadow-xs'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-gray-900">{translateFormat(fmt.format)}</div>
                      <div className="text-sm font-black text-gray-900 mt-1">
                        {formatPrice(fmt.price)}
                      </div>
                      {fmt.savingsPercent > 0 && (
                        <div className="text-[10px] text-[#CC0C39] font-semibold">
                          {t.savePercent.replace('{percent}', fmt.savingsPercent.toString())}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Quote / Synopsis Preview */}
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 italic">
                "{manga.featuredQuote}"
              </div>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {manga.synopsis}
              </p>
            </div>

            {/* Column 3: Amazon Buy Box (3 cols) */}
            <div className="lg:col-span-3">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-300 shadow-sm space-y-3.5">
                {/* Price */}
                <div>
                  <span className="text-2xl font-black text-gray-900">
                    {formatPrice(activeFormat.price)}
                  </span>
                  {activeFormat.originalPrice > activeFormat.price && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      <span>{t.listPrice}</span>
                      <span className="line-through">{formatPrice(activeFormat.originalPrice)}</span>
                      <span className="ml-1 text-[#CC0C39] font-bold">
                        ({t.savePercent.replace('{percent}', activeFormat.savingsPercent.toString())})
                      </span>
                    </div>
                  )}
                </div>

                {/* Delivery & Prime */}
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[#007185] font-semibold">
                    <span className="italic font-black text-[#00A8E1]">✓prime</span>
                    <span>{t.freeDeliveryTomorrow}</span>
                  </div>
                  <div className="text-gray-600">
                    {t.deliverTo} <strong className="text-gray-800">{t.locationName}</strong>
                  </div>
                  <div className="text-[#007600] font-bold">
                    {t.inStock}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 text-xs">
                  <label htmlFor="modal-qty-select" className="font-bold text-gray-700">
                    {t.quantityLabel}
                  </label>
                  <select
                    id="modal-qty-select"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded bg-white px-2 py-1 text-xs text-gray-800 font-medium focus:ring-1 focus:ring-[#FF9900] focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`w-full py-2.5 px-4 rounded-full text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 border border-[#FCD200]'
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

                  <button
                    id="modal-buy-now-btn"
                    onClick={() => onBuyNow(manga, selectedFormat)}
                    className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-gray-900 font-bold py-2.5 px-4 rounded-full text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current text-gray-900" />
                    <span>{t.buyNow1Click}</span>
                  </button>
                </div>

                {/* Meta details */}
                <div className="text-[11px] text-gray-600 space-y-1 pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span>{t.shipsFrom}</span>
                    <span className="font-semibold text-gray-800">Mangazon Fulfillment</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.soldBy}</span>
                    <span className="font-semibold text-gray-800">{manga.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.returnsLabel}</span>
                    <span className="text-[#007185]">{t.returnPolicy30Days}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-800 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.secureSsl}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Bought Together Bundle */}
          {relatedItems.length > 0 && (
            <div className="bg-amber-50/40 p-4 sm:p-5 rounded-xl border border-amber-200/80">
              <h3 className="font-bold text-sm text-gray-900 mb-3">
                {t.frequentlyBoughtTogether}
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-2">
                  <img
                    src={manga.coverImage}
                    alt={manga.title}
                    referrerPolicy="no-referrer"
                    className="w-16 sm:w-20 h-24 sm:h-28 object-cover rounded shadow"
                  />
                  <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {relatedItems.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-16 sm:w-20 h-24 sm:h-28 object-cover rounded shadow"
                      />
                      {idx < relatedItems.length - 1 && (
                        <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="md:ml-auto text-center md:text-right space-y-1.5">
                  <div className="text-xs text-gray-600">{t.bundleTotalPrice}</div>
                  <div className="text-xl font-black text-gray-900">
                    {formatPrice(bundleRawTotal)}
                  </div>
                  <p className="text-[11px] text-gray-500">{t.bundleSaveNotice}</p>
                  <button
                    onClick={handleAddBundleToCart}
                    className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold px-4 py-2 rounded-full text-xs shadow-sm cursor-pointer"
                  >
                    {t.addAllBundleToCart.replace('{count}', (1 + relatedItems.length).toString())}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Details Tabs */}
          <div>
            <div className="flex border-b border-gray-200 text-xs sm:text-sm font-bold gap-2 sm:gap-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-[#FF9900] text-[#E67A00]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {t.tabOverview}
              </button>
              <button
                onClick={() => setActiveTab('chronology')}
                className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'chronology'
                    ? 'border-[#FF9900] text-[#E67A00]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {t.tabReadingGuide}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'specs'
                    ? 'border-[#FF9900] text-[#E67A00]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {t.tabSpecs}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-[#FF9900] text-[#E67A00]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {t.tabReviews} ({reviewsList.length})
              </button>
            </div>

            {/* Tab: Details */}
            {activeTab === 'details' && (
              <div className="pt-5 space-y-4 text-xs sm:text-sm text-gray-700">
                <h4 className="font-bold text-gray-900 text-base">{t.publicationDetails}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-gray-500 block text-xs">{t.printLengthLabel}</span>
                    <span className="font-bold text-gray-800">{manga.pages} {t.pagesLabel}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">{t.releaseDateLabel}</span>
                    <span className="font-bold text-gray-800">{manga.releaseDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">{t.isbnLabel}</span>
                    <span className="font-mono text-gray-800">{manga.isbn}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">{t.ageRatingLabel}</span>
                    <span className="font-bold text-gray-800">{manga.ageRating}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h5 className="font-bold text-gray-900">{t.animeStatusTitle}</h5>
                  <p className="bg-gray-50 p-3 rounded border border-gray-200 text-gray-700">
                    {manga.animeAdaptation}
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Chronology */}
            {activeTab === 'chronology' && (
              <div className="pt-5 space-y-4 text-xs sm:text-sm text-gray-700">
                <div className="flex items-center gap-2 text-[#E67A00] font-bold">
                  <Film className="w-4 h-4" />
                  <span>{t.volumeChronologyTitle}</span>
                </div>
                <p className="text-gray-600">{t.volumeChronologySub}</p>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 space-y-2 mb-6">
                  <h5 className="font-bold text-gray-900">{t.keyArcsMilestones}</h5>
                  <p className="text-gray-800 leading-relaxed">
                    Volume {manga.currentVolume} of {manga.volumesCount} • Official Canon Storyline.
                  </p>
                  <p className="text-xs text-gray-600 font-mono bg-white p-2 rounded border border-amber-200">
                    {manga.title} is positioned at the pinnacle of {manga.category} serialization.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 text-base border-b border-gray-200 pb-2">Volumes Disponíveis ({manga.volumesCount})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                    {Array.from({ length: manga.volumesCount || 1 }).map((_, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full aspect-[3/4] bg-gray-100 rounded border border-gray-200 shadow-sm overflow-hidden relative">
                          <img 
                            src={manga.coverImage} 
                            alt={`Volume ${idx + 1}`} 
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                            <span className="bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded-full shadow">Ver Detalhes</span>
                          </div>
                        </div>
                        <div className="text-center w-full">
                          <p className="font-bold text-gray-900 text-xs truncate w-full">{manga.title}</p>
                          <p className="text-[#FF9900] font-black text-xs">Vol. {idx + 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Specs */}
            {activeTab === 'specs' && (
              <div className="pt-5 text-xs sm:text-sm text-gray-700 space-y-3">
                <table className="w-full border-collapse border border-gray-200 text-left">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-2.5 font-bold bg-gray-50 w-1/3">Publisher</td>
                      <td className="p-2.5">{manga.publisher}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2.5 font-bold bg-gray-50">Language</td>
                      <td className="p-2.5">Official Licensed Edition (Multilingual Support)</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2.5 font-bold bg-gray-50">Dimensions</td>
                      <td className="p-2.5">5.0 x 0.8 x 7.5 inches (Standard Tankobon) / 7.0 x 10.0 inches (Deluxe)</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2.5 font-bold bg-gray-50">ISBN-13</td>
                      <td className="p-2.5 font-mono">{manga.isbn}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2.5 font-bold bg-gray-50">Tags & Themes</td>
                      <td className="p-2.5">{manga.tags.join(', ')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="pt-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Rating Breakdown (4 cols) */}
                  <div className="md:col-span-4 space-y-3">
                    <h4 className="font-bold text-gray-900 text-base">{t.customerReviewsTitle}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex text-[#DE7921]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="font-black text-gray-900">{manga.rating} {t.outOf5Stars}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {manga.ratingCount.toLocaleString()} {t.globalRatings}
                    </p>

                    {/* Star bars */}
                    <div className="space-y-1.5 pt-2 text-xs">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const pct = manga.ratingDistribution[star] || (star === 5 ? 85 : star === 4 ? 10 : 2);
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="w-12 text-gray-600">{star} {t.starLabel}</span>
                            <div className="flex-1 h-3.5 bg-gray-200 rounded-sm overflow-hidden">
                              <div
                                className="h-full bg-[#FF9900]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-8 text-right text-gray-500">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Review Form (8 cols) */}
                  <div className="md:col-span-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h5 className="font-bold text-gray-900 text-sm mb-3">
                      {t.writeReviewTitle}
                    </h5>
                    <form onSubmit={handleSubmitReview} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder={t.reviewerNamePlaceholder}
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:ring-1 focus:ring-[#FF9900] focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-gray-700">{t.reviewRatingLabel}</label>
                          <select
                            value={reviewRating}
                            onChange={(e) => setReviewRating(Number(e.target.value))}
                            className="bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-800"
                          >
                            <option value={5}>5 Stars ★★★★★</option>
                            <option value={4}>4 Stars ★★★★☆</option>
                            <option value={3}>3 Stars ★★★☆☆</option>
                            <option value={2}>2 Stars ★★☆☆☆</option>
                            <option value={1}>1 Star ★☆☆☆☆</option>
                          </select>
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder={t.reviewTitlePlaceholder}
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        required
                        className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:ring-1 focus:ring-[#FF9900] focus:outline-none"
                      />

                      <textarea
                        rows={3}
                        placeholder={t.reviewContentPlaceholder}
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        required
                        className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:ring-1 focus:ring-[#FF9900] focus:outline-none"
                      />

                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold px-4 py-2 rounded-full text-xs shadow-xs cursor-pointer"
                      >
                        {isSubmittingReview ? t.submittingReview : t.submitReview}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="text-left space-y-1.5 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-7 h-7 rounded-full bg-gray-200"
                        />
                        <span className="font-bold text-xs text-gray-900">{rev.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex text-[#DE7921]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'fill-[#DE7921]' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-gray-900">{rev.title}</span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {rev.date} • <span className="text-[#C45500] font-bold">{t.verifiedPurchaseBadge}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{rev.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
