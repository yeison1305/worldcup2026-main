package edu.ucaldas.prediction.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionRequest {

    private String homeTeamName;

    private String awayTeamName;


}
