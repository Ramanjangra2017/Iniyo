package com.iniyo.store.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.mail.from-name}")
    private String fromName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String email, String otp) {

        try {

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true,
                            "UTF-8"
                    );

            helper.setFrom(from, fromName);
            helper.setTo(email);
            helper.setSubject(
                    "Your INIYO verification code"
            );

            String html = """
                    <div style="font-family:Arial,sans-serif;
                                max-width:600px;
                                margin:auto;
                                padding:30px;
                                color:#333;">

                        <h2>Welcome to INIYO ♡</h2>

                        <p>
                            Use the verification code below
                            to continue.
                        </p>

                        <div style="
                            font-size:32px;
                            font-weight:bold;
                            letter-spacing:8px;
                            padding:20px;
                            margin:25px 0;
                            background:#f8eee9;
                            text-align:center;
                            border-radius:10px;">
                            %s
                        </div>

                        <p>
                            This code will expire in
                            <b>5 minutes</b>.
                        </p>

                        <p style="color:#777;font-size:13px;">
                            If you didn't request this code,
                            you can safely ignore this email.
                        </p>

                        <p style="margin-top:30px;">
                            With love,<br>
                            <b>INIYO</b>
                        </p>

                    </div>
                    """.formatted(otp);

            helper.setText(html, true);

            System.out.println(
                    "Sending OTP email to: " + email
            );

            System.out.println(
                    "SMTP From: " + from
            );

            mailSender.send(message);

            System.out.println(
                    "OTP email sent successfully to: " + email
            );

        } catch (MailException e) {

            System.err.println(
                    "===== EMAIL SEND FAILED ====="
            );

            e.printStackTrace();

            throw new RuntimeException(
                    "Unable to send OTP email: "
                            + e.getMessage(),
                    e
            );

        } catch (Exception e) {

            System.err.println(
                    "===== EMAIL ERROR ====="
            );

            e.printStackTrace();

            throw new RuntimeException(
                    "Unable to create/send OTP email: "
                            + e.getMessage(),
                    e
            );
        }
    }
}