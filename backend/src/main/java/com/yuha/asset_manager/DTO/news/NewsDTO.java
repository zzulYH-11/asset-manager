package com.yuha.asset_manager.DTO.news;

import java.util.Date;

public record NewsDTO (
        String title,
        String originallink,
        String link,
        String description,
        Date pubDate
)
{

}
