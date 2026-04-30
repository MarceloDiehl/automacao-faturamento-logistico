package com.dsup.dsup.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/api/manuais")
public class UploadController {


    private final String DIRETORIO_DESTINO = "C:/DITIC_DSUP/Manuais/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadManual(@RequestParam("file") MultipartFile file,
                                               @RequestParam("tipo") String tipo) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Arquivo vazio.");
        }

        try {
            File pasta = new File(DIRETORIO_DESTINO);
            if (!pasta.exists()) {
                pasta.mkdirs();
            }

            String nomeArquivo = tipo.equals("acionamento") ? "manual_acionamento.pdf" : "manual_grp.pdf";
            Path caminho = Paths.get(DIRETORIO_DESTINO + nomeArquivo);

            Files.copy(file.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok("Upload concluído: " + nomeArquivo);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao salvar arquivo: " + e.getMessage());
        }
    }
}