## 🗯️ CI/CD with GitHub Actions

### 🧱 CI/CD Flow & Architecture
- Flow
```
Push code → Build → Docker build → Push Docker Hub → SSH deploy VPS
```

- Project Structure:
```
TaskTracker/
├── TaskTracker/           (Spring Boot backend)
│   └── Dockerfile
├── TaskTrackerFontend/    (Angular frontend)
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

### 🔐 3. Create Docker Hub
```
tasktracker-backend
tasktracker-frontend
```

### 4. GitHub Secrets

Repob (TaskTracker) → Settings → Secrets and variables → Actions → New repository secret\
Add:
```
DOCKER_USERNAME
DOCKER_PASSWORD
SERVER_HOST
SERVER_USER
SERVER_SSH_KEY
```

### Get DOCKER_USERNAME and DIOCKER_PASSWORD
- login: https://hub.docker.com/
- create a personal access token
- DOCKER_PASSWORD = access token

#### Create SERVER_SSH_KEY
- ssh-keygen -t ed25519 -C "tasktracker-deploy"
- enter with default option and no passphrase
- copy content of id_ed25519.pub and paste into the file: authorized_keys
- Set permission:
```
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```
- SERVER_SSH_KEY = id_ed25519


### Server sertup & Docker-compose-yml
#### Setup
- install docker
```
sudo apt update
sudo apt install docker.io docker-compose -y
```
- create deploy folder
mkdir -p ~/tasktracker
cd ~/tasktracker

- copy file docker-compose.yml into  ~/tasktracker

#### docker-compose.yml
```
version: '3.8'

services:
  backend:
    image: minhducngo85/tasktracker-backend:latest
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/taskdb
      SPRING_DATASOURCE_USERNAME: user
      SPRING_DATASOURCE_PASSWORD: password
    depends_on:
      - db

  frontend:
    image: minhducngo85/tasktracker-frontend:latest
    ports:
      - "80:80"

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: taskdb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - pgdata:/var/lib/postgresql/data   # 🔥 Important

volumes:
  pgdata:
```


### ⚙️ GitHub Actions (CI/CD)
```
name: CI/CD TaskTracker

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      # 🧱 Build Backend
      - name: Build Backend
        working-directory: TaskTracker
        run: |
          chmod +x mvnw
          ./mvnw clean package -DskipTests

      # 🌐 Build Frontend
      - name: Build Frontend
        working-directory: TaskTrackerFrontend
        run: |
          npm ci
          npm run build -- --configuration production

      # 🔐 Docker login
      - name: Login Docker Hub
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      # 🐳 Backend image
      - name: Build & Push Backend
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/tasktracker-backend ./TaskTracker
          docker push ${{ secrets.DOCKER_USERNAME }}/tasktracker-backend

      # 🐳 Frontend image
      - name: Build & Push Frontend
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/tasktracker-frontend ./TaskTrackerFrontend
          docker push ${{ secrets.DOCKER_USERNAME }}/tasktracker-frontend

      # 🚀 Deploy
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd ~/tasktracker
            docker pull ${{ secrets.DOCKER_USERNAME }}/tasktracker-backend
            docker pull ${{ secrets.DOCKER_USERNAME }}/tasktracker-frontend
            docker-compose down
            docker-compose up -d
```


### ⚙️ Testing
- docker ps
- check log in frond end: docker-compose logs frontend

### Database backup
- backup
```
docker exec -e PGPASSWORD=password tasktracker_db_1 pg_dump -U user taskdb > backup.sql
```

- restore
```
cat backup.sql | docker exec -i tasktracker_db_1 psql -U user taskdb
```

- if data exists -Y reset
```
docker stop tasktracker_backend_1
docker exec -it tasktracker_db_1 psql -U user -d postgres -c "DROP DATABASE taskdb;"
docker exec -it tasktracker_db_1 psql -U user -d postgres -c "CREATE DATABASE taskdb;"
docker exec -i tasktracker_db_1 psql -U user -d taskdb < backup.sql
docker start tasktracker_backend_1
```