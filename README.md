# 🚀 Task Tracker (Mini Jira)

A simple full-stack task management application inspired by Jira.  
Built with **Spring Boot + Angular**, focusing on clean architecture, JWT authentication, and modern frontend practices.

## ✨ Features

- 🔐 Authentication with JWT
- 📝 CRUD Task (Create, Read, Update, Delete)
- 🔍 Filter & Search tasks
- 👤 Assign tasks to users
- 📊 Task status management:
  - TODO
  - IN_PROGRESS
  - DONE
- 🌐 Clean REST API design
- 📱 Responsive UI

---

## 🛠 Tech Stack

### Backend (Spring Boot)

- Java 17+
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL / H2
- Lombok

### Frontend (Angular)

- Angular 17+ (16+ compatible)
- RxJS (Observable, switchMap 🔥)
- Angular Material / Tailwind CSS
- HttpClient
- Angular Routing

---

## 🏗 Architecture

### Backend Structure
backend/
├── controller/ # REST controllers
├── service/ # Business logic
├── repository/ # Data access layer
├── dto/ # Data Transfer Objects
├── entity/ # JPA entities
├── security/ # JWT + Spring Security
└── config/ # App configurations

3. Architecture (CV rất thích phần này)
Backend structure

backend/
 ├── controller/
 ├── service/
 ├── repository/
 ├── dto/
 ├── entity/
 ├── security/
 └── config/
Frontend structure

frontend/
 ├── core/        (auth, interceptor)
 ├── shared/      (components reusable)
 ├── features/
 │    ├── task/
 │    ├── auth/
 ├── models/
 └── services/

