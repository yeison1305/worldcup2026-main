package edu.ucaldas.prediction.mappers;




import edu.ucaldas.prediction.dtos.response.LLMInteractionResponse;
import edu.ucaldas.prediction.entities.LLMInteraction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LLMInteractionMapper {

    LLMInteractionResponse toResponse(LLMInteraction entity);
}
