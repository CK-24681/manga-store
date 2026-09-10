package com.mangazon.api.service;

import com.mangazon.api.model.CartItem;
import com.mangazon.api.model.Order;
import com.mangazon.api.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

class CartServiceTest {

    private OrderRepository orderRepository;
    private CartService cartService;

    @BeforeEach
    void setUp() {
        orderRepository = Mockito.mock(OrderRepository.class);
        cartService = new CartService(orderRepository);
    }

    @Test
    @DisplayName("checkout deve calcular subtotal, desconto MANGA20 (20%) e frete grátis para compras > R$ 35")
    void testCheckoutWithManga20Discount() {
        CartItem item = new CartItem();
        item.setMangaId("100642");
        item.setFormat("Paperback");
        item.setPrice(50.0);
        item.setQuantity(2); // Subtotal = 100.0

        Order order = cartService.checkout(List.of(item), null, "Credit Card", "MANGA20");

        assertNotNull(order);
        assertEquals(100.0, order.getSubtotal());
        assertEquals(20.0, order.getDiscount()); // 20% de 100
        assertEquals(0.0, order.getShipping()); // > 35 -> frete grátis
        assertEquals(80.0, order.getTotal());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    @DisplayName("checkout deve aplicar cupom OTAKU10 (10%) e cobrar frete R$ 4.99 para compras <= R$ 35")
    void testCheckoutWithOtaku10DiscountAndShipping() {
        CartItem item = new CartItem();
        item.setMangaId("30013");
        item.setFormat("Paperback");
        item.setPrice(30.0);
        item.setQuantity(1); // Subtotal = 30.0

        Order order = cartService.checkout(List.of(item), null, "Pix", "OTAKU10");

        assertNotNull(order);
        assertEquals(30.0, order.getSubtotal());
        assertEquals(3.0, order.getDiscount()); // 10% de 30
        assertEquals(4.99, order.getShipping()); // <= 35 -> 4.99
        assertEquals(31.99, order.getTotal()); // 30 - 3 + 4.99 = 31.99
        verify(orderRepository).save(any(Order.class));
    }
}
