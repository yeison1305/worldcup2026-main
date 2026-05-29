package edu.ucaldas.prediction.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamStatisticsResponse {

    private String teamName;

    private Integer matchesPlayed;

    private Integer wins;

    private Integer draws;

    private Integer losses;

    private Integer goalsFor;

    private Integer goalsAgainst;

    private Double winRate;

    private Double avgGoals;
}
