package com.iniyo.store.security;

import com.iniyo.store.repo.UserRepo;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepo userRepo;

    public JwtFilter(
            JwtService jwtService,
            UserRepo userRepo
    ) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorization =
                request.getHeader("Authorization");

        if (authorization != null &&
                authorization.startsWith("Bearer ")) {

            String token =
                    authorization.substring(7);

            if (jwtService.isValid(token)) {

                String email =
                        jwtService.extractEmail(token);

                userRepo.findByEmail(email)
                        .ifPresent(user -> {

                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            user.getEmail(),
                                            null,
                                            Collections.emptyList()
                                    );

                            SecurityContextHolder
                                    .getContext()
                                    .setAuthentication(
                                            authentication
                                    );
                        });
            }
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}