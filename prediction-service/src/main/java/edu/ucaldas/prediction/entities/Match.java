package edu.ucaldas.prediction.entities;


import edu.ucaldas.prediction.entities.enums.MatchStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "home_team_id")
    private Team homeTeam;

    @ManyToOne(optional = false)
    @JoinColumn(name = "away_team_id")
    private Team awayTeam;

    private Integer homeScore;

    private Integer awayScore;

    private LocalDateTime matchDate;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

}
