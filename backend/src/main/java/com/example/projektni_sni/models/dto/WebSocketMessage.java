package com.example.projektni_sni.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WebSocketMessage {
    private Object user;
    private Boolean isLogout;
}
