# 🚀 Task Tracker (Mini Jira)

A simple full-stack task management application inspired by Jira.  
Built with **Spring Boot + Angular**, focusing on clean architecture, JWT authentication, and modern frontend practices.

Project: Task Tracker (Mini Jira)

1. Features 
	• Login (JWT) 
	• CRUD Task 
	• Filter / Search 
	• Assign user 
	• Status: TODO / IN_PROGRESS / DONE 
	• REST API clean 
	• Responsive UI

2. Tech Stack
Backend (Spring Boot)
	• Java 17+ 
	• Spring Boot 3 
	• Spring Security + JWT 
	• Spring Data JPA 
	• PostgreSQL / H2 
	• Lombok 
Frontend (Angular)
	• Angular 17+ (hoặc 16+ ok) 
	• RxJS (Observable, switchMap 🔥) 
	• Angular Material / Tailwind 
	• HttpClient 
	• Routing


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

