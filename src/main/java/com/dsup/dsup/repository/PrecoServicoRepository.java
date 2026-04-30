package com.dsup.dsup.repository;

import com.dsup.dsup.model.PrecoServico;
import com.dsup.dsup.model.Regiao;
import com.dsup.dsup.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PrecoServicoRepository extends JpaRepository<PrecoServico, Integer> {
    Optional<PrecoServico> findByRegiaoAndServico(Regiao regiao, Servico servico);
}