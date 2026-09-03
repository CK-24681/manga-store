import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  Headphones,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHumanSupport?: () => void;
}

interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_SUGGESTIONS = [
  'Falar com Atendente Humano (SAC)',
  'Como devolver por arrependimento (Art. 49)?',
  'Prazos de entrega e frete grátis',
  'Garantia contra avarias e trocas',
];

function renderFormattedMessage(text: string) {
  const paragraphs = text.split('\n');
  return paragraphs.map((paragraph, pIdx) => {
    const trimmed = paragraph.trim();
    if (!trimmed) {
      return <div key={pIdx} className="h-1.5" />;
    }

    const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ');
    const content = isBullet ? trimmed.replace(/^(\*|-|•)\s+/, '') : paragraph;

    const parts = content.split(/(\*\*.*?\*\*)/g);
    const renderedParts = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={partIdx} className="font-bold text-gray-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <React.Fragment key={partIdx}>{part}</React.Fragment>;
    });

    if (isBullet) {
      return (
        <div key={pIdx} className="flex items-start gap-2 mt-1.5 ml-1 text-gray-800">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9900] mt-1.5 flex-shrink-0" />
          <div className="flex-1 leading-relaxed text-xs sm:text-sm">{renderedParts}</div>
        </div>
      );
    }

    return (
      <p key={pIdx} className={pIdx > 0 ? 'mt-2 leading-relaxed' : 'leading-relaxed'}>
        {renderedParts}
      </p>
    );
  });
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onOpenHumanSupport,
}) => {
  const { language } = useLanguage();
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Olá! Sou o assistente de atendimento da Mangazon Store. Como posso te ajudar hoje?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleAskAI = async (promptToSend?: string) => {
    const query = (promptToSend || question).trim();
    if (!query || isLoading) return;

    // Se o usuário pedir explicitamente para falar com humano
    if (
      query.toLowerCase().includes('falar com atendente') ||
      query.toLowerCase().includes('atendimento humano') ||
      query.toLowerCase().includes('humano')
    ) {
      const userMessage: AIMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Em conformidade com o **Decreto Federal nº 11.034/2022 (Regulamentação do SAC)** e o Código de Defesa do Consumidor, você tem o direito garantido de ser transferido para um atendente humano a qualquer momento.\n\nClique no botão abaixo para abrir a nossa Central de Atendimento Humano, onde você receberá um **Número de Protocolo oficial** e poderá conversar com nossa equipe por chat ao vivo ou WhatsApp!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMessage, aiMessage]);
      setQuestion('');
      return;
    }

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await response.json();

      if (data.success && data.answer) {
        const aiMessage: AIMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage: AIMessage = {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `Não foi possível obter a resposta no momento. ${data.error || 'Por favor, tente novamente.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err: any) {
      console.error('Erro na requisição do assistente:', err);
      const networkErrorMessage: AIMessage = {
        id: `net-err-${Date.now()}`,
        sender: 'ai',
        text: 'Erro de conexão com o servidor. Por favor, verifique sua conexão e tente novamente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, networkErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: 'Conversa reiniciada. Em que mais posso te ajudar?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div
      id="ai-assistant-modal-container"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden h-[85vh] max-h-[680px]">
        {/* Cabeçalho Clean & Robusto com Mascote */}
        <div className="bg-[#131921] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between border-b border-gray-800 select-none">
          <div className="flex items-center gap-3">
            <img
              src="/mascot.jpg"
              alt="Mascote Mangazon"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#FF9900]/70 shadow-sm ring-1 ring-white/15"
            />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Assistente Mangazon
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Atendimento ao cliente e suporte oficial
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenHumanSupport && (
              <button
                id="header-open-human-support-btn"
                onClick={() => {
                  onClose();
                  onOpenHumanSupport();
                }}
                className="flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer hover:text-white"
                title="Transferir para atendimento humano (Decreto SAC nº 11.034/2022)"
              >
                <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Atendimento Humano (SAC)</span>
                <span className="sm:hidden">SAC</span>
              </button>
            )}
            <button
              onClick={handleClearHistory}
              title="Limpar conversa"
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="close-ai-modal-btn"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── ÁREA DE MENSAGENS (Requisito 1: Container de Resposta) ── */}
        <div
          id="ai-response-container"
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F7F8FA]"
        >
          <ul id="ai-messages-list" className="space-y-4 list-none m-0 p-0">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`flex gap-2.5 text-xs sm:text-sm ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <img
                    src="/mascot.jpg"
                    alt="Mascote Mangazon"
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5 border border-[#FF9900]/50 shadow-2xs"
                  />
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 sm:p-4 leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#131921] text-white rounded-tr-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <div className="break-words font-sans">
                    {renderFormattedMessage(msg.text)}
                  </div>

                  {/* Card Interativo de Transferência Humana */}
                  {msg.sender === 'ai' &&
                    onOpenHumanSupport &&
                    (msg.text.toLowerCase().includes('humano') ||
                      msg.text.toLowerCase().includes('atendente') ||
                      msg.text.toLowerCase().includes('sac') ||
                      msg.text.toLowerCase().includes('devolu') ||
                      msg.text.toLowerCase().includes('arrependimento') ||
                      msg.text.toLowerCase().includes('troca')) && (
                      <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-gray-500 text-[11px]">
                          Direito do Consumidor (Dec. nº 11.034/2022):
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenHumanSupport();
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap active:scale-95"
                        >
                          <Headphones className="w-3.5 h-3.5" />
                          <span>Falar com Atendente Humano</span>
                        </button>
                      </div>
                    )}

                  <div
                    className={`flex items-center justify-between gap-3 mt-2.5 pt-1.5 border-t text-[10px] ${
                      msg.sender === 'user'
                        ? 'border-gray-800 text-gray-400'
                        : 'border-gray-100 text-gray-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-gray-700 cursor-pointer flex items-center gap-1 transition-colors"
                        title="Copiar texto"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}

            {isLoading && (
              <li className="flex gap-2.5 text-xs sm:text-sm justify-start animate-fade-in">
                <img
                  src="/mascot.jpg"
                  alt="Mascote Mangazon"
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0 animate-pulse border border-[#FF9900]/50 shadow-2xs"
                />
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-2.5 text-gray-600 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-[#FF9900]" />
                  <span>Consultando acervo e preparando resposta...</span>
                </div>
              </li>
            )}
          </ul>

          <div ref={messagesEndRef} />
        </div>

        {/* Tópicos Rápidos de Atendimento (Pills limpos) */}
        <div className="px-4 sm:px-5 py-2.5 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-gray-400 font-medium flex-shrink-0 flex items-center gap-1 mr-1">
            <MessageSquare className="w-3 h-3 text-gray-400" />
            Ajuda rápida:
          </span>
          {QUICK_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAskAI(sug)}
              disabled={isLoading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer text-xs font-medium active:scale-95 disabled:opacity-50"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* ── FORMULÁRIO COM CAMPO DE TEXTO E BOTÃO DE ENVIO (Requisito 1) ── */}
        <form
          id="ai-question-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAI();
          }}
          className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            id="ai-question-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Digite sua dúvida ou solicitação..."
            disabled={isLoading}
            className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent focus:bg-white transition-all"
          />

          <button
            type="submit"
            id="ai-submit-button"
            disabled={isLoading || !question.trim()}
            className="bg-[#FF9900] hover:bg-[#e68a00] disabled:bg-gray-200 disabled:text-gray-400 text-black font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-xs sm:text-sm cursor-pointer disabled:cursor-not-allowed shadow-xs active:scale-95 flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Enviar</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
