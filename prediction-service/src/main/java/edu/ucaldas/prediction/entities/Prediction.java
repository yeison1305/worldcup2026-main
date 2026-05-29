package edu.ucaldas.prediction.entities;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Data
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "predicted_winner_team_id")
    private Team predictedWinner;

    private Double confidence;

    private Double homeWinProbability;

    private Double drawProbability;

    private Double awayWinProbability;

    @Column(columnDefinition = "LONGTEXT")
    private String reasoning;

    private String modelVersion;

    private LocalDateTime predictionDate;

    @PrePersist
    public void prePersist() {
        this.predictionDate = LocalDateTime.now();
    }
}
