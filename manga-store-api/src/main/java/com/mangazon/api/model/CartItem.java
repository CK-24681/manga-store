package com.mangazon.api.model;

public class CartItem {
    private String mangaId;
    private String format;
    private double price;
    private int quantity;
    private int volumeNumber;

    public CartItem() {}

    public CartItem(String mangaId, String format, double price, int quantity, int volumeNumber) {
        this.mangaId = mangaId;
        this.format = format;
        this.price = price;
        this.quantity = quantity;
        this.volumeNumber = volumeNumber;
    }

    public String getMangaId() { return mangaId; }
    public void setMangaId(String mangaId) { this.mangaId = mangaId; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public int getVolumeNumber() { return volumeNumber; }
    public void setVolumeNumber(int volumeNumber) { this.volumeNumber = volumeNumber; }
}
