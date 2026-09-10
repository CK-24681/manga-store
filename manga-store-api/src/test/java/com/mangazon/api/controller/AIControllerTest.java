package com.mangazon.api.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Objects;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AIControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testAIStatusEndpoint() throws Exception {
        mockMvc.perform(get("/api/ai/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.hasEnvFile").value(true));
    }

    @Test
    void testAIAskValidPrompt() throws Exception {
        mockMvc.perform(post("/api/ai/ask")
                .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                .content("{\"prompt\": \"Em qual volume Luffy usa o Gear 5?\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.answer").isNotEmpty());
    }

    @Test
    void testAIAskEmptyPromptReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/ai/ask")
                .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                .content("{\"prompt\": \"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
