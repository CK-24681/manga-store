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
// AI Endpoint (Aula 02 - História da IA: Pré-requisitos)
// ----------------------------------------------------
function generateLocalMangaAIResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('one piece') || p.includes('luffy') || p.includes('gear 5')) {
    return '🏴‍☠️ **One Piece (Eiichiro Oda)**:\n\n' +
      '• **Gear 5:** O despertar da Fruta do Humano Modelo Nika acontece no **Volume 103 (Capítulo 1044)** e a batalha atinge o ápice no **Volume 104 e 105** no clímax de Wano!\n' +
      '• **Ordem de Leitura:** Recomendamos iniciar do **Volume 1 (Romance Dawn)**. Arcos cruciais incluem Alabasta (Vols 18–24), Marineford (Vols 56–60) e País de Wano (Vols 90–105).\n' +
      '• **Na Mangazon Store:** Todos os volumes estão disponíveis em formato Paperback com frete grátis express.';
  }

  if (p.includes('berserk') || p.includes('guts') || p.includes('griffith')) {
    return '🗡️ **Berserk (Kentaro Miura)**:\n\n' +
      '• **Por onde começar:** Comece pelo **Volume 1 (Espadachim Negro)** ou diretamente pela **Edição Deluxe Hardcover Vol. 1**, que reúne os primeiros 3 volumes originais em capa dura e formato oversized.\n' +
      '• **Arcos Imperdíveis:** A **Era de Ouro (Golden Age - Vols 3 a 14)** é uma das maiores obras-primas das narrativas de dark fantasy mundial.\n' +
      '• **Classificação:** Recomendado para maiores de 18 anos devido a temas maduros e violência explícita.';
  }

  if (p.includes('jujutsu') || p.includes('gojo') || p.includes('sukuna')) {
    return '🤞 **Jujutsu Kaisen (Gege Akutami)**:\n\n' +
      '• **Arco de Shibuya:** Um dos arcos mais aclamados se estende dos **Volumes 10 ao 16 (Capítulos 79–136)**.\n' +
      '• **Dica Canônica:** Antes do volume 1, você também pode ler o **Volume 0 (Jujutsu Kaisen 0)**, focado em Yuta Okkotsu.\n' +
      '• **Disponibilidade:** Todos os volumes até o clímax da Batalha de Shinjuku disponíveis para envio imediato.';
  }

  if (p.includes('demon slayer') || p.includes('kimetsu') || p.includes('tanjiro')) {
    return '⚔️ **Demon Slayer: Kimetsu no Yaiba (Koyoharu Gotouge)**:\n\n' +
      '• **Status da Obra:** Série completa em **23 volumes** (205 capítulos).\n' +
      '• **Castelo Infinito:** O clímax com as Luas Superiores e Muzan começa a partir do **Volume 16** e vai até o Volume 23.';
  }

  if (p.includes('hunter') || p.includes('gon') || p.includes('killua')) {
    return '🎣 **Hunter x Hunter (Yoshihiro Togashi)**:\n\n' +
      '• **Continuação após o Anime (2011):** O anime finaliza no capítulo 339 (Volume 32). Para continuar a história na Expedição do Continente Sombrio e Guerra de Sucessão, comece do **Volume 33** em diante!';
  }

  if (p.includes('recomen') || p.includes('indica') || p.includes('parecido') || p.includes('melhor')) {
    if (p.includes('seinen') || p.includes('sombrio') || p.includes('adulto')) {
      return '💀 **Recomendações Seinen & Dark Fantasy:**\n\n' +
        '1. **Berserk** — A quintessência da fantasia sombria.\n' +
        '2. **Vinland Saga** — Épico viking histórico profundo sobre vingança e redenção.\n' +
        '3. **Tokyo Ghoul** — Terror psicológico urbano e batalhas sobrenaturais.\n' +
        '4. **Monster (Naoki Urasawa)** — Suspense policial psicológico espetacular.';
    }
    return '📚 **Recomendações de Destaque na Mangazon Store:**\n\n' +
      '1. **Para Aventura e Ação:** *One Piece*, *Jujutsu Kaisen*, *Chainsaw Man*.\n' +
      '2. **Para Fantasia Madura:** *Berserk (Deluxe)*, *Attack on Titan*.\n' +
      '3. **Para Obras Completas:** *Demon Slayer* (23 volumes), *Death Note* (12 volumes/Black Edition).\n' +
      'Dica: Utilize nossa barra de filtros por Categoria (Shonen, Seinen, Shojo) ou consulte a aba Guia de Leitura!';
  }

  return `📚 **Consultor Mangazon:**\n\n` +
    `Sobre sua dúvida sobre *" ${prompt} "*:\n\n` +
    `Na Mangazon Store, você encontra volumes oficiais com faixas completas de capítulos e arcos canônicos detalhados.\n\n` +
    `💡 **Dica da Loja:** Você pode selecionar o volume exato que deseja comprar diretamente na vitrine ou na página do título, além de utilizar o recurso **"Espiar por Dentro"** para folhear as primeiras páginas antes da compra!`;
}

function getGeminiApiKey(): string | undefined {
  dotenv.config({ path: path.resolve(process.cwd(), '../.env'), override: true });
  dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
  return process.env.GEMINI_API_KEY;
}

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
      const modelsToTry = ['gemini-3.6-flash', 'gemini-1.5-flash'];
      for (const modelName of modelsToTry) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const callPromise = ai.models.generateContent({
            model: modelName,
            contents: `Você é o consultor de atendimento da Mangazon Store, a loja online especializada em mangás.
Seu objetivo é ajudar o leitor com:
- Recomendações de mangás de acordo com o gosto do leitor
- Ordem de leitura, cronologia e arcos
- Faixas de volumes e capítulos
Diretrizes:
- Responda de forma natural, cortês, direta e bem diagramada em tópicos (markdown), em português do Brasil.
- Aja como um especialista humano e prestativo em mangás; evite jargões robóticos sobre modelos ou inteligência artificial.

Pergunta do cliente: ${userPrompt}`,
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout ao conectar com o serviço de nuvem')), 7000)
          );

          const response: any = await Promise.race([callPromise, timeoutPromise]);

          if (response && response.text) {
            return res.json({
              success: true,
              answer: response.text
            });
          }
        } catch (modelErr: any) {
          console.warn(`Tentativa com ${modelName} falhou:`, modelErr?.message || modelErr);
        }
      }
    }

    // Resposta do Motor de Conhecimento Local (fallback offline)
    const localAnswer = generateLocalMangaAIResponse(userPrompt);
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
