package edu.ucaldas.prediction.repositories;



import edu.ucaldas.prediction.entities.Team;
import edu.ucaldas.prediction.entities.TeamStatistics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamStatisticsRepository
        extends JpaRepository<TeamStatistics, Long> {

    Optional<TeamStatistics> findByTeam(Team team);
}
