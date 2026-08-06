package com.roadsentinel.roadsentinel_backend_api.security;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.roadsentinel.roadsentinel_backend_api.helpers.UserHelper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                if (!jwtService.isAccessToken(token)) {
                    sendUnauthorizedResponse(response, "Invalid token type");
                    return;
                }

                Jws<Claims> parse = jwtService.parse(token);
                Claims payload = parse.getPayload();

                String userId = payload.getSubject();
                String email = payload.get("email", String.class);
                List<String> roles = payload.get("roles", List.class);

                UUID userUuid = UserHelper.parseUUID(userId);

                List<GrantedAuthority> authorities = roles == null ? List.of()
                        : roles.stream()
                                .map(SimpleGrantedAuthority::new)
                                .map(GrantedAuthority.class::cast)
                                .toList();

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        email, null, authorities);

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }

            } catch (ExpiredJwtException e) {
                logger.warn("JWT expired for request {}: {}", request.getRequestURI(), e.getMessage());
                sendUnauthorizedResponse(response, "JWT token expired");
                return; // Stop filter execution
            } catch (MalformedJwtException e) {
                logger.warn("Malformed JWT token: {}", e.getMessage());
                sendUnauthorizedResponse(response, "Malformed token");
                return; // Stop filter execution
            } catch (JwtException e) {
                logger.warn("Invalid JWT token: {}", e.getMessage());
                sendUnauthorizedResponse(response, "Invalid token");
                return; // Stop filter execution
            } catch (Exception e) {
                logger.error("Unexpected authentication error: ", e);
                sendUnauthorizedResponse(response, "Authentication failed");
                return; // Stop filter execution
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
        response.setContentType("application/json");
        response.getWriter().write(String.format("{\"error\": \"Unauthorized\", \"message\": \"%s\"}", message));
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/v1/auth") || path.startsWith("/admin/auth");
    }
}