package com.example.loginservice.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.loginservice.model.Role;
import com.example.loginservice.model.Usuario;
import com.example.loginservice.repository.RoleRepository;
import com.example.loginservice.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${jwt.secret}")
    private String secret;

    public Usuario registrarNuevoUsuario(String nickname, String password) {
        // Verifica si el usuario ya existe
        if (usuarioRepository.findByNickname(nickname).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNickname(nickname);

        // Asigna roles basado en si se proporcionó una contraseña
        Role defaultRole;
        if (password != null && !password.trim().isEmpty()) {
            nuevoUsuario.setPassword(passwordEncoder.encode(password));
            defaultRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow(() -> new RuntimeException("Rol de administrador no encontrado"));
        } else {
            defaultRole = roleRepository.findByName("ROLE_USER").orElseThrow(() -> new RuntimeException("Rol de usuario no encontrado"));
        }
        nuevoUsuario.setRoles(new HashSet<>(Collections.singletonList(defaultRole)));

        return usuarioRepository.save(nuevoUsuario);
    }


    private String generateToken(Usuario usuario) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 86400000); // 24 horas

        return JWT.create()
                .withSubject(String.valueOf(usuario.getId()))
                .withIssuedAt(now)
                .withClaim("nickname", usuario.getNickname())
                .withClaim("roles", usuario.getRoles().stream().map(Role::getName).collect(Collectors.toList()))
                .withExpiresAt(expiryDate)
                .sign(Algorithm.HMAC512(secret.getBytes()));
    }

    public String loginOrRegisterClient(String nickname) {
        Usuario usuario = usuarioRepository.findByNickname(nickname)
                .orElseGet(() -> {
                    Usuario newUser = new Usuario();
                    newUser.setNickname(nickname);
                    Role userRole = roleRepository.findByName("ROLE_USER")
                            .orElseThrow(() -> new RuntimeException("Rol de usuario no encontrado"));
                    newUser.setRoles(new HashSet<>(Collections.singletonList(userRole)));
                    return usuarioRepository.save(newUser);
                });
        return generateToken(usuario);
    }

    public String login(String nickname, String password) {
        Usuario usuario = usuarioRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta.");
        }

        return generateToken(usuario);
    }
    private void sincronizarUsuarioConInteraccionesService(Usuario usuario) {
        String url = "http://localhost:3030/usuarios/sincronizar";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        // Asegúrate de enviar "id_usuario" en lugar de "id"
        Map<String, Object> map = Map.of("id_usuario", usuario.getId(), "nickname", usuario.getNickname());
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(map, headers);

        restTemplate.postForEntity(url, entity, String.class);
    }

}

