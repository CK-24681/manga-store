import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  MANGAZON_SYSTEM_INSTRUCTION,
  AI_RECOMMENDED_MODELS,
  sanitizeAndFilterAIResponse,
  generateLocalFallbackResponse,
} from './src/config/aiPromptConfig';

// Carrega variáveis de ambiente canônicas da raiz do projeto (.env)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = 5173;

app.use(express.json({ limit: '10mb' }));

function getGeminiApiKey(): string | undefined {
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

    // Se houver uma chave real configurada no .env, chama a API Gemini via @google/genai com systemInstruction nativo
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
      for (const modelName of AI_RECOMMENDED_MODELS) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const callPromise = ai.models.generateContent({
            model: modelName,
            contents: userPrompt,
            config: {
              systemInstruction: MANGAZON_SYSTEM_INSTRUCTION,
              temperature: 0.3,
              maxOutputTokens: 1000,
            },
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout ao conectar com o serviço de nuvem')), 12000)
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
