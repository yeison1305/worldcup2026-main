package edu.ucaldas.prediction.mappers;

import edu.ucaldas.prediction.dtos.response.TeamStatisticsResponse;
import edu.ucaldas.prediction.entities.TeamStatistics;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TeamStatisticsMapper {

    @Mapping(source = "team.name", target = "teamName")
    TeamStatisticsResponse toResponse(TeamStatistics entity);
}
