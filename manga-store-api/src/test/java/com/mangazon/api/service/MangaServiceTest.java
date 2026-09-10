package com.mangazon.api.service;

import com.mangazon.api.data.MangaDexService;
import com.mangazon.api.model.Manga;
import com.mangazon.api.model.MangaPage;
import com.mangazon.api.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

class MangaServiceTest {

    private MangaDexService mangaDexService;
    private ReviewRepository reviewRepository;
    private MangaService mangaService;

    @BeforeEach
    void setUp() {
        mangaDexService = Mockito.mock(MangaDexService.class);
        reviewRepository = Mockito.mock(ReviewRepository.class);
        mangaService = new MangaService(mangaDexService, reviewRepository);
    }

    @Test
    @DisplayName("findAll deve chamar mangaDexService e carregar avaliações locais")
    void testFindAll() {
        Manga m = new Manga();
        m.setId("100642");
        m.setTitle("One Piece");
        m.setRatingCount(100);

        MangaPage page = new MangaPage(List.of(m), 1, 1, 10);
        when(mangaDexService.searchManga(any(), any(), eq(10), eq(0), any())).thenReturn(page);
        when(reviewRepository.findByMangaId("100642")).thenReturn(Collections.emptyList());

        MangaPage result = mangaService.findAll(1, 10, null, null, null, null);

        assertNotNull(result);
        assertEquals(1, result.getData().size());
        assertEquals("One Piece", result.getData().get(0).getTitle());
    }

    @Test
    @DisplayName("findById deve retornar o mangá correspondente")
    void testFindById() {
        Manga m = new Manga();
        m.setId("30002");
        m.setTitle("Berserk");

        when(mangaDexService.findById("30002")).thenReturn(Optional.of(m));
        when(reviewRepository.findByMangaId("30002")).thenReturn(Collections.emptyList());

        Optional<Manga> result = mangaService.findById("30002");

        assertTrue(result.isPresent());
        assertEquals("Berserk", result.get().getTitle());
    }
}
