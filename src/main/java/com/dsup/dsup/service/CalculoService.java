package com.dsup.dsup.service;

import com.dsup.dsup.model.Comarca;
import com.dsup.dsup.model.PrecoServico;
import com.dsup.dsup.model.Servico;
import com.dsup.dsup.model.Usuario;
import com.dsup.dsup.repository.ComarcaRepository;
import com.dsup.dsup.repository.PrecoServicoRepository;
import com.dsup.dsup.repository.ServicoRepository;
import com.dsup.dsup.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CalculoService {

    private final ComarcaRepository comarcaRepository;
    private final ServicoRepository servicoRepository;
    private final PrecoServicoRepository precoServicoRepository;
    private final UsuarioRepository usuarioRepository;

    public CalculoService(ComarcaRepository comarcaRepository,
                          ServicoRepository servicoRepository,
                          PrecoServicoRepository precoServicoRepository,
                          UsuarioRepository usuarioRepository) {
        this.comarcaRepository = comarcaRepository;
        this.servicoRepository = servicoRepository;
        this.precoServicoRepository = precoServicoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public List<Comarca> listarComarcasOrdenadas() {
        return comarcaRepository.findAllByOrderByNomeAsc();
    }

    public BigDecimal buscarValorUnitario(Integer comarcaId, String servicoSigla) {
        Comarca comarca = comarcaRepository.findById(comarcaId)
                .orElseThrow(() -> new RuntimeException("Comarca não encontrada"));

        Servico servico = servicoRepository.findBySigla(servicoSigla)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        PrecoServico preco = precoServicoRepository.findByRegiaoAndServico(comarca.getRegiao(), servico)
                .orElseThrow(() -> new RuntimeException("Preço não configurado para esta região/serviço"));

        return preco.getValor();
    }
}