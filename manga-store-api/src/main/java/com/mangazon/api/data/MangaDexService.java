package com.mangazon.api.data;

import com.mangazon.api.model.Manga;
import com.mangazon.api.model.MangaFormat;
import com.mangazon.api.model.MangaPage;
import com.mangazon.api.model.Review;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MangaDexService {

    private static final Logger log = LoggerFactory.getLogger(MangaDexService.class);
    private static final String ANILIST_URL = "https://graphql.anilist.co";
    private final RestTemplate restTemplate;

    /** Returns a deterministic Random seeded by the manga’s numeric ID */
    private static Random seededRandom(int mediaId) {
        return new Random((long) mediaId * 31L);
    }

    public MangaDexService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public MangaPage searchManga(String query, String category, int limit, int offset, String order) {
        int page = (offset / limit) + 1;
        boolean isReleases = "releases".equalsIgnoreCase(order) || "date".equalsIgnoreCase(order) || "newest".equalsIgnoreCase(order);
        String sortType = "POPULARITY_DESC";
        if (order != null && order.equals("rating")) {
            sortType = "SCORE_DESC";
        } else if (isReleases) {
            sortType = "START_DATE_DESC";
        }
        
        String graphqlQuery = "query ($page: Int, $perPage: Int, $search: String, $sort: [MediaSort], $genre: String, $startDateGreater: FuzzyDateInt, $popularityGreater: Int) { " +
                "Page (page: $page, perPage: $perPage) { " +
                "pageInfo { total currentPage perPage hasNextPage } " +
                "media (type: MANGA, sort: $sort, search: $search, genre: $genre, startDate_greater: $startDateGreater, popularity_greater: $popularityGreater) { " +
                "id title { romaji english native } coverImage { large } description(asHtml: false) " +
                "averageScore popularity status chapters volumes genres startDate { year month day } " +
                "staff { edges { role node { name { full } } } } } } }";

        Map<String, Object> variables = new HashMap<>();
        variables.put("page", page);
        variables.put("perPage", limit);
        variables.put("sort", List.of(sortType));
        if (isReleases) {
            variables.put("startDateGreater", 20240101);
            variables.put("popularityGreater", 50);
        }
        if (query != null && !query.trim().isEmpty()) {
            variables.put("search", query);
        }
        if (category != null && !category.equals("All") && !category.trim().isEmpty()) {
            // Map frontend categories to AniList genres
            String genre = category;
            if (category.equals("Shonen")) genre = "Action";
            else if (category.equals("Seinen")) genre = "Psychological"; // Seinen is a demographic, Action/Psychological is closest
            else if (category.equals("Romance & Shojo")) genre = "Romance";
            else if (category.equals("Dark Fantasy")) genre = "Horror";
            else if (category.equals("Sci-Fi & Cyberpunk")) genre = "Sci-Fi";
            else if (category.equals("Isekai & Fantasy")) genre = "Fantasy";
            else if (category.equals("Box Sets & Special Editions")) genre = "Adventure";
            else if (category.equals("Classic & Award Winners")) genre = "Drama";
            else genre = null;
            
            if (genre != null) {
                variables.put("genre", genre);
            }
        }

        Map<String, Object> body = new HashMap<>();
        body.put("query", graphqlQuery);
        body.put("variables", variables);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            AniListResponse response = restTemplate.postForObject(ANILIST_URL, entity, AniListResponse.class);
            if (response == null || response.data == null || response.data.Page == null) {
                return new MangaPage(Collections.emptyList(), 0, page, limit);
            }

            AniListResponse.PageData pageData = response.data.Page;
            List<Manga> result = new ArrayList<>();
            int rank = offset + 1;
            for (AniListResponse.Media media : pageData.media) {
                result.add(mapToManga(media, rank++));
            }

            int total = pageData.pageInfo != null ? pageData.pageInfo.total : result.size();
            return new MangaPage(result, total, page, limit);

        } catch (Exception e) {
            log.error("Failed to fetch from AniList API: {}. Using fallback data.", e.getMessage());
            return buildFallbackPage(query, category, limit, page);
        }
    }

    public Optional<Manga> findById(String id) {
        String graphqlQuery = "query ($id: Int) { " +
                "Media (id: $id, type: MANGA) { " +
                "id title { romaji english native } coverImage { large } description(asHtml: false) " +
                "averageScore popularity status chapters volumes genres startDate { year } " +
                "staff { edges { role node { name { full } } } } } }";

        Map<String, Object> variables = new HashMap<>();
        try {
            variables.put("id", Integer.parseInt(id));
        } catch (NumberFormatException e) {
            return Optional.empty(); // Not an Anilist ID
        }

        Map<String, Object> body = new HashMap<>();
        body.put("query", graphqlQuery);
        body.put("variables", variables);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            AniListResponse response = restTemplate.postForObject(ANILIST_URL, entity, AniListResponse.class);
            if (response == null || response.data == null || response.data.Media == null) {
                return Optional.empty();
            }
            return Optional.of(mapToManga(response.data.Media, 1));
        } catch (Exception e) {
            log.error("Failed to fetch manga {}: {}. Searching fallback data.", id, e.getMessage());
            return getFallbackMangaList().stream()
                    .filter(m -> m.getId().equals(id))
                    .findFirst();
        }
    }

    private Manga mapToManga(AniListResponse.Media media, int rank) {
        Manga manga = new Manga();
        manga.setId(String.valueOf(media.id));

        String title = media.title != null && media.title.english != null ? media.title.english 
            : (media.title != null ? media.title.romaji : "Unknown");
        manga.setTitle(title);
        
        String jaTitle = media.title != null && media.title.nativeTitle != null ? media.title.nativeTitle : title;
        manga.setJapaneseTitle(jaTitle);

        manga.setCoverImage(media.coverImage != null && media.coverImage.large != null ? media.coverImage.large : "");
        manga.setPreviewImages(List.of(manga.getCoverImage()));

        String desc = resolvePortugueseSynopsis(title, media.description);
        manga.setSynopsis(desc);

        // Staff
        String author = "Desconhecido";
        String artist = "Desconhecido";
        if (media.staff != null && media.staff.edges != null) {
            for (AniListResponse.StaffEdge edge : media.staff.edges) {
                if (edge.role != null && edge.role.toLowerCase().contains("story")) {
                    author = edge.node.name.full;
                }
                if (edge.role != null && edge.role.toLowerCase().contains("art")) {
                    artist = edge.node.name.full;
                }
            }
        }
        if (author.equals("Desconhecido") && artist.equals("Desconhecido") && media.staff != null && media.staff.edges != null && !media.staff.edges.isEmpty()) {
             author = media.staff.edges.get(0).node.name.full;
             artist = author;
        }
        manga.setAuthor(author);
        manga.setArtist(artist);
        manga.setPublisher("Panini Mangás / Shueisha");

        manga.setRank(rank);
        
        // Category/Genres
        String category = "Shonen";
        List<String> tags = new ArrayList<>();
        if (media.genres != null && !media.genres.isEmpty()) {
            tags = media.genres.subList(0, Math.min(media.genres.size(), 6));
            String gLower = String.join(" ", media.genres).toLowerCase();
            if (gLower.contains("seinen") || gLower.contains("josei")) category = "Seinen";
            else if (gLower.contains("shoujo") || gLower.contains("romance")) category = "Romance & Shojo";
            else if (gLower.contains("horror") || gLower.contains("gore") || gLower.contains("dark")) category = "Dark Fantasy";
            else if (gLower.contains("sci-fi") || gLower.contains("cyberpunk")) category = "Sci-Fi & Cyberpunk";
            else if (gLower.contains("fantasy") || gLower.contains("isekai")) category = "Isekai & Fantasy";
        }
        manga.setCategory(category);
        manga.setTags(tags);

        double rating = media.averageScore != null ? (media.averageScore / 100.0) * 5.0 : 4.5;
        manga.setRating(Math.round(rating * 10.0) / 10.0);
        manga.setRatingCount(media.popularity != null ? media.popularity : 10000);
        manga.setRatingDistribution(Map.of(5, 75, 4, 15, 3, 6, 2, 3, 1, 1));

        int volumes = resolveAccurateVolumes(title, media);
        manga.setVolumesCount(volumes);
        manga.setCurrentVolume(Math.max(1, volumes > 1 ? volumes - 2 : volumes));

        // Use a seeded Random for deterministic values (same manga → same price/pages/ISBN)
        Random rng = seededRandom(media.id);
        manga.setPages(192 + rng.nextInt(60));
        manga.setIsbn("978-" + (1000000000L + (long)(rng.nextInt(999999999))));
        manga.setReleaseDate(formatReleaseDate(media.startDate));
        manga.setAgeRating("Classificação: 14+");
        manga.setAmazonChoice(rank <= 3);
        manga.setBestSeller(rank <= 10);
        manga.setBestSellerCategory(manga.getCategory() + " Manga");
        manga.setPrimeEligible(rng.nextInt(100) < 85);
        manga.setFeaturedQuote("'" + title + "'" + " — Uma das obras mais aclamadas mundialmente.");
        manga.setAnimeAdaptation("Adaptação em anime disponível nos principais streamings");

        // Realistic pricing across all retail price brackets
        manga.setFormats(resolveRealisticFormats(title, manga.getCategory(), rank, manga.getPages(), rng));

        manga.setReviews(generateSampleReviews(manga.getId(), title, rank));
        manga.setFrequentlyBoughtTogetherIds(new ArrayList<>());

        return manga;
    }

    private List<MangaFormat> resolveRealisticFormats(String title, String category, int rank, int pages, Random rng) {
        String lower = title.toLowerCase();
        
        double basePaperbackPrice;
        boolean isDeluxePrimary = false;
        boolean isBoxPrimary = false;

        // Specific real series pricing benchmarked against Brazilian retail (Panini, JBC, Pipoca & Nanquim)
        if (lower.contains("berserk")) {
            basePaperbackPrice = 14.50; // R$ 78.30 (Tankobon)
            isDeluxePrimary = true;     // Berserk Deluxe Edition Capa Dura is the flagship
        } else if (lower.contains("solo leveling")) {
            basePaperbackPrice = 16.50; // R$ 89.10 (Full-color manhwa prestige format)
        } else if (lower.contains("one piece")) {
            basePaperbackPrice = 6.90;  // R$ 37.26 (Standard tankobon)
        } else if (lower.contains("chainsaw man")) {
            basePaperbackPrice = 6.40;  // R$ 34.56
        } else if (lower.contains("jujutsu kaisen")) {
            basePaperbackPrice = 6.60;  // R$ 35.64
        } else if (lower.contains("demon slayer") || lower.contains("kimetsu")) {
            basePaperbackPrice = 6.20;  // R$ 33.48
        } else if (lower.contains("naruto")) {
            basePaperbackPrice = 7.80;  // R$ 42.12
        } else if (lower.contains("dragon ball")) {
            basePaperbackPrice = 5.90;  // R$ 31.86
        } else if (lower.contains("hunter x hunter")) {
            basePaperbackPrice = 7.20;  // R$ 38.88
        } else if (lower.contains("attack on titan") || lower.contains("shingeki")) {
            basePaperbackPrice = 7.40;  // R$ 39.96
        } else if (lower.contains("bleach")) {
            basePaperbackPrice = 7.50;  // R$ 40.50
        } else if (lower.contains("death note")) {
            basePaperbackPrice = 12.90; // R$ 69.66 (Black Edition 2-em-1)
        } else if (lower.contains("fullmetal")) {
            basePaperbackPrice = 8.90;  // R$ 48.06
        } else if (lower.contains("spy x family")) {
            basePaperbackPrice = 6.90;  // R$ 37.26
        } else if (lower.contains("tokyo ghoul")) {
            basePaperbackPrice = 8.20;  // R$ 44.28
        } else if ("Box Sets & Special Editions".equalsIgnoreCase(category) || lower.contains("box") || lower.contains("set")) {
            basePaperbackPrice = 12.00;
            isBoxPrimary = true;
        } else {
            // General catalog titles: distributed smoothly across the 4 price brackets:
            // Bracket 0: Até R$ 50 -> USD 4.80 to 8.80 (R$ 25.90 to R$ 47.50) (~30% of catalog)
            // Bracket 1: R$ 50 a R$ 80 -> USD 9.50 to 14.50 (R$ 51.30 to R$ 78.30) (~35% of catalog)
            // Bracket 2: R$ 80 a R$ 120 -> USD 15.50 to 21.80 (R$ 83.70 to R$ 117.70) (~20% of catalog)
            // Bracket 3: Acima de R$ 120 -> USD 23.00 to 45.00 (R$ 124.20 to R$ 243.00) (~15% of catalog)
            int bracketRoll = rng.nextInt(100);
            if (bracketRoll < 32) {
                basePaperbackPrice = 4.80 + rng.nextDouble() * 4.0;
            } else if (bracketRoll < 66) {
                basePaperbackPrice = 9.50 + rng.nextDouble() * 5.0;
            } else if (bracketRoll < 86) {
                basePaperbackPrice = 15.50 + rng.nextDouble() * 6.0;
            } else {
                basePaperbackPrice = 23.00 + rng.nextDouble() * 20.0;
                isDeluxePrimary = true;
            }
        }

        // Realistic discounts (savings percent)
        boolean hasPaperbackDiscount = rng.nextInt(100) < 55;
        int paperbackSavings = hasPaperbackDiscount ? (10 + rng.nextInt(20)) : 0;
        double paperbackOriginal = hasPaperbackDiscount ? round2(basePaperbackPrice * (1.0 + (paperbackSavings / 100.0) * 1.2)) : round2(basePaperbackPrice);

        // Stock availability
        boolean paperbackInStock = rng.nextInt(100) > 8;
        int paperbackStockCount = paperbackInStock ? (20 + rng.nextInt(180)) : 0;

        // Deluxe format
        double deluxePrice = isDeluxePrimary ? round2(29.90 + rng.nextDouble() * 15.0) : round2(basePaperbackPrice * 2.3);
        boolean hasDeluxeDiscount = rng.nextInt(100) < 45;
        int deluxeSavings = hasDeluxeDiscount ? (12 + rng.nextInt(18)) : 0;
        double deluxeOriginal = hasDeluxeDiscount ? round2(deluxePrice * (1.0 + (deluxeSavings / 100.0) * 1.15)) : round2(deluxePrice);
        boolean deluxeInStock = rng.nextInt(100) > 12;

        // Digital format
        double digitalPrice = round2(basePaperbackPrice * 0.55);
        int digitalSavings = 25;
        double digitalOriginal = round2(digitalPrice * 1.33);

        // Box set format
        double boxPrice = isBoxPrimary ? round2(45.0 + rng.nextDouble() * 45.0) : round2(basePaperbackPrice * 8.5);
        boolean hasBoxDiscount = rng.nextInt(100) < 60;
        int boxSavings = hasBoxDiscount ? (15 + rng.nextInt(20)) : 0;
        double boxOriginal = hasBoxDiscount ? round2(boxPrice * (1.0 + (boxSavings / 100.0) * 1.2)) : round2(boxPrice);
        boolean boxInStock = (rank <= 8 || isBoxPrimary) && (rng.nextInt(100) > 15);

        MangaFormat paperbackFmt = new MangaFormat("Paperback", round2(basePaperbackPrice), paperbackOriginal, paperbackSavings, paperbackInStock, paperbackStockCount);
        MangaFormat deluxeFmt = new MangaFormat("Deluxe Hardcover", deluxePrice, deluxeOriginal, deluxeSavings, deluxeInStock, deluxeInStock ? 15 + rng.nextInt(35) : 0);
        MangaFormat digitalFmt = new MangaFormat("Kindle / Digital", digitalPrice, digitalOriginal, digitalSavings, true, 9999);
        MangaFormat boxFmt = new MangaFormat("Collector Box Set", boxPrice, boxOriginal, boxSavings, boxInStock, boxInStock ? 5 + rng.nextInt(25) : 0);

        List<MangaFormat> formats = new ArrayList<>();
        if (isDeluxePrimary) {
            formats.add(deluxeFmt);
            formats.add(paperbackFmt);
            formats.add(digitalFmt);
            formats.add(boxFmt);
        } else if (isBoxPrimary) {
            formats.add(boxFmt);
            formats.add(paperbackFmt);
            formats.add(deluxeFmt);
            formats.add(digitalFmt);
        } else {
            formats.add(paperbackFmt);
            formats.add(deluxeFmt);
            formats.add(digitalFmt);
            formats.add(boxFmt);
        }
        return formats;
    }

    private int resolveAccurateVolumes(String title, AniListResponse.Media media) {
        String lower = title.toLowerCase();
        if (lower.contains("one piece")) return 108;
        if (lower.contains("naruto")) return 72;
        if (lower.contains("bleach")) return 74;
        if (lower.contains("attack on titan") || lower.contains("shingeki")) return 34;
        if (lower.contains("demon slayer") || lower.contains("kimetsu")) return 23;
        if (lower.contains("jujutsu")) return 30;
        if (lower.contains("berserk")) return 42;
        if (lower.contains("chainsaw")) return 18;
        if (lower.contains("solo leveling")) return 15;
        if (lower.contains("death note")) return 12;
        if (lower.contains("fullmetal")) return 27;
        if (lower.contains("hunter")) return 38;
        if (lower.contains("dragon ball")) return 42;
        if (lower.contains("spy x family")) return 13;
        if (lower.contains("tokyo ghoul")) return 14;

        if (media.volumes != null && media.volumes > 0) return media.volumes;
        if (media.chapters != null && media.chapters > 0) return Math.max(1, media.chapters / 9);
        if ("RELEASING".equalsIgnoreCase(media.status)) return 16;
        return 1;
    }

    private String resolvePortugueseSynopsis(String title, String raw) {
        String lower = title.toLowerCase();
        if (lower.contains("one piece")) {
            return "Gol D. Roger, o Rei dos Piratas, escondeu seu maior tesouro, o 'One Piece', na perigosa Grand Line. O jovem Monkey D. Luffy, com os poderes da Fruta da Borracha, parte ao mar em busca de uma tripulação para se tornar o próximo Rei dos Piratas em uma jornada repleta de lendas, mistérios e grandes batalhas.";
        }
        if (lower.contains("naruto")) {
            return "Naruto Uzumaki é um jovem ninja órfão que carrega selada em seu corpo a temível Raposa de Nove Caudas. Rejeitado pelos moradores da Vila da Folha, ele treina incansavelmente e supera todos os limites ao lado do Time 7 com o sonho inabalável de se tornar Hokage, o maior líder de sua aldeia.";
        }
        if (lower.contains("bleach")) {
            return "Ichigo Kurosaki é um estudante capaz de enxergar espíritos que recebe os poderes de um Shinigami através de Rukia Kuchiki para salvar sua família. Agora encarregado de proteger as almas e combater as perigosas entidades espirituais Hollows, Ichigo é arrastado para conflitos épicos na Sociedade das Almas.";
        }
        if (lower.contains("attack on titan") || lower.contains("shingeki")) {
            return "A humanidade vive isolada atrás de imensas muralhas para se proteger dos gigantescos Titãs devoradores de homens. Quando o Titã Colossal destrói a muralha exterior e devora sua mãe, Eren Yeager jura exterminar cada um dos Titãs, alistando-se na Divisão de Reconhecimento para descobrir os segredos do mundo.";
        }
        if (lower.contains("demon slayer") || lower.contains("kimetsu")) {
            return "Na Era Taisho japonesa, o jovem Tanjiro Kamado encontra sua família brutalmente massacrada por um demônio e sua irmã Nezuko transformada em uma criatura sedenta de sangue. Tanjiro empunha a espada e ingressa no Esquadrão de Caçadores de Demônios para encontrar uma cura e salvar sua irmã.";
        }
        if (lower.contains("jujutsu")) {
            return "Yuji Itadori engole um dedo amaldiçoado do temido Rei das Maldições, Ryomen Sukuna, para proteger seus amigos do colégio. Conduzido à Escola Técnica Superior de Jujutsu de Tóquio sob a mentoria de Satoru Gojo, Yuji deve dominar a energia amaldiçoada para salvar vidas antes de sua execução programada.";
        }
        if (lower.contains("berserk")) {
            return "Guts, o 'Espadachim Negro', empunha sua gigantesca espada Dragonslayer caçando apóstolos demoníacos em uma sangrenta busca por vingança contra Griffith, o antigo comandante do Bando do Falcão que o traiu no ritual proibido do Eclipse. Um marco absoluto da fantasia sombria mundial.";
        }
        if (lower.contains("chainsaw")) {
            return "Denji é um jovem marginalizado afundado em dívidas que caça demônios ao lado do cão-demônio Pochita. Traído e esquartejado, Denji renasce ao se fundir com Pochita, tornando-se o híbrido 'Chainsaw Man', capaz de brotar motosserras de seus membros a serviço da Segurança Pública.";
        }
        if (lower.contains("solo leveling")) {
            return "Em um mundo assolado por portais mágicos com monstros, Sung Jin-Woo é considerado o Caçador Mais Fraco da Humanidade (Rank E). Após sobreviver a uma masmorra dupla secreta, Jin-Woo é agraciado com uma interface misteriosa que permite apenas a ele subir de nível e poderes ilimitados.";
        }
        if (lower.contains("death note")) {
            return "Light Yagami encontra o caderno sobrenatural 'Death Note', deixado na Terra pelo Shinigami Ryuk. Ao descobrir que pode eliminar qualquer indivíduo escrevendo seu nome nas páginas, Light decide purificar a Terra como 'Kira', iniciando uma impressionante batalha psicológica contra o detetive mundial L.";
        }
        if (lower.contains("hunter")) {
            return "Gon Freecss descobre que seu pai Ging não morreu, mas é um lendário Hunter de elite. Decidido a seguir seus passos e entender essa paixão, Gon deixa sua terra natal para prestar o implacável Exame Hunter, forjando laços eternos com Killua, Kurapika e Leorio em meio a perigos mortais.";
        }
        if (lower.contains("dragon ball")) {
            return "Goku é um garoto com cauda de macaco e extraordinária força física que se junta à jovem Bulma para buscar as sete místicas Esferas do Dragão, capazes de conceder qualquer desejo quando reunidas. Uma das maiores e mais influentes sagas de artes marciais de todos os tempos.";
        }
        if (lower.contains("fullmetal")) {
            return "Os irmãos Edward e Alphonse Elric violam o maior tabu da Alquimia — a transmutação humana — para tentar reviver sua falecida mãe. Pagando um preço terrível na Lei da Troca Equivalente, os dois partem pelo país como alquimistas federais em busca da lendária Pedra Filosofal.";
        }
        if (lower.contains("spy x family")) {
            return "Para cumprir uma missão de infiltração crucial pela paz entre nações rivais, o espião 'Twilight' forja uma família falsa: adota a garotinha Anya (uma telepata) e casa-se com Yor (uma assassina de aluguel). Nenhum sabe o segredo do outro nesta aclamada comédia de ação.";
        }
        if (lower.contains("tokyo ghoul")) {
            return "Ken Kaneki sobrevive a um ataque violento de uma Ghoul — criatura que se alimenta de humanos — e acorda no hospital transformado no primeiro meio-ghoul. Ele precisa aprender a sobreviver nos submundo sombrio de Tóquio sem perder sua humanidade.";
        }

        if (raw == null || raw.trim().isEmpty()) {
            return title + " — Mangá oficial disponível para leitura e colecionadores.";
        }
        String clean = raw.replaceAll("<br\\s*/?>", " ").replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim();
        if (clean.length() > 500) clean = clean.substring(0, 497) + "...";
        return clean;
    }

    private List<Review> generateSampleReviews(String mangaId, String title, int rank) {
        List<Review> reviews = new ArrayList<>();
        reviews.add(new Review("auto-r1-" + rank, mangaId, "Colecionador de Mangás", 
            "https://api.dicebear.com/7.x/bottts/svg?seed=collector" + rank, 5, 
            "Compra Verificada em 15 de Agosto de 2026", "Uma leitura indispensável!", 
            "\"" + title + "\" é uma obra-prima que mantém o leitor fascinado a cada novo capítulo e volume.", 
            true, 42 + rank * 10, "Capa Comum"));
        return reviews;
    }

    private String formatReleaseDate(AniListResponse.StartDate sd) {
        if (sd == null || sd.year == null) return "Recente";
        String[] months = {
            "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        };
        int y = sd.year;
        int m = sd.month != null && sd.month >= 1 && sd.month <= 12 ? sd.month : 1;
        int d = sd.day != null && sd.day >= 1 && sd.day <= 31 ? sd.day : 1;
        return d + " de " + months[m] + " de " + y;
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    // -----------------------------------------------------------------------
    // Fallback data — used when AniList API is unavailable
    // -----------------------------------------------------------------------

    private MangaPage buildFallbackPage(String query, String category, int limit, int page) {
        List<Manga> all = getFallbackMangaList();

        // Simple filter by query
        if (query != null && !query.trim().isEmpty()) {
            String q = query.trim().toLowerCase();
            all = all.stream()
                    .filter(m -> m.getTitle().toLowerCase().contains(q)
                            || (m.getSynopsis() != null && m.getSynopsis().toLowerCase().contains(q)))
                    .collect(java.util.stream.Collectors.toList());
        }
        // Filter by category
        if (category != null && !category.equals("All") && !category.trim().isEmpty()) {
            String cat = category.trim();
            all = all.stream()
                    .filter(m -> cat.equalsIgnoreCase(m.getCategory()))
                    .collect(java.util.stream.Collectors.toList());
        }

        int total = all.size();
        int from = Math.min((page - 1) * limit, total);
        int to   = Math.min(from + limit, total);
        return new MangaPage(all.subList(from, to), total, page, limit);
    }

    private List<Manga> getFallbackMangaList() {
        // Static dataset — covers the most popular titles across all categories
        Object[][] data = {
            // {id, title, jaTitle, category, author, coverUrl, rating, ratingCount, volumes, basePrice, synopsis}
            {"100642", "One Piece", "ワンピース", "Shonen", "Eiichiro Oda",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx100642-BEQp7n1OEQOJ.jpg",
             4.9, 2800000, 108, 6.90,
             "Gol D. Roger escondeu seu tesouro na Grand Line. O jovem Monkey D. Luffy parte ao mar com poderes de borracha para se tornar o Rei dos Piratas."},
            {"30013", "Naruto", "ナルト", "Shonen", "Masashi Kishimoto",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx30013-RerOEfqRMHtZ.jpg",
             4.8, 1900000, 72, 7.80,
             "Naruto Uzumaki é um jovem ninja órfão que carrega a Raposa de Nove Caudas e sonha em se tornar Hokage."},
            {"30002", "Berserk", "ベルセルク", "Seinen", "Kentaro Miura",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx30002-KFEsHVjvMmXs.jpg",
             4.9, 950000, 42, 14.50,
             "Guts, o Espadachim Negro, busca vingança contra Griffith em uma epopeia sombria de fantasia medieval."},
            {"87216", "Jujutsu Kaisen", "呪術廻戦", "Shonen", "Gege Akutami",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx87216-TtGNPsR0FVj7.jpg",
             4.8, 1200000, 30, 6.60,
             "Yuji Itadori engole um dedo de Sukuna e entra na Escola de Jujutsu para dominar as maldições."},
            {"85449", "Chainsaw Man", "チェンソーマン", "Shonen", "Tatsuki Fujimoto",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx85449-ZAMFdXQvJbXD.jpg",
             4.7, 850000, 18, 6.40,
             "Denji se funde com o demônio Pochita e renasce como Chainsaw Man, caçador de demônios a serviço do governo."},
            {"30026", "Bleach", "ブリーチ", "Shonen", "Tite Kubo",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx30026-3aQPH4m3XKQP.jpg",
             4.6, 1100000, 74, 7.50,
             "Ichigo Kurosaki recebe poderes de Shinigami e combate entidades espirituais Hollows para proteger as almas."},
            {"49433", "Attack on Titan", "進撃の巨人", "Shonen", "Hajime Isayama",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx49433-1rlxUqNJI3OK.jpg",
             4.9, 1600000, 34, 7.40,
             "A humanidade sobrevive atrás de muralhas contra Titãs. Eren jura exterminar cada um após perder sua mãe."},
            {"85470", "Demon Slayer", "鬼滅の刃", "Shonen", "Koyoharu Gotouge",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx85470-c4TXJZP5MGFY.jpg",
             4.8, 1400000, 23, 6.20,
             "Tanjiro busca uma cura para sua irmã transformada em demônio enquanto caça as criaturas da noite."},
            {"2541", "Death Note", "デスノート", "Seinen", "Tsugumi Ohba",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx2541-yMh6RAtIkBbB.jpg",
             4.9, 1300000, 12, 12.90,
             "Light Yagami usa um caderno sobrenatural que mata qualquer pessoa cujo nome estiver escrito nele."},
            {"25", "Fullmetal Alchemist", "鋼の錬金術師", "Shonen", "Hiromu Arakawa",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx25-sBNdTIJGkYG5.jpg",
             4.9, 1050000, 27, 8.90,
             "Os irmãos Elric violam o maior tabu da alquimia e partem em busca da Pedra Filosofal para restaurar seus corpos."},
            {"46234", "Hunter x Hunter", "HUNTER×HUNTER", "Shonen", "Yoshihiro Togashi",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx46234-A4c5Z99tPEoQ.jpg",
             4.9, 870000, 38, 7.20,
             "Gon parte em busca do pai lendário tornando-se Hunter, forjando amizades épicas no implacável exame."},
            {"104458", "Spy x Family", "SPY×FAMILY", "Shonen", "Tatsuya Endo",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx104458-k3KYGtfUuKlc.jpg",
             4.7, 760000, 13, 6.90,
             "Um espião monta uma família falsa: uma telepata e uma assassina. Nenhum sabe o segredo do outro."},
            {"74", "Dragon Ball", "ドラゴンボール", "Shonen", "Akira Toriyama",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx74-B4lGAMNlXfmL.jpg",
             4.8, 2100000, 42, 5.90,
             "Goku busca as Esferas do Dragão em uma saga épica de artes marciais que influenciou gerações."},
            {"98396", "Solo Leveling", "나 혼자만 레벨업", "Seinen", "Chugong",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx98396-R6JjQQJVJTzO.jpg",
             4.8, 930000, 15, 16.50,
             "Sung Jin-Woo, o caçador mais fraco do mundo, ganha uma interface misteriosa e começa a subir de nível ilimitadamente."},
            {"56105", "Tokyo Ghoul", "東京喰種", "Seinen", "Sui Ishida",
             "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx56105-OWRM5lh6TGQE.jpg",
             4.6, 720000, 14, 8.20,
             "Ken Kaneki sobrevive a um ataque e desperta como meio-ghoul, buscando sobreviver no submundo de Tóquio."}
        };

        List<Manga> list = new ArrayList<>();
        int rank = 1;
        for (Object[] d : data) {
            String id       = (String)  d[0];
            String title    = (String)  d[1];
            String jaTitle  = (String)  d[2];
            String cat      = (String)  d[3];
            String author   = (String)  d[4];
            String cover    = (String)  d[5];
            double rating   = (Double)  d[6];
            int ratingCount = (Integer) d[7];
            int volumes     = (Integer) d[8];
            String synopsis = (String)  d[10];

            Manga m = new Manga();
            m.setId(id);
            m.setTitle(title);
            m.setJapaneseTitle(jaTitle);
            m.setCategory(cat);
            m.setAuthor(author);
            m.setArtist(author);
            m.setPublisher("Panini Mangás / Shueisha");
            m.setCoverImage(cover);
            m.setPreviewImages(List.of(cover));
            m.setSynopsis(synopsis);
            m.setRating(rating);
            m.setRatingCount(ratingCount);
            m.setRatingDistribution(Map.of(5, 75, 4, 15, 3, 6, 2, 3, 1, 1));
            m.setVolumesCount(volumes);
            m.setCurrentVolume(Math.max(1, volumes > 1 ? volumes - 2 : volumes));
            m.setRank(rank);
            m.setAmazonChoice(rank <= 3);
            m.setBestSeller(rank <= 10);
            m.setBestSellerCategory(cat + " Manga");
            m.setPrimeEligible(true);
            m.setAgeRating("Classificação: 14+");
            m.setFeaturedQuote("'" + title + "' — Uma das obras mais aclamadas mundialmente.");
            m.setAnimeAdaptation("Adaptação em anime disponível nos principais streamings");

            Random rng = seededRandom(Integer.parseInt(id.replaceAll("\\D", "").substring(0, Math.min(id.replaceAll("\\D", "").length(), 8))));
            m.setPages(192 + rng.nextInt(60));
            m.setIsbn("978-" + (1000000000L + (long)(rng.nextInt(999999999))));
            m.setReleaseDate("1 de Janeiro de 2024");
            m.setFormats(resolveRealisticFormats(title, cat, rank, m.getPages(), rng));
            m.setTags(new ArrayList<>());
            m.setReviews(generateSampleReviews(id, title, rank));
            m.setFrequentlyBoughtTogetherIds(new ArrayList<>());

            list.add(m);
            rank++;
        }
        return list;
    }

    // --- DTOs for AniList ---
    public static class AniListResponse {
        public Data data;
        public static class Data { public PageData Page; public Media Media; }
        public static class PageData { public PageInfo pageInfo; public List<Media> media; }
        public static class PageInfo { public int total; public int currentPage; public int perPage; public boolean hasNextPage; }
        public static class Media {
            public int id;
            public Title title;
            public CoverImage coverImage;
            public String description;
            public Integer averageScore;
            public Integer popularity;
            public String status;
            public Integer chapters;
            public Integer volumes;
            public List<String> genres;
            public StartDate startDate;
            public Staff staff;
        }
        public static class Title { public String romaji; public String english; public String nativeTitle; }
        public static class CoverImage { public String large; }
        public static class StartDate { public Integer year; public Integer month; public Integer day; }
        public static class Staff { public List<StaffEdge> edges; }
        public static class StaffEdge { public String role; public StaffNode node; }
        public static class StaffNode { public StaffName name; }
        public static class StaffName { public String full; }
    }
}
