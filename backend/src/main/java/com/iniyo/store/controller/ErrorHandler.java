package com.iniyo.store.controller; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestControllerAdvice public class ErrorHandler { @ExceptionHandler(Exception.class) public Map<String,String> error(Exception e){return Map.of("message",e.getMessage()==null?"Something went wrong":e.getMessage());} }
