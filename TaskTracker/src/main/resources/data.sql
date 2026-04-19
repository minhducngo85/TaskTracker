DELETE FROM task;


INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Build Backend', ' Implementing a REST API endpoint to retrieve user/task data in JSON format', 'DONE', 'CRITICAL', 'Minh Duc');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Build Frontend', 'Building a search bar component with Angular, including styling and autocomplete functionality', 'DONE', 'CRITICAL', 'Minh Duc');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Deployment on VPS', 'Configure nginx and deploy the frontend and backend in a VPS', 'DONE', 'HIGH', 'Minh Duc');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Dashboard', 'Dashboard with number of DONE/TODO/IN_PROGRESS and chart. Using chart.js', 'TODO', 'HIGH', 'Lucas Ngo');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Priority Function', 'Extend Task with Priority (Critial, high, medim, low) including backend and front end side.', 'TODO', 'HIGH', 'Lucas Ngo');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('DevOps/Configuration', 'Write Dockerfile and docker-compose files to enable deployment with one command', 'DONE', 'MEDIUM', 'Minh Duc');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Database Management', 'Modifying a database schema by adding a deleted_at column for soft-delete functionality', 'IN_PROGRESS', 'HIGH', 'Minh Duc');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Intergate Keycloak', 'Implement and integrate ODIC authentication with Keycloak', 'TODO', 'MEDIUM', 'Minh Duc');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Paginator', 'Backend: GET /tasks?page=0&size=10. Frontend: next / prev', 'IN_PROGRESS', 'MEDIUM', 'Minh Duc');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Due Date and Overdue', 'Add due date to task and highlight', 'IN_PROGRESS', 'HIGH', 'Minh Duc');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Play pickleball', 'Practice Dink and drop ', 'DONE', 'LOW', 'Lucas');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Play Tennis', 'Play tennis today. Practice forehand', 'TODO', 'MEDIUM', 'Lucas');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Email notification', 'If task is assigned. An email to assignee will be sent', 'TODO', 'HIGH', 'Lucas');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Kanban Drag & Drop Feature', 'TODO → IN_PROGRESS → DONE. Angular CDK Dragdrop', 'IN_PROGRESS', 'CRITICAL', 'Minh Duc');

INSERT INTO task (title, description, status, priority, assigned_to)
VALUES ('Task Comments', 'Implement feature "Task comments"', 'TODO', 'LOW', 'Lucas');

DELETE FROM users;

INSERT INTO users (username, password, role)
VALUES ('admin', 'abcd1234', 'ADMIN');

INSERT INTO users (username, password, role)
VALUES ('user', 'abcd1234', 'USER');

INSERT INTO users (username, password, role)
VALUES ('mgno', 'abcd1234', 'ADMIN');

INSERT INTO users (username, password, role)
VALUES ('mia', 'abcd1234', 'USER');
