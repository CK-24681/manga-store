package com.mangazon.api.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public abstract class JsonFileRepository<T> {

    private final ObjectMapper mapper;
    private final File file;
    private final TypeReference<List<T>> typeRef;

    public JsonFileRepository(String filename, TypeReference<List<T>> typeRef) {
        this.mapper = new ObjectMapper();
        File dir = new File("./data");
        if (!dir.exists()) {
            dir.mkdirs();
        }
        this.file = new File(dir, filename);
        this.typeRef = typeRef;
        
        if (!this.file.exists()) {
            saveAll(new ArrayList<>());
        }
    }

    public List<T> findAll() {
        try {
            if (!file.exists() || file.length() == 0) return new ArrayList<>();
            return mapper.readValue(file, typeRef);
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public void saveAll(List<T> items) {
        try {
            mapper.writeValue(file, items);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void save(T item) {
        List<T> items = findAll();
        items.add(item);
        saveAll(items);
    }
}
