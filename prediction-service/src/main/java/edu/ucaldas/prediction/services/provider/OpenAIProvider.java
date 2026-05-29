package edu.ucaldas.prediction.services.provider;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OpenAIProvider implements LLMProvider {

    @Value("${llm.openai.api-key}")
    private String apiKey;

    @Value("${llm.openai.url}")
    private String url;

    @Value("${llm.openai.model}")
    private String model;

    private final RestTemplate restTemplate;

    @Override
    public String generateResponse(String prompt) {

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                ),
                "temperature", 0.4
        );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        request,
                        Map.class
                );

        List<Map<String, Object>> choices =
                (List<Map<String, Object>>)
                        response.getBody().get("choices");

        Map<String, Object> choice = choices.get(0);

        Map<String, Object> message =
                (Map<String, Object>) choice.get("message");

        return message.get("content").toString();
    }
}
