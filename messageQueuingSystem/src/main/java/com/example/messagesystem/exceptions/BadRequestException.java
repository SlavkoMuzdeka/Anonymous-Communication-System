package com.example.messagesystem.exceptions;

import org.springframework.http.HttpStatus;

public class BadRequestException extends HttpException{

    public BadRequestException() {
        super(HttpStatus.BAD_REQUEST, null);
    }
}
