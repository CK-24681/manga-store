package com.mangazon.api.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.mangazon.api.model.Review;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ReviewRepository extends JsonFileRepository<Review> {
    public ReviewRepository() {
        super("reviews.json", new TypeReference<List<Review>>() {});
    }

    public List<Review> findByMangaId(String mangaId) {
        return findAll().stream()
                .filter(r -> mangaId.equals(r.getMangaId()))
                .collect(Collectors.toList());
    }
}
