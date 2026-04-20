DELETE FROM task;


INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Build Backend', ' Implementing a REST API endpoint to retrieve user/task data in JSON format', 'DONE', 'CRITICAL', 'Minh Duc', '2026-04-20 11:02:25', '2026-04-20 11:02:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Build Frontend', 'Building a search bar component with Angular, including styling and autocomplete functionality', 'DONE', 'CRITICAL', 'Minh Duc', '2026-04-20 11:02:20', '2026-04-20 11:02:20');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Deployment on VPS', 'Configure nginx and deploy the frontend and backend in a VPS', 'DONE', 'HIGH', 'Minh Duc', '2026-04-20 11:00:25', '2026-04-20 11:00:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Dashboard', 'Dashboard with number of DONE/TODO/IN_PROGRESS and chart. Using chart.js', 'TODO', 'HIGH', 'Lucas Ngo', '2026-04-20 11:01:25', '2026-04-20 11:01:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Priority Function', 'Extend Task with Priority (Critial, high, medim, low) including backend and front end side.', 'TODO', 'HIGH', 'Lucas Ngo', '2026-04-20 09:00:25', '2026-04-20 09:00:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('DevOps/Configuration', 'Write Dockerfile and docker-compose files to enable deployment with one command', 'DONE', 'MEDIUM', 'Minh Duc', '2026-04-19 11:00:25', '2026-04-19 11:00:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Database Management', 'Modifying a database schema by adding a deleted_at column for soft-delete functionality', 'IN_PROGRESS', 'HIGH', 'Minh Duc', '2026-04-20 11:05:25', '2026-04-20 11:05:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Intergate Keycloak', 'Implement and integrate ODIC authentication with Keycloak', 'TODO', 'MEDIUM', 'Minh Duc', '2026-04-20 11:10:25', '2026-04-20 11:10:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Paginator', 'Backend: GET /tasks?page=0&size=10. Frontend: next / prev', 'IN_PROGRESS', 'MEDIUM', 'Minh Duc', '2026-04-18 11:01:25', '2026-04-18 11:01:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Due Date and Overdue', 'Add due date to task and highlight', 'IN_PROGRESS', 'HIGH', 'Minh Duc', '2026-04-20 11:04:25', '2026-04-20 11:04:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Play pickleball', 'Practice Dink and drop ', 'DONE', 'LOW', 'Lucas', '2026-04-20 11:06:25', '2026-04-20 11:06:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Play Tennis', 'Play tennis today. Practice forehand', 'TODO', 'MEDIUM', 'Lucas Ngo', '2026-04-20 10:00:25', '2026-04-20 10:00:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Email notification', 'If task is assigned. An email to assignee will be sent', 'TODO', 'HIGH', 'Lucas Ngo', '2026-04-20 08:00:25', '2026-04-20 08:00:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Kanban Drag & Drop Feature', 'TODO → IN_PROGRESS → DONE. Angular CDK Dragdrop', 'IN_PROGRESS', 'CRITICAL', 'Minh Duc', '2026-04-19 11:09:25', '2026-04-19 11:09:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Task Comments', 'Implement feature "Task comments"', 'TODO', 'LOW', 'Lucas Ngo', '2026-04-20 11:02:50', '2026-04-20 11:02:50');

INSERT INTO task (title, description, status, priority, assigned_to, created_At, updated_At)
VALUES ('Deep sorting and filtering', 'Parse filter and sort value in url and perform sorting & filtering at server side.', 'TODO', 'HIGH', 'Mia Ngo', '2026-04-20 12:08:00', '2026-04-20 12:08:00');

DELETE FROM users;

INSERT INTO users (username, password, role)
VALUES ('admin', 'abcd1234', 'ADMIN');

INSERT INTO users (username, password, role)
VALUES ('user', 'abcd1234', 'USER');

INSERT INTO users (username, password, role)
VALUES ('mgno', 'abcd1234', 'ADMIN');

INSERT INTO users (username, password, role)
VALUES ('mia', 'abcd1234', 'USER');
