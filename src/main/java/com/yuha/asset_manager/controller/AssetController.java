package com.yuha.asset_manager.controller;

import com.yuha.asset_manager.entity.Asset;
import com.yuha.asset_manager.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping("/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    public String assets(Model model) {

        model.addAttribute("assets", assetService.findAllAsset());

        return "assets";
    }

    @GetMapping("/add")
    public String addPage() {

        return "add-assets";
    }

    @PostMapping("/add")
    public String addAsset(@ModelAttribute Asset asset) {

        assetService.saveAsset(asset);

        return "redirect:/assets";
    }

    @PostMapping("/edit/{id}")
    public String editAsset(@PathVariable long id, @RequestParam("quantity") int quantity) {

        if(quantity<0) {
            throw new RuntimeException("수량은 음수일 수 없습니다.");
        }
        assetService.updateQuantity(id, quantity);

        return "redirect:/assets";
    }

    @PostMapping("/delete/{id}")
    public String deletePage(@PathVariable("id") long id) {

        assetService.deleteAsset(id);

        return "redirect:/assets";
    }
}
