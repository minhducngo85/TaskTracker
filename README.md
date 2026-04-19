# 🚀 Task Tracker (Mini Jira)

A simple full-stack task management application inspired by Jira.  
Built with **Spring Boot + Angular**, focusing on clean architecture, JWT authentication, and modern frontend practices.

Live Demo: http://82.165.51.255/

<p align="center">
  <img src="./screenshots/dashboard.png" width="800"/>
</p>

## ✨ Features

- 🔐 Authentication with JWT
- 👤 User roles: Admin & user
- 📝 CRUD Task (Create, Read, Update, Delete)
- 🔍 Filter & Search tasks
- 📉 Dashboard: statistics, chart and recent tasks
- 👤 Assign tasks to users
- 📊 Task status management:
  - TODO
  - IN_PROGRESS
  - DONE
- 🚩 Task priority management:
  - CRITCAL
  - HIGH
  - MEDIUM
  - LOW
- 🌐 Clean REST API design
- 📱 Responsive UI
- 📲 Mobile-friendly UI

---

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
npm install chart.js
npm install chartjs-plugin-datalabels

## 🛠 Testing with Postmann
TaskTracker.postman_collection.json

## Deployment on VPS

### 🚀 Deployment Steps
- [x] 🖥️ VPS setup  
- [x] ⚙️ Run backend (Spring Boot)  
- [x] 📦 Upload frontend (Angular)  
- [x] 🌐 Configure Nginx  
- [x] ✅ Test application 

### VPS setup
```
sudo apt update
sudo apt install openjdk-17-jdk nginx -y
```

### Deploy backend to serser
```
scp target/TaskTracker.jar user@server:/home/user/
nohup java -jar tasktracker.jar > app.log 2>&1 &
``` 

Test:
```
curl http://localhost:8080/api/tasks
or curl http://localhost:8080/api/test
```


### Deploy Frontend to serser
Build & Copy
```
ng build --configuration production
scp -r dist/TaskTrackerFrontend/browser user@server:/var/www/TaskTracker
```

### Config Nginx
sudo nano /etc/nginx/sites-available/default

Content:
```
server {
    listen 80;
	server_name 89.165.51.255;
	
    root /var/www/app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Restart nginx:
```
nginx -t
sudo systemctl restart nginx
```

### Environment for dev & production
File: environments/environment.ts for dev branch
```
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

File: environments/environment.prod.ts for dev branch
```
export const environment = {
  production: false,
  apiUrl: '/api'
};
```

Extend: angular.json
```
"production": {
    "fileReplacements": [
        {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.prod.ts"
        }
    ],
```

### Fake SSL and forward to http
Extend /etc/nginx/sites-available/default
```
server {
    listen 443 ssl;
    server_name 82.165.51.255;

    ssl_certificate /etc/nginx/self.crt;
    ssl_certificate_key /etc/nginx/self.key;

    return 301 http://$host$request_uri;
}
```

Create Self-Signed Cert
```
openssl req -x509 -nodes -days 365 \
-newkey rsa:2048 \
-keyout /etc/nginx/self.key \
-out /etc/nginx/self.crt
```

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

## 📸 Screenshots

### Login Page
![Login](./screenshots/login.png)

### Task List
![Task List](./screenshots/task-list.png)

### Create Task
![Create Task](./screenshots/add-task.png)

### Edit
![Dashboard](./screenshots/edit-task.png)

### Admin
![Admin](./screenshots/admin.png)