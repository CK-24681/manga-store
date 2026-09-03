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

        if (p.contains("frieren") || p.contains("sousou") || p.contains("himmel") || p.contains("fern")) {
            return "🌿 **Frieren e a Jornada para o Além (Sousou no Frieren)**:\n\n" +
                   "• **Previsão de Lançamentos:** No Brasil, a publicação oficial é da Panini. Os **Volumes 1 ao 12** estão disponíveis em nosso acervo, e o **Volume 13** tem previsão oficial para os próximos meses de 2025/2026, seguindo a periodicidade bimestral/trimestral da editora.\n" +
                   "• **Edições Especiais na Mangazon:** Disponibilizamos edições avulsas e pacotes especiais com marcadores exclusivos e sobrecapas metalizadas.\n" +
                   "• **Continuação após o Anime:** A 1ª temporada do anime (28 episódios) adapta os capítulos 1 ao 60. Para continuar a jornada no mangá, comece pelo **Volume 7 (Capítulo 61)**!\n" +
                   "• **Dica de Compra:** Utilize o recurso **\"Espiar por Dentro\"** na vitrine para ler páginas de demonstração antes da compra.";
        }

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

        if (p.contains("chainsaw") || p.contains("denji") || p.contains("makima")) {
            return "🪚 **Chainsaw Man (Tatsuki Fujimoto)**:\n\n" +
                   "• **Parte 1 (Segurança Pública):** Completa nos **Volumes 1 ao 11**.\n" +
                   "• **Parte 2 (Academia):** Em publicação a partir do **Volume 12** em diante.\n" +
                   "• Volumes avulsos e Box Sets disponíveis com envio imediato na Mangazon Store.";
        }

        if (p.contains("dandadan") || p.contains("okarun") || p.contains("momo")) {
            return "🛸 **Dandadan (Yukinobu Tatsu)**:\n\n" +
                   "• **Status no Brasil:** Publicação oficial pela Panini com volumes do 1 ao 10+ disponíveis na Mangazon.\n" +
                   "• Edições com sobrecapa especial e envio com frete grátis express acima de R$ 99.";
        }

        if (p.contains("recomen") || p.contains("indica") || p.contains("parecido")) {
            return "📚 **Recomendações da Mangazon Store:**\n\n" +
                   "1. **Seinen & Fantasia:** *Berserk*, *Frieren*, *Vinland Saga*, *Tokyo Ghoul*.\n" +
                   "2. **Shonen de Ação:** *One Piece*, *Jujutsu Kaisen*, *Chainsaw Man*, *Dandadan*.\n" +
                   "3. **Completos:** *Demon Slayer* (23 volumes), *Death Note* (12 volumes).\n" +
                   "💡 Experimente o filtro de categorias ou o Guia de Leitura no topo da vitrine!";
        }

        return "Olá! Sou o consultor de atendimento da **Mangazon Store**, a loja especializada em mangás e edições de colecionador.\n\n" +
               "• **Como podemos te ajudar:** Posso te informar sobre previsão de novos volumes (Panini, JBC, NewPOP), ordem canônica de leitura, onde o anime para no mangá ou recomendar novas leituras.\n" +
               "• **Dica da Loja:** Escolha o volume exato pelo **Seletor de Volumes** no card de cada mangá e use o recurso **\"Espiar por Dentro\"** para folhear páginas de demonstração antes da compra!";
    }
}
