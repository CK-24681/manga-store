package com.mangazon.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MangaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/manga deve retornar uma página válida de mangás")
    void testGetAllMangas() throws Exception {
        mockMvc.perform(get("/api/manga?page=1&limit=5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.currentPage").value(1));
    }

    @Test
    @DisplayName("GET /api/manga com filtro de categoria Shonen")
    void testGetMangasByCategory() throws Exception {
        mockMvc.perform(get("/api/manga?category=Shonen&limit=3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("GET /api/manga/best-sellers deve retornar mangás mais vendidos")
    void testGetBestsellers() throws Exception {
        mockMvc.perform(get("/api/manga/best-sellers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bestSellers").isArray());
    }

    @Test
    @DisplayName("GET /api/manga/{id} com ID numérico de mangá existente")
    void testGetMangaById() throws Exception {
        mockMvc.perform(get("/api/manga/100642"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("100642"))
                .andExpect(jsonPath("$.data.title").isNotEmpty());
    }

    @Test
    @DisplayName("GET /api/manga/{id} com ID inexistente deve retornar 404")
    void testGetMangaByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/manga/999999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/manga/{id}/reviews deve adicionar uma nova avaliação")
    void testAddReviewToManga() throws Exception {
        Map<String, Object> reviewReq = Map.of(
                "author", "Otaku Tester",
                "rating", 5,
                "title", "Sensacional!",
                "content", "Vol veio bem embalado e a leitura é incrível.",
                "formatPurchased", "Paperback"
        );

        mockMvc.perform(post("/api/manga/100642/reviews")
                .contentType(java.util.Objects.requireNonNull(MediaType.APPLICATION_JSON))
                .content(java.util.Objects.requireNonNull(objectMapper.writeValueAsString(reviewReq))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.manga.id").value("100642"))
                .andExpect(jsonPath("$.review.author").value("Otaku Tester"));
    }
}
