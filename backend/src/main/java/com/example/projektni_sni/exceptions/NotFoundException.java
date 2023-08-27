package com.example.projektni_sni.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Return 404 if data was not found (doesn't exist)
 */
public class NotFoundException extends HttpException{

    public NotFoundException(){
        super(HttpStatus.NOT_FOUND, null);
    }
    public NotFoundException(Object data) { super(HttpStatus.NOT_FOUND, data); }

}
