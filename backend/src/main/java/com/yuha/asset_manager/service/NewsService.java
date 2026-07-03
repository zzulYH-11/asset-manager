package com.yuha.asset_manager.service;

import com.yuha.asset_manager.DTO.news.NaverNewsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


@Service
public class NewsService {

    @Value("${naver.api.client-id}")
    private String clientId;

    @Value("${naver.api.client-secret}")
    private String clientSecret;

    @Value("${naver.api.url}")
    private String newsUrl;

    private final WebClient webClient = WebClient.builder()
            .baseUrl(newsUrl)
            .build();

    public NaverNewsResponse searchNews(String keyWord) {

        String finalUrl = newsUrl + "?query=" + keyWord + "&sort=sim";

        return webClient.get()
                        .uri(finalUrl)
                        .header("X-Naver-Client-Id", clientId)
                        .header("X-Naver-Client-Secret", clientSecret)
                        .retrieve()
                        .bodyToMono(NaverNewsResponse.class)
                        .block();
    }
}
