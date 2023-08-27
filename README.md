# Anonymous-Communication-System

Anonymous Communication System empowers users with a secure and private means of communication, where messages are safeguarded, anonymity is maintained, and data security is a top priority.

## Project Motivation

The Anonymous Communication System is a web-based application designed to facilitate anonymous communication based on standard message exchange systems. The system operates on the principle of mixed networks, similar to the [TOR](https://www.torproject.org/) network. The system aims to enhance user anonymity and message security while ensuring efficient message delivery.

## Key Dependencies & Platforms

- [React](https://react.dev/): The project leverages React, a powerful JavaScript library for building dynamic user interfaces. It enables the creation of interactive and responsive frontends, enhancing the user experience and facilitating seamless communication with the backend APIs.

- [Spring Boot](https://spring.io/projects/spring-boot): Spring Boot is utilized as the backend framework. This Java-based framework simplifies the development of robust web applications, providing features for creating RESTful APIs and managing project dependencies.

- [Apache ActiveMQ](https://activemq.apache.org/): Apache ActiveMQ serves as the message broker, facilitating efficient communication between different components of the application. It ensures reliable and asynchronous message exchange, enhancing the overall performance and scalability.

- [MySQL](https://www.mysql.com/): MySQL, a widely adopted relational database management system, is employed for storing and managing data. Its scalability, security, and data integrity features make it an ideal choice for integrating with the Spring Boot backend.

- [Ant Design (Antd)](https://ant.design/): Ant Design is a design framework for React applications. It offers a collection of well-designed UI components and styles, allowing developers to create visually appealing and consistent user interfaces without extensive customization.

- [Node.js](https://nodejs.org/): Node.js is used to run JavaScript code on the server side. It aids in building scalable and high-performance backend services and APIs that seamlessly integrate with the frontend React application.

- [Maven](https://maven.apache.org/): Maven serves as the build automation and project management tool for the backend Java application. It simplifies the build process, manages dependencies, and streamlines deployment tasks, contributing to a well-organized development workflow.

By leveraging these key dependencies and platforms, the project aims to deliver a robust and user-friendly application that seamlessly integrates frontend and backend technologies, ensuring a smooth and engaging user experience.

## Key Features

- The system divides each message into M segments (M ≥ 3), and each segment is sent to one of N servers (3 ≤ N ≤ 4) based on a random assignment.

- Users can log in using their credentials and view a list of other logged-in users.

- Users can select a recipient for communication.

- Communication is initiated by sending a request to the chosen recipient, who then accepts the request to establish communication.

- Cryptographic materials such as digital certificates, symmetric encryption keys, and hash function details are exchanged securely during communication initiation.

- Messages are segmented, signed, encrypted, and optionally steganographically protected by the sender before being sent.

- Segments of messages are transmitted through the appropriate message queue system, enhancing security and message integrity.

- The frontend application handles encryption, sending, and receiving messages(while this setup adds complexity to the frontend, its implementation significantly enhances data security during transit).

## Running Locally

To run the Anonymous Communication System locally, please refer to the README of each individual folder (database, frontend, backend, messageQueuingServer, activeMq) for detailed instructions on setting up the respective components.

## Workflow

1. Users log in using their credentials through the frontend application.

2. A list of logged-in users is displayed, and users can select recipients.

3. Communication is initiated by sending a request.

4. The chosen recipient accepts the request, establishing secure communication.

5. Cryptographic materials are securely exchanged.

6. Messages are composed and sent through the frontend.

7. Messages are segmented, signed, encrypted, and optionally steganographically concealed.

8. Segments are transmitted via the message queue system.

9. The recipient's frontend decrypts segments and assembles the original message.

10. Users engage in secure, anonymous, and confidential communication.

## Security Measures

- Robust cryptographic techniques ensure message confidentiality and integrity.

- Steganography enhances data security.

- Backend communication prevents direct communication between frontend applications for added privacy.

## Future Prospects

- Enabling group communication and multi-party messaging.

- Advanced verification mechanisms for messages.

- Continued enhancement of steganography methods for further security.

- Implementation of end-to-end encryption for superior privacy.
