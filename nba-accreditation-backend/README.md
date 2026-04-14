# NBA Accreditation System - Spring Boot Backend

## Overview

This is the Spring Boot backend for the NBA Accreditation Management System. It provides RESTful APIs for managing the entire accreditation lifecycle including user authentication, institution management, pre-qualifier applications, SAR (Self Assessment Report) applications, file management, email notifications, and audit logging.

## Tech Stack

- **Java 17+**
- **Spring Boot 3.2.5**
- **Spring Security + JWT** (Authentication & Authorization)
- **Spring Data JPA** (Database ORM)
- **MySQL 8.0+** (Database)
- **Flyway** (Database Migrations)
- **Lombok** (Boilerplate Reduction)
- **MapStruct** (DTO Mapping)
- **SpringDoc OpenAPI** (Swagger UI)
- **iText 8** (PDF Generation)
- **Thymeleaf** (Email Templates)
- **JavaMailSender** (Email Notifications)

## Project Structure

```
src/main/java/com/compliedu/nba/
├── config/          # Security, CORS, Swagger, Mail, Audit configs
├── security/        # JWT token provider, filter, entry point, UserDetails
├── entity/          # JPA entities (21 tables) + enums
├── repository/      # Spring Data JPA repositories
├── dto/             # Request & Response DTOs
├── service/         # Business logic layer
├── controller/      # REST API controllers
├── mapper/          # Entity <-> DTO mappers (MapStruct)
└── exception/       # Global exception handler + custom exceptions
```

## API Endpoints

| Module | Base Path | Description |
|--------|-----------|-------------|
| Auth | `/api/v1/auth` | Login, Register, Password Reset |
| Users | `/api/v1/users` | User CRUD (Admin only) |
| Institutions | `/api/v1/institutions` | Institution management |
| Pre-Qualifiers | `/api/v1/pre-qualifiers` | PQ application lifecycle |
| SAR Applications | `/api/v1/sar-applications` | SAR application + criteria/sections |
| Templates | `/api/v1/templates` | Template upload/download |
| Attachments | `/api/v1/attachments` | File upload/download |
| Notifications | `/api/v1/notifications` | Email notification management |
| Dashboard | `/api/v1/dashboard` | Admin & Institute dashboards |
| Export | `/api/v1/export` | PDF export for PQ & SAR |
| Audit Logs | `/api/v1/audit-logs` | System audit trail |

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+

### Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE nba_accreditation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Configure application.yml:**
   Update `src/main/resources/application.yml` with your:
   - MySQL credentials
   - SMTP email settings
   - JWT secret key

3. **Build & Run:**
   ```bash
   cd nba-accreditation-backend
   mvn clean install
   mvn spring-boot:run
   ```

4. **Access:**
   - API: `http://localhost:8080/api/v1/`
   - Swagger UI: `http://localhost:8080/swagger-ui.html`
   - API Docs: `http://localhost:8080/api-docs`

### Default Users (after Flyway migration)
| Email | Password | Role |
|-------|----------|------|
| admin@compliedu.com | admin123 | ADMIN |
| rgukt@example.com | admin123 | INSTITUTE |

> **Note:** Update the BCrypt password hashes in `V1__init_schema.sql` before production use.

## Key Features

- **JWT Authentication** with role-based access (ADMIN, INSTITUTE)
- **Pre-Qualifier Application** with multi-part forms (Part A & B)
- **SAR Application** with 7 criteria, sections, and sub-sections
- **File Attachments** for sections and sub-sections
- **Template Management** for admin-uploaded documents
- **Email Notifications** with async sending and retry logic
- **PDF Export** for Pre-Qualifier and SAR applications
- **Audit Logging** for tracking all system changes
- **Dashboard APIs** for both Admin and Institute users

## Frontend Integration

Update the React frontend `.env`:
```
VITE_API_URL=http://localhost:8080/api/v1
```

See `specs/SPRING_BOOT_PROJECT_GUIDE.md` for the frontend API client setup.