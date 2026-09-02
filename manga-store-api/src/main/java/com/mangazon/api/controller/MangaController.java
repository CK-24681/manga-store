package com.mangazon.api.controller;

import com.mangazon.api.model.Manga;
import com.mangazon.api.model.MangaPage;
import com.mangazon.api.service.MangaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/manga")
public class MangaController {

    private final MangaService mangaService;

    public MangaController(MangaService mangaService) {
        this.mangaService = mangaService;
    }

    /**
     * GET /api/manga
     * Optional query params: page, limit, category, q, sortBy, maxPrice
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listManga(
        @RequestParam(required = false, defaultValue = "1") int page,
        @RequestParam(required = false, defaultValue = "20") int limit,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String sortBy,
        @RequestParam(required = false) Double maxPrice
    ) {
        MangaPage resultPage = mangaService.findAll(page, limit, category, q, sortBy, maxPrice);
        return ResponseEntity.ok(Map.of(
            "status", 200,
            "count", resultPage.getCount(),
            "total", resultPage.getTotal(),
            "totalPages", resultPage.getTotalPages(),
            "currentPage", resultPage.getCurrentPage(),
            "data", resultPage.getData()
        ));
    }

    /**
     * GET /api/manga/best-sellers
     */
    @GetMapping("/best-sellers")
    public ResponseEntity<Map<String, Object>> getBestSellers() {
        MangaPage bestSellers = mangaService.getBestSellers();
        return ResponseEntity.ok(Map.of(
            "status", 200,
            "timestamp", Instant.now().toString(),
            "bestSellers", bestSellers.getData()
        ));
    }

    /**
     * GET /api/manga/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getMangaById(@PathVariable String id) {
        Optional<Manga> manga = mangaService.findById(id);
        if (manga.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Manga not found"));
        }
        return ResponseEntity.ok(Map.of("status", 200, "data", manga.get()));
    }

    /**
     * POST /api/manga/{id}/reviews
     */
    @PostMapping("/{id}/reviews")
    public ResponseEntity<Map<String, Object>> addReview(
        @PathVariable String id,
        @RequestBody Map<String, Object> body
    ) {
        String author = (String) body.get("author");
        int rating = body.get("rating") != null
            ? ((Number) body.get("rating")).intValue()
            : 5;
        String title = (String) body.get("title");
        String content = (String) body.get("content");
        String formatPurchased = (String) body.get("formatPurchased");

        Manga updatedManga = mangaService.addReview(id, author, rating, title, content, formatPurchased);
        if (updatedManga == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Manga not found"));
        }
        
        var newReview = updatedManga.getReviews().get(0);

        return ResponseEntity.status(201).body(Map.of(
            "status", 201,
            "review", newReview,
            "manga", updatedManga
        ));
    }
}
