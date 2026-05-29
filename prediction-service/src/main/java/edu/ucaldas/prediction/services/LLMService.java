package edu.ucaldas.prediction.services;


import edu.ucaldas.prediction.services.provider.LLMProvider;
import edu.ucaldas.prediction.services.provider.DeepseekProvider;
import edu.ucaldas.prediction.services.provider.OpenAIProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LLMService {

    @Value("${llm.provider}")
    private String provider;

    private final DeepseekProvider deepSeekProvider;

    private final OpenAIProvider openAIProvider;

    public String generateExplanation(
            String homeTeam,
            String awayTeam,
            String predictedWinner,
            Double confidence
    ) {

        String prompt = """
                Analyze the football prediction.

                Home Team: %s
                Away Team: %s
                Predicted Winner: %s
                Confidence: %.2f%%

                Explain briefly why this team is likely to win.
                """.formatted(
                homeTeam,
                awayTeam,
                predictedWinner,
                confidence
        );

        return getProvider().generateResponse(prompt);
    }

    private LLMProvider getProvider() {

        return switch (provider.toLowerCase()) {

            case "deepseek" -> deepSeekProvider;

            case "openai" -> openAIProvider;

            default ->
                    throw new RuntimeException(
                            "Unsupported provider"
                    );
        };
    }
}
