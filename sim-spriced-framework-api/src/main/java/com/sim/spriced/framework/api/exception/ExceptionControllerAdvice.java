package com.sim.spriced.framework.api.exception;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.sim.spriced.framework.exceptions.DataAccessException;


import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class ExceptionControllerAdvice extends ResponseEntityExceptionHandler {
	
	private static final String DATA_ACCESS_ERROR = "Data Access Error.";
	private static final String UNHANDLED_ERROR = "Un Handled Error.";
	private static final String RESOURCE_NOT_FOUND_ERROR = "Resource Not Found Error.";
	private static final String REQUEST_METHOD_NOT_SUPPORTED_ERROR = "Request method not supported.";
	private static final String BAD_REQUEST_ERROR = "Bad request.";

	@ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> dataAccessException(DataAccessException ex, WebRequest request) {
         ErrorDetails errorDetails = new ErrorDetails(new Date(), "DataAccess:"+ex.getMessage(), request.getDescription(false),ex.getErrorCode());
         errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());
         
         log.error(DATA_ACCESS_ERROR, ex);
         
         return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> globleExcpetionHandler(Exception ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false),"");
        errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());
        
        log.error(UNHANDLED_ERROR, ex);
        
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(
      NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
    	String errorCode = "EX404";
        String error = "No handler found for " + ex.getHttpMethod() + " " + ex.getRequestURL();
        ErrorDetails errorDetails = new ErrorDetails(new Date(), error, request.getDescription(false),errorCode);
        errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());
        
        log.error(RESOURCE_NOT_FOUND_ERROR, ex);
        
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }
    
    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(
      HttpRequestMethodNotSupportedException ex, 
      HttpHeaders headers, 
      HttpStatus status, 
      WebRequest request) {
    	String errorCode = "EX405";
        StringBuilder builder = new StringBuilder();
        builder.append(ex.getMethod());
        builder.append(
          " method is not supported for this request. Supported methods are ");
        Set<HttpMethod> methods = ex.getSupportedHttpMethods();
        if(methods!=null) {
        	methods.forEach(t -> builder.append(t + " "));
        }
        
        ErrorDetails errorDetails = new ErrorDetails(new Date(), builder.toString(), request.getDescription(false),errorCode);
        errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());
        
        log.error(REQUEST_METHOD_NOT_SUPPORTED_ERROR, ex);
        
        return new ResponseEntity<>(errorDetails, HttpStatus.METHOD_NOT_ALLOWED);
    }
    
    @Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
    	
    	String errorCode = "VL_001";
    	String description ="VALIDATION ERROR";
    	
    	Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getAllErrors().forEach(error ->{
			
			String fieldName = ((FieldError) error).getField();
			String message = error.getDefaultMessage();
			errors.put(fieldName, message);
		});
        
        ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(),description ,errorCode);
        errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());
        errorDetails.setErrors(errors);
        
        log.error(BAD_REQUEST_ERROR, ex);
        
        return new ResponseEntity<>(errorDetails,HttpStatus.BAD_REQUEST);
    }
    
}
