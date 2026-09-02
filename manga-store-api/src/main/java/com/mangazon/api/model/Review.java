package com.mangazon.api.model;

public class Review {
    private String id;
    private String mangaId;
    private String author;
    private String avatar;
    private int rating;
    private String date;
    private String title;
    private String content;
    private boolean verifiedPurchase;
    private int helpfulCount;
    private String formatPurchased;

    public Review() {}

    public Review(String id, String mangaId, String author, String avatar, int rating, String date,
                  String title, String content, boolean verifiedPurchase,
                  int helpfulCount, String formatPurchased) {
        this.id = id;
        this.mangaId = mangaId;
        this.author = author;
        this.avatar = avatar;
        this.rating = rating;
        this.date = date;
        this.title = title;
        this.content = content;
        this.verifiedPurchase = verifiedPurchase;
        this.helpfulCount = helpfulCount;
        this.formatPurchased = formatPurchased;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getMangaId() { return mangaId; }
    public void setMangaId(String mangaId) { this.mangaId = mangaId; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public boolean isVerifiedPurchase() { return verifiedPurchase; }
    public void setVerifiedPurchase(boolean verifiedPurchase) { this.verifiedPurchase = verifiedPurchase; }
    public int getHelpfulCount() { return helpfulCount; }
    public void setHelpfulCount(int helpfulCount) { this.helpfulCount = helpfulCount; }
    public String getFormatPurchased() { return formatPurchased; }
    public void setFormatPurchased(String formatPurchased) { this.formatPurchased = formatPurchased; }
}
