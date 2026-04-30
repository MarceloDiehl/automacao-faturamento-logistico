package com.dsup.dsup.controller;

import com.dsup.dsup.model.Comarca;
import com.dsup.dsup.service.CalculoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CalculoController {

    private final CalculoService calculoService;

    public CalculoController(CalculoService calculoService) {
        this.calculoService = calculoService;
    }

    @GetMapping("/comarcas")
    public ResponseEntity<List<Comarca>> listarComarcas() {
        return ResponseEntity.ok(calculoService.listarComarcasOrdenadas());
    }

    @GetMapping("/valor")
    public ResponseEntity<BigDecimal> obterValorServico(
            @RequestParam Integer comarcaId,
            @RequestParam String servicoSigla) {
        BigDecimal valor = calculoService.buscarValorUnitario(comarcaId, servicoSigla);
        return ResponseEntity.ok(valor);
    }
}

