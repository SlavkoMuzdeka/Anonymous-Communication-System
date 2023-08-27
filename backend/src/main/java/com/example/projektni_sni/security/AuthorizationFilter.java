package com.example.projektni_sni.security;

import com.example.projektni_sni.models.dto.JwtUser;
import com.example.projektni_sni.models.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Service
public class AuthorizationFilter extends OncePerRequestFilter {

    @Value("Authorization")
    private String authorizationHeaderName;

    @Value("Bearer")
    private String authorizationHeaderPrefix;

    @Value("${authorization.token.secret}")
    private String authorizationSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 6
        String authorizationHeader = request.getHeader(authorizationHeaderName);
        if(authorizationHeader == null || !authorizationHeader.startsWith(authorizationHeaderPrefix)){
            filterChain.doFilter(request, response);
            return;
        }
        String token = authorizationHeader.replace(authorizationHeaderPrefix, "");
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(authorizationSecret)
                    .parseClaimsJws(token)
                    .getBody();
            JwtUser jwtUser = new JwtUser(Integer.valueOf(claims.getId()), claims.getSubject(), null, Role.valueOf(claims.get("role", String.class)), claims.get("firstName", String.class), claims.get("lastName", String.class));
            Authentication authentication = new UsernamePasswordAuthenticationToken(jwtUser, null, jwtUser.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        filterChain.doFilter(request, response);
    }
}
