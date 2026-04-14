package com.compliedu.nba.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ReviewRequest {
    @NotNull
    private Action action;
    private String comments;

    public enum Action {
        APPROVE, REJECT
    }
}