package com.example.projektni_sni.models.requests;

import lombok.Data;

@Data
public class MessageRequest {
    private Integer recipientId;
    private String message;
}
