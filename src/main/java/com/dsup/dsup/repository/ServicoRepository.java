package com.dsup.dsup.repository;

import com.dsup.dsup.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Integer> {
    Optional<Servico> findBySigla(String sigla);
}