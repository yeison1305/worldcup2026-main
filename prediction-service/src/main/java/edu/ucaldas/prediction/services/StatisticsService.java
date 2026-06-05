package edu.ucaldas.prediction.services;


import edu.ucaldas.prediction.dtos.response.TeamStatisticsResponse;
import edu.ucaldas.prediction.entities.Match;
import edu.ucaldas.prediction.entities.Team;
import edu.ucaldas.prediction.entities.TeamStatistics;
import edu.ucaldas.prediction.mappers.TeamStatisticsMapper;
import edu.ucaldas.prediction.repositories.TeamStatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final MatchService matchService;
    private final TeamStatisticsRepository statisticsRepository;
    private final TeamStatisticsMapper statisticsMapper;

    public TeamStatisticsResponse generateStatistics(Team team) {


        List<Match> matches =
                matchService.findRecentMatches(team);

        int wins = 0;
        int draws = 0;
        int losses = 0;
        int goalsFor = 0;
        int goalsAgainst = 0;

        for (Match match : matches) {

            boolean isHome =
                    match.getHomeTeam().getId()
                            .equals(team.getId());

            int teamGoals =
                    isHome
                            ? match.getHomeScore()
                            : match.getAwayScore();

            int opponentGoals =
                    isHome
                            ? match.getAwayScore()
                            : match.getHomeScore();

            goalsFor += teamGoals;
            goalsAgainst += opponentGoals;

            if (teamGoals > opponentGoals) {
                wins++;
            } else if (teamGoals == opponentGoals) {
                draws++;
            } else {
                losses++;
            }
        }

        int matchesPlayed = matches.size();

        double winRate =
                matchesPlayed > 0
                        ? (double) wins / matchesPlayed
                        : 0;

        double avgGoals =
                matchesPlayed > 0
                        ? (double) goalsFor / matchesPlayed
                        : 0;

        TeamStatistics statistics = statisticsRepository.findByTeam(team)
                .orElse(new TeamStatistics());

        statistics.setTeam(team);
        statistics.setMatchesPlayed(matchesPlayed);
        statistics.setWins(wins);
        statistics.setDraws(draws);
        statistics.setLosses(losses);
        statistics.setGoalsFor(goalsFor);
        statistics.setGoalsAgainst(goalsAgainst);
        statistics.setWinRate(winRate);
        statistics.setAvgGoals(avgGoals);

        TeamStatistics saved =
                statisticsRepository.save(statistics);

        return statisticsMapper.toResponse(saved);
    }
}
