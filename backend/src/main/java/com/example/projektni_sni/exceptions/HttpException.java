package com.example.projektni_sni.exceptions;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@ToString
public class HttpException extends RuntimeException{

    private HttpStatus status;
    private Object data;

    public HttpException() {
        this(HttpStatus.INTERNAL_SERVER_ERROR, null);
    }

    public HttpException(HttpStatus status, Object data){
        this.status = status;
        this.data = data;
    }
}
