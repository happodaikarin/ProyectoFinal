package com.example.loginservice;
import org.junit.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderTest {

    @Test
    public void generarContraseñaCodificada() {
        String contraseña = "gatitoMustafa"; // Reemplaza con la contraseña que desees codificar
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String contraseñaCodificada = passwordEncoder.encode(contraseña);
        System.out.println("Contraseña codificada: " + contraseñaCodificada);
    }
}
