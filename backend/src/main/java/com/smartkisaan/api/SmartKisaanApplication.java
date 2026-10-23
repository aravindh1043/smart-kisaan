package com.smartkisaan.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartKisaanApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartKisaanApplication.class, args);
    }
}
