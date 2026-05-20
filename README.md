# LeaveFlow – Leave Management System

A full-stack Leave Management System built using **Spring Boot**, **React**, **JWT Authentication**, **MySQL**, **Flyway**, and **AWS S3**.

This project simulates a real-world Scrum-based software development workflow and demonstrates:

- Secure authentication
- Role-based access control
- Leave request management
- AWS S3 file uploads
- Flyway database migrations
- EC2 deployment readiness
- Clean layered backend architecture
- Modern React frontend integration

---

# Tech Stack

## Backend
- Java 17
- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA
- Flyway
- MySQL
- AWS SDK for Java (S3)

## Frontend
- React
- TypeScript
- Vite
- Context API
- Modern CSS

## Cloud & DevOps
- AWS EC2
- AWS S3
- Git & GitHub
- Scrum Workflow

---

# Features

## Authentication
- User registration
- Login with JWT
- Persistent authentication
- Protected routes

## Role-Based Access Control

### ADMIN
- View all leave requests
- Approve leave requests
- Reject leave requests
- View employee statistics

### EMPLOYEE
- Submit leave requests
- Upload supporting documents
- View leave history
- Cancel pending requests

---

# AWS S3 File Uploads

Employees can upload:
- PDF files
- JPG images
- PNG images

The backend:
- validates file type
- validates file size
- uploads files to AWS S3
- stores the file URL in MySQL

---

# Database Design

The system uses:
- MySQL
- Flyway migrations
- UUID primary keys

Main tables:
- `app_user`
- `leave_type`
- `leave_request`

---

# Project Structure

```text
leaveflow/
│
├── backend/
│   ├── src/main/java/com/leaveflow
│   ├── src/main/resources
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── docs/
```

---

# Backend Architecture

The backend follows a layered architecture:

```text
Controller Layer
↓
Service Layer
↓
Repository Layer
↓
Database
```

Additional layers:
- DTO Layer
- Security Layer
- Exception Handling Layer
- Storage Layer (AWS S3)

---

# Authentication Flow

```text
1. User logs in
2. JWT token generated
3. Token returned to frontend
4. Frontend stores token
5. Token sent in Authorization header
6. Backend validates token
7. User gains access to protected endpoints
```

Authorization header format:

```text
Authorization: Bearer YOUR_TOKEN
```

---

# Flyway Migrations

Flyway handles database schema creation and versioning.

Migration files are located in:

```text
backend/src/main/resources/db/migration
```

Example:

```text
V1__initial_schema.sql
```

Hibernate validation mode:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

This prevents accidental schema overwrites.

---

# Local Setup

# 1. Clone Project

```bash
git clone YOUR_REPOSITORY_URL
```

---

# 2. Backend Setup

Navigate to backend:

```bash
cd backend
```

Run backend:

```bash
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:3000
```

Swagger documentation:

```text
http://localhost:3000/swagger-ui/index.html
```

---

# 3. Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Run frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Environment Variables

## Backend

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=leave_management_db
DB_USERNAME=root
DB_PASSWORD=*********

JWT_SECRET=kingmeka1234kingmeka1234kingmeka1234kingmeka1234
JWT_EXPIRATION_MS=86400000

AWS_REGION=af-south-1
AWS_S3_BUCKET=your-bucket-name
AWS_S3_PUBLIC_BASE_URL=https://your-bucket-name.s3.amazonaws.com

FRONTEND_URL=http://localhost:5173
PORT=3000
```

---

# Main API Endpoints

## Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

## Leave Requests

```text
GET    /leave-types
GET    /leave-requests/dashboard
GET    /leave-requests/my
GET    /leave-requests
POST   /leave-requests
PATCH  /leave-requests/{id}/review
DELETE /leave-requests/{id}
```

## Users

```text
GET /users/employees
```

---

# Security Features

- JWT authentication
- Password hashing using BCrypt
- Role-based authorization
- Protected API routes
- Environment variable protection
- File validation for uploads
- Secure AWS credential handling

---

# AWS EC2 Deployment

The backend is deployment-ready for EC2.

Deployment steps:
1. Build JAR file
2. Upload to EC2
3. Configure environment variables
4. Open security groups
5. Run Spring Boot application

Example:

```bash
java -jar app.jar
```

---

# Scrum Simulation

This project was designed around Scrum principles.

Included:
- Sprint Planning
- Daily Standups
- Sprint Review
- Sprint Retrospective
- Feature Branch Workflow
- Pull Request Workflow

Documentation available in:

```text
docs/
```

---

# Challenges Faced

## Migration Errors

### Problem
Existing schemas conflicted with Flyway validation.

### Solution
- Removed old schema history
- Rebuilt migration structure
- Switched fully to Flyway migrations

---

## JWT Security Issues

### Problem
JWT secret length errors.

### Solution
Used a secure long secret key compatible with:

```java
Keys.hmacShaKeyFor(...)
```

---

## File Upload Validation

### Problem
Preventing unsupported files.

### Solution
- Added MIME type validation
- Added file size limits
- Restricted uploads to PDF/JPG/PNG

---

# Future Improvements

- CI/CD Pipeline
- Docker Support
- Kubernetes Deployment
- Email Notifications
- Leave Balance Tracking
- Audit Logging
- Unit & Integration Testing
- Redis Caching


# License

This project is for educational and portfolio purp
