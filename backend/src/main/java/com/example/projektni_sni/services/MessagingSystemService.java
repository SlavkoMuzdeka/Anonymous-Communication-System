package com.example.projektni_sni.services;

import com.example.projektni_sni.models.dto.User;

import java.util.List;

public interface MessagingSystemService {
    void sendMessage(String message);

    List<User> getLoggedUsers();

    void addUser(User user);

    void removeUser(String username);
}

