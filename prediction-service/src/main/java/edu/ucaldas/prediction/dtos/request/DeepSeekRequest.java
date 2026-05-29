package edu.ucaldas.prediction.dtos.request;

import edu.ucaldas.prediction.dtos.ChatMessage;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DeepSeekRequest {

    private String model;

    private List<ChatMessage> messages;

    private Double temperature;

}