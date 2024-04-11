package com.example.loginservice.config;

import com.example.loginservice.config.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

public class JwtTokenFilter extends OncePerRequestFilter {

    private JwtTokenProvider jwtTokenProvider;

    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain)
            throws IOException, ServletException {
        // Intenta resolver el token del request.
        String token = jwtTokenProvider.resolveToken(req);

        // Verifica si el token existe y es válido.
        if (token != null && jwtTokenProvider.validateToken(token)) {
            // Obtiene la autenticación basada en el token.
            Authentication auth = jwtTokenProvider.getAuthentication(token);

            // Establece la autenticación en el contexto de seguridad.
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        // Continúa con la cadena de filtros.
        filterChain.doFilter(req, res);
    }
}
