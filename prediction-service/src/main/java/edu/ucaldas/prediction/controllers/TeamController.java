package edu.ucaldas.prediction.controllers;


import edu.ucaldas.prediction.dtos.request.CreateTeamRequest;
import edu.ucaldas.prediction.dtos.response.ApiResponse;
import edu.ucaldas.prediction.dtos.response.TeamResponse;
import edu.ucaldas.prediction.services.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<ApiResponse<TeamResponse>> create(
            @RequestBody CreateTeamRequest request
    ) {

        TeamResponse team = teamService.create(request);

        ApiResponse<TeamResponse> response =
                ApiResponse.<TeamResponse>builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.CREATED.value())
                        .message("Team created successfully")
                        .data(team)
                        .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamResponse>>> findAll() {

        List<TeamResponse> teams =
                teamService.findAll();

        ApiResponse<List<TeamResponse>> response =
                ApiResponse.<List<TeamResponse>>builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.OK.value())
                        .message("Teams retrieved successfully")
                        .data(teams)
                        .build();

        return ResponseEntity.ok(response);
    }

}