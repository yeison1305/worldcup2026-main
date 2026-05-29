package edu.ucaldas.prediction.services;


import edu.ucaldas.prediction.dtos.request.PredictionRequest;
import edu.ucaldas.prediction.dtos.response.PredictionResponse;
import edu.ucaldas.prediction.entities.Prediction;
import edu.ucaldas.prediction.entities.Team;
import edu.ucaldas.prediction.entities.TeamStatistics;
import edu.ucaldas.prediction.mappers.PredictionMapper;
import edu.ucaldas.prediction.repositories.MatchRepository;
import edu.ucaldas.prediction.repositories.PredictionRepository;
import edu.ucaldas.prediction.repositories.TeamStatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final TeamService teamService;
    private final LLMService llmService;
    private final TeamStatisticsRepository statisticsRepository;
    private final PredictionRepository predictionRepository;
    private final PredictionMapper predictionMapper;

    public PredictionResponse predict(
            PredictionRequest request
    ) {

        Team homeTeam =
                teamService.findEntityByName(request.getHomeTeamName());

        Team awayTeam =
                teamService.findEntityByName(request.getAwayTeamName());

        TeamStatistics homeStats =
                statisticsRepository.findByTeam(homeTeam)
                        .orElseGet(() -> createEmptyStats(homeTeam));

        TeamStatistics awayStats =
                statisticsRepository.findByTeam(awayTeam)
                        .orElseGet(() -> createEmptyStats(awayTeam));

        double homeScore =
                (homeStats.getWinRate() * 0.7)
                        + (homeStats.getAvgGoals() * 0.3);

        double awayScore =
                (awayStats.getWinRate() * 0.7)
                        + (awayStats.getAvgGoals() * 0.3);

        Team winner =
                homeScore >= awayScore
                        ? homeTeam
                        : awayTeam;

        double total = homeScore + awayScore;

        double homeProbability;
        double awayProbability;

        if (total == 0) {
            homeProbability = 50.0;
            awayProbability = 50.0;
        } else {
            homeProbability = (homeScore / total) * 100;
            awayProbability = (awayScore / total) * 100;
        }

        Prediction prediction = new Prediction();

        prediction.setPredictedWinner(winner);
        prediction.setConfidence(
                Math.max(
                        homeProbability,
                        awayProbability
                )
        );

        double totalPlayed = homeStats.getMatchesPlayed() + awayStats.getMatchesPlayed();
        double drawProbability;
        if (totalPlayed > 0) {
            drawProbability = ((double) (homeStats.getDraws() + awayStats.getDraws()) / totalPlayed) * 100;
        } else {
            drawProbability = 10.0;
        }

        double remaining = 100.0 - drawProbability;
        double scaled = homeScore + awayScore;
        if (scaled > 0) {
            homeProbability = (homeScore / scaled) * remaining;
            awayProbability = (awayScore / scaled) * remaining;
        } else {
            homeProbability = remaining / 2;
            awayProbability = remaining / 2;
        }

        prediction.setHomeWinProbability(homeProbability);
        prediction.setAwayWinProbability(awayProbability);
        prediction.setDrawProbability(drawProbability);

        prediction.setModelVersion("v1-basic-score");

        prediction.setReasoning(llmService.generateExplanation(homeTeam.getName(), awayTeam.getName(), prediction.getPredictedWinner().getName(), prediction.getConfidence()));

        return predictionMapper.toResponse(
                predictionRepository.save(prediction)
        );
    }

    private TeamStatistics createEmptyStats(Team team) {
        TeamStatistics stats = new TeamStatistics();
        stats.setTeam(team);
        stats.setMatchesPlayed(0);
        stats.setWins(0);
        stats.setDraws(0);
        stats.setLosses(0);
        stats.setGoalsFor(0);
        stats.setGoalsAgainst(0);
        stats.setWinRate(0.0);
        stats.setAvgGoals(0.0);
        return stats;
    }
}
