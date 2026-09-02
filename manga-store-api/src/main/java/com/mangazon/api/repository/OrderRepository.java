package com.mangazon.api.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.mangazon.api.model.Order;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrderRepository extends JsonFileRepository<Order> {
    public OrderRepository() {
        super("orders.json", new TypeReference<List<Order>>() {});
    }
}
