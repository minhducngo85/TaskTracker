## 🗯️ Deployment on VPS

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

### Install PostgreSQL
Install
```
sudo apt update
sudo apt upgrade -y
sudo apt install postgresql postgresql-contrib -y
```

Test Service:
```
sudo systemctl status postgresql
```
Create Database and user
```
Login: sudo -u postgres psql
Create db: CREATE DATABASE task_tracker;
Create User: CREATE USER app_user WITH PASSWORD 'Postgresql1234!';
```

Grant role:
```
ALTER ROLE app_user SET client_encoding TO 'utf8';
ALTER ROLE app_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE app_user SET timezone TO 'UTC';
GRANT ALL ON SCHEMA public TO app_user;
ALTER SCHEMA public OWNER TO app_user;
GRANT ALL PRIVILEGES ON DATABASE task_tracker TO app_user;
```

Update application.properties
```
# PostgreSQL datasource
spring.datasource.url=jdbc:postgresql://localhost:5432/task_tracker
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=app_user
spring.datasource.password=Postgresql1234!
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
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