package com.example.projektni_sni.controllers;

import com.example.projektni_sni.services.MessagingSystemService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessagingSystemController {

    private final MessagingSystemService service;

    public MessagingSystemController(MessagingSystemService service) {
        this.service = service;
    }

    @MessageMapping("/request")
    public void processMessageRequest(String message) {
        service.sendMessage(message);
    }
}
