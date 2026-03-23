package com.yuha.asset_manager.controller;

import com.yuha.asset_manager.entity.Asset;
import com.yuha.asset_manager.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final AssetRepository assetRepository;

    @GetMapping("/")
    public String index() {
        return "home";
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
    public String assets(Model model) {

        List<Asset> assetList = assetRepository.findAll();

        model.addAttribute("assets", assetList);

        return "assets";
    }
}
