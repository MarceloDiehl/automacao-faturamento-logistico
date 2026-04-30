package com.dsup.dsup.controller;

import com.dsup.dsup.model.Preco;
import com.dsup.dsup.repository.PrecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/precos")
public class PrecoController {

    @Autowired
    private PrecoRepository precoRepository;

    @GetMapping("/todos")
    public List<Preco> listarTodos() {
        return precoRepository.findAll();
    }

    @PostMapping("/atualizar-lote")
    public ResponseEntity<?> atualizarLote(@RequestBody List<Map<String, String>> dados) {
        for (Map<String, String> item : dados) {
            try {
                String idComposto = item.get("idComposta");
                java.math.BigDecimal valor = new java.math.BigDecimal(item.get("novoValor"));

                String[] partes = idComposto.split("-");
                if (partes.length >= 2) {

                    String servico = partes[0];

                    Map<String, String> mapa = Map.of(
                            "instalacao", "inst",
                            "desinstalacao", "des",
                            "rolloutac", "rac",
                            "rolloutabc", "rabc",
                            "ml", "ml",
                            "mp", "mp"
                    );

                    servico = mapa.getOrDefault(servico, servico);

                    String regiao = String.join("-", java.util.Arrays.copyOfRange(partes, 1, partes.length));

                    regiao = regiao.replace("-", " ");
                    regiao = java.text.Normalizer.normalize(regiao, java.text.Normalizer.Form.NFD)
                            .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");

                    regiao = Arrays.stream(regiao.split(" "))
                            .map(p -> p.substring(0,1).toUpperCase() + p.substring(1))
                            .reduce((a, b) -> a + " " + b)
                            .orElse(regiao);

                    precoRepository.findByServicoSiglaAndRegiaoNome(servico, regiao)
                            .ifPresent(preco -> {
                                preco.setValor(valor);
                                precoRepository.save(preco);
                            });
                }
            } catch (Exception e) {
                System.out.println("Erro ao processar item: " + item);
            }
        }
        return ResponseEntity.ok().build();
    }
}