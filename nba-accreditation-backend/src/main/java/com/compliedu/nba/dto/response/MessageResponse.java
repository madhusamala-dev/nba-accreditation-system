package com.compliedu.nba.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MessageResponse {
    private String message;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static MessageResponse of(String message) {
        return MessageResponse.builder().message(message).build();
    }
}