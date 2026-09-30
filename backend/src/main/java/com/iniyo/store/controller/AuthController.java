package com.iniyo.store.controller;

import com.iniyo.store.model.User;
import com.iniyo.store.repo.UserRepo;
import com.iniyo.store.security.JwtService;
import com.iniyo.store.service.OtpService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepo users;
    private final OtpService otpService;
    private final JwtService jwtService;

    public AuthController(
            UserRepo users,
            OtpService otpService,
            JwtService jwtService
    ) {
        this.users = users;
        this.otpService = otpService;
        this.jwtService = jwtService;
    }

    // =========================
    // SEND OTP
    // =========================

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(
            @Valid @RequestBody LoginOtpRequest request
    ) {

        String name = request.name().trim();
        String email = request.email().trim().toLowerCase();
        String phone = request.phone().trim();

        if (name.length() < 2) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please enter a valid name"));
        }

        if (!phone.matches("[6-9][0-9]{9}")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please enter a valid 10-digit phone number"));
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please enter a valid email"));
        }

        try {

            otpService.sendOtp(email);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "OTP sent successfully",
                            "email", email
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to send OTP"
                            )
                    );
        }
    }

    // =========================
    // VERIFY OTP
    // =========================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request
    ) {

        String name = request.name().trim();
        String email = request.email().trim().toLowerCase();
        String phone = request.phone().trim();
        String otp = request.otp().trim();

        if (name.length() < 2) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please enter a valid name"));
        }

        if (!phone.matches("[6-9][0-9]{9}")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please enter a valid phone number"));
        }

        if (!otp.matches("\\d{6}")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "OTP must be 6 digits"));
        }

        try {

            boolean verified = otpService.verifyOtp(email, otp);

            if (!verified) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid or expired OTP"));
            }

            // Check whether phone belongs to another user
            var existingPhone = users.findByPhone(phone);

            if (existingPhone.isPresent()
                    && !existingPhone.get().getEmail().equalsIgnoreCase(email)) {

                return ResponseEntity.badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "This phone number is already registered with another account"
                                )
                        );
            }

            User user = users.findByEmail(email)
                    .orElseGet(User::new);

            user.setName(name);
            user.setEmail(email);
            user.setPhone(phone);
            user.setEmailVerified(true);

            users.save(user);

            String token = jwtService.create(email);

            Map<String, Object> response = new HashMap<>();

            response.put("token", token);
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("phone", user.getPhone());
            response.put("emailVerified", user.isEmailVerified());

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to verify OTP"
                            )
                    );
        }
    }

    // =========================
    // GET CURRENT USER
    // =========================

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Unauthorized"));
        }

        String email = authentication.getName();

        return users.findByEmail(email)
                .map(user -> {

                    Map<String, Object> response = new HashMap<>();

                    response.put("id", user.getId());
                    response.put("name", user.getName());
                    response.put("email", user.getEmail());
                    response.put("phone", user.getPhone());
                    response.put(
                            "emailVerified",
                            user.isEmailVerified()
                    );

                    return ResponseEntity.ok(response);

                })
                .orElseGet(
                        () -> ResponseEntity.status(404)
                                .body(Map.of("message", "User not found"))
                );
    }

    // =========================
    // UPDATE PROFILE
    // =========================

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request
    ) {

        if (authentication == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Unauthorized"));
        }

        String email = authentication.getName();

        User user = users.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "User not found"));
        }

        String name = request.name() != null
                ? request.name().trim()
                : "";

        String phone = request.phone() != null
                ? request.phone().trim()
                : "";

        if (name.length() < 2) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please enter a valid name"));
        }

        if (!phone.matches("[6-9][0-9]{9}")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please enter a valid phone number"));
        }

        var existingPhone = users.findByPhone(phone);

        if (existingPhone.isPresent()
                && !existingPhone.get().getEmail().equalsIgnoreCase(email)) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "This phone number is already registered"
                            )
                    );
        }

        user.setName(name);
        user.setPhone(phone);

        users.save(user);

        Map<String, Object> response = new HashMap<>();

        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("emailVerified", user.isEmailVerified());

        return ResponseEntity.ok(response);
    }

    // =========================
    // LOGOUT
    // =========================

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        /*
         * JWT is stateless.
         *
         * The frontend removes the token from localStorage.
         *
         * For true server-side token revocation,
         * a token blacklist/refresh-token system would be required.
         */

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }

    // =========================
    // REQUEST DTOs
    // =========================

    public record LoginOtpRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank String phone
    ) {}

    public record VerifyOtpRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank String phone,
            @NotBlank String otp
    ) {}

    public record UpdateProfileRequest(
            String name,
            String phone
    ) {}
}