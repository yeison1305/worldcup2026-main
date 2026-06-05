package edu.ucaldas.prediction.repositories;



import edu.ucaldas.prediction.entities.Match;
import edu.ucaldas.prediction.entities.Team;
import edu.ucaldas.prediction.entities.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByHomeTeamOrAwayTeam(Team homeTeam, Team awayTeam);

    List<Match> findByStatus(MatchStatus status);

    List<Match> findByMatchDateBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    List<Match> findTop10ByHomeTeamOrAwayTeamOrderByMatchDateDesc(
            Team homeTeam,
            Team awayTeam
    );

    List<Match> findTop50ByHomeTeamOrAwayTeamOrderByMatchDateDesc(
            Team homeTeam,
            Team awayTeam
    );

    List<Match> findTop5ByHomeTeamOrderByMatchDateDesc(Team homeTeam);

    List<Match> findTop5ByAwayTeamOrderByMatchDateDesc(Team awayTeam);
}
