package edu.ucaldas.prediction.mappers;


import edu.ucaldas.prediction.dtos.response.MatchResponse;
import edu.ucaldas.prediction.entities.Match;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MatchMapper {

    @Mapping(source = "homeTeam.name", target = "homeTeam")
    @Mapping(source = "awayTeam.name", target = "awayTeam")
    @Mapping(source = "status", target = "status")
    MatchResponse toResponse(Match entity);
}
