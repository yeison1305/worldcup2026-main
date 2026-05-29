package edu.ucaldas.prediction.dtos.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LLMInteractionResponse {

    private String model;

    private String prompt;

    private String response;

    private Integer tokensUsed;

    private LocalDateTime createdAt;
}
