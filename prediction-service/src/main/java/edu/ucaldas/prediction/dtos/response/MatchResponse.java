package edu.ucaldas.prediction.dtos.response;



import edu.ucaldas.prediction.entities.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResponse {

    private Long id;

    private String homeTeam;

    private String awayTeam;

    private Integer homeScore;

    private Integer awayScore;

    private MatchStatus status;

    private LocalDateTime matchDate;

}
