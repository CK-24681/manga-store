package com.mangazon.api.service;

import com.mangazon.api.model.CartItem;
import com.mangazon.api.model.Order;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;
import com.mangazon.api.repository.OrderRepository;

@Service
public class CartService {

    private final OrderRepository orderRepository;

    public CartService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    private static final Random RANDOM = new Random();
    private static final DateTimeFormatter DELIVERY_FMT =
        DateTimeFormatter.ofPattern("EEE, MMM d");

    /**
     * Processes a checkout request, applying promo codes, computing totals,
     * and generating order/tracking IDs. Mirrors Express POST /api/cart/checkout.
     */
    public Order checkout(List<CartItem> items, Map<String, String> shippingAddress,
                          String paymentMethod, String promoCode) {

        // Calculate totals
        double subtotal = items.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();

        double discountRate = 0.0;
        if (promoCode != null) {
            String code = promoCode.trim().toUpperCase();
            if ("MANGA20".equals(code)) {
                discountRate = 0.20;
            } else if ("OTAKU10".equals(code)) {
                discountRate = 0.10;
            }
        }

        double discount = subtotal * discountRate;
        double shipping = subtotal > 35.0 ? 0.0 : 4.99;
        double total = Math.max(0, subtotal - discount + shipping);

        // Generate IDs
        String orderId = "MGZ-JPA-" + (100000 + RANDOM.nextInt(900000)) + "-" + LocalDate.now().getYear();
        String trackingNumber = "937488969" + (100000000L + RANDOM.nextInt(900000000));

        // Delivery estimate: next day
        LocalDate deliveryDate = LocalDate.now().plusDays(1);
        String deliveryEstimate = "Tomorrow by 9:00 PM (" + deliveryDate.format(DELIVERY_FMT) + ")";

        Order order = new Order();
        order.setOrderId(orderId);
        order.setDate(java.time.Instant.now().toString());
        order.setItems(items);
        order.setSubtotal(round2(subtotal));
        order.setShipping(round2(shipping));
        order.setDiscount(round2(discount));
        order.setTotal(round2(total));
        order.setShippingAddress(shippingAddress != null ? shippingAddress : defaultAddress());
        order.setDeliveryEstimate(deliveryEstimate);
        order.setTrackingNumber(trackingNumber);
        order.setPaymentMethod(paymentMethod != null ? paymentMethod : "MangaPrime 1-Click Card (ending in 8892)");
        order.setStatus("Processing");

        orderRepository.save(order);

        return order;
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private Map<String, String> defaultAddress() {
        return Map.of(
            "fullName", "Alex Vance",
            "street", "424 Akihabara Blvd Suite 700",
            "city", "Los Angeles",
            "state", "CA",
            "zipCode", "90001",
            "country", "United States"
        );
    }
}
