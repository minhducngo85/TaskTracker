# 🚀 Task Tracker (Mini Jira)

A simple full-stack task management application inspired by Jira.  
Built with **Spring Boot + Angular**, focusing on clean architecture, JWT authentication, and modern frontend practices.

Live Demo: https://82.165.51.255/

<p align="center">
  <img src="./screenshots/dashboard.png" width="800"/>
</p>

## ✨ Features

### 🔐 Authentication & Security
- 🔐 Authentication with JWT
- 🔄 Refresh token mechanism to renew access tokens
- 👤 Role-based access control (Admin & User)

### 📝 Task Management
- 📝 Task management (CRUD: Create, Read, Update, Delete)
- 👤 Assign tasks to users
- 📌 Status management: TODO, IN_PROGRESS, DONE
- 🚩 Priority levels: CRITICAL, HIGH, MEDIUM, LOW

### 🔍 Advanced Features
- 🔍 Advanced filtering, search & pagination
- 📊 Dashboard with statistics, charts & recent tasks
- 📋 Kanban Board with drag-and-drop (Angular CDK)

### 💬 Collaboration
- 💬 Task comments with pagination
- 🤝 Collaboration: discussions per task
- 📊 Task change history (audit log)
- 📝 Activity feed (timeline of changes)

### 📱 UI/UX
- 📱 Responsive UI with mobile-optimized layout (swipe / horizontal scroll)

### 🌐 Backend & API
- 🌐 Clean REST API design (Spring Boot best practices)
- 🧱 Layered architecture (Controller → Service → Repository)
- 🔄 DTO mapping & validation

### 📈 Logging & Observability (Production-Ready)
- 📈 Structured logging with correlationId for request tracing
- 🔗 Correlation ID propagation across requests
- 📥 Full HTTP request & response logging (method, URI, body, latency)
- 👤 User-aware logging (logs include authenticated user context)
- ⚠️ Standardized error logging with stacktrace & context
- 🧾 Audit logging for business actions (create/update/delete tasks)
- 📊 Activity tracking for debugging and system monitoring

### 🧪 Testing (Full-Stack Coverage)

#### 🧪 Backend testing (Spring Boot)
- Unit tests for service layer (business logic validation)
- Integration tests for REST controllers (MockMvc)
- Repository tests with in-memory database (H2)
- Validation & error handling test coverage

#### ⚡ Frontend testing (Angular + Vitest)
- Unit tests for components, services, and pipes
- Mocked HTTP requests for isolated testing- 
- Reactive forms & validation testing
- Observable-based async testing

#### 🌐 End-to-End (E2E) testing with Playwright
- Full user flow testing (login → dashboard → task actions)
- Authentication handling (JWT / session reuse)
- UI interaction testing (filters, navigation, pagination)
- Stable async handling (auto-wait, non-flaky tests)
- Multi-browser support (Chromium, Firefox, WebKit)

### 🐳 DevOps
- 🐳 Docker & Docker Compose setup for fullstack environment
- ⚙️ Environment-based configuration (dev/prod ready)

## ✨ To-do Features
- real time: sync kanban between users using websocket
- Offline-first: cache task and sync when it becomes online
- OIDC with keycloak (optional)
- File upload: save file local or in S3
- notification system :Notification {id, userId, message, isRead}. to trigger assign task, comment

## 🛠 Tech Stack

### Backend - TaskTracker (Spring Boot)

- Java 17+
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL / H2
- Lombok

### Frontend - TaskTrackerFrontend (Angular)

- Angular 21
- RxJS (Observable, switchMap 🔥)
- Angular Material / Tailwind CSS
- HttpClient
- Angular Routing
- Authentication guard and admin guard

---

## 🏗 Architecture

### Backend Structure
```text
backend/
├── controller/    # REST controllers
├── service/       # Business logic
├── repository/    # Data access layer
├── dto/           # Data Transfer Objects
├── entity/        # JPA entities
├── security/      # JWT + Spring Security
└── config/        # App configurations
```

### Frontend Structure
```text
src/app/
 ├── core/
 │    ├── auth.service.ts
 │    ├── auth.interceptor.ts
 ├── features/
 │    ├── auth/
 │    │     └── login.component.ts
 │    ├── task/
 │          └── task.component.ts
 ├── models/
 └── app.routes.ts
```

### Frontend packages
### Chart
```
npm install chart.js
npm install chartjs-plugin-datalabels
```

### Angular Material
``` 
npm install @angular/material
ng add @angular/material
```
to use snackbar

style.css: @import '@angular/material/prebuilt-themes/indigo-pink.css';

### quill for tich text
```
npm install ngx-quill quill
```
style.css: @import 'quill/dist/quill.snow.css';
### Angular CDK for Drag & Drop
``` 
npm install @angular/cdk
``` 

### Angular ng-select
```
npm install @ng-select/ng-select
```

Angular.jss
```
"styles": [
  "src/material-theme.scss",
  "node_modules/@ng-select/ng-select/themes/material.theme.css",
  "src/styles.css"
]
```
###  toastr - not compatible for angular 21
```
npm install ngx-toastr
npm install @angular/animations
```

## 🗯️ Deployment on VPS
See full deployment guide here 👉 [DEPLOYMENT.md](./DEPLOYMENT.md)

##  🛠️ Containerize with Docker Image
### 🧱Docker architecture
````
[ Angular (build) ] → Nginx (serve frontend)
[ Spring Boot ] → backend API
[ H2 ] → database
````

### 🚀 STEP 1: Dockerfile for backend (TaskTracker/Dockerfile)
```
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT [ "java", "-jar", "app.jar" ]
```

### 🚀 STEP 2: Dockerfile for Angular and Nginx (TaskTrackerFrontend/Dockerfile)
```
FROM node:20 as build

WORKDIR /app

# 🔥 Copy dependency
COPY package*.json ./

# 🔥 use ci to clean install matching platform
RUN npm ci

# copy source
COPY . .

# build
RUN npm run build

# -------- NGINX --------
FROM nginx:alpine

COPY --from=build /app/dist/TaskTrackerFrontend/browser/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### 🚀 STEP 3: nginx.conf file
```
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 🚀 STEP 4: docker-compose.yml file
```
version: '3.8'

services:

  backend:
    build: ./TaskTracker
    container_name: task-tracker-backend
    ports:
      - "8080:8080"

  frontend:
    build: ./TaskTrackerFrontend
    container_name: task-tracker-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```


### 🚀 STEP 5: run docker-compose.yml file
- start Docker Desktop
- run: docker-compose up --build

### 🚀 STEP 6: Run and Test
- start docker Image
- test: docker ps -> outpout: task-frontend   ...   0.0.0.0:80->80/tcp   task-backend    ...   0.0.0.0:8080->8080/tcp

### 🚀 STEP 7: build from Windows

👉 Windows: delete node_modules localhost and install
```
cd frontend
rmdir /s /q node_modules
del package-lock.json

npm install
```

👉 Windows: build form sratch
```
docker-compose down -v
docker system prune -a
docker-compose up --build
```


## 🛠 Testing API with Postmann
TaskTracker.postman_collection.json

## 🛠 E2E Testing with Playwright
### Baisc Information
- Unit test: Vitest
- Component test:	Angular TestBed
- E2E / System test:	Playwright


### Write example tests
Playwright installation
```
npm init playwright@latest
npx playwright install
```

playwright.config.ts
```
export default defineConfig({
  use: {
    baseURL: 'http://localhost:4200',
  },

  workers: 1, // 🔥 tránh race

  webServer: {
    command: 'npx ng serve --port 4200',
    url: 'http://localhost:4200',
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});
```

/tests/dashboard.spec.ts
```
import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // make sure in playwright.config.ts:   baseURL: 'http://localhost:4200',
    await page.goto('/login');

    await page.fill('input[name="username"]', 'username');
    await page.fill('input[name="password"]', 'password');

    await Promise.all([page.waitForURL('**/dashboard'), page.click('button[type=submit]')]);

    // await page.goto('http://localhost:4200'); // adjust nếu cần
  });

  // ✅ 1. Page loads
  test('should load dashboard text', async ({ page }) => {
    await page.waitForSelector('.title');
    await expect(page.locator('.title')).toBeVisible();
    await expect(page.locator('.title')).toContainText('Dashboard');
  });
```

## 📸 Screenshots

### Dashboard
![Kanban](./screenshots/dashboard.png)

### My Work
![Kanban](./screenshots/my-work.png)

### Kanban Board
![Kanban](./screenshots/kanban-board.png)

### Login Page
![Login](./screenshots/login.png)

### Task List
![Task List](./screenshots/task-list.png)

### Task Detail
![Task List](./screenshots/task-detail.png)

### Create Task
![Create Task](./screenshots/add-task.png)

### Edit
![Dashboard](./screenshots/edit-task.png)

### Admin
![Admin](./screenshots/admin.png)


## 👨‍💻 Author
Minh Duc Ngo

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.