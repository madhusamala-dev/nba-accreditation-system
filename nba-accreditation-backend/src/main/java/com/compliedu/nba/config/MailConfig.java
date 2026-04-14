package com.compliedu.nba.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class MailConfig {
    // Mail configuration is handled via application.yml
    // This class enables async processing for email sending
}