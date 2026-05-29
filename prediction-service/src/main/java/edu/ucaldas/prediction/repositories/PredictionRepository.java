package edu.ucaldas.prediction.repositories;


import edu.ucaldas.prediction.entities.Match;
import edu.ucaldas.prediction.entities.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PredictionRepository
        extends JpaRepository<Prediction, Long> {

    List<Prediction> findTop10ByOrderByPredictionDateDesc();
}
