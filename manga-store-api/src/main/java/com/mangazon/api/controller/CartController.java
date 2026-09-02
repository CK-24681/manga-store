package com.mangazon.api.controller;

import com.mangazon.api.model.CartItem;
import com.mangazon.api.model.Order;
import com.mangazon.api.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * POST /api/cart/checkout
     * Body: { items: CartItem[], shippingAddress?, paymentMethod?, promoCode? }
     */
    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> checkout(@RequestBody Map<String, Object> body) {

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> rawItems = (List<Map<String, Object>>) body.get("items");

        if (rawItems == null || rawItems.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cart is empty"));
        }

        // Map raw JSON to CartItem objects
        List<CartItem> items = rawItems.stream().map(raw -> {
            CartItem ci = new CartItem();
            ci.setMangaId((String) raw.get("mangaId"));
            ci.setFormat((String) raw.get("format"));
            ci.setPrice(raw.get("price") != null ? ((Number) raw.get("price")).doubleValue() : 0.0);
            ci.setQuantity(raw.get("quantity") != null ? ((Number) raw.get("quantity")).intValue() : 1);
            ci.setVolumeNumber(raw.get("volumeNumber") != null ? ((Number) raw.get("volumeNumber")).intValue() : 1);
            return ci;
        }).toList();

        @SuppressWarnings("unchecked")
        Map<String, String> shippingAddress = (Map<String, String>) body.get("shippingAddress");
        String paymentMethod = (String) body.get("paymentMethod");
        String promoCode = (String) body.get("promoCode");

        Order order = cartService.checkout(items, shippingAddress, paymentMethod, promoCode);

        return ResponseEntity.ok(Map.of(
            "status", 200,
            "success", true,
            "order", order
        ));
    }
}
