package com.mangazon.api.model;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

public class Manga {
    private String id;
    private String title;
    private String japaneseTitle;
    private String author;
    private String artist;
    private String publisher;
    private int rank;
    private String category;
    private double rating;
    private int ratingCount;
    private Map<Integer, Integer> ratingDistribution;
    private String coverImage;
    private List<String> previewImages;
    private String synopsis;
    private List<MangaFormat> formats;
    private List<String> tags;
    private String releaseDate;
    private int pages;
    private String isbn;
    private String ageRating;
    private boolean isAmazonChoice;
    private boolean isBestSeller;
    private String bestSellerCategory;
    private boolean isPrimeEligible;
    private int volumesCount;
    private int currentVolume;
    private String featuredQuote;
    private String animeAdaptation;
    private List<Review> reviews;
    private List<String> frequentlyBoughtTogetherIds;

    public Manga() {
        this.reviews = new ArrayList<>();
        this.previewImages = new ArrayList<>();
        this.formats = new ArrayList<>();
        this.tags = new ArrayList<>();
        this.frequentlyBoughtTogetherIds = new ArrayList<>();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getJapaneseTitle() { return japaneseTitle; }
    public void setJapaneseTitle(String japaneseTitle) { this.japaneseTitle = japaneseTitle; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getRatingCount() { return ratingCount; }
    public void setRatingCount(int ratingCount) { this.ratingCount = ratingCount; }

    public Map<Integer, Integer> getRatingDistribution() { return ratingDistribution; }
    public void setRatingDistribution(Map<Integer, Integer> ratingDistribution) { this.ratingDistribution = ratingDistribution; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public List<String> getPreviewImages() { return previewImages; }
    public void setPreviewImages(List<String> previewImages) { this.previewImages = previewImages; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public List<MangaFormat> getFormats() { return formats; }
    public void setFormats(List<MangaFormat> formats) { this.formats = formats; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public int getPages() { return pages; }
    public void setPages(int pages) { this.pages = pages; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getAgeRating() { return ageRating; }
    public void setAgeRating(String ageRating) { this.ageRating = ageRating; }

    public boolean isAmazonChoice() { return isAmazonChoice; }
    public void setAmazonChoice(boolean amazonChoice) { isAmazonChoice = amazonChoice; }

    public boolean isBestSeller() { return isBestSeller; }
    public void setBestSeller(boolean bestSeller) { isBestSeller = bestSeller; }

    public String getBestSellerCategory() { return bestSellerCategory; }
    public void setBestSellerCategory(String bestSellerCategory) { this.bestSellerCategory = bestSellerCategory; }

    public boolean isPrimeEligible() { return isPrimeEligible; }
    public void setPrimeEligible(boolean primeEligible) { isPrimeEligible = primeEligible; }

    public int getVolumesCount() { return volumesCount; }
    public void setVolumesCount(int volumesCount) { this.volumesCount = volumesCount; }

    public int getCurrentVolume() { return currentVolume; }
    public void setCurrentVolume(int currentVolume) { this.currentVolume = currentVolume; }

    public String getFeaturedQuote() { return featuredQuote; }
    public void setFeaturedQuote(String featuredQuote) { this.featuredQuote = featuredQuote; }

    public String getAnimeAdaptation() { return animeAdaptation; }
    public void setAnimeAdaptation(String animeAdaptation) { this.animeAdaptation = animeAdaptation; }

    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }

    public List<String> getFrequentlyBoughtTogetherIds() { return frequentlyBoughtTogetherIds; }
    public void setFrequentlyBoughtTogetherIds(List<String> frequentlyBoughtTogetherIds) {
        this.frequentlyBoughtTogetherIds = frequentlyBoughtTogetherIds;
    }
}
