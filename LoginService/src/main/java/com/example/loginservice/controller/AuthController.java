package com.example.loginservice.controller;

import com.example.loginservice.dto.LoginDTO;
import com.example.loginservice.dto.RegistroDTO;
import com.example.loginservice.model.Usuario;
import com.example.loginservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            String token;
            if (loginDTO.getPassword() == null || loginDTO.getPassword().isEmpty()) {
                // Cliente: intento de registro o inicio de sesión automático
                token = authService.loginOrRegisterClient(loginDTO.getNickname());
            } else {
                // Administrador: inicio de sesión con contraseña
                token = authService.login(loginDTO.getNickname(), loginDTO.getPassword());
            }
            // Devuelve un objeto JSON con el token
            return ResponseEntity.ok().body(Map.of("token", token));
        } catch (Exception e) {
            e.printStackTrace(); // Esto imprimirá el stack trace en el log del servidor
            return ResponseEntity.badRequest().body(Map.of("error", "Error en el login: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistroDTO registroDTO) {
        try {
            Usuario newUser = authService.registrarNuevoUsuario(registroDTO.getNickname(), registroDTO.getPassword());
            // Devuelve un objeto JSON confirmando el registro
            return ResponseEntity.ok(Map.of("message", "Usuario registrado con éxito: " + newUser.getNickname()));
        } catch (Exception e) {
            // Devuelve un objeto JSON con el mensaje de error
            return ResponseEntity.badRequest().body(Map.of("error", "Error en el registro: " + e.getMessage()));
        }
    }
}
