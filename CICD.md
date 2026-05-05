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