package com.mangazon.api.model;

import java.util.List;
import java.util.Map;

public class Order {
    private String orderId;
    private String date;
    private List<CartItem> items;
    private double subtotal;
    private double shipping;
    private double discount;
    private double total;
    private Map<String, String> shippingAddress;
    private String deliveryEstimate;
    private String trackingNumber;
    private String paymentMethod;
    private String status;

    public Order() {}

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getShipping() { return shipping; }
    public void setShipping(double shipping) { this.shipping = shipping; }

    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public Map<String, String> getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(Map<String, String> shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getDeliveryEstimate() { return deliveryEstimate; }
    public void setDeliveryEstimate(String deliveryEstimate) { this.deliveryEstimate = deliveryEstimate; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
