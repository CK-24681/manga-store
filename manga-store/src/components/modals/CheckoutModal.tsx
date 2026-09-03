import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Tag, Package, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, OrderItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: OrderItem) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  onClearCart,
}) => {
  const { t, formatPrice, translateFormat, language } = useLanguage();

  // ── All hooks must be declared before any conditional return ──
  const [step, setStep] = useState<'review' | 'success'>('review');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountRate, setPromoDiscountRate] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);

  // Address
  const [fullName, setFullName] = useState(language === 'pt' ? 'Alex Vance Silva' : 'Alex Vance');
  const [street, setStreet] = useState(language === 'pt' ? 'Av. Paulista, 1578 - Bela Vista' : '424 Akihabara Blvd Suite 700');
  const [city, setCity] = useState(language === 'pt' ? 'São Paulo' : 'Los Angeles');
  const [state, setState] = useState(language === 'pt' ? 'SP' : 'CA');
  const [zipCode, setZipCode] = useState(language === 'pt' ? '01310-200' : '90001');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'points' | 'oneclick'>('oneclick');

  // Totals — aligned with CartService.java (no tax applied on backend)
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * promoDiscountRate;
  const shipping = subtotal > 35 ? 0 : 4.99;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  // Conditional render after all hooks
  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'MANGA20') {
      setAppliedPromo('MANGA20');
      setPromoDiscountRate(0.2);
    } else if (code === 'OTAKU10') {
      setAppliedPromo('OTAKU10');
      setPromoDiscountRate(0.1);
    } else {
      alert(language === 'pt' ? 'Cupom inválido. Experimente "MANGA20" (20% OFF) ou "OTAKU10" (10% OFF)!' : 'Invalid promo code. Try "MANGA20" for 20% off or "OTAKU10" for 10% off!');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: {
            fullName,
            street,
            city,
            state,
            zipCode,
            country: language === 'pt' ? 'Brasil' : 'United States',
          },
          paymentMethod: paymentMethod === 'oneclick' ? 'Cartão Cadastrado Visa' : 'Otaku Points',
          promoCode: appliedPromo,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setCompletedOrder(data.order);
        setStep('success');
        onOrderSuccess(data.order);
        onClearCart();
        
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF9900', '#FFD814', '#131921', '#00A8E1']
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      id="checkout-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-300 text-left my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-[#131921] text-white px-5 py-3.5 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FF9900]" />
            <h2 className="font-bold text-base text-white">{t.checkoutTitle}</h2>
          </div>
          <button
            id="checkout-close-btn"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-50">
          {step === 'review' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Forms (7 cols) */}
              <div className="md:col-span-7 space-y-5">
                {/* 1. Shipping Address */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-[#E67A00]" />
                    <span>{t.stepAddress}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="text-gray-600 block mb-1 font-semibold">{t.fullNameLabel}</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:bg-white focus:ring-1 focus:ring-[#FF9900] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-gray-600 block mb-1 font-semibold">{t.streetLabel}</label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:bg-white focus:ring-1 focus:ring-[#FF9900] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 block mb-1 font-semibold">{t.cityLabel}</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:bg-white focus:ring-1 focus:ring-[#FF9900] focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-gray-600 block mb-1 font-semibold">{t.stateLabel}</label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:bg-white focus:ring-1 focus:ring-[#FF9900] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 block mb-1 font-semibold">{t.zipCodeLabel}</label>
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:bg-white focus:ring-1 focus:ring-[#FF9900] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                    <CreditCard className="w-4 h-4 text-[#E67A00]" />
                    <span>{t.stepPayment}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label 
                      onClick={() => setPaymentMethod('oneclick')}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                        paymentMethod === 'oneclick' ? 'border-[#FF9900] bg-amber-50/50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'oneclick'}
                          onChange={() => setPaymentMethod('oneclick')}
                          className="text-[#FF9900] focus:ring-[#FF9900]"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{t.oneClickPayment}</div>
                          <div className="text-gray-500 text-[11px]">Visa •••• 8892 (Pagamento Rápido)</div>
                        </div>
                      </div>
                      <span className="font-bold text-teal-700 text-xs">1-Clique</span>
                    </label>

                    <label 
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                        paymentMethod === 'card' ? 'border-[#FF9900] bg-amber-50/50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="text-[#FF9900] focus:ring-[#FF9900]"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{t.cardPayment}</div>
                          <div className="text-gray-500 text-[11px]">Mastercard, Visa, Elo, Pix</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 3. Promo Code Form */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Cupom (ex: MANGA20, OTAKU10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs text-gray-800 uppercase font-mono focus:bg-white focus:ring-1 focus:ring-[#FF9900] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-gray-800 hover:bg-black text-white font-bold text-xs px-4 py-1.5 rounded cursor-pointer transition"
                    >
                      {t.applyPromo}
                    </button>
                  </form>
                  {appliedPromo && (
                    <div className="text-xs text-emerald-700 font-bold mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.promoApplied} ({appliedPromo} - {promoDiscountRate * 100}% OFF)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary (5 cols) */}
              <div className="md:col-span-5">
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2">
                    {t.orderSummary}
                  </h3>

                  {/* Items summary */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={`${item.mangaId}-${item.format}-vol${item.volumeNumber}`} className="flex justify-between text-xs text-gray-700">
                        <span className="truncate max-w-[210px]">
                          {item.quantity}x {item.manga.title} — Vol. {item.volumeNumber} ({translateFormat(item.format).split(' ')[0]})
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="border-t border-gray-200 pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>{t.subtotalLabel}:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Desconto Promocional:</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>{t.shippingFee}:</span>
                      <span className="text-[#007600] font-bold">
                        {shipping === 0 ? t.freeShipping : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                      <span>{t.grandTotal}</span>
                      <span className="text-base text-[#B12704]">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Place Order CTA */}
                  <button
                    id="place-order-confirm-btn"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold py-3 px-4 rounded-full text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <span>{t.processingOrder}</span>
                    ) : (
                      <>
                        <span>{t.placeOrderBtn}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-gray-500 text-center leading-tight">
                    Ao confirmar seu pedido, você concorda com os Termos de Venda da Mangazon.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Success Screen */
            <div className="text-center py-6 sm:py-10 space-y-5 max-w-lg mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  {t.orderSuccessTitle}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {t.orderSuccessSub}
                </p>
              </div>

              {completedOrder && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-left space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID do Pedido:</span>
                    <span className="font-bold text-gray-900">{completedOrder.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.trackingNumberLabel}</span>
                    <span className="font-bold text-[#007185]">{completedOrder.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.deliveryDateLabel}</span>
                    <span className="font-bold text-[#007600]">{completedOrder.deliveryEstimate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Pago:</span>
                    <span className="font-bold text-gray-900">{formatPrice(completedOrder.total)}</span>
                  </div>
                </div>
              )}

              <button
                id="order-success-continue-btn"
                onClick={onClose}
                className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm shadow cursor-pointer"
              >
                {t.continueShopping}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
