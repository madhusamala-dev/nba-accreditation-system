package com.compliedu.nba.dto.response;

import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SarApplicationDetailResponse {
    private SarApplicationResponse application;
    private List<CriteriaDetailResponse> criteria;
}