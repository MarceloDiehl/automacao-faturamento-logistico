package com.dsup.dsup.service;

import com.dsup.dsup.model.Usuario;
import com.dsup.dsup.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class SetupService implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public SetupService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setNomeCompleto("Administrador");

            String senhaCriptografada = passwordEncoder.encode("@Ditic26");
            admin.setPassword(senhaCriptografada);

            usuarioRepository.save(admin);
            System.out.println(">>> Usuário ADMIN criado com sucesso com senha criptografada!");
        }
    }
}
