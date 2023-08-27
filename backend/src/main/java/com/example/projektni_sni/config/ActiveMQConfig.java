package com.example.projektni_sni.config;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.config.DefaultJmsListenerContainerFactory;
import org.springframework.jms.core.JmsTemplate;

import javax.jms.ConnectionFactory;

@Configuration
@EnableJms
public class ActiveMQConfig {

    @Value("${spring.activemq.broker-url}")
    private String DEFAULT_BROKER_URL;

    public ConnectionFactory connectionFactory() {
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory();
        activeMQConnectionFactory.setBrokerURL(DEFAULT_BROKER_URL);
        return activeMQConnectionFactory;
    }

    @Bean
    public JmsTemplate jmsTemplate() {
        JmsTemplate jmsTemplate = new JmsTemplate();
        jmsTemplate.setConnectionFactory(connectionFactory());
        jmsTemplate.setPubSubDomain(true); // Sets the JmsTemplate to operate in Publish-Subscribe mode (topic-based communication) rather than Point-to-Point mode (queue-based communication). This indicates that messages sent using this JmsTemplate will be sent to topics.
        return jmsTemplate;
    }

   @Bean
   public DefaultJmsListenerContainerFactory jmsListenerContainerFactory(){
       DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
       factory.setConnectionFactory(connectionFactory());
       factory.setPubSubDomain(false);   //  Sets the DefaultJmsListenerContainerFactory to operate in Point-to-Point mode (queue-based communication) rather than Publish-Subscribe mode (topic-based communication). This indicates that messages consumed using this container factory will be received from queues.
       return factory;
   }
}
