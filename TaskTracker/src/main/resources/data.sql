DELETE FROM task;


INSERT INTO task (title, description, status, assigned_to)
VALUES ('Build Backend', ' Implementing a REST API endpoint to retrieve user/task data in JSON format', 'DONE', 'Minh Duc');

INSERT INTO task (title, description, status, assigned_to)
VALUES ('Build Frontend', 'Building a search bar component with Angular, including styling and autocomplete functionality', 'DONE', 'Minh Duc');

INSERT INTO task (title, description, status, assigned_to)
VALUES ('Deployment on VPS', 'Configure nginx and deploy the frontend and backend in a VPS', 'DONE', 'Minh Duc');

INSERT INTO task (title, description, status, assigned_to)
VALUES ('Intergate Keycloak', 'Implement and integrate ODIC authentication with Keycloak', 'TODO', 'Minh Duc');

INSERT INTO task (title, description, status, assigned_to)
VALUES ('DevOps/Configuration', 'Write Dockerfile and docker-compose files to enable deployment with one command', 'DONE', 'Minh Duc');

INSERT INTO task (title, description, status, assigned_to)
VALUES ('Database Management', 'Modifying a database schema by adding a deleted_at column for soft-delete functionality', 'IN_PROGRESS', 'Minh Duc');

INSERT INTO task (title, description, status, assigned_to)
VALUES ('Play pickleball', 'Practice Dink and drop ', 'TODO', 'Lucas');

INSERT INTO task (title, description, status, assigned_to)
VALUES ('Play Tennis', 'Play tennis today. Practice forehand', 'TODO', 'Lucas');

DELETE FROM users;

INSERT INTO users (username, password, role)
VALUES ('admin', 'abcd1234', 'ADMIN');

INSERT INTO users (username, password, role)
VALUES ('user', 'abcd1234', 'USER');

INSERT INTO users (username, password, role)
VALUES ('mgno', 'abcd1234', 'ADMIN');

INSERT INTO users (username, password, role)
VALUES ('mia', 'abcd1234', 'USER');
