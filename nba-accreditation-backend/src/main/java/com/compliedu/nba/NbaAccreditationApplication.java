package com.compliedu.nba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class NbaAccreditationApplication {
    public static void main(String[] args) {
        SpringApplication.run(NbaAccreditationApplication.class, args);
    }
}