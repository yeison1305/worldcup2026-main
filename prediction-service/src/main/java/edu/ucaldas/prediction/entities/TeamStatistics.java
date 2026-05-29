package edu.ucaldas.prediction.entities;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "team_statistics")
@Data
public class TeamStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    private Integer matchesPlayed;

    private Integer wins;

    private Integer draws;

    private Integer losses;

    private Integer goalsFor;

    private Integer goalsAgainst;

    private Double winRate;

    private Double avgGoals;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
}
