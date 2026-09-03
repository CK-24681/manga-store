package com.mangazon.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        String apiKey = System.getenv("GEMINI_API_KEY");
        boolean isConfigured = apiKey != null && !apiKey.isBlank() && !apiKey.equals("MY_GEMINI_API_KEY");
        
        String maskedToken = "Token de exemplo (MY_GEMINI_API_KEY)";
        if (isConfigured && apiKey != null && apiKey.length() >= 8) {
            maskedToken = apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length() - 4);
        }
        
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "hasEnvFile", true,
            "geminiKeyConfigured", isConfigured,
            "tokenMasked", maskedToken,
            "runtime", "Java 21 Spring Boot LTS"
        ));
    }

    @PostMapping("/ask")
    public ResponseEntity<Map<String, Object>> askAI(@RequestBody Map<String, String> body) {
        String prompt = body.getOrDefault("prompt", body.getOrDefault("question", "")).trim();
        
        if (prompt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Por favor, digite uma pergunta no campo de texto."
            ));
        }

        String answer = generateResponse(prompt);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "answer", answer,
            "model", "Mangazon Otaku-AI (Spring Boot)",
            "source", "Backend Seguro (Java Spring Boot)"
        ));
    }

    private String generateResponse(String prompt) {
        String p = prompt.toLowerCase();

        if (p.contains("humano") || p.contains("atendente") || p.contains("sac") || p.contains("procon") || p.contains("reclama")) {
            return "🤝 **Atendimento Humano (SAC Mangazon)**:\n\n" +
                   "Em conformidade com o **Decreto Federal nº 11.034/2022 (Regulamentação do SAC)** e o Código de Defesa do Consumidor, você tem o direito garantido de ser atendido por um operador humano a qualquer momento.\n\n" +
                   "• **Como acionar:** Acesse a aba **\"Ajuda & SAC (CDC)\"** no menu da loja ou acione o botão de Atendimento Humano para receber seu **Número de Protocolo oficial** gerado na hora!\n" +
                   "• **Canais:** Chat ao Vivo e WhatsApp do SAC (Segunda a Sábado, das 08h às 20h).";
        }

        if (p.contains("devol") || p.contains("arrepend") || p.contains("troca") || p.contains("defeito")) {
            return "📦 **Trocas e Devoluções (Código de Defesa do Consumidor)**:\n\n" +
                   "• **Direito de Arrependimento (Art. 49 do CDC):** Prazo legal de **7 dias corridos** após o recebimento para solicitar devolução com reembolso 100% integral (produto e frete original).\n" +
                   "• **Garantia contra Vício/Defeito (Art. 18 do CDC):** Troca imediata sem qualquer custo para o consumidor em casos de páginas danificadas ou avaria no transporte.\n" +
                   "• **Como solicitar:** Pela Central de Ajuda & FAQ na loja ou diretamente com nosso SAC humano para emissão do código de postagem reversa dos Correios.";
        }

        return filterAndSanitize(
            "O serviço de inteligência artificial online está temporariamente em manutenção. " +
            "Você pode pesquisar títulos diretamente pela barra de busca no topo do site, filtrar os volumes por Categoria (Shonen, Seinen, Shojo) " +
            "ou consultar a aba **Guia de Leitura** para conferir a ordem canônica e arcos de cada obra."
        );
    }

    /**
     * Filtro de sanitização para garantir respostas limpas, diretas e coerentes.
     * Elimina preâmbulos robóticos de IA e padroniza marcadores.
     */
    private String filterAndSanitize(String raw) {
        if (raw == null || raw.isBlank()) {
            return "";
        }

        String text = raw.trim();

        // 1. Remover cercas de código markdown acidentais
        text = text.replaceAll("(?i)^```(?:markdown)?\\s*([\\s\\S]*?)\\s*```$", "$1").trim();

        // 2. Filtro de preâmbulos e clichês robóticos no início
        text = text.replaceAll("(?i)^(?:com certeza|certamente|com prazer|olá[!.]?|olá,[^.\n]*[!.]?|aqui está[^.:\n]*[:.]?)\\s*", "").trim();
        text = text.replaceAll("(?i)^(?:como especialista da mangazon|como consultor da mangazon|como assistente da mangazon)[^.\n]*[:.]?\\s*", "").trim();
        text = text.replaceAll("(?i)^(?:sobre a sua (?:dúvida|pergunta)|em relação [aà] sua (?:dúvida|pergunta)|você perguntou sobre)[^.\n]*[:.]?\\s*", "").trim();

        // 3. Normalizar marcadores de lista (* ou - soltos para bullet uniforme '• ')
        text = text.replaceAll("(?m)^(\\s*)[*-]\\s+", "$1• ");

        // 4. Limpar quebras de linha excessivas
        text = text.replaceAll("\n{3,}", "\n\n");

        if (!text.isEmpty()) {
            text = Character.toUpperCase(text.charAt(0)) + (text.length() > 1 ? text.substring(1) : "");
        }

        return text.trim();
    }
}
