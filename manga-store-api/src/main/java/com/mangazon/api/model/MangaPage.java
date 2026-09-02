package com.mangazon.api.model;

import java.util.List;

public class MangaPage {
    private List<Manga> data;
    private int count;
    private int totalPages;
    private int currentPage;
    private int total;

    public MangaPage(List<Manga> data, int total, int currentPage, int limit) {
        this.data = data;
        this.total = total;
        this.count = data.size();
        this.currentPage = currentPage;
        this.totalPages = (int) Math.ceil((double) total / limit);
    }

    public List<Manga> getData() { return data; }
    public int getCount() { return count; }
    public int getTotalPages() { return totalPages; }
    public int getCurrentPage() { return currentPage; }
    public int getTotal() { return total; }
}
