package com.example.productmanager;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class ProductSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/products/**").permitAll() // Permite todas las solicitudes a /products
                        .anyRequest().authenticated()) // Requiere autenticación para cualquier otra solicitud
                .httpBasic(httpBasic -> {}); // Habilita autenticación básica HTTP con la configuración predeterminada

        return http.build();
    }
}
