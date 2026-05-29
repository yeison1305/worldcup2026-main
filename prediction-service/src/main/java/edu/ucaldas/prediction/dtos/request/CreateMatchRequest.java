package edu.ucaldas.prediction.dtos.request;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMatchRequest {

    private Long homeTeamId;

    private Long awayTeamId;

    private Integer homeScore;

    private Integer awayScore;

    private LocalDateTime matchDate;
}
