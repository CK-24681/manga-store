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

    public MangaDexService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public MangaPage searchManga(String query, String category, int limit, int offset, String order) {
        int page = (offset / limit) + 1;
        String sortType = "POPULARITY_DESC";
        if (order != null && order.equals("rating")) {
            sortType = "SCORE_DESC";
        }
        
        String graphqlQuery = "query ($page: Int, $perPage: Int, $search: String, $sort: [MediaSort], $genre: String) { " +
                "Page (page: $page, perPage: $perPage) { " +
                "pageInfo { total currentPage perPage hasNextPage } " +
                "media (type: MANGA, sort: $sort, search: $search, genre: $genre) { " +
                "id title { romaji english native } coverImage { large } description(asHtml: false) " +
                "averageScore popularity status chapters volumes genres startDate { year } " +
                "staff { edges { role node { name { full } } } } } } }";

        Map<String, Object> variables = new HashMap<>();
        variables.put("page", page);
        variables.put("perPage", limit);
        variables.put("sort", List.of(sortType));
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
            log.error("Failed to fetch from AniList API: {}", e.getMessage(), e);
            return new MangaPage(Collections.emptyList(), 0, page, limit);
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
            log.error("Failed to fetch manga {}: {}", id, e.getMessage());
            return Optional.empty();
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

        String desc = media.description != null ? media.description.replaceAll("<br>", "\n").replaceAll("<[^>]+>", "") : "No synopsis available.";
        if (desc.length() > 600) desc = desc.substring(0, 597) + "...";
        manga.setSynopsis(desc);

        // Staff
        String author = "Unknown";
        String artist = "Unknown";
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
        if (author.equals("Unknown") && artist.equals("Unknown") && media.staff != null && media.staff.edges != null && !media.staff.edges.isEmpty()) {
             author = media.staff.edges.get(0).node.name.full;
             artist = author;
        }
        manga.setAuthor(author);
        manga.setArtist(artist);
        manga.setPublisher("VIZ Media / Shueisha");

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

        int volumes = media.volumes != null ? media.volumes : 1;
        manga.setVolumesCount(volumes);
        manga.setCurrentVolume(Math.max(1, volumes));
        manga.setPages(192 + (int)(Math.random() * 60));
        manga.setIsbn("978-" + (1000000000L + (long)(Math.random() * 999999999L)));
        
        manga.setReleaseDate(media.startDate != null && media.startDate.year != null ? "January 1, " + media.startDate.year : "Unknown");
        manga.setAgeRating("Teen (13+)");
        manga.setAmazonChoice(rank <= 3);
        manga.setBestSeller(rank <= 10);
        manga.setBestSellerCategory(manga.getCategory() + " Manga");
        manga.setPrimeEligible(true);
        manga.setFeaturedQuote("\"" + title + "\" — One of the most acclaimed manga series.");
        manga.setAnimeAdaptation("Anime adaptation available on Crunchyroll");

        // Formats
        double base = 9.99 + Math.random() * 3;
        manga.setFormats(List.of(
            new MangaFormat("Paperback", round2(base), round2(base * 1.3), 23, true, 80 + (int)(Math.random() * 120)),
            new MangaFormat("Deluxe Hardcover", round2(base * 2.8), round2(base * 3.5), 20, true, 15 + (int)(Math.random() * 40)),
            new MangaFormat("Kindle / Digital", round2(base * 0.65), round2(base * 0.9), 28, true, 9999),
            new MangaFormat("Collector Box Set", round2(base * 14), round2(base * 17), 17, rank <= 5, rank <= 5 ? 20 + (int)(Math.random() * 30) : 0)
        ));

        manga.setReviews(generateSampleReviews(manga.getId(), title, rank));
        manga.setFrequentlyBoughtTogetherIds(new ArrayList<>());

        return manga;
    }

    private List<Review> generateSampleReviews(String mangaId, String title, int rank) {
        List<Review> reviews = new ArrayList<>();
        reviews.add(new Review("auto-r1-" + rank, mangaId, "Manga Collector", 
            "https://api.dicebear.com/7.x/bottts/svg?seed=collector" + rank, 5, 
            "Verified Purchase on August 15, 2026", "An absolute must-read!", 
            "\"" + title + "\" is one of those rare manga series that keeps getting better with each volume.", 
            true, 42 + rank * 10, "Paperback"));
        return reviews;
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
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
        public static class StartDate { public Integer year; }
        public static class Staff { public List<StaffEdge> edges; }
        public static class StaffEdge { public String role; public StaffNode node; }
        public static class StaffNode { public StaffName name; }
        public static class StaffName { public String full; }
    }
}
