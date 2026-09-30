package com.iniyo.store.service;

import com.iniyo.store.model.Otp;
import com.iniyo.store.repo.OtpRepo;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private final OtpRepo otpRepo;
    private final EmailService emailService;

    private final SecureRandom random = new SecureRandom();

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    public OtpService(
            OtpRepo otpRepo,
            EmailService emailService) {

        this.otpRepo = otpRepo;
        this.emailService = emailService;
    }

    public void sendOtp(String email) {

        email = email.toLowerCase().trim();

        var existing =
                otpRepo.findTopByEmailOrderByCreatedAtDesc(email);

        if (existing.isPresent()) {

            Otp oldOtp = existing.get();

            LocalDateTime cooldownTime =
                    oldOtp.getCreatedAt()
                            .plusSeconds(RESEND_COOLDOWN_SECONDS);

            if (LocalDateTime.now().isBefore(cooldownTime)) {

                long remaining =
                        Duration.between(
                                LocalDateTime.now(),
                                cooldownTime
                        ).getSeconds();

                throw new IllegalArgumentException(
                        "Please wait "
                                + remaining
                                + " seconds before requesting another OTP"
                );
            }
        }

        String otp = String.format(
                "%06d",
                random.nextInt(1_000_000)
        );

        Otp newOtp = new Otp();

        newOtp.setEmail(email);
        newOtp.setOtpHash(hashOtp(otp));
        newOtp.setCreatedAt(LocalDateTime.now());
        newOtp.setExpiresAt(
                LocalDateTime.now()
                        .plusMinutes(OTP_EXPIRY_MINUTES)
        );
        newOtp.setAttempts(0);
        newOtp.setUsed(false);

        otpRepo.save(newOtp);

        emailService.sendOtp(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {

        email = email.toLowerCase().trim();
        otp = otp.trim();

        Otp storedOtp =
                otpRepo
                        .findTopByEmailOrderByCreatedAtDesc(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "OTP not found"
                                )
                        );

        if (storedOtp.isUsed()) {

            throw new IllegalArgumentException(
                    "OTP already used"
            );
        }

        if (LocalDateTime.now()
                .isAfter(storedOtp.getExpiresAt())) {

            throw new IllegalArgumentException(
                    "OTP expired"
            );
        }

        if (storedOtp.getAttempts() >= MAX_ATTEMPTS) {

            throw new IllegalArgumentException(
                    "Too many incorrect attempts. Please request a new OTP"
            );
        }

        storedOtp.setAttempts(
                storedOtp.getAttempts() + 1
        );

        boolean valid =
                hashOtp(otp)
                        .equals(storedOtp.getOtpHash());

        if (!valid) {

            otpRepo.save(storedOtp);

            throw new IllegalArgumentException(
                    "Invalid OTP"
            );
        }

        storedOtp.setUsed(true);

        otpRepo.save(storedOtp);

        return true;
    }

    private String hashOtp(String otp) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            otp.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            StringBuilder hex =
                    new StringBuilder();

            for (byte b : hash) {

                hex.append(
                        String.format(
                                "%02x",
                                b
                        )
                );
            }

            return hex.toString();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to hash OTP",
                    e
            );
        }
    }
}