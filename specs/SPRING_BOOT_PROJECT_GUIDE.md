# NBA Accreditation System - Spring Boot Backend Guide

## Project Structure

```
nba-accreditation-backend/
├── pom.xml
├── src/
│   └── main/
│       ├── java/com/compliedu/nba/
│       │   ├── NbaAccreditationApplication.java          # Main entry point
│       │   │
│       │   ├── config/
│       │   │   ├── SecurityConfig.java                   # Spring Security + JWT config
│       │   │   ├── CorsConfig.java                       # CORS for React frontend
│       │   │   ├── SwaggerConfig.java                    # Swagger/OpenAPI config
│       │   │   ├── MailConfig.java                       # Email (SMTP) configuration
│       │   │   └── AuditConfig.java                      # JPA Auditing config
│       │   │
│       │   ├── security/
│       │   │   ├── JwtTokenProvider.java                 # JWT token generation/validation
│       │   │   ├── JwtAuthenticationFilter.java          # JWT filter for requests
│       │   │   ├── JwtAuthenticationEntryPoint.java      # Unauthorized handler
│       │   │   └── CustomUserDetailsService.java         # UserDetails implementation
│       │   │
│       │   ├── entity/
│       │   │   ├── User.java
│       │   │   ├── Institution.java
│       │   │   ├── PreQualifier.java
│       │   │   ├── ProgramOffered.java
│       │   │   ├── ProgramForAccreditation.java
│       │   │   ├── AlliedDepartment.java
│       │   │   ├── ProgramDetail.java
│       │   │   ├── FacultyRow.java
│       │   │   ├── FacultyCadreRow.java
│       │   │   ├── SfrData.java
│       │   │   ├── SfrProgramRow.java
│       │   │   ├── ComplianceRow.java
│       │   │   ├── SarApplication.java
│       │   │   ├── Criteria.java
│       │   │   ├── SectionData.java
│       │   │   ├── SubSectionData.java
│       │   │   ├── Attachment.java
│       │   │   ├── Application.java
│       │   │   ├── TemplateFile.java
│       │   │   ├── EmailNotification.java
│       │   │   ├── AuditLog.java
│       │   │   └── enums/
│       │   │       ├── UserRole.java                     # ADMIN, INSTITUTE
│       │   │       ├── AccreditationStatus.java          # PENDING, ACCREDITED, NOT_ACCREDITED
│       │   │       ├── PreQualifierStatus.java           # DRAFT, IN_PROGRESS, SUBMITTED
│       │   │       ├── SarStatus.java                    # DRAFT, IN_PROGRESS, ... REJECTED
│       │   │       ├── ApplicationType.java              # INITIAL, RENEWAL
│       │   │       ├── ApplicationStatus.java            # DRAFT, SUBMITTED, ... REJECTED
│       │   │       ├── NotificationType.java             # REGISTRATION, PASSWORD_RESET, ...
│       │   │       ├── NotificationStatus.java           # PENDING, SENT, FAILED
│       │   │       └── EntityType.java                   # SECTION, SUB_SECTION
│       │   │
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   ├── InstitutionRepository.java
│       │   │   ├── PreQualifierRepository.java
│       │   │   ├── ProgramOfferedRepository.java
│       │   │   ├── ProgramForAccreditationRepository.java
│       │   │   ├── AlliedDepartmentRepository.java
│       │   │   ├── ProgramDetailRepository.java
│       │   │   ├── FacultyRowRepository.java
│       │   │   ├── FacultyCadreRowRepository.java
│       │   │   ├── SfrDataRepository.java
│       │   │   ├── SfrProgramRowRepository.java
│       │   │   ├── ComplianceRowRepository.java
│       │   │   ├── SarApplicationRepository.java
│       │   │   ├── CriteriaRepository.java
│       │   │   ├── SectionDataRepository.java
│       │   │   ├── SubSectionDataRepository.java
│       │   │   ├── AttachmentRepository.java
│       │   │   ├── ApplicationRepository.java
│       │   │   ├── TemplateFileRepository.java
│       │   │   ├── EmailNotificationRepository.java
│       │   │   └── AuditLogRepository.java
│       │   │
│       │   ├── dto/
│       │   │   ├── request/
│       │   │   │   ├── LoginRequest.java
│       │   │   │   ├── RegisterRequest.java
│       │   │   │   ├── ForgotPasswordRequest.java
│       │   │   │   ├── ResetPasswordRequest.java
│       │   │   │   ├── ChangePasswordRequest.java
│       │   │   │   ├── CreateInstitutionRequest.java
│       │   │   │   ├── CreatePreQualifierRequest.java
│       │   │   │   ├── UpdatePreQualifierRequest.java
│       │   │   │   ├── CreateSarApplicationRequest.java
│       │   │   │   ├── UpdateSarApplicationRequest.java
│       │   │   │   ├── UpdateSectionRequest.java
│       │   │   │   ├── UpdateSubSectionRequest.java
│       │   │   │   ├── ReviewRequest.java
│       │   │   │   ├── SendNotificationRequest.java
│       │   │   │   └── UpdateUserRequest.java
│       │   │   │
│       │   │   └── response/
│       │   │       ├── LoginResponse.java
│       │   │       ├── UserResponse.java
│       │   │       ├── InstitutionResponse.java
│       │   │       ├── PreQualifierResponse.java
│       │   │       ├── PreQualifierDetailResponse.java
│       │   │       ├── SarApplicationResponse.java
│       │   │       ├── SarApplicationDetailResponse.java
│       │   │       ├── CriteriaResponse.java
│       │   │       ├── CriteriaDetailResponse.java
│       │   │       ├── SectionResponse.java
│       │   │       ├── SubSectionResponse.java
│       │   │       ├── AttachmentResponse.java
│       │   │       ├── TemplateResponse.java
│       │   │       ├── NotificationResponse.java
│       │   │       ├── AuditLogResponse.java
│       │   │       ├── AdminDashboardResponse.java
│       │   │       ├── InstituteDashboardResponse.java
│       │   │       ├── MessageResponse.java
│       │   │       ├── ErrorResponse.java
│       │   │       └── ValidationErrorResponse.java
│       │   │
│       │   ├── service/
│       │   │   ├── AuthService.java
│       │   │   ├── UserService.java
│       │   │   ├── InstitutionService.java
│       │   │   ├── PreQualifierService.java
│       │   │   ├── SarApplicationService.java
│       │   │   ├── CriteriaService.java
│       │   │   ├── SectionService.java
│       │   │   ├── AttachmentService.java
│       │   │   ├── TemplateService.java
│       │   │   ├── EmailNotificationService.java         # Email sending + queue
│       │   │   ├── PdfExportService.java                 # PDF generation
│       │   │   ├── DashboardService.java
│       │   │   ├── AuditLogService.java
│       │   │   └── FileStorageService.java               # File upload/download
│       │   │
│       │   ├── controller/
│       │   │   ├── AuthController.java                   # /api/v1/auth/**
│       │   │   ├── UserController.java                   # /api/v1/users/**
│       │   │   ├── InstitutionController.java            # /api/v1/institutions/**
│       │   │   ├── PreQualifierController.java           # /api/v1/pre-qualifiers/**
│       │   │   ├── SarApplicationController.java         # /api/v1/sar-applications/**
│       │   │   ├── TemplateController.java               # /api/v1/templates/**
│       │   │   ├── NotificationController.java           # /api/v1/notifications/**
│       │   │   ├── ExportController.java                 # /api/v1/export/**
│       │   │   ├── DashboardController.java              # /api/v1/dashboard/**
│       │   │   └── AuditLogController.java               # /api/v1/audit-logs/**
│       │   │
│       │   ├── mapper/
│       │   │   ├── UserMapper.java                       # Entity <-> DTO mapping
│       │   │   ├── InstitutionMapper.java
│       │   │   ├── PreQualifierMapper.java
│       │   │   ├── SarApplicationMapper.java
│       │   │   ├── CriteriaMapper.java
│       │   │   └── TemplateMapper.java
│       │   │
│       │   └── exception/
│       │       ├── GlobalExceptionHandler.java           # @ControllerAdvice
│       │       ├── ResourceNotFoundException.java
│       │       ├── BadRequestException.java
│       │       ├── UnauthorizedException.java
│       │       └── DuplicateResourceException.java
│       │
│       └── resources/
│           ├── application.yml                           # Main config
│           ├── application-dev.yml                       # Dev profile
│           ├── application-prod.yml                      # Production profile
│           ├── db/migration/                             # Flyway migrations
│           │   └── V1__init_schema.sql                   # Use the schema.sql file
│           └── templates/
│               └── email/                                # Thymeleaf email templates
│                   ├── registration.html
│                   ├── password-reset.html
│                   ├── pq-submitted.html
│                   ├── pq-approved.html
│                   ├── pq-rejected.html
│                   ├── sar-submitted.html
│                   ├── sar-approved.html
│                   ├── sar-rejected.html
│                   └── general-notification.html
```

## Key Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>

    <!-- MySQL -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>

    <!-- Swagger/OpenAPI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>

    <!-- PDF Generation -->
    <dependency>
        <groupId>com.itextpdf</groupId>
        <artifactId>itext7-core</artifactId>
        <version>8.0.2</version>
        <type>pom</type>
    </dependency>
    <dependency>
        <groupId>com.itextpdf</groupId>
        <artifactId>html2pdf</artifactId>
        <version>5.0.2</version>
    </dependency>

    <!-- Flyway for DB migrations -->
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-mysql</artifactId>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- MapStruct for DTO mapping -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>1.5.5.Final</version>
        <scope>provided</scope>
    </dependency>

    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## application.yml Configuration

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/nba_accreditation?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: validate  # Use Flyway for migrations
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true

  flyway:
    enabled: true
    locations: classpath:db/migration

  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB

# JWT Configuration
jwt:
  secret: your-256-bit-secret-key-here-must-be-at-least-32-characters
  expiration: 86400000  # 24 hours in milliseconds

# File Storage
file:
  upload-dir: ./uploads
  templates-dir: ./uploads/templates
  attachments-dir: ./uploads/attachments

# Swagger
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: alpha
```

## Email Notification Events

The system sends email notifications for the following events:

| Event | Recipient | Template |
|-------|-----------|----------|
| User Registration | New user | `registration.html` |
| Password Reset Request | User | `password-reset.html` |
| Pre-Qualifier Submitted | Admin(s) | `pq-submitted.html` |
| Pre-Qualifier Approved | Institute user | `pq-approved.html` |
| Pre-Qualifier Rejected | Institute user | `pq-rejected.html` |
| SAR Application Submitted | Admin(s) | `sar-submitted.html` |
| SAR Application Approved | Institute user | `sar-approved.html` |
| SAR Application Rejected | Institute user | `sar-rejected.html` |
| New Template Uploaded | All institute users | `general-notification.html` |

### Email Service Implementation Notes

```java
@Service
public class EmailNotificationService {
    
    // 1. Save notification to DB with PENDING status
    // 2. Use @Async to send email asynchronously
    // 3. Update status to SENT or FAILED
    // 4. Implement retry logic (max 3 retries)
    // 5. Use @Scheduled for processing pending/failed notifications
    
    @Async
    public void sendNotification(EmailNotification notification) {
        // Send via JavaMailSender with Thymeleaf template
    }
    
    @Scheduled(fixedDelay = 60000) // Every minute
    public void processFailedNotifications() {
        // Retry failed notifications with retry_count < max_retries
    }
}
```

## Frontend API Integration

Update the React frontend to call the Spring Boot API instead of using localStorage:

```typescript
// src/lib/api.ts - Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },
  
  get: (endpoint: string) => api.request(endpoint),
  post: (endpoint: string, body: any) => api.request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) => api.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint: string) => api.request(endpoint, { method: 'DELETE' }),
};
```

## Quick Start

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE nba_accreditation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Generate Spring Boot Project:**
   - Go to [start.spring.io](https://start.spring.io)
   - Select: Maven, Java 17+, Spring Boot 3.2+
   - Add dependencies: Web, JPA, Security, Validation, Mail, MySQL Driver, Flyway, Lombok

3. **Copy the schema.sql** to `src/main/resources/db/migration/V1__init_schema.sql`

4. **Import the swagger.yaml** into your project and use it as reference for controllers

5. **Configure application.yml** with your MySQL and SMTP credentials

6. **Run:**
   ```bash
   mvn spring-boot:run
   ```

7. **Access Swagger UI:** `http://localhost:8080/swagger-ui.html`

8. **Update React frontend** `.env`:
   ```
   VITE_API_URL=http://localhost:8080/api/v1
   ```