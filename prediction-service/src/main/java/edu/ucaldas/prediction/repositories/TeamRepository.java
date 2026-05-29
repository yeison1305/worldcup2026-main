package edu.ucaldas.prediction.repositories;


import edu.ucaldas.prediction.entities.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<edu.ucaldas.prediction.entities.Team, Long> {

    Optional<Team> findByName(String name);

    boolean existsByName(String name);
}
