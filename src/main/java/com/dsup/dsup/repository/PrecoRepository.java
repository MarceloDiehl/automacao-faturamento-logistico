package com.dsup.dsup.repository;

import com.dsup.dsup.model.Preco;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PrecoRepository extends JpaRepository<Preco, Long> {
    Optional<Preco> findByServicoSiglaAndRegiaoNome(String sigla, String regiaoNome);
}