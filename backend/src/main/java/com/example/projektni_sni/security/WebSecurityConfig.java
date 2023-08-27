package com.example.projektni_sni.security;

import com.example.projektni_sni.security.models.AuthorizationRules;
import com.example.projektni_sni.security.models.Rule;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final AuthorizationFilter authorizationFilter;

    public WebSecurityConfig(AuthorizationFilter authorizationFilter) {
        this.authorizationFilter = authorizationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder, UserDetailsService userDetailsService) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class).userDetailsService(userDetailsService).passwordEncoder(passwordEncoder).and().build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Enable Cross-Site Scripting (XSS) protection and set a Content Security Policy that only allows scripts to be loaded from the same origin as the page
        http.headers().xssProtection().and().contentSecurityPolicy("script-src 'self'");
        // Allow Cross-Origin Resource Sharing (CORS) requests, disable Cross-Site Request Forgery (CSRF) protection and set the session creation policy to stateless.
        http = http.cors().and().csrf().disable().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and();
        http = createAuthorizationRules(http);
        http.addFilterBefore(authorizationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    private HttpSecurity createAuthorizationRules(HttpSecurity httpSecurity) throws Exception {
        AuthorizationRules authorizationRules = new ObjectMapper().readValue(new ClassPathResource("rules.json").getInputStream(), AuthorizationRules.class);
        AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry interceptor = httpSecurity.authorizeHttpRequests();
        for (Rule rule : authorizationRules.getRules()) {
            if (rule.getRoles().isEmpty()) {
                if (!rule.getMethods().isEmpty())
                    for (String method : rule.getMethods())
                        interceptor = interceptor.requestMatchers(HttpMethod.valueOf(method), rule.getPattern()).permitAll();
            } else {
                if (!rule.getMethods().isEmpty())
                    for (String method : rule.getMethods())
                        interceptor = interceptor.requestMatchers(HttpMethod.valueOf(method), rule.getPattern()).hasAnyAuthority(rule.getRoles().toArray(String[]::new));
            }
        }
        return interceptor.anyRequest().denyAll().and();
    }


    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return new CorsFilter(source);
    }


    @Bean
    GrantedAuthorityDefaults grantedAuthorityDefaults() {
        return new GrantedAuthorityDefaults("");
    }
}
