package edu.ucaldas.prediction.controllers;


import edu.ucaldas.prediction.dtos.request.CreateMatchRequest;
import edu.ucaldas.prediction.dtos.response.ApiResponse;
import edu.ucaldas.prediction.dtos.response.MatchResponse;
import edu.ucaldas.prediction.services.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<ApiResponse<MatchResponse>> create(
            @RequestBody CreateMatchRequest request
    ) {

        MatchResponse match =
                matchService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<MatchResponse>builder()
                                .timestamp(LocalDateTime.now())
                                .status(201)
                                .message("Match created successfully")
                                .data(match)
                                .build()
                );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchResponse>>> findAll() {

        List<MatchResponse> matches =
                matchService.findAll();

        return ResponseEntity.ok(
                ApiResponse.<List<MatchResponse>>builder()
                        .timestamp(LocalDateTime.now())
                        .status(200)
                        .message("Matches retrieved successfully")
                        .data(matches)
                        .build()
        );
    }

}
