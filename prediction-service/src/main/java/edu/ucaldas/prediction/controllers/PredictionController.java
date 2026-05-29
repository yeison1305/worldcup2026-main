package edu.ucaldas.prediction.controllers;


import edu.ucaldas.prediction.dtos.request.PredictionRequest;
import edu.ucaldas.prediction.dtos.response.ApiResponse;
import edu.ucaldas.prediction.dtos.response.PredictionResponse;
import edu.ucaldas.prediction.services.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    @PostMapping
    public ResponseEntity<ApiResponse<PredictionResponse>>
    predict(
            @RequestBody PredictionRequest request
    ) {

        PredictionResponse prediction =
                predictionService.predict(request);

        return ResponseEntity.ok(
                ApiResponse.<PredictionResponse>builder()
                        .timestamp(LocalDateTime.now())
                        .status(200)
                        .message("Prediction generated successfully")
                        .data(prediction)
                        .build()
        );
    }

}
