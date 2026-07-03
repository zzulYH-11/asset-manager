package com.yuha.asset_manager.DTO.news;

import java.util.Date;
import java.util.List;

public record NaverNewsResponse (
        Date lastBuildDate,
        int total,
        int start,
        int display,
        List<NewsDTO> items
)

{

}
