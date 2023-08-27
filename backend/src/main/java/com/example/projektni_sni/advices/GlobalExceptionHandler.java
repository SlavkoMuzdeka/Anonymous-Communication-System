package com.example.projektni_sni.advices;

import com.example.projektni_sni.exceptions.HttpException;
import com.example.projektni_sni.util.LoggingUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.HandlerMethod;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Here we process HttpMessageNotReadableException which happens in situation when someone send JSON which isn't formatted
     * as it needs to be and because of it Spring cannot parse it
     *
     * @return Status code 400 (BAD_REQUEST)
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public final ResponseEntity<Object> handleHttpMessageNotReadable() {
        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    /**
     * Process user defined exception (HttpException)
     *
     * @param e             The exception that happened
     * @param handlerMethod Abstraction of method where happened exception
     * @return Status code 500 if status of exception is null, otherwise, status code for one user defined exception
     */
    @ExceptionHandler(HttpException.class)
    public final ResponseEntity<Object> handleHttpException(HttpException e, HandlerMethod handlerMethod) {
        Log log = getLog(handlerMethod);
        log.error(e);
        if (e.getStatus() == null) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(e.getData(), e.getStatus());
    }

    /**
     * This error will occur if an error occurs in a controller, and none of the above-mentioned exceptions are specified.
     * It describes all stack trace
     *
     * @param e             The exception that happened
     * @param handlerMethod Abstraction of method where happened exception
     * @return Status code 500 (as default)
     */
    @ExceptionHandler(Exception.class)
    public final ResponseEntity<Object> handleException(Exception e, HandlerMethod handlerMethod) {
        LoggingUtil.logException(e, getLog(handlerMethod));
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Helper function which enables getting log object from our class method
     *
     * @param handlerMethod Abstraction of method
     * @return Log object
     */
    private Log getLog(HandlerMethod handlerMethod) {
        return LogFactory.getLog(handlerMethod.getMethod().getDeclaringClass());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}
