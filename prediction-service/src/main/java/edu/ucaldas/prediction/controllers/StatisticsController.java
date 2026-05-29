package edu.ucaldas.prediction.controllers;

import edu.ucaldas.prediction.dtos.response.ApiResponse;
import edu.ucaldas.prediction.dtos.response.TeamStatisticsResponse;
import edu.ucaldas.prediction.entities.Team;
import edu.ucaldas.prediction.services.StatisticsService;
import edu.ucaldas.prediction.services.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;
    private final TeamService teamService;

    @GetMapping("/{teamId}")
    public ResponseEntity<ApiResponse<TeamStatisticsResponse>>
    getStatistics(
            @PathVariable Long teamId
    ) {

        Team team =
                teamService.findEntityById(teamId);

        TeamStatisticsResponse stats =
                statisticsService.generateStatistics(team);

        return ResponseEntity.ok(
                ApiResponse.<TeamStatisticsResponse>builder()
                        .timestamp(LocalDateTime.now())
                        .status(200)
                        .message("Statistics generated successfully")
                        .data(stats)
                        .build()
        );
    }

}