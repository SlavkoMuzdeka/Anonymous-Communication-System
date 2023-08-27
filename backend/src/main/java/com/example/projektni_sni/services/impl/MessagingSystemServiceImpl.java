package com.example.projektni_sni.services.impl;

import com.example.projektni_sni.exceptions.HttpException;
import com.example.projektni_sni.models.dto.User;
import com.example.projektni_sni.models.dto.WebSocketMessage;
import com.example.projektni_sni.models.requests.MessageRequest;
import com.example.projektni_sni.services.MessagingSystemService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.activemq.command.ActiveMQQueue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.jms.TextMessage;
import java.util.ArrayList;
import java.util.List;

@Service
public class MessagingSystemServiceImpl implements MessagingSystemService {

    private final List<User> loggedUsers = new ArrayList<>();
    private final JmsTemplate jmsTemplate;
    private final SimpMessagingTemplate template;
    private final ObjectMapper mapper;
    @Value("${mq.queue.send.message}")
    private String queueName;

    public MessagingSystemServiceImpl(JmsTemplate jmsTemplate, SimpMessagingTemplate template, ObjectMapper mapper) {
        this.jmsTemplate = jmsTemplate;
        this.template = template;
        this.mapper = mapper;
    }


    @Override
    public void sendMessage(String message) {
        jmsTemplate.convertAndSend(new ActiveMQQueue(queueName), message);
    }

    @Override
    public List<User> getLoggedUsers() {
        return loggedUsers;
    }

    @Override
    public void addUser(User user) {
        if (loggedUsers.stream().noneMatch(u -> u.getId().equals(user.getId()))) {
            loggedUsers.add(user);
            template.convertAndSend("/topic/logged-users", new WebSocketMessage(user, false));
        }
    }

    @Override
    public void removeUser(String username) {
        loggedUsers.removeIf(user -> user.getUsername().equals(username));
        template.convertAndSend("/topic/logged-users", new WebSocketMessage(username, true));
    }

    @JmsListener(destination = "${mq.queue.receive.message}")
    public void receiveMessage(TextMessage message) {
        try {
            String messageReq = message.getText();
            MessageRequest messageRequest = mapper.readValue(messageReq, MessageRequest.class);
            template.convertAndSend("/queue/requests" + messageRequest.getRecipientId(), mapper.writeValueAsString(messageReq));
        } catch (Exception e) {
            throw new HttpException(HttpStatus.BAD_REQUEST, null);
        }
    }

}