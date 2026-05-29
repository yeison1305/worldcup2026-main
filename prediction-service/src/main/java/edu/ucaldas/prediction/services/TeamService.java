package edu.ucaldas.prediction.services;

import edu.ucaldas.prediction.dtos.request.CreateTeamRequest;
import edu.ucaldas.prediction.dtos.response.TeamResponse;
import edu.ucaldas.prediction.entities.Team;
import edu.ucaldas.prediction.mappers.TeamMapper;
import edu.ucaldas.prediction.repositories.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMapper teamMapper;

    public TeamResponse create(CreateTeamRequest request) {

        if (teamRepository.existsByName(request.getName())) {
            throw new RuntimeException("Team already exists");
        }

        Team team = teamMapper.toEntity(request);

        return teamMapper.toResponse(
                teamRepository.save(team)
        );
    }

    public List<TeamResponse> findAll() {

        return teamRepository.findAll()
                .stream()
                .map(teamMapper::toResponse)
                .toList();
    }

    public Team findEntityById(Long id) {

        return teamRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Team not found")
                );
    }

    public Team findEntityByName(String name) {

        return teamRepository.findByName(name)
                .orElseThrow(() ->
                        new RuntimeException("Team not found")
                );
    }
}
