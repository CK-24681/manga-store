import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { CartItem, MangaFormat } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (mangaId: string, format: MangaFormat, newQty: number) => void;
  onRemoveItem: (mangaId: string, format: MangaFormat) => void;
  onProceedToCheckout: () => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onClearCart,
}) => {
  const { t, formatPrice, translateFormat } = useLanguage();
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 35.0;
  const progressToFree = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex w-full sm:w-auto sm:pl-10 max-w-full animate-slide-in-right">
        <div className="w-full sm:w-[420px] bg-white shadow-2xl flex flex-col text-left">

          {/* Header */}
          <div className="bg-[#131921] text-white p-4 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FF9900]" />
              <h2 className="text-base font-bold">
                {t.shoppingCartTitle} ({items.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              id="cart-drawer-close-btn"
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress */}
          <div className="bg-amber-50 p-3 border-b border-amber-200 text-xs flex-shrink-0">
            {amountNeeded > 0 ? (
              <div>
                <span className="text-gray-700">
                  {t.freeShippingNeeded.replace('{amount}', formatPrice(amountNeeded))}
                </span>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#FF9900] transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFree}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <span className="text-[#00A8E1] italic font-black text-sm">✓prime</span>
                <span>{t.freeShippingUnlocked}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-500 space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-base font-medium">{t.emptyCartTitle}</p>
                <p className="text-xs text-gray-400">{t.emptyCartSub}</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.mangaId}-${item.format}`}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs"
                >
                  <img
                    src={item.manga.coverImage}
                    alt={item.manga.title}
                    referrerPolicy="no-referrer"
                    className="w-12 sm:w-14 h-18 sm:h-20 object-cover rounded shadow flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-2 text-xs sm:text-sm leading-snug">
                        {item.manga.title}
                      </h4>
                      <p className="text-gray-500 text-[11px] mt-0.5">{translateFormat(item.format)}</p>
                      <div className="font-black text-gray-900 mt-1">{formatPrice(item.price)}</div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.mangaId, item.format, Math.max(1, item.quantity - 1))
                          }
                          className="p-1 hover:bg-gray-100 text-gray-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-gray-800 text-[11px]">{item.quantity}</span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.mangaId, item.format, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-100 text-gray-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.mangaId, item.format)}
                        className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title={t.deleteItem}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3 flex-shrink-0">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {t.subtotalLabel} ({items.reduce((a, b) => a + b.quantity, 0)} {t.quantity}):
                </span>
                <span className="font-black text-gray-900 text-base">{formatPrice(subtotal)}</span>
              </div>

              <button
                id="cart-proceed-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold py-3 px-4 rounded-full text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <span>{t.proceedToCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.secureSsl}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
