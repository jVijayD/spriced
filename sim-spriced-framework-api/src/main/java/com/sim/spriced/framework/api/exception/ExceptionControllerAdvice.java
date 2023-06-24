package com.sim.spriced.framework.api.exception;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import com.sim.spriced.framework.exceptions.data.NotFoundException;
import com.sim.spriced.framework.exceptions.data.ReferentialIntegrityException;
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
import com.sim.spriced.framework.exceptions.data.TenantNotPresentException;
import com.sim.spriced.framework.exceptions.data.UniqueConstraintException;

@ControllerAdvice
public class ExceptionControllerAdvice extends ResponseEntityExceptionHandler {
	
	//TenantNotPresentException
	
	@ExceptionHandler(UniqueConstraintException.class)
    public ResponseEntity<?> uniqueConstraintException(UniqueConstraintException ex, WebRequest request) {
         ErrorDetails errorDetails = new ErrorDetails(new Date(), "DataAccess:"+ex.getMessage(), request.getDescription(false),ex.getErrorCode());
         errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());
         errorDetails.setDetails(ex.getExtraData());
         return new ResponseEntity<>(errorDetails, HttpStatus.CONFLICT);
    }

	@ExceptionHandler(TenantNotPresentException.class)
    public ResponseEntity<?> tenantNotPresentException(TenantNotPresentException ex, WebRequest request) {
         ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false),ex.getErrorCode());
         errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());
         errorDetails.setDetails(ex.getExtraData());
         return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

	@ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> dataAccessException(DataAccessException ex, WebRequest request) {
         ErrorDetails errorDetails = new ErrorDetails(new Date(), "DataAccess:"+ex.getMessage(), request.getDescription(false),ex.getErrorCode());
         errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());
         
         return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> globleExcpetionHandler(Exception ex, WebRequest request) {
    	String errorCode = "EX500";
        ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false),errorCode);
        errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());

        
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ReferentialIntegrityException.class)
    public ResponseEntity<?> referentialIntegrityException(ReferentialIntegrityException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false),ex.getErrorCode());
        errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());
        errorDetails.setDetails(ex.getExtraData());
        return new ResponseEntity<>(errorDetails, HttpStatus.METHOD_NOT_ALLOWED);
    }
    
    @ExceptionHandler({ResourceNotFoundException.class,NotFoundException.class})
    public ResponseEntity<?> resourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false),ex.getErrorCode());
        errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());
        errorDetails.setDetails(ex.getExtraData());
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }
    
    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(
      NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
    	String errorCode = "EX404";
        String error = "No handler found for " + ex.getHttpMethod() + " " + ex.getRequestURL();
        ErrorDetails errorDetails = new ErrorDetails(new Date(), error, request.getDescription(false),errorCode);
        errorDetails.setRequestURI(((ServletWebRequest)request).getRequest().getRequestURI());
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
  
        
        return new ResponseEntity<>(errorDetails,HttpStatus.BAD_REQUEST);
    }
    
}
