        package com.example.loginservice.config;

        import ch.qos.logback.classic.Logger;
        import com.auth0.jwt.JWTVerifier;
        import com.auth0.jwt.exceptions.JWTVerificationException;
        import com.auth0.jwt.interfaces.DecodedJWT;
        import jakarta.servlet.http.HttpServletRequest;
        import org.slf4j.LoggerFactory;
        import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
        import org.springframework.security.core.Authentication;
        import org.springframework.security.core.authority.SimpleGrantedAuthority;
        import org.springframework.security.core.userdetails.User;
        import org.springframework.stereotype.Component;
        import com.auth0.jwt.JWT;
        import com.auth0.jwt.algorithms.Algorithm;

        import java.util.Collections;
        import java.util.Date;

        @Component
        public class JwtTokenProvider {

            private final String secret = "tuSecret"; // Usar una mejor gestión del secreto
            private static final Logger log = (Logger) LoggerFactory.getLogger(JwtTokenProvider.class);

            public String createToken(String username, Long idUsuario) { // Añade idUsuario como argumento
                Date now = new Date();
                Date validity = new Date(now.getTime() + 3600000); // 1 hora de validez

                return JWT.create()
                        .withSubject(username)
                        .withClaim("id_usuario", idUsuario) // Añade el id_usuario al payload del token
                        .withIssuedAt(now)
                        .withExpiresAt(validity)
                        .sign(Algorithm.HMAC256(secret.getBytes()));
            }

            public String resolveToken(HttpServletRequest req) {
                String bearerToken = req.getHeader("Authorization");
                if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
                    return bearerToken.substring(7);
                }
                return null;
            }
            public boolean validateToken(String token) {
                try {
                    Algorithm algorithm = Algorithm.HMAC256(secret);
                    JWTVerifier verifier = JWT.require(algorithm).build();
                    DecodedJWT jwt = verifier.verify(token);
                    return true;
                } catch (JWTVerificationException exception) {
                    // Agregar logging del error para diagnóstico
                    log.error("Error validating token: {}", exception.getMessage());
                    return false;
                }
            }

            public Authentication getAuthentication(String token) {
                DecodedJWT decodedJWT = JWT.decode(token);
                String username = decodedJWT.getSubject();
                // Aquí puedes extraer y usar más información del token si es necesario, como roles.
                User principal = new User(username, "", Collections.singletonList(new SimpleGrantedAuthority("USER")));
                // En este ejemplo, todos los usuarios se les da el rol "USER". Ajusta según tu modelo de seguridad.
                return new UsernamePasswordAuthenticationToken(principal, token, principal.getAuthorities());
            }

        }
