import React from 'react';
import { Store, TrendingUp, ShieldCheck, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SellPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-white font-sans min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-[#131921] text-white py-16 px-4 md:px-8 text-center">
        <h1 className="text-3xl md:text-5xl font-black mb-4">
          Alcance milhões de leitores
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Cadastre-se na Mangazon, o maior marketplace focado em mangás, light novels e quadrinhos. Venda rápido e com segurança.
        </p>
        <button className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold px-8 py-3 rounded-full text-lg shadow-sm transition-colors cursor-pointer">
          Comece a vender hoje
        </button>
      </div>

      {/* Benefits */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          Por que vender na Mangazon?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-[#FF9900]">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Visibilidade Imediata</h3>
            <p className="text-gray-600 text-sm">
              Coloque seus mangás na frente de clientes que estão procurando exatamente o que você tem a oferecer.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Fulfillment da Mangazon</h3>
            <p className="text-gray-600 text-sm">
              Você armazena seus produtos nos nossos centros de distribuição e nós embalamos, enviamos com frete grátis e prestamos atendimento ao cliente.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Pagamento Seguro</h3>
            <p className="text-gray-600 text-sm">
              Garantia de transações seguras. O dinheiro vai direto para a sua conta bancária regularmente.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ / Support */}
      <div className="bg-gray-50 py-12 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <HelpCircle className="w-10 h-10 text-gray-400" />
            <div>
              <h3 className="font-bold text-gray-900">Precisa de ajuda para começar?</h3>
              <p className="text-sm text-gray-600">Nossa equipe de suporte a vendedores está 24/7 disponível.</p>
            </div>
          </div>
          <button className="px-6 py-2 border border-gray-400 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            Falar com Especialista
          </button>
        </div>
      </div>
    </div>
  );
};
