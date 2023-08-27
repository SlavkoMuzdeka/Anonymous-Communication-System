package com.example.projektni_sni.services.impl;

import com.example.projektni_sni.exceptions.UnauthorizedException;
import com.example.projektni_sni.models.dto.JwtUser;
import com.example.projektni_sni.models.dto.User;
import com.example.projektni_sni.models.entities.UserEntity;
import com.example.projektni_sni.models.requests.LoginRequest;
import com.example.projektni_sni.models.responses.LoginResponse;
import com.example.projektni_sni.repositories.UserEntityRepository;
import com.example.projektni_sni.services.AuthService;
import com.example.projektni_sni.services.MessagingSystemService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;
    private final UserEntityRepository userEntityRepository;
    private final MessagingSystemService service;

    @Value("${authorization.token.expiration-time}")
    private String tokenExpirationTime;

    @Value("${authorization.token.secret}")
    private String tokenSecret;

    public AuthServiceImpl(AuthenticationManager authenticationManager, ModelMapper modelMapper, UserEntityRepository userEntityRepository, MessagingSystemService service) {
        this.authenticationManager = authenticationManager;
        this.modelMapper = modelMapper;
        this.userEntityRepository = userEntityRepository;
        this.service = service;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        LoginResponse response;
        try {
            Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword()
            ));
            JwtUser user = (JwtUser) authenticate.getPrincipal();
            UserEntity userEntity = userEntityRepository.findByUsername(request.getUsername());
            response = modelMapper.map(userEntity, LoginResponse.class);
            response.setToken(generateJwt(user));
            service.addUser(modelMapper.map(userEntity, User.class));
        } catch (Exception ex) {
            throw new UnauthorizedException();
        }
        return response;
    }

    private String generateJwt(JwtUser user) {
        return Jwts.builder()
                .setId(user.getId().toString())
                .setSubject(user.getUsername())
                .claim("role", user.getRole().name())
                .claim("firstName", user.getFirstName())
                .claim("lastName", user.getLastName())
                .setExpiration(new Date(System.currentTimeMillis() + Long.parseLong(tokenExpirationTime)))
                .signWith(SignatureAlgorithm.HS512, tokenSecret)
                .compact();
    }
}
