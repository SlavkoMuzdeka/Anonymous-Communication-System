package com.example.projektni_sni.models.dto;

import lombok.Data;

@Data
public class User {
    private Integer id;
    private String firstName;
    private String lastName;
    private String username;
    private byte[] certificate;
}
