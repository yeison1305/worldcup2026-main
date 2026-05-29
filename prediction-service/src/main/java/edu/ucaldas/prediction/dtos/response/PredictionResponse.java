package edu.ucaldas.prediction.dtos.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionResponse {

    private Long predictionId;

    private String predictedWinner;

    private Double confidence;

    private Double homeWinProbability;

    private Double drawProbability;

    private Double awayWinProbability;

    private String reasoning;

    private String modelVersion;

}
