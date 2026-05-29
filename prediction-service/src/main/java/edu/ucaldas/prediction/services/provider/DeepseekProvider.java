package edu.ucaldas.prediction.services.provider;

import edu.ucaldas.prediction.dtos.ChatMessage;
import edu.ucaldas.prediction.dtos.request.DeepSeekRequest;
import edu.ucaldas.prediction.dtos.response.DeepSeekResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DeepseekProvider implements LLMProvider {

    @Value("${llm.deepseek.api-key}")
    private String apiKey;

    @Value("${llm.deepseek.url}")
    private String url;

    @Value("${llm.deepseek.model}")
    private String model;

    private final RestTemplate restTemplate;

    @Override
    public String generateResponse(String prompt) {

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        headers.setBearerAuth(apiKey);

        DeepSeekRequest request =
                DeepSeekRequest.builder()
                        .model(model)
                        .messages(
                                List.of(
                                        new ChatMessage(
                                                "user",
                                                prompt
                                        )
                                )
                        )
                        .temperature(0.4)
                        .build();

        HttpEntity<DeepSeekRequest> entity =
                new HttpEntity<>(
                        request,
                        headers
                );

        ResponseEntity<DeepSeekResponse> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        entity,
                        DeepSeekResponse.class
                );

        return response
                .getBody()
                .getChoices()
                .get(0)
                .getMessage()
                .getContent();
    }
}
