package edu.ucaldas.prediction.dtos.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ApiResponse<T> {

    private LocalDateTime timestamp;

    private Integer status;

    private String message;

    private T data;
}
