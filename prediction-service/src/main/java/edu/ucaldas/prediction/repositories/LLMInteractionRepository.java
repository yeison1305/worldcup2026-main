package edu.ucaldas.prediction.repositories;


import edu.ucaldas.prediction.entities.LLMInteraction;
import edu.ucaldas.prediction.entities.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LLMInteractionRepository
        extends JpaRepository<LLMInteraction, Long> {

    List<LLMInteraction> findByPrediction(Prediction prediction);

    List<LLMInteraction> findTop20ByOrderByCreatedAtDesc();
}
