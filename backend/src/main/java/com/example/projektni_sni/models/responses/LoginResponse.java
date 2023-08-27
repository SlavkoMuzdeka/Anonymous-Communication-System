package com.example.projektni_sni.models.responses;

import com.example.projektni_sni.models.dto.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class LoginResponse extends User {
    private String token;
    private byte[] privateKey;
}
