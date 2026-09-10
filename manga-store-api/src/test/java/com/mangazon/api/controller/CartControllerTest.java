package com.mangazon.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/cart/checkout deve processar pedido com cupom MANGA20")
    void testCheckoutWithManga20Promo() throws Exception {
        Map<String, Object> checkoutReq = Map.of(
                "items", List.of(
                        Map.of(
                                "id", "100642-1",
                                "mangaId", "100642",
                                "title", "One Piece Vol. 1",
                                "price", 37.90,
                                "quantity", 2,
                                "format", "Paperback",
                                "coverImage", "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx100642-BEQp7n1OEQOJ.jpg"
                        )
                ),
                "promoCode", "MANGA20",
                "paymentMethod", "Credit Card"
        );

        mockMvc.perform(post("/api/cart/checkout")
                .contentType(java.util.Objects.requireNonNull(MediaType.APPLICATION_JSON))
                .content(java.util.Objects.requireNonNull(objectMapper.writeValueAsString(checkoutReq))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.order.orderId").isNotEmpty())
                .andExpect(jsonPath("$.order.subtotal").value(75.80))
                .andExpect(jsonPath("$.order.discount").value(15.16))
                .andExpect(jsonPath("$.order.status").value("Processing"));
    }

    @Test
    @DisplayName("POST /api/cart/checkout deve rejeitar pedido sem itens")
    void testCheckoutEmptyCart() throws Exception {
        Map<String, Object> checkoutReq = Map.of(
                "items", List.of(),
                "promoCode", ""
        );

        mockMvc.perform(post("/api/cart/checkout")
                .contentType(java.util.Objects.requireNonNull(MediaType.APPLICATION_JSON))
                .content(java.util.Objects.requireNonNull(objectMapper.writeValueAsString(checkoutReq))))
                .andExpect(status().isBadRequest());
    }
}
