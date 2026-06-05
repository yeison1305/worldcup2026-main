package edu.ucaldas.prediction.services;


import edu.ucaldas.prediction.dtos.request.CreateMatchRequest;
import edu.ucaldas.prediction.dtos.response.MatchResponse;
import edu.ucaldas.prediction.entities.Match;
import edu.ucaldas.prediction.entities.Team;
import edu.ucaldas.prediction.entities.enums.MatchStatus;
import edu.ucaldas.prediction.mappers.MatchMapper;
import edu.ucaldas.prediction.repositories.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final TeamService teamService;
    private final MatchMapper matchMapper;

    public MatchResponse create(CreateMatchRequest request) {

        Team homeTeam = teamService.findEntityById(
                request.getHomeTeamId()
        );

        Team awayTeam = teamService.findEntityById(
                request.getAwayTeamId()
        );

        Match match = new Match();

        match.setHomeTeam(homeTeam);
        match.setAwayTeam(awayTeam);
        match.setHomeScore(request.getHomeScore());
        match.setAwayScore(request.getAwayScore());
        match.setMatchDate(request.getMatchDate());
        match.setStatus(MatchStatus.FINISHED);

        return matchMapper.toResponse(
                matchRepository.save(match)
        );
    }

    public List<MatchResponse> findAll() {

        return matchRepository.findAll()
                .stream()
                .map(matchMapper::toResponse)
                .toList();
    }

    public List<Match> findRecentMatches(Team team) {

        return matchRepository
                .findTop50ByHomeTeamOrAwayTeamOrderByMatchDateDesc(
                        team,
                        team
                );
    }
}
