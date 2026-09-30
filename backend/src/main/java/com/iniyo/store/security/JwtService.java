package com.iniyo.store.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class JwtService {

    private final SecretKey key;
    private final long exp;

    public JwtService(
            @Value("${app.jwt.secret}") String s,
            @Value("${app.jwt.expiration-ms}") long e) {

        key = Keys.hmacShaKeyFor(
                s.getBytes(StandardCharsets.UTF_8)
        );

        exp = e;
    }

    // Create JWT
    public String create(String email) {

        Date n = new Date();

        return Jwts.builder()
                .subject(email)
                .issuedAt(n)
                .expiration(
                        new Date(n.getTime() + exp)
                )
                .signWith(key)
                .compact();
    }

    // Existing method
    public String email(String t) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(t)
                .getPayload()
                .getSubject();
    }

    // Added for AuthController
    public String extractEmail(String token) {

        return email(token);
    }

    // Existing method
    public boolean valid(String t) {

        try {
            email(t);
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    // Added for JwtFilter
    public boolean isValid(String token) {

        return valid(token);
    }
}