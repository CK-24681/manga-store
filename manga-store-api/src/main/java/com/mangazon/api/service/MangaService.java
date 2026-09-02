package com.mangazon.api.service;

import com.mangazon.api.data.MangaDexService;
import com.mangazon.api.model.Manga;
import com.mangazon.api.model.MangaPage;
import com.mangazon.api.model.Review;
import com.mangazon.api.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MangaService {

    private final MangaDexService mangaDexService;
    private final ReviewRepository reviewRepository;

    public MangaService(MangaDexService mangaDexService, ReviewRepository reviewRepository) {
        this.mangaDexService = mangaDexService;
        this.reviewRepository = reviewRepository;
    }

    public MangaPage findAll(int page, int limit, String category, String q, String sortBy, Double maxPrice) {
        int offset = (Math.max(1, page) - 1) * limit;
        MangaPage resultPage = mangaDexService.searchManga(q, category, limit, offset, sortBy);

        // Attach reviews from our local JSON DB to each fetched manga
        for (Manga m : resultPage.getData()) {
            List<Review> localReviews = reviewRepository.findByMangaId(m.getId());
            if (!localReviews.isEmpty()) {
                m.getReviews().addAll(0, localReviews); // prepend local reviews
                m.setRatingCount(m.getRatingCount() + localReviews.size());
            }
        }
        return resultPage;
    }

    public MangaPage getBestSellers() {
        return mangaDexService.searchManga(null, null, 10, 0, "rank");
    }

    public Optional<Manga> findById(String id) {
        Optional<Manga> opt = mangaDexService.findById(id);
        if (opt.isPresent()) {
            Manga m = opt.get();
            List<Review> localReviews = reviewRepository.findByMangaId(m.getId());
            if (!localReviews.isEmpty()) {
                m.getReviews().addAll(0, localReviews);
                m.setRatingCount(m.getRatingCount() + localReviews.size());
            }
        }
        return opt;
    }

    public Manga addReview(String mangaId, String author, int rating,
                           String title, String content, String formatPurchased) {
        Optional<Manga> opt = findById(mangaId);
        if (opt.isEmpty()) return null;
        
        Manga manga = opt.get();

        Review review = new Review();
        review.setId("r_" + System.currentTimeMillis());
        review.setMangaId(mangaId);
        review.setAuthor(author != null ? author : "Otaku Reviewer");
        review.setAvatar("https://api.dicebear.com/7.x/bottts/svg?seed=" + (author != null ? author : "Otaku"));
        review.setRating(Math.max(1, Math.min(5, rating)));
        review.setDate("Verified Purchase on " + java.time.LocalDate.now()
            .format(java.time.format.DateTimeFormatter.ofPattern("MMMM d, yyyy")));
        review.setTitle(title != null ? title : "Incredible manga volume!");
        review.setContent(content != null ? content : "Arrived fast and in mint collector condition.");
        review.setVerifiedPurchase(true);
        review.setHelpfulCount(0);
        review.setFormatPurchased(formatPurchased != null ? formatPurchased : "Paperback");

        // Save to JSON
        reviewRepository.save(review);

        manga.getReviews().add(0, review);
        manga.setRatingCount(manga.getRatingCount() + 1);

        return manga;
    }
}
