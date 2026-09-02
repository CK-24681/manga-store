package com.mangazon.api.model;

public class MangaFormat {
    private String format;
    private double price;
    private double originalPrice;
    private int savingsPercent;
    private boolean inStock;
    private int stockCount;

    public MangaFormat() {}

    public MangaFormat(String format, double price, double originalPrice,
                       int savingsPercent, boolean inStock, int stockCount) {
        this.format = format;
        this.price = price;
        this.originalPrice = originalPrice;
        this.savingsPercent = savingsPercent;
        this.inStock = inStock;
        this.stockCount = stockCount;
    }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(double originalPrice) { this.originalPrice = originalPrice; }
    public int getSavingsPercent() { return savingsPercent; }
    public void setSavingsPercent(int savingsPercent) { this.savingsPercent = savingsPercent; }
    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }
    public int getStockCount() { return stockCount; }
    public void setStockCount(int stockCount) { this.stockCount = stockCount; }
}
