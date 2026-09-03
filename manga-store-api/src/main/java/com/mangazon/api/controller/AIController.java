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

        if (p.contains("one piece") || p.contains("luffy") || p.contains("gear 5")) {
            return "🏴‍☠️ **One Piece (Eiichiro Oda)**:\n\n" +
                   "• **Gear 5:** O despertar acontece no **Volume 103 (Capítulo 1044)** e a grande batalha ocorre nos **Volumes 104 e 105**!\n" +
                   "• **Ordem de Leitura:** Inicie pelo **Volume 1 (Romance Dawn)**. Arcos recomendados: Alabasta (Vols 18–24), Marineford (Vols 56–60) e Wano (Vols 90–105).\n" +
                   "• Todos os volumes canônicos disponíveis com envio expresso.";
        }

        if (p.contains("berserk") || p.contains("guts") || p.contains("griffith")) {
            return "🗡️ **Berserk (Kentaro Miura)**:\n\n" +
                   "• **Por onde começar:** Comece pelo **Volume 1** ou pela prestigiada **Edição Deluxe Hardcover Vol. 1**.\n" +
                   "• **Era de Ouro:** Abrange os Volumes 3 a 14, considerada uma das melhores obras de ficção de fantasia sombria.\n" +
                   "• Classificação indicativa para maiores de 18 anos.";
        }

        if (p.contains("jujutsu") || p.contains("gojo") || p.contains("sukuna")) {
            return "🤞 **Jujutsu Kaisen (Gege Akutami)**:\n\n" +
                   "• **Incidente de Shibuya:** Abrange os **Volumes 10 ao 16 (Capítulos 79–136)**.\n" +
                   "• **Dica de Leitura:** O **Volume 0** serve como prólogo perfeito antes do início da trama principal.";
        }

        if (p.contains("recomen") || p.contains("indica") || p.contains("parecido")) {
            return "📚 **Recomendações da Mangazon Store:**\n\n" +
                   "1. **Seinen & Dark Fantasy:** *Berserk*, *Vinland Saga*, *Tokyo Ghoul*.\n" +
                   "2. **Shonen de Ação:** *One Piece*, *Jujutsu Kaisen*, *Chainsaw Man*.\n" +
                   "3. **Completos:** *Demon Slayer* (23 volumes), *Death Note* (12 volumes).\n" +
                   "💡 Experimente o filtro de categorias no topo da vitrine!";
        }

        return "🤖 **Assistente Mangazon AI (Backend)**:\n\n" +
               "Recebi sua pergunta: *\"" + prompt + "\"*.\n\n" +
               "Você pode navegar pelo catálogo da Mangazon Store, selecionar o volume específico de cada obra e usar o recurso 'Espiar por Dentro' para pré-visualizar as páginas antes da compra.";
    }
}
