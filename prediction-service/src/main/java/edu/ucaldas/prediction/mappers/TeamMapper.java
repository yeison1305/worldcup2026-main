package edu.ucaldas.prediction.mappers;


import edu.ucaldas.prediction.dtos.request.CreateTeamRequest;
import edu.ucaldas.prediction.dtos.response.TeamResponse;
import edu.ucaldas.prediction.entities.Team;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TeamMapper {

    Team toEntity(CreateTeamRequest request);

    TeamResponse toResponse(Team entity);
}
