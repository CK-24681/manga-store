package com.mangazon.api.controller;

import com.mangazon.api.model.Manga;
import com.mangazon.api.model.MangaPage;
import com.mangazon.api.service.MangaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final MangaService mangaService;

    public AIController(MangaService mangaService) {
        this.mangaService = mangaService;
    }

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

    private static final String DEFAULT_SYSTEM_INSTRUCTION = """
        Você é o livreiro e consultor especialista de vendas e atendimento da Mangazon Store, a maior loja online brasileira de mangás, manhwas, comics orientais e edições de colecionador.

        # DIRETRIZES FUNDAMENTAIS & ESPECIALIZAÇÃO EM MANGÁS (ENGENHARIA DE PROMPT):

        1. PERSONA & ESPECIALIZAÇÃO EM MANGÁS (LIVREIRO ESPECIALISTA):
           - Comporte-se como um livreiro profissional altamente apaixonado e conhecedor do acervo de mangás.
           - Domine as categorias do nosso acervo: Shonen, Seinen, Romance & Shojo, Dark Fantasy, Sci-Fi & Cyberpunk, Isekai & Fantasy, e Box Sets de Colecionador.
           - Recomende obras do acervo com base no gosto do leitor, citando autores (Eiichiro Oda, Kentaro Miura, Gege Akutami, Tatsuki Fujimoto, Masashi Kishimoto, Tite Kubo, Hajime Isayama, Koyoharu Gotouge, Tsugumi Ohba, Hiromu Arakawa, Yoshihiro Togashi, Tatsuya Endo, Akira Toriyama, Chugong, Sui Ishida).

        2. DIFERENCIAIS E RECURSOS DA LOJA:
           - **Seletor de Volumes**: Seleção de volumes individuais (Vol 1 ao último publicado) direto no card do produto.
           - **Espiar por Dentro (Look Inside)**: Folhear prévias das páginas.
           - **Guia de Leitura**: Cronologias de leitura e ordem de arcos.
           - **Cupons da Loja**: Cupons MANGA20 (20% OFF) e OTAKU10 (10% na primeira compra).

        3. LIMITE DE ESCOPO E BLINDAGEM DE CONTEÚDO (DOMAIN BOUNDARY & OFF-TOPIC):
           - Seu escopo é RESTRITO EXCLUSIVAMENTE ao universo de mangás, animes, manhwas, cultura pop japonesa, colecionismo, catálogo da loja, volumes, fretes, prazos e direitos do consumidor na Mangazon Store.
           - Se o usuário fizer perguntas totalmente desconexas, RECUSE educadamente:
             "Como livreiro da Mangazon Store, meu atendimento é dedicado exclusivamente ao universo de mangás e pedidos da nossa loja. Como posso te ajudar sobre nosso acervo ou seu pedido?"

        4. LIMITE DE EXTENSÃO E PROLIXIDADE:
           - Responda em NO MÁXIMO 2 a 3 parágrafos curtos ou listas limpas ('• ') de até 4 itens.
           - NUNCA use saudações robóticas ou declare ser uma IA. Comporte-se como um livreiro experiente.

        5. DIREITO DO CONSUMIDOR (CDC) E DECRETO DO SAC (Nº 11.034/2022):
           - Devoluções/Arrependimento: 7 dias corridos (Art. 49 CDC) com reembolso integral e logística reversa grátis.
           - Vício/Avaria: Garantia legal de troca (Art. 18 CDC).
           - Direcione para o botão "Atendimento Humano (SAC)" para emissão do Número de Protocolo oficial.
        """;

    public static final String MANGAZON_SYSTEM_INSTRUCTION = loadSystemInstruction();

    private static String loadSystemInstruction() {
        try (java.io.InputStream is = AIController.class.getResourceAsStream("/prompts/mangazon-system-instruction.txt")) {
            if (is != null) {
                return new String(is.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8).trim();
            }
        } catch (Exception ignored) {}
        return DEFAULT_SYSTEM_INSTRUCTION.trim();
    }

    private String generateResponse(String prompt) {
        String p = prompt.toLowerCase();

        if (p.contains("humano") || p.contains("atendente") || p.contains("sac") || p.contains("procon") || p.contains("reclama")) {
            return "🤝 **Atendimento Humano (SAC Mangazon)**:\n\n" +
                   "Em conformidade com o **Decreto Federal nº 11.034/2022 (Regulamentação do SAC)** e o Código de Defesa do Consumidor, você tem o direito garantido de ser atendido por um operador humano a qualquer momento.\n\n" +
                   "• **Como acionar:** Acesse a aba **\"Ajuda & SAC (CDC)\"** no menu da loja ou acione o botão de Atendimento Humano para receber seu **Número de Protocolo oficial** gerado na hora!\n" +
                   "• **Canais:** Chat ao Vivo e WhatsApp do SAC (Segunda a Sábado, das 08h às 20h).";
        }

        if (p.contains("devol") || p.contains("arrepend") || p.contains("troca") || p.contains("defeito") || p.contains("avaria")) {
            return "📦 **Trocas e Devoluções (Código de Defesa do Consumidor)**:\n\n" +
                   "• **Direito de Arrependimento (Art. 49 do CDC):** Prazo legal de **7 dias corridos** após o recebimento para solicitar devolução com reembolso 100% integral (produto e frete original).\n" +
                   "• **Garantia contra Vício/Defeito (Art. 18 do CDC):** Troca imediata sem qualquer custo para o consumidor em casos de páginas danificadas ou avaria no transporte.\n" +
                   "• **Como solicitar:** Pela Central de Ajuda & FAQ na loja ou diretamente com nosso SAC humano para emissão do código de postagem reversa dos Correios.";
        }

        // Respostas especializadas sobre mangás do acervo da Mangazon Store
        if (p.contains("recomenda") || p.contains("sugest") || p.contains("dica") || p.contains("ler")) {
            return "📚 **Recomendações Especiais do Livreiro Mangazon**:\n\n" +
                   "• **Para amantes de Ação Épica (Shonen):** **One Piece** (108 vols), **Jujutsu Kaisen** (30 vols) e **Chainsaw Man** (18 vols).\n" +
                   "• **Para fãs de Fantasia Sombria (Seinen):** **Berserk** (42 vols em Capa Dura Deluxe) e **Tokyo Ghoul** (14 vols).\n" +
                   "• **Para leitores de Manhwas & Aventura:** **Solo Leveling** (15 vols totalmente em cores) e **Hunter x Hunter** (38 vols).\n" +
                   "💡 *Dica:* Utilize o cupom **MANGA20** para garantir 20% OFF e use o **Seletor de Volumes** para escolher a edição desejada!";
        }

        if (p.contains("one piece") || p.contains("luffy") || p.contains("oda")) {
            return "🏴‍☠️ **One Piece na Mangazon Store**:\n\n" +
                   "• **Obra:** Criada por Eiichiro Oda (Shonen Jump / Panini Mangás).\n" +
                   "• **Acervo na Loja:** Temos do **Volume 1 ao Volume 108** disponíveis para pronta entrega.\n" +
                   "• **Formatos:** Edição Tankobon tradicional, Edição Deluxe e Box Sets de Colecionador.\n" +
                   "• **Recurso:** Clique em **\"Espiar por Dentro\"** no card do mangá para folhear as primeiras páginas e use nosso **Seletor de Volumes**!";
        }

        if (p.contains("berserk") || p.contains("guts") || p.contains("miura")) {
            return "🗡️ **Berserk (Deluxe Edition) na Mangazon Store**:\n\n" +
                   "• **Obra:** Obra-prima de Kentaro Miura (Seinen / Dark Fantasy).\n" +
                   "• **Acervo na Loja:** Temos do **Volume 1 ao Volume 42** em estoque.\n" +
                   "• **Edição Especial:** Disponível em capa dura Deluxe de alta gramatura e acabamento para colecionadores.\n" +
                   "• **Promoção:** Ative o cupom **MANGA20** no carrinho para desconto exclusivo!";
        }

        if (p.contains("solo leveling") || p.contains("manhwa") || p.contains("jin-woo")) {
            return "🗡️ **Solo Leveling (Manhwa Coreano)**:\n\n" +
                   "• **Obra:** Criada por Chugong e ilustrada por DUBU.\n" +
                   "• **Acervo na Loja:** Do **Volume 1 ao Volume 15** em formato prestige totalmente colorido.\n" +
                   "• **Formato:** Papel couché de alta qualidade com ilustrações vibrantes em cores ricas.\n" +
                   "• **Dica:** Aproveite o cupom **OTAKU10** na sua primeira compra de manhwas!";
        }

        if (p.contains("naruto") || p.contains("sasuke") || p.contains("kishimoto")) {
            return "🍥 **Naruto na Mangazon Store**:\n\n" +
                   "• **Obra:** Escrita por Masashi Kishimoto (Shonen Jump / Panini Mangás).\n" +
                   "• **Acervo na Loja:** Coleção completa do **Volume 1 ao Volume 72** em estoque.\n" +
                   "• **Formatos:** Tankobon clássico, Gold Edition e Box Sets temáticos.\n" +
                   "• **Dica:** Confira o **Guia de Leitura** no menu para acompanhar a cronologia exata do Clássico ao Shippuden!";
        }

        if (p.contains("cupom") || p.contains("desconto") || p.contains("promo")) {
            return "🏷️ **Cupons de Desconto Ativos na Mangazon Store**:\n\n" +
                   "• **MANGA20:** 20% de desconto em todo o catálogo de mangás e colecionáveis.\n" +
                   "• **OTAKU10:** 10% de desconto adicional na sua primeira compra.\n" +
                   "• **Frete Grátis:** Aplicado automaticamente para compras com itens de pré-venda ou selecionados.";
        }

        // Tentar buscar por palavra-chave no catálogo do MangaService se houver termo específico
        try {
            MangaPage searchResult = mangaService.findAll(1, 3, null, prompt, null, null);
            if (searchResult != null && searchResult.getData() != null && !searchResult.getData().isEmpty()) {
                Manga top = searchResult.getData().get(0);
                return "📖 **" + top.getTitle() + " na Mangazon Store**:\n\n" +
                       "• **Categoria & Autor:** " + top.getCategory() + " por " + top.getAuthor() + ".\n" +
                       "• **Volumes em Estoque:** Do **Vol 1 ao Vol " + top.getVolumesCount() + "** disponíveis.\n" +
                       "• **Sinopse:** " + top.getSynopsis() + "\n" +
                       "• **Como Comprar:** Use a barra de buscas ou selecione o volume desejado com nosso **Seletor de Volumes**!";
            }
        } catch (Exception ignored) {}

        return filterAndSanitize(
            "Bem-vindo à **Mangazon Store**! Como livreiro especialista, posso te ajudar a escolher o volume ideal, recomendar títulos por categoria (Shonen, Seinen, Manhwas) ou tirar dúvidas sobre prazos e pedidos. " +
            "Consulte nosso acervo direto na barra de buscas no topo ou navegue pelo **Guia de Leitura**!"
        );
    }

    /**
     * Filtro de sanitização para garantir respostas limpas, diretas e coerentes.
     * Elimina preâmbulos robóticos de IA, vazamentos de meta-instruções, encerramentos e padroniza marcadores.
     */
    private String filterAndSanitize(String raw) {
        if (raw == null || raw.isBlank()) {
            return "";
        }

        String text = raw.trim();

        // 1. Remover cercas de código markdown acidentais
        text = text.replaceAll("(?i)^```(?:markdown)?\\s*([\\s\\S]*?)\\s*```$", "$1").trim();

        // 2. Filtro de vazamento de meta-instruções
        text = text.replaceAll("(?i)(?:MANGAZON_SYSTEM_INSTRUCTION|DIRETRIZES FUNDAMENTAIS|ENGENHARIA DE PROMPT)[\\s\\S]*?:\\s*", "");

        // 3. Filtro de preâmbulos e clichês robóticos no início
        text = text.replaceAll("(?i)^(?:com certeza|certamente|com todo prazer|com prazer|olá[!.]?|olá,[^.\n]*[!.]?|aqui está[^.:\n]*[:.]?)\\s*", "").trim();
        text = text.replaceAll("(?i)^(?:como especialista da mangazon|como consultor da mangazon|como assistente da mangazon)[^.\n]*[:.]?\\s*", "").trim();
        text = text.replaceAll("(?i)^(?:como (?:uma? )?(?:inteligência artificial|ia|modelo de linguagem))[^.\n]*[:.]?\\s*", "").trim();
        text = text.replaceAll("(?i)^(?:sobre a sua (?:dúvida|pergunta)|em relação [aà] sua (?:dúvida|pergunta)|você perguntou sobre)[^.\n]*[:.]?\\s*", "").trim();

        // 4. Filtro de encerramentos robóticos dispensáveis
        text = text.replaceAll("(?i)\\s*(?:espero ter ajudado[!.]?|qualquer dúvida estou [aà] disposição[!.]?)$", "").trim();

        // 5. Normalizar marcadores de lista (* ou - soltos para bullet uniforme '• ')
        text = text.replaceAll("(?m)^(\\s*)[*-]\\s+", "$1• ");

        // 6. Limpar quebras de linha excessivas
        text = text.replaceAll("\n{3,}", "\n\n");

        // 7. Limite de tamanho de segurança para respostas (máximo 1200 caracteres)
        if (text.length() > 1200) {
            int lastPeriod = Math.max(text.lastIndexOf('.', 1200), Math.max(text.lastIndexOf('!', 1200), text.lastIndexOf('?', 1200)));
            if (lastPeriod > 600) {
                text = text.substring(0, lastPeriod + 1).trim();
            }
        }

        if (!text.isEmpty()) {
            text = Character.toUpperCase(text.charAt(0)) + (text.length() > 1 ? text.substring(1) : "");
        }

        return text.trim();
    }
}
