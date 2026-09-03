package com.mangazon.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Duration;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${mangadex.timeout:10000}")
    private int mangadexTimeoutMs;

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:3000",   // Express dev server (frontend)
                "http://localhost:5173",   // Vite dev server (direct)
                "http://localhost:4173"    // Vite preview
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }

    /**
     * RestTemplate bean with timeout configured for external API calls (AniList GraphQL).
     */
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .setConnectTimeout(Duration.ofMillis(mangadexTimeoutMs))
            .setReadTimeout(Duration.ofMillis(mangadexTimeoutMs))
            .additionalInterceptors((request, body, execution) -> {
                request.getHeaders().add("User-Agent", "MangaStore-Educational-App/1.0");
                return execution.execute(request, body);
            })
            .build();
    }
}
