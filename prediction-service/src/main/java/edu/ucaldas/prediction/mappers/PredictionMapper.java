package edu.ucaldas.prediction.mappers;


import edu.ucaldas.prediction.dtos.response.PredictionResponse;
import edu.ucaldas.prediction.entities.Prediction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PredictionMapper {

    @Mapping(
            source = "predictedWinner.name",
            target = "predictedWinner"
    )
    PredictionResponse toResponse(Prediction entity);
}
