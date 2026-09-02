package com.mangazon.api.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

/**
 * DTO classes for deserializing MangaDex API v5 responses.
 * Only the fields we need are mapped; everything else is ignored.
 */
public class MangaDexDto {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ListResponse {
        public List<MangaEntry> data;
        public int limit;
        public int offset;
        public int total;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SingleResponse {
        public MangaEntry data;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MangaEntry {
        public String id;
        public String type;
        public MangaAttributes attributes;
        public List<Relationship> relationships;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MangaAttributes {
        public Map<String, String> title;
        public List<Map<String, String>> altTitles;
        public Map<String, String> description;
        public String status;
        public Integer year;
        public String lastVolume;
        public String lastChapter;
        public String contentRating;
        public List<Tag> tags;
        public Statistics statistics;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Tag {
        public String id;
        public TagAttributes attributes;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TagAttributes {
        public Map<String, String> name;
        public String group;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Relationship {
        public String id;
        public String type;
        public RelationshipAttributes attributes;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RelationshipAttributes {
        // For cover_art
        public String fileName;
        public String volume;
        // For author/artist
        public String name;
    }

    // Statistics are fetched from a separate endpoint
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class StatisticsResponse {
        // Map of mangaId -> stats
        public Map<String, MangaStats> statistics;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MangaStats {
        public RatingStats rating;
        public Long follows;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RatingStats {
        public Double average;
        public Double bayesian;
        @JsonProperty("distribution")
        public Map<String, Integer> distribution;
    }

    // Internal class (not from API, just for local use)
    public static class Statistics {
        public Double average;
    }
}
