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
// AI Endpoint (Mangazon Store Consultant)
// ----------------------------------------------------
function generateLocalMangaAIResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('frieren') || p.includes('sousou') || p.includes('himmel') || p.includes('fern') || p.includes('stark')) {
    return '🌿 **Frieren e a Jornada para o Além (Sousou no Frieren)**:\n\n' +
      '• **Previsão de Lançamentos:** No Brasil, a publicação oficial é da Panini. Os **Volumes 1 ao 12** estão disponíveis no nosso catálogo, e o **Volume 13** tem previsão de chegada para os próximos meses de 2025/2026, mantendo o ritmo de publicação bimestral/trimestral da editora.\n' +
      '• **Edições Especiais na Mangazon:** Temos tanto a edição padrão quanto as edições especiais com marcadores e postais colecionáveis.\n' +
      '• **Continuação após o Anime:** A 1ª temporada do anime (28 episódios) adapta os capítulos 1 ao 60. Se você quer continuar a história, comece pelo **Volume 7 (Capítulo 61)**!\n' +
      '• **Dica da Loja:** Você pode usar o botão **"Espiar por Dentro"** no card de Frieren para folhear as primeiras páginas antes de comprar.';
  }

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

  if (p.includes('chainsaw') || p.includes('denji') || p.includes('makima') || p.includes('pochita')) {
    return '🪚 **Chainsaw Man (Tatsuki Fujimoto)**:\n\n' +
      '• **Parte 1 (Segurança Pública):** Completa nos **Volumes 1 ao 11**.\n' +
      '• **Parte 2 (Academia):** Em publicação a partir do **Volume 12** em diante.\n' +
      '• **Disponibilidade:** Volumes avulsos e Box Sets com envio imediato na Mangazon Store.';
  }

  if (p.includes('dandadan') || p.includes('okarun') || p.includes('momo')) {
    return '🛸 **Dandadan (Yukinobu Tatsu)**:\n\n' +
      '• **Status no Brasil:** Publicação oficial pela Panini com volumes do 1 ao 10+ disponíveis com frete expresso na Mangazon.\n' +
      '• **Edições:** Acompanha sobrecapa e qualidade gráfica impecável. Sucesso imperdível!';
  }

  if (p.includes('solo leveling') || p.includes('sung jinwoo') || p.includes('jin-woo')) {
    return '🗡️ **Solo Leveling (Chugong / DUBU)**:\n\n' +
      '• **Formato:** Manhwa totalmente colorido em papel couchê de alta gramatura, publicado pela NewPOP.\n' +
      '• **Volumes:** Coleção completa em publicação com os principais arcos disponíveis na Mangazon Store.';
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
      '2. **Para Fantasia Madura:** *Berserk (Deluxe)*, *Frieren*, *Attack on Titan*.\n' +
      '3. **Para Obras Completas:** *Demon Slayer* (23 volumes), *Death Note* (12 volumes/Black Edition).\n' +
      'Dica: Utilize nossa barra de filtros por Categoria (Shonen, Seinen, Shojo) ou consulte a aba Guia de Leitura!';
  }

  return 'Olá! Sou o consultor de atendimento da **Mangazon Store**, especializado em mangás nacionais e importados.\n\n' +
    '• **Como posso te ajudar:** Informações sobre volumes específicos, previsão de novos lançamentos (Panini, JBC, NewPOP), ordem canônica de leitura e onde o anime para no mangá.\n' +
    '• **Dica de Compra na Mangazon:** Você pode escolher qualquer volume diretamente pelo **Seletor de Volumes** no card do produto e clicar em **"Espiar por Dentro"** para ver páginas de demonstração antes de adicionar ao carrinho!\n\n' +
    'Se desejar saber sobre alguma série em específico (como *Frieren*, *One Piece*, *Berserk*, *Jujutsu Kaisen* ou lançamentos recentes), basta me dizer o título!';
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

    // Se houver uma chave real configurada no .env, chama a API Gemini via @google/genai com timeout resiliente de 25s
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
      const modelsToTry = [
        'gemini-flash-lite-latest',
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
        'gemini-3.5-flash',
        'gemini-pro-latest'
      ];
      for (const modelName of modelsToTry) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const callPromise = ai.models.generateContent({
            model: modelName,
            contents: `Você é o consultor especialista de vendas e atendimento da Mangazon Store, a maior loja online de mangás do Brasil.

QUEM VOCÊ É E ONDE VOCÊ TRABALHA:
- Você trabalha no atendimento ao cliente da Mangazon Store (e-commerce oficial focado em mangás).
- Seu tom deve ser o de um livreiro especialista, acolhedor, apaixonado por mangás, direto ao ponto e prestativo.
- NUNCA repita a pergunta do usuário como introdução (ex: JAMAIS diga "Sobre sua dúvida sobre..." ou "Você perguntou sobre..."). Vá direto à resposta útil!
- NUNCA diga que é uma IA ou modelo de linguagem. Você é o assistente oficial da loja Mangazon.

RECURSOS E CATÁLOGO DA MANGAZON STORE:
- Obras disponíveis em nosso catálogo:
  • Frieren (Sousou no Frieren / Frieren e a Jornada para o Além): Sucesso absoluto publicado pela Panini no Brasil. Temos volumes do 1 ao 12 em estoque, e o Volume 13 tem previsão de lançamento oficial no Brasil nos próximos meses (publicação regular bimestral/trimestral da Panini). Oferecemos também edições especiais com brindes e marcadores. Se a pessoa veio do anime (28 episódios), a história continua no mangá a partir do Volume 7 (Capítulo 61).
  • One Piece: Obra de Eiichiro Oda (volumes 1 ao 108+), com o despertar do Gear 5 no Volume 103 (Capítulo 1044) e clímax de Wano nos vols 104 e 105.
  • Berserk: Obra-prima de Kentaro Miura, disponível em edições avulsas e na aclamada Edição Deluxe Hardcover 3-em-1 em capa dura.
  • Dandadan, Chainsaw Man, Jujutsu Kaisen, Solo Leveling, Demon Slayer (completo em 23 volumes), Attack on Titan, Spy x Family, Tokyo Ghoul, Vinland Saga, Vagabond, Naruto, Bleach, Hunter x Hunter, Death Note.
- Formatos e Serviços da loja:
  • Formatos: Paperback (capa comum), Deluxe Hardcover (capa dura de luxo) e Collector Box Sets (caixas especiais).
  • Seletor de Volumes: o cliente pode escolher o volume exato desejado (Vol. 1 ao mais recente) diretamente no card ou na página do título.
  • "Espiar por Dentro" (Look Inside): recurso interativo para folhear as primeiras páginas de qualquer mangá antes de comprar.
  • "Guia de Leitura": aba com cronologia de arcos e equivalência mangá/anime.
  • Frete Grátis Express para compras acima de R$ 99 e cupons de desconto OTAKU10 e MANGA20.

Responda em português do Brasil de forma clara, prestativa e bem formatada em tópicos (Markdown).

Pergunta do cliente: ${userPrompt}`,
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout ao conectar com o serviço de nuvem')), 25000)
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
