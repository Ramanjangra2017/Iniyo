package com.iniyo.store.repo;

import com.iniyo.store.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepo extends JpaRepository<Otp, Long> {

    Optional<Otp> findTopByEmailOrderByCreatedAtDesc(String email);
}