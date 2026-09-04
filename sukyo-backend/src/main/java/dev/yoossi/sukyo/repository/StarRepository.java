package dev.yoossi.sukyo.repository;

import dev.yoossi.sukyo.entity.Star;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StarRepository extends JpaRepository<Star, Long> {
    Optional<Star> findBySequence(Integer sequence);
}
