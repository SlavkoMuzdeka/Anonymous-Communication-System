package com.example.projektni_sni.services;

import com.example.projektni_sni.models.requests.LoginRequest;
import com.example.projektni_sni.models.responses.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
