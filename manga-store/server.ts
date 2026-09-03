import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
// Carrega variáveis de ambiente canônicas da raiz do projeto (.env)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = 5173;

app.use(express.json({ limit: '10mb' }));

// ----------------------------------------------------
// AI Filtering Pipeline & Prompt Engineering
// ----------------------------------------------------

/**
 * Filtro de saída pós-processamento para garantir respostas limpas, diretas e coerentes.
 * Remove preâmbulos robóticos de LLM, normaliza marcadores e elimina artefatos de formatação.
 */
export function sanitizeAndFilterAIResponse(raw: string): string {
  if (!raw) return '';

  let text = raw.trim();

  // 1. Remover cercas de bloco de código acidentais (ex: ```markdown ... ```)
  text = text.replace(/^```(?:markdown)?\s*([\s\S]*?)\s*```$/i, '$1').trim();

  // 2. Filtro de preâmbulos e clichês de IA no início da resposta
  const preamblePatterns = [
    /^(?:com certeza|certamente|com prazer|olá[!,\.]?|olá,[^.\n]*[!,\.]?|aqui está[^.:\n]*[:.]?)\s*/i,
    /^(?:como especialista da mangazon|como consultor da mangazon|como assistente da mangazon)[^.\n]*[:.]?\s*/i,
    /^(?:sobre a sua (?:dúvida|pergunta)|em relação [aà] sua (?:dúvida|pergunta)|você perguntou sobre)[^.\n]*[:.]?\s*/i,
    /^(?:compreendo perfeitamente[!,\.]?|entendo perfeitamente[!,\.]?)\s*/i,
  ];

  for (const pattern of preamblePatterns) {
    text = text.replace(pattern, '').trim();
  }

  // 3. Normalizar marcadores de lista (* ou - soltos para bullet uniforme '• ')
  text = text.replace(/^(\s*)\*\s+/gm, '$1• ');
  text = text.replace(/^(\s*)-\s+/gm, '$1• ');

  // 4. Limpar quebras de linha excessivas (3 ou mais consecutivas)
  text = text.replace(/\n{3,}/g, '\n\n');

  // 5. Garantir primeira letra maiúscula após remoção de preâmbulo
  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  return text.trim();
}

/**
 * Resposta de contingência offline (SEM dados ou mangás mockados específicos).
 * Trata apenas direitos do consumidor e orientações gerais quando a nuvem estiver indisponível.
 */
function generateLocalFallbackResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('humano') || p.includes('atendente') || p.includes('sac') || p.includes('procon') || p.includes('reclama')) {
    return '🤝 **Atendimento Humano (SAC Mangazon)**:\n\n' +
      'Em conformidade com o **Decreto Federal nº 11.034/2022 (Regulamentação do SAC)** e o Código de Defesa do Consumidor, você tem o direito garantido de ser atendido por um operador humano a qualquer momento.\n\n' +
      '• **Como acionar:** Clique no botão **"Atendimento Humano (SAC)"** no topo desta janela ou acesse a aba **"Ajuda & SAC (CDC)"** no menu da loja para receber seu **Número de Protocolo oficial** gerado na hora e conversar com nossa equipe por Chat ao Vivo ou WhatsApp.';
  }

  if (p.includes('devol') || p.includes('arrepend') || p.includes('troca') || p.includes('defeito') || p.includes('avaria')) {
    return '📦 **Trocas e Devoluções (Código de Defesa do Consumidor)**:\n\n' +
      '• **Direito de Arrependimento (Art. 49 do CDC):** Prazo legal de até **7 dias corridos** após o recebimento para devolução com reembolso 100% integral (produto e frete original).\n' +
      '• **Garantia contra Vícios ou Defeitos (Art. 18 do CDC):** Troca imediata sem custo caso o mangá apresente defeitos gráficos ou avarias de transporte.\n' +
      '• **Como solicitar:** Acesse o menu **"Ajuda & SAC (CDC)"** ou acione o Atendimento Humano para emitir o código de postagem reversa dos Correios.';
  }

  return 'O serviço de consulta online da inteligência artificial está temporariamente indisponível. Você pode navegar pelos títulos diretamente pelos filtros de Categoria (Shonen, Seinen, Shojo), buscar volumes específicos na barra de pesquisa no topo ou consultar a aba **Guia de Leitura** para cronologias e arcos canônicos.';
}

function getGeminiApiKey(): string | undefined {
  dotenv.config({ path: path.resolve(process.cwd(), '../.env'), override: true });
  dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
  return process.env.GEMINI_API_KEY;
}

// ----------------------------------------------------
// Prompt do Sistema (Engenharia de Prompt para Respostas Limpas, Diretas e Coerentes)
// ----------------------------------------------------
const MANGAZON_SYSTEM_INSTRUCTION = `Você é o consultor de vendas e atendimento especialista da Mangazon Store, a principal loja online brasileira dedicada a mangás, manhwas e edições de colecionador.

# DIRETRIZES FUNDAMENTAIS DE RESPOSTA (ENGENHARIA DE PROMPT E FILTRAGEM):
1. **DIRETO AO PONTO (ZERO ENROLAÇÃO)**:
   - Responda a dúvida do cliente imediatamente no primeiro parágrafo.
   - NUNCA use saudações vazias ou introduções clichês de IA (ex: JAMAIS diga "Com certeza!", "Certamente!", "Olá, como assistente...", "Sobre a sua dúvida sobre...", "Você perguntou sobre...").
   - NUNCA repita a pergunta do usuário.
   - NUNCA diga que é uma inteligência artificial ou modelo de linguagem. Fale com a naturalidade, autoridade e precisão de um livreiro experiente da Mangazon.

2. **RESPOSTAS LIMPAS, DIRETAS E COERENTES**:
   - Seja conciso e elegante: responda de forma objetiva em 2 a 4 parágrafos curtos ou tópicos ('• ').
   - Não seja prolixo. Elimine adjetivações excessivas e frases de transição dispensáveis.

3. **CONHECIMENTO FACTUAL DO MERCADO BRASILEIRO E ACERVO**:
   - Forneça informações reais e precisas sobre volumes lançados no Brasil, editoras nacionais (Panini, JBC, NewPOP, Pipoca & Nanquim, Conrad), arcos canônicos e equivalência anime/mangá (onde o anime termina e qual volume o cliente deve comprar para continuar).
   - Formatos da loja: Paperback (capa comum), Deluxe Hardcover (capa dura de luxo / 3-em-1) e Collector Box Sets (caixas de colecionador).
   - Diferenciais da loja: "Seletor de Volumes" (escolha do volume específico no card), "Espiar por Dentro" (Look Inside para folhear páginas de demonstração), "Guia de Leitura" e cupons MANGA20 e OTAKU10.

4. **DIREITO DO CONSUMIDOR E ATENDIMENTO HUMANO (Decreto SAC nº 11.034/2022 e CDC)**:
   - Se o cliente perguntar sobre falar com atendente humano, registrar reclamação, solicitar cancelamento, devolução ou estorno:
     • Esclareça objetivamente o Artigo 49 do CDC (Direito de Arrependimento de 7 dias corridos com reembolso 100% integral e frete reverso gratuito).
     • Oriente o cliente diretamente a clicar no botão "Atendimento Humano (SAC)" no topo da janela ou na aba "Ajuda & SAC (CDC)" no topo do site para falar ao vivo com um atendente e receber seu Número de Protocolo oficial na hora.

5. **FORMATAÇÃO VISUAL IMPECÁVEL**:
   - Use negrito estrategicamente apenas para títulos de obras, números de volumes, capítulos e termos essenciais (**Volume X**, **Capítulo Y**).
   - NUNCA use cabeçalhos gigantes (# ou ##) que poluem o visual do chat; prefira tópicos ('• ') e negrito.
   - NUNCA deixe asteriscos soltos ou caracteres quebrados.`;

// Endpoint de Consulta de IA
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { prompt, question } = req.body || {};
    const userPrompt = (prompt || question || '').trim();

    if (!userPrompt) {
      return res.status(400).json({ 
        success: false, 
        error: 'Por favor, digite uma pergunta no campo de texto.' 
      });
    }

    const apiKey = getGeminiApiKey();

    // Se houver uma chave real configurada no .env, chama a API Gemini via @google/genai com timeout resiliente
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
      const modelsToTry = [
        'gemini-flash-latest',
        'gemini-3.5-flash',
        'gemini-flash-lite-latest',
      ];
      for (const modelName of modelsToTry) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const callPromise = ai.models.generateContent({
            model: modelName,
            contents: `${MANGAZON_SYSTEM_INSTRUCTION}

Pergunta do cliente: ${userPrompt}`,
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout ao conectar com o serviço de nuvem')), 6000)
          );

          const response: any = await Promise.race([callPromise, timeoutPromise]);

          if (response && response.text) {
            const cleanAnswer = sanitizeAndFilterAIResponse(response.text);
            return res.json({
              success: true,
              answer: cleanAnswer
            });
          }
        } catch (modelErr: any) {
          console.warn(`Tentativa com ${modelName} falhou:`, modelErr?.message || modelErr);
        }
      }
    }

    // Resposta de contingência limpa (sem dados mockados)
    const localAnswer = sanitizeAndFilterAIResponse(generateLocalFallbackResponse(userPrompt));
    return res.json({
      success: true,
      answer: localAnswer
    });

  } catch (error: any) {
    console.error('Erro na rota /api/ai/ask:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro no processamento da requisição de IA: ' + (error?.message || 'Erro desconhecido')
    });
  }
});

// Endpoint de Status da IA (para diagnóstico de variáveis de ambiente)
app.get('/api/ai/status', (req, res) => {
  const apiKey = getGeminiApiKey();
  const isConfigured = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY';
  res.json({
    status: 'UP',
    hasEnvFile: true,
    geminiKeyConfigured: isConfigured,
    tokenMasked: isConfigured ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'Token de exemplo (MY_GEMINI_API_KEY)',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ----------------------------------------------------
// Vite Middleware setup for development & production
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mangazon Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
