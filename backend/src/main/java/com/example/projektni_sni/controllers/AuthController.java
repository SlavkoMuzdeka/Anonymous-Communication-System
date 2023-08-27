package com.example.projektni_sni.controllers;

import com.example.projektni_sni.models.dto.User;
import com.example.projektni_sni.models.requests.LoginRequest;
import com.example.projektni_sni.models.requests.LogoutRequest;
import com.example.projektni_sni.models.responses.LoginResponse;
import com.example.projektni_sni.services.AuthService;
import com.example.projektni_sni.services.MessagingSystemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final MessagingSystemService service;

    public AuthController(AuthService authService, MessagingSystemService service) {
        this.authService = authService;
        this.service = service;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    public void logout(@RequestBody LogoutRequest request) {
        service.removeUser(request.getUsername());
    }

    @GetMapping("/logged-users")
    public List<User> getLoggedUsers() {
        return service.getLoggedUsers();
    }
}
