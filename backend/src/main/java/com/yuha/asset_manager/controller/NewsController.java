package com.yuha.asset_manager.controller;

import com.yuha.asset_manager.DTO.news.NaverNewsResponse;
import com.yuha.asset_manager.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/news")
@RestController
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public NaverNewsResponse getNews(@RequestParam String keyWord) {

        return newsService.searchNews(keyWord);
    }
}
