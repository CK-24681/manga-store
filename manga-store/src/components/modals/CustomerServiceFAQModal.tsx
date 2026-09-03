import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  HelpCircle,
  Headphones,
  Search,
  ChevronDown,
  ShieldCheck,
  Send,
  RotateCcw,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileText,
  ExternalLink,
  User,
  AlertCircle
} from 'lucide-react';

export interface CustomerServiceFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'faq' | 'human';
  initialCategory?: string;
}

interface FAQItem {
  id: string;
  category: string;
  question: string;
  lawReference: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'arrependimento',
    category: 'arrependimento',
    question: 'Posso me arrepender da compra e devolver o mangá?',
    lawReference: 'Art. 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990) & Decreto nº 7.962/2013',
    answer: 'Sim! De acordo com o Artigo 49 do CDC, em compras realizadas pela internet, você tem o direito de arrependimento no prazo de até 7 (sete) dias corridos, contados a partir da data de recebimento do pedido. A devolução é 100% gratuita (enviamos o código de postagem reversa dos Correios sem nenhum custo para você) e o estorno é integral, contemplando o valor do produto e do frete original pago.',
  },
  {
    id: 'defeito-avaria',
    category: 'defeito',
    question: 'Meu mangá chegou amassado ou com defeito gráfico. Como funciona a troca?',
    lawReference: 'Art. 18 e 26 do Código de Defesa do Consumidor',
    answer: 'Se o seu exemplar apresentar defeitos de encadernação, folhas faltando, erros graves de corte ou avarias provocadas pelo transporte, você possui garantia legal. Realizamos a troca imediata por um novo exemplar lacrado ou o reembolso integral sem burocracia. O envio do novo volume tem prioridade expressa.',
  },
  {
    id: 'atendimento-humano-direito',
    category: 'atendimento',
    question: 'Tenho o direito de falar diretamente com um atendente humano?',
    lawReference: 'Decreto Federal nº 11.034/2022 (Regulamentação do SAC) - Art. 11 e 12',
    answer: 'Sim, é um direito garantido por lei federal! Nosso sistema automatizado e IA inteligente contam com a opção obrigatória e imediata de transferência para um operador humano. Você pode solicitar o operador pelo chat a qualquer momento ou utilizar a aba "Atendimento Humano (SAC)" deste painel. Todo atendimento gera obrigatoriamente um Número de Protocolo gravado.',
  },
  {
    id: 'prazos-frete',
    category: 'entrega',
    question: 'Quais são os prazos de entrega e como rastrear meu pedido?',
    lawReference: 'Decreto do E-commerce nº 7.962/2013',
    answer: 'Compras acima de R$ 99 contam com Frete Grátis Express para capitais e regiões metropolitanas (prazo estimado de 2 a 5 dias úteis). O código de rastreamento oficial é gerado assim que o pacote é despachado pelo nosso centro de distribuição e pode ser consultado em tempo real no nosso painel de pedidos ou no site da transportadora parceira.',
  },
  {
    id: 'estorno-reembolso',
    category: 'pagamento',
    question: 'Como e quando recebo o estorno em caso de cancelamento ou devolução?',
    lawReference: 'Art. 49, Parágrafo Único do CDC',
    answer: 'Para compras realizadas via Pix, o estorno é processado instantaneamente na mesma conta bancária pagadora assim que a devolução for validada. Para pagamentos em Cartão de Crédito, solicitamos o estorno à sua operadora em até 48 horas úteis, constando na fatura atual ou subsequente conforme as normas do emissor do seu cartão.',
  },
  {
    id: 'dados-loja',
    category: 'empresa',
    question: 'Quais são os dados cadastrais e canais de contato da Mangazon?',
    lawReference: 'Decreto nº 7.962/2013 - Identificação do Fornecedor',
    answer: 'Mangazon Comércio de Livros e Mangás Ltda. CNPJ: 12.345.678/0001-90. Sede: Av. Paulista, 1000 - Bela Vista, São Paulo/SP - CEP: 01310-100. SAC Central: sac@mangazon.com.br. Horário de Atendimento Humano: Segunda a Sábado, das 08h às 20h (Horário de Brasília).',
  },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  time: string;
}

export const CustomerServiceFAQModal: React.FC<CustomerServiceFAQModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'faq',
  initialCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'human'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [openAccordion, setOpenAccordion] = useState<string | null>('arrependimento');

  // Human Support State
  const [protocolNumber, setProtocolNumber] = useState<string>('');
  const [isChatActive, setIsChatActive] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerOrder, setCustomerOrder] = useState('');
  const [supportReason, setSupportReason] = useState('arrependimento');
  const [userMsgInput, setUserMsgInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [agentTyping, setAgentTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize protocol on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      if (initialCategory) {
        setSelectedCategory(initialCategory);
      }
      if (!protocolNumber) {
        const rand = Math.floor(100000 + Math.random() * 900000);
        const year = new Date().getFullYear();
        setProtocolNumber(`SAC-MNG-${year}-${rand}`);
      }
    }
  }, [isOpen, initialTab, initialCategory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, agentTyping]);

  if (!isOpen) return null;

  const categories = [
    { id: 'todas', label: 'Todas as Dúvidas' },
    { id: 'arrependimento', label: 'Arrependimento (Art. 49)' },
    { id: 'defeito', label: 'Trocas & Avarias (Art. 18)' },
    { id: 'entrega', label: 'Prazos & Frete' },
    { id: 'pagamento', label: 'Estorno & Reembolso' },
    { id: 'atendimento', label: 'Direitos do Consumidor' },
  ];

  const filteredFaq = FAQ_DATA.filter((item) => {
    const matchesCat = selectedCategory === 'todas' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lawReference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartHumanChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) return;

    setIsChatActive(true);
    const initialTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages([
      {
        id: 'sys-1',
        sender: 'system',
        text: `Atendimento iniciado com Protocolo ${protocolNumber}. Em conformidade com o Decreto Federal nº 11.034/2022 (Regulamentação do SAC), a conversa é registrada e armazenada para sua segurança.`,
        time: initialTime,
      },
      {
        id: 'agent-1',
        sender: 'agent',
        text: `Olá, ${customerName}! Meu nome é Lucas Ferreira, sou atendente do SAC da Mangazon Store (Matrícula #4821). Estou com seu protocolo aberto para te auxiliar. Como posso te ajudar com sua solicitação de ${getReasonLabel(supportReason)}?`,
        time: initialTime,
      },
    ]);
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'arrependimento':
        return 'Direito de Arrependimento (Devolução)';
      case 'defeito':
        return 'Troca de Mangá por Defeito ou Avaria';
      case 'entrega':
        return 'Informações sobre Rastreamento ou Atraso';
      case 'pagamento':
        return 'Cancelamento ou Estorno Financeiro';
      default:
        return 'Atendimento Geral com Atendente';
    }
  };

  const handleSendMessageToAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsgInput.trim() || agentTyping) return;

    const userText = userMsgInput.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setUserMsgInput('');

    setChatMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userText,
        time,
      },
    ]);

    // Agent realistic response simulation
    setAgentTyping(true);
    setTimeout(() => {
      setAgentTyping(false);
      let agentReply = `Compreendo perfeitamente, ${customerName}. Já localizei os dados referentes à sua solicitação no sistema. Em cumprimento às diretrizes do Código de Defesa do Consumidor, nosso prazo para envio do código de postagem reversa ou regularização do pedido é de até 24h úteis. O senhor(a) receberá todas as atualizações no e-mail ${customerEmail}.`;

      if (userText.toLowerCase().includes('protocolo') || userText.toLowerCase().includes('comprovante')) {
        agentReply = `Seu protocolo oficial é ${protocolNumber}. Você pode utilizá-lo a qualquer momento para consultar o andamento deste chamado através de qualquer canal do nosso SAC.`;
      } else if (userText.toLowerCase().includes('arrependimento') || userText.toLowerCase().includes('devolver')) {
        agentReply = `Perfeito! Como a solicitação está dentro do prazo legal de 7 dias previsto pelo Artigo 49 do CDC, geramos a autorização de devolução gratuita. Enviamos o código de postagem reversa dos Correios para seu e-mail ${customerEmail}. O estorno integral será efetuado assim que a encomenda for postada.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: agentReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1800);
  };

  return (
    <div
      id="customer-service-faq-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans animate-fade-in"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden h-[90vh] max-h-[720px]">
        {/* Cabeçalho Oficial Amazon/Mangazon */}
        <div className="bg-[#131921] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-gray-800 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#232F3E] text-[#FF9900] border border-gray-700 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#FF9900]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  Central de Ajuda & Atendimento ao Consumidor (SAC)
                </h3>
                <span className="hidden sm:inline-block text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Conformidade CDC & Lei do SAC
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Direito de Arrependimento, Trocas, Prazos e Transferência para Atendimento Humano
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-faq-modal-btn"
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar Central de Ajuda"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Navegação das Abas */}
        <div className="bg-gray-50 border-b border-gray-200 px-5 flex items-center gap-3 select-none">
          <button
            id="tab-faq-btn"
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'border-[#FF9900] text-[#131921] bg-white rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#FF9900]" />
            <span>Dúvidas Frequentes (FAQ)</span>
          </button>

          <button
            id="tab-human-support-btn"
            onClick={() => setActiveTab('human')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer relative ${
              activeTab === 'human'
                ? 'border-[#FF9900] text-[#131921] bg-white rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Headphones className="w-4 h-4 text-emerald-600" />
            <span>Atendimento Humano (SAC)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        {/* CONTEÚDO DA ABA FAQ */}
        {activeTab === 'faq' && (
          <div className="flex-1 overflow-y-auto flex flex-col bg-white">
            {/* Barra de Pesquisa e Filtros */}
            <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="faq-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquise por arrependimento, troca, defeito, prazo, estorno ou CDC..."
                  className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent transition-all shadow-2xs"
                />
              </div>

              {/* Categorias Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#131921] text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Acordeons do FAQ */}
            <div className="p-4 sm:p-5 space-y-3 flex-1 overflow-y-auto">
              {filteredFaq.length === 0 ? (
                <div className="text-center py-12 text-gray-500 space-y-2">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="font-semibold text-sm">Nenhuma dúvida encontrada para "{searchQuery}"</p>
                  <p className="text-xs text-gray-400">
                    Deseja falar diretamente com nossa equipe? Acesse a aba <strong>Atendimento Humano</strong>.
                  </p>
                </div>
              ) : (
                filteredFaq.map((item) => {
                  const isOpen = openAccordion === item.id;
                  return (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl overflow-hidden transition-all bg-white hover:border-gray-300 shadow-2xs"
                    >
                      <button
                        onClick={() => setOpenAccordion(isOpen ? null : item.id)}
                        className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/80 transition-colors"
                      >
                        <div className="space-y-1 pr-2">
                          <span className="text-[10px] font-bold tracking-wider uppercase text-[#FF9900]">
                            {item.lawReference}
                          </span>
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug">
                            {item.question}
                          </h4>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#FF9900]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-100 bg-gray-50/40 animate-fade-in">
                          <p>{item.answer}</p>
                          <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                            <span>Precisa de auxílio nesta solicitação?</span>
                            <button
                              onClick={() => {
                                setSupportReason(item.category === 'defeito' ? 'defeito' : 'arrependimento');
                                setActiveTab('human');
                              }}
                              className="text-[#FF9900] hover:text-[#e68a00] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Acionar SAC Humano</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Rodapé do FAQ com Chamada para Atendimento Humano */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>SAC disponível de Seg. a Sáb. das 08h às 20h. Tempo médio de espera: &lt; 2 min.</span>
              </div>
              <button
                onClick={() => setActiveTab('human')}
                className="bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Falar com Atendente Humano</span>
              </button>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA ATENDIMENTO HUMANO (SAC) */}
        {activeTab === 'human' && (
          <div className="flex-1 overflow-y-auto flex flex-col bg-white">
            {/* Faixa Legal do Protocolo */}
            <div className="bg-amber-50/80 border-b border-amber-200/70 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF9900]" />
                <span>
                  Protocolo Oficial do SAC: <strong className="font-mono text-gray-950 font-bold">{protocolNumber}</strong>
                </span>
              </div>
              <span className="text-[11px] text-amber-800">
                Decreto Federal nº 11.034/2022 (Direito ao Atendimento Humano)
              </span>
            </div>

            {!isChatActive ? (
              /* FORMULÁRIO DE INICIALIZAÇÃO DE ATENDIMENTO HUMANO */
              <div className="p-5 sm:p-6 flex-1 overflow-y-auto max-w-xl mx-auto w-full">
                <div className="mb-5 text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-2 shadow-xs">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-gray-900">
                    Transferência para Operador Humano
                  </h4>
                  <p className="text-xs text-gray-500">
                    Preencha os dados abaixo para conectar com a equipe de suporte especializado da Mangazon.
                  </p>
                </div>

                <form onSubmit={handleStartHumanChat} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo Silva"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Seu E-mail Cadastrado *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Ex: carlos@exemplo.com.br"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Motivo do Contato *
                      </label>
                      <select
                        value={supportReason}
                        onChange={(e) => setSupportReason(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:bg-white"
                      >
                        <option value="arrependimento">Direito de Arrependimento (Devolução 7 dias)</option>
                        <option value="defeito">Mangá com Defeito / Avaria no Transporte</option>
                        <option value="entrega">Atraso na Entrega / Dúvida de Rastreio</option>
                        <option value="pagamento">Cancelamento / Estorno Financeiro</option>
                        <option value="outros">Falar com Atendente sobre Outro Assunto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Número do Pedido (Opcional)
                      </label>
                      <input
                        type="text"
                        value={customerOrder}
                        onChange={(e) => setCustomerOrder(e.target.value)}
                        placeholder="Ex: #MNG-9842"
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      type="submit"
                      id="start-human-chat-btn"
                      className="w-full bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md active:scale-98"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Iniciar Chat com Atendente Humano</span>
                    </button>

                    <a
                      href={`https://wa.me/5511999999999?text=Olá! Gostaria de atendimento humano pelo SAC da Mangazon Store. Meu protocolo é ${protocolNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 text-xs text-center shadow-xs"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Atendimento via WhatsApp Oficial</span>
                    </a>
                  </div>
                </form>
              </div>
            ) : (
              /* CHAT AO VIVO COM OPERADOR HUMANO */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Status do Operador */}
                <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-300">
                        LF
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-gray-900">
                        Lucas Ferreira — SAC Mangazon
                      </h5>
                      <p className="text-[10px] text-emerald-600 font-medium">
                        • Operador conectado • Matrícula #4821
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsChatActive(false)}
                    className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
                  >
                    Encerrar Chamado
                  </button>
                </div>

                {/* Mensagens do Chat Humano */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#F8F9FA]">
                  {chatMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col text-xs sm:text-sm ${
                        m.sender === 'user'
                          ? 'items-end'
                          : m.sender === 'system'
                          ? 'items-center text-center my-2'
                          : 'items-start'
                      }`}
                    >
                      {m.sender === 'system' ? (
                        <div className="bg-amber-100/70 border border-amber-200 text-amber-900 px-3.5 py-2 rounded-xl text-[11px] max-w-[90%] leading-relaxed">
                          {m.text}
                        </div>
                      ) : (
                        <div
                          className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-xs ${
                            m.sender === 'user'
                              ? 'bg-[#131921] text-white rounded-tr-none'
                              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                          }`}
                        >
                          <p>{m.text}</p>
                          <span
                            className={`block text-[10px] mt-1.5 ${
                              m.sender === 'user' ? 'text-gray-400 text-right' : 'text-gray-400 text-left'
                            }`}
                          >
                            {m.time}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  {agentTyping && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-xl w-fit shadow-xs animate-fade-in">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Lucas Ferreira está digitando...</span>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input do Chat Humano */}
                <form
                  onSubmit={handleSendMessageToAgent}
                  className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={userMsgInput}
                    onChange={(e) => setUserMsgInput(e.target.value)}
                    placeholder="Digite sua mensagem para o atendente Lucas..."
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!userMsgInput.trim() || agentTyping}
                    className="bg-[#FF9900] hover:bg-[#e68a00] disabled:bg-gray-200 disabled:text-gray-400 text-black font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs sm:text-sm flex-shrink-0"
                  >
                    <span>Enviar</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
