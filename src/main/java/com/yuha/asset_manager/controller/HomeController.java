package com.yuha.asset_manager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/news")
    public String news() {
        return "news";
    }

    @GetMapping("/indicators")
    public String indicators() {
        return "indicators";
    }

    @GetMapping("/assets")
    public String assets() {
        return "assets";
    }
}
