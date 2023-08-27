package com.example.messagesystem.service;

import com.example.messagesystem.exceptions.BadRequestException;
import org.apache.activemq.command.ActiveMQQueue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

import javax.jms.TextMessage;

@Service
public class JmsConsumer {

    private final JmsTemplate jmsTemplate;
    @Value("${mq.queue.receive.message}")
    private String receiveMessage;

    public JmsConsumer(JmsTemplate jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }

    @JmsListener(destination = "${mq.queue.send.message}")
    public void receiveMessage(TextMessage message) {
        try {
            System.out.println("Ja sam prihvation " + message.getText());
            jmsTemplate.convertAndSend(new ActiveMQQueue(receiveMessage), message.getText());
        } catch (Exception e) {
            throw new BadRequestException();
        }
    }

}
