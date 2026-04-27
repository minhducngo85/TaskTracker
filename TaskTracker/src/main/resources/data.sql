DELETE FROM task_history;
DELETE FROM task_tags;
DELETE FROM task_comment;
DELETE FROM task;
DELETE FROM users;


INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Build Backend', ' Implementing a REST API endpoint to retrieve user/task data in JSON format', 'IN_PROGRESS', 'CRITICAL', 'mngo', '2026-04-20 11:02:25', '2026-04-20 11:02:25', '2026-04-24 11:02:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'backend'),
((SELECT MAX(id) FROM task), 'spring boot');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Build Frontend', 'Building a search bar component with Angular, including styling and autocomplete functionality', 'DONE', 'CRITICAL', 'mngo', '2026-04-20 11:02:20', '2026-04-20 11:02:20', '2026-04-28 11:02:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'frontend');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Deployment on VPS', 'Configure nginx and deploy the frontend and backend in a VPS', 'DONE', 'HIGH', 'mngo', '2026-04-20 11:00:25', '2026-04-20 11:00:25', '2026-04-21 11:00:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'deployment'),
((SELECT MAX(id) FROM task), 'vps');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Dashboard', 'Dashboard with number of DONE/TODO/IN_PROGRESS and chart. Using chart.js', 'TODO', 'HIGH', 'admin', '2026-04-20 11:01:25', '2026-04-20 11:01:25', '2026-04-21 11:01:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'chartjs'),
((SELECT MAX(id) FROM task), 'dashboard');


INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Priority Function', 'Extend Task with Priority (Critial, high, medim, low) including backend and front end side.', 'TODO', 'HIGH', 'lucas', '2026-04-20 09:00:25', '2026-04-20 09:00:25', '2026-04-29 09:00:25');
INSERT INTO task_tags (task_id, tag)
VALUES ((SELECT MAX(id) FROM task), 'priority'), ((SELECT MAX(id) FROM task), 'angular'), ((SELECT MAX(id) FROM task), 'frontend');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('DevOps/Configuration', 'Write Dockerfile and docker-compose files to enable deployment with one command', 'DONE', 'MEDIUM', 'mngo', '2026-04-19 11:00:25', '2026-04-19 11:00:25', '2026-04-19 11:00:25');
INSERT INTO task_tags (task_id, tag)
VALUES ((SELECT MAX(id) FROM task), 'nginx'), ((SELECT MAX(id) FROM task), 'vps'),((SELECT MAX(id) FROM task), 'linux');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Database Management', 'Modifying a database schema by adding a deleted_at column for soft-delete functionality', 'IN_PROGRESS', 'HIGH', 'mngo', '2026-04-20 11:05:25', '2026-04-20 11:05:25', '2026-04-22 11:05:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'postgresql'),
((SELECT MAX(id) FROM task), 'database');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Intergate Keycloak', 'Implement and integrate ODIC authentication with Keycloak', 'TODO', 'MEDIUM', '', '2026-04-20 11:10:25', '2026-04-20 11:10:25', '2026-04-25 11:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES ((SELECT MAX(id) FROM task), 'keycloak'), ((SELECT MAX(id) FROM task), 'oidc');


INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Paginator', 'Backend: GET /tasks?page=0&size=10. Frontend: next / prev', 'DONE', 'MEDIUM', 'user', '2026-04-18 11:01:25', '2026-04-18 11:01:25', '2026-04-27 11:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES
((SELECT MAX(id) FROM task), 'backend'),
((SELECT MAX(id) FROM task), 'paginator');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Due Date and Overdue', 'Add due date to task and highlight', 'IN_PROGRESS', 'HIGH', 'mngo', '2026-04-20 11:04:25', '2026-04-20 11:04:25', '2026-04-29 11:10:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Play pickleball', 'Practice Dink and drop ', 'DONE', 'LOW', 'lucas', '2026-04-20 11:06:25', '2026-04-20 11:06:25', '2026-04-24 11:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES
((SELECT MAX(id) FROM task), 'sport'),
((SELECT MAX(id) FROM task), 'pickleball'),
((SELECT MAX(id) FROM task), 'drop'),
((SELECT MAX(id) FROM task), 'dink');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Play Tennis', 'Play tennis today. Practice forehand', 'TODO', 'MEDIUM', 'lucas', '2026-04-20 10:00:25', '2026-04-20 10:00:25','2026-04-24 11:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES
((SELECT MAX(id) FROM task), 'sport'),
((SELECT MAX(id) FROM task), 'tennis');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Email notification', 'If task is assigned. An email to assignee will be sent', 'TODO', 'HIGH', 'lucas', '2026-04-20 08:00:25', '2026-04-20 08:00:25', '2026-04-22 11:10:25');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Kanban Drag & Drop Feature', 'TODO → IN_PROGRESS → DONE. Angular CDK Dragdrop', 'IN_PROGRESS', 'CRITICAL', 'admin', '2026-04-19 11:09:25', '2026-04-19 11:09:25', '2026-04-30 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES
((SELECT MAX(id) FROM task), 'kanban'),
((SELECT MAX(id) FROM task), 'drag & drop');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Task Comments', 'Implement feature "Task comments"', 'TODO', 'LOW', 'lucas', '2026-04-20 11:02:50', '2026-04-20 11:02:50', '2026-05-01 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES
((SELECT MAX(id) FROM task), 'backend'),
((SELECT MAX(id) FROM task), 'frontend');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Deep sorting and filtering', 'Parse filter and sort value in url and perform sorting & filtering at server side.', 'DONE', 'HIGH', 'mia', '2026-04-20 12:08:00', '2026-04-20 12:08:00', '2026-04-28 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES
((SELECT MAX(id) FROM task), 'backend'),
((SELECT MAX(id) FROM task), 'paginator'),
((SELECT MAX(id) FROM task), 'frontend');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Refresh token', 'Extend JWT authentication with refresh token. Frontend: auto renew new token 5 minute before expiration', 'TODO', 'HIGH', 'mngo', '2026-04-21 00:07:00', '2026-04-21 00:07:00', '2026-04-22 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES
((SELECT MAX(id) FROM task), 'jwt'),
((SELECT MAX(id) FROM task), 'token');


INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Login with Jwt', 'Login function with Jwt', 'TODO', 'HIGH', 'mngo', '2026-04-21 00:07:00', '2026-04-21 00:07:00', '2026-04-27 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES
((SELECT MAX(id) FROM task), 'jwt'),
((SELECT MAX(id) FROM task), 'token');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Option/ Assignee List api', 'New API to fetch all assignee list from database', 'TODO', 'CRITICAL', 'mngo', '2026-04-21 01:08:00', '2026-04-21 01:08:00', '2026-05-30 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES
((SELECT MAX(id) FROM task), 'assignee'),
((SELECT MAX(id) FROM task), 'api');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Task List - Assignee Dropdown', 'Update frontend page Task list to use dropdown for assignee field', 'TODO', 'MEDIUM', 'admin', '2026-04-21 02:09:00', '2026-04-21 02:09:00', '2026-04-28 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES
((SELECT MAX(id) FROM task), 'dropdown'),
((SELECT MAX(id) FROM task), 'assignee');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at)
VALUES ('Logger Service', 'Singleton Logger object with levels: log, info, debug, warn and error', 'DONE', 'CRITICAL', 'mngo', '2026-04-21 16:09:00', '2026-04-21 16:09:00');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'logger');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at)
VALUES ('Logger Service Context', 'Extend logger service with context. The context can be set from other services', 'IN_PROGRESS', 'CRITICAL', 'mngo', '2026-04-21 16:09:00', '2026-04-21 16:09:00');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'logger context'),
((SELECT MAX(id) FROM task), 'logger');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at)
VALUES ('Assigned to Me', 'Show assigned to me tasks in dashboard', 'DONE', 'CRITICAL', 'admin', '2026-04-21 16:09:00', '2026-04-21 16:09:00');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'assignee');


INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at)
VALUES ('Task Details component', 'New Angular component for task details', 'DONE', 'MEDIUM', 'mngo', '2026-04-21 16:10:00', '2026-04-21 16:10:00');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'angular material');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at)
VALUES ('Tags feature', 'Each task can have multiple tags', 'TODO', 'LOW', 'admin', '2026-04-21 23:10:00', '2026-04-21 23:10:00');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'tag'),
((SELECT MAX(id) FROM task), 'angular material');

INSERT INTO task_comment (task_id, created_by, created_by_full_name, created_at, updated_at, content)
VALUES
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-22 23:15:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-22 23:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-22 23:25:00', '2026-04-22 23:25:00', 'UI looks greate 👍');

INSERT INTO task_comment (task_id, created_by, created_by_full_name, created_at, updated_at, content)
VALUES
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-22 23:15:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-22 23:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-22 23:25:00', '2026-04-22 23:25:00', 'UI looks greate 👍');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at)
VALUES ('Top Tags', 'Top tags in dashboard', 'DONE', 'CRITICAL', 'admin', '2026-04-22 23:10:00', '2026-04-22 23:10:00');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'dashboard'),
((SELECT MAX(id) FROM task), 'backend'),
((SELECT MAX(id) FROM task), 'tags');

INSERT INTO task_comment (task_id, created_by, created_by_full_name, created_at, updated_at, content)
VALUES
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-22 23:15:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-22 23:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-22 23:25:00', '2026-04-22 23:25:00', 'UI looks greate 👍');

INSERT INTO task_comment (task_id, created_by, created_by_full_name, created_at, updated_at, content)
VALUES
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-22 23:15:00', '2026-04-22 23:15:00', 'Nice feature, very useful for analytics!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-22 23:20:00', '2026-04-22 23:20:00', 'Maybe we should add pagination for tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-22 23:25:00', '2026-04-22 23:25:00', 'UI looks clean 👍');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Task Historiy', 'Task history feature for auditing', 'TODO', 'LOW', 'admin', '2026-04-22 23:15:00', '2026-04-22 23:15:00', '2026-05-01 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'backend'),
((SELECT MAX(id) FROM task), 'history');

INSERT INTO task_comment (task_id, created_by, created_by_full_name, created_at, updated_at, content)
VALUES
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-22 23:15:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-22 23:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-22 23:25:00', '2026-04-22 23:25:00', 'UI looks greate 👍');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('File Upload', 'Task can have multiple attachments', 'IN_PROGRESS', 'HIGH', 'mngo', '2026-04-23 08:10:00', '2026-04-22 08:10:00', '2026-05-02 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'backend'),
((SELECT MAX(id) FROM task), 'attachment'),
((SELECT MAX(id) FROM task), 'frontend');

INSERT INTO task_comment (task_id, created_by, created_by_full_name, created_at, updated_at, content)
VALUES
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-22 23:15:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-22 23:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-22 23:25:00', '2026-04-22 23:25:00', 'UI looks greate 👍');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Tag autocomplete', 'by entering tag, the suggestion box mus tbe appeared', 'TODO', 'HIGH', 'mngo', '2026-04-23 08:10:00', '2026-04-22 08:10:00', '2026-05-01 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'autocomplete'),
((SELECT MAX(id) FROM task), 'frontend');

INSERT INTO task_comment (task_id, created_by, created_by_full_name, created_at, updated_at, content)
VALUES
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-22 23:15:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-22 23:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-22 23:25:00', '2026-04-22 23:25:00', 'UI looks greate 👍');

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Comment paginator', 'Paginator for comment section and with load more buttons', 'TODO', 'HIGH', 'admin', '2026-04-23 12:10:00', '2026-04-23 12:10:00', '2026-05-30 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'paginator'),
((SELECT MAX(id) FROM task), 'comment'),
((SELECT MAX(id) FROM task), 'frontend');

INSERT INTO task_comment (task_id, created_by, created_by_full_name, created_at, updated_at, content)
VALUES
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:15:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:25:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:30:00', '2026-04-22 23:15:00', 'Lets have a meeting to discuss!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:35:00', '2026-04-22 23:20:00', 'Arrange a meeting tomowrrow'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:36:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:37:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:38:00', '2026-04-22 23:20:00', 'When does it get done?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:39:00', '2026-04-22 23:25:00', 'I like this 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:40:00', '2026-04-22 23:15:00', 'UI could be improved'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:41:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:42:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:43:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:44:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:45:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:46:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:25:00', '2026-04-22 23:25:00', 'Amzing work 👍');

INSERT INTO task_history (task_id, field, old_value, new_value, changed_by, changed_by_full_name, changed_at)
VALUES
-- status changes
((SELECT MAX(id) FROM task), 'status', 'TODO', 'IN_PROGRESS', 'admin' , 'Admin', '2026-04-23 20:37:00'),
((SELECT MAX(id) FROM task), 'status', 'IN_PROGRESS', 'DONE', 'admin','Admin', '2026-04-23 20:37:30'),
((SELECT MAX(id) FROM task), 'status', 'DONE', 'IN_PROGRESS', 'admin','Admin', '2026-04-23 20:38:00'),
((SELECT MAX(id) FROM task), 'status', 'IN_PROGRESS', 'TODO', 'mngo','Minh Ngo', '2026-04-23 20:38:30'),
((SELECT MAX(id) FROM task), 'status', 'TODO', 'IN_PROGRESS', 'admin','Admin', '2026-04-23 20:39:00'),

-- priority changes
((SELECT MAX(id) FROM task), 'priority', 'HIGH', 'MEDIUM', 'admin','Admin', '2026-04-23 20:38:10'),
((SELECT MAX(id) FROM task), 'priority', 'MEDIUM', 'HIGH', 'mngo','Minh Ngo', '2026-04-23 20:38:20'),

-- description change
((SELECT MAX(id) FROM task), 'description','Paginator for comment section and with load more buttons',
 'Paginator for comment section and with load more buttons 2', 'admin', 'Admin', '2026-04-23 20:21:00'),

-- tags change
((SELECT MAX(id) FROM task), 'tags',
 'paginator,comment,frontend',
 'paginator,comment,frontend,today',
 'mngo', 'Minh Ngo', '2026-04-23 20:06:00');

 
 
INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('My work in dashboard', 'Show my work: due today, due in 7 days, and overdue', 'TODO', 'HIGH', 'admin', '2026-04-23 12:10:00', '2026-04-23 12:10:00', '2026-05-30 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'paginator'),
((SELECT MAX(id) FROM task), 'comment'),
((SELECT MAX(id) FROM task), 'frontend');

INSERT INTO task_comment (task_id, created_by, created_by_full_name, created_at, updated_at, content)
VALUES
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:15:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:25:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:30:00', '2026-04-22 23:15:00', 'Lets have a meeting to discuss!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:35:00', '2026-04-22 23:20:00', 'Arrange a meeting tomowrrow'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:36:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:37:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:38:00', '2026-04-22 23:20:00', 'When does it get done?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:39:00', '2026-04-22 23:25:00', 'I like this 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:40:00', '2026-04-22 23:15:00', 'UI could be improved'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:41:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:42:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:43:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:44:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:45:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:46:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:25:00', '2026-04-22 23:25:00', 'Amzing work 👍');

INSERT INTO task_history (task_id, field, old_value, new_value, changed_by, changed_by_full_name, changed_at)
VALUES
-- status changes
((SELECT MAX(id) FROM task), 'status', 'TODO', 'IN_PROGRESS', 'admin' , 'Admin', '2026-04-23 20:37:00'),
((SELECT MAX(id) FROM task), 'status', 'IN_PROGRESS', 'DONE', 'admin','Admin', '2026-04-23 20:37:30'),
((SELECT MAX(id) FROM task), 'status', 'DONE', 'IN_PROGRESS', 'admin','Admin', '2026-04-23 20:38:00'),
((SELECT MAX(id) FROM task), 'status', 'IN_PROGRESS', 'TODO', 'mngo','Minh Ngo', '2026-04-23 20:38:30'),
((SELECT MAX(id) FROM task), 'status', 'TODO', 'IN_PROGRESS', 'admin','Admin', '2026-04-23 20:39:00'),

-- priority changes
((SELECT MAX(id) FROM task), 'priority', 'HIGH', 'MEDIUM', 'admin','Admin', '2026-04-23 20:38:10'),
((SELECT MAX(id) FROM task), 'priority', 'MEDIUM', 'HIGH', 'mngo','Minh Ngo', '2026-04-23 20:38:20'),

-- description change
((SELECT MAX(id) FROM task), 'description','Paginator for comment section and with load more buttons',
 'Paginator for comment section and with load more buttons 2', 'admin', 'Admin', '2026-04-23 20:21:00');
 

INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Add Task dialog', 'New Dialog to add a task. Autocomplete for tags', 'TODO', 'HIGH', 'admin', '2026-04-23 12:10:00', '2026-04-23 20:39:00', '2026-05-30 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'tag'),
((SELECT MAX(id) FROM task), 'angualar material'),
((SELECT MAX(id) FROM task), 'frontend');

INSERT INTO task_comment (task_id, created_by, created_by_full_name, created_at, updated_at, content)
VALUES
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:15:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:25:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:30:00', '2026-04-22 23:15:00', 'Lets have a meeting to discuss!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:35:00', '2026-04-22 23:20:00', 'Arrange a meeting tomowrrow'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:36:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:37:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:38:00', '2026-04-22 23:20:00', 'When does it get done?'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-23 12:46:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-23 12:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-23 12:25:00', '2026-04-22 23:25:00', 'Amzing work 👍');

INSERT INTO task_history (task_id, field, old_value, new_value, changed_by, changed_by_full_name, changed_at)
VALUES
-- status changes
((SELECT MAX(id) FROM task), 'status', 'TODO', 'IN_PROGRESS', 'admin' , 'Admin', '2026-04-23 20:37:00'),
((SELECT MAX(id) FROM task), 'status', 'IN_PROGRESS', 'DONE', 'admin','Admin', '2026-04-23 20:37:30'),
((SELECT MAX(id) FROM task), 'status', 'DONE', 'IN_PROGRESS', 'admin','Admin', '2026-04-23 20:38:00'),
((SELECT MAX(id) FROM task), 'status', 'IN_PROGRESS', 'TODO', 'mngo','Minh Ngo', '2026-04-23 20:38:30'),
((SELECT MAX(id) FROM task), 'status', 'TODO', 'IN_PROGRESS', 'admin','Admin', '2026-04-24 20:39:00');


INSERT INTO task (title, description, status, priority, assigned_to, created_at, updated_at, due_date)
VALUES ('Complete task chart', 'New line chart in dashbaord for complete taks of last 7 days', 'DONE', 'MEDIUM', 'admin', '2026-04-25 12:10:00', '2026-04-25 12:10:00', '2026-05-30 09:10:25');
INSERT INTO task_tags (task_id, tag)
VALUES 
((SELECT MAX(id) FROM task), 'backend'),
((SELECT MAX(id) FROM task), 'chartjs'),
((SELECT MAX(id) FROM task), 'frontend');

INSERT INTO task_comment (task_id, created_by, created_by_full_name, created_at, updated_at, content)
VALUES
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-25 12:15:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-25 12:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-25 12:25:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-25 12:30:00', '2026-04-22 23:15:00', 'Lets have a meeting to discuss!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-25 12:35:00', '2026-04-22 23:20:00', 'Arrange a meeting tomowrrow'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-25 12:36:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-25 12:37:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-25 12:38:00', '2026-04-22 23:20:00', 'When does it get done?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-25 12:39:00', '2026-04-22 23:25:00', 'I like this 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-25 12:40:00', '2026-04-22 23:15:00', 'UI could be improved'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-25 12:41:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-25 12:42:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-25 12:43:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-25 12:44:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-25 12:45:00', '2026-04-22 23:25:00', 'UI looks greate 👍'),
((SELECT MAX(id) FROM task), 'admin', 'Admin', '2026-04-25 12:46:00', '2026-04-22 23:15:00', 'Nice feature, very useful for searching!'),
((SELECT MAX(id) FROM task), 'mngo', 'Minh Ngo', '2026-04-25 12:20:00', '2026-04-22 23:20:00', 'Maybe we should have search fucntion by multiple tags?'),
((SELECT MAX(id) FROM task), 'lucas', 'Lucas Ngo', '2026-04-25 12:25:00', '2026-04-22 23:25:00', 'Amzing work 👍');

INSERT INTO task_history (task_id, field, old_value, new_value, changed_by, changed_by_full_name, changed_at)
VALUES
-- status changes
((SELECT MAX(id) FROM task), 'task', 'null', 'task created', 'admin' , 'Admin', '2026-04-25 13:10:00');


INSERT INTO users (username, password, fullname, role)
VALUES ('admin', 'abcd1234', 'Admin', 'ADMIN');

INSERT INTO users (username, password, fullname, role)
VALUES ('user', 'abcd1234', 'User', 'USER');

INSERT INTO users (username, password, fullname , role)
VALUES ('mngo', 'abcd1234', 'Minh Ngo', 'ADMIN');

INSERT INTO users (username, password, fullname ,role)
VALUES ('mia', 'abcd1234' , 'Mia Ngo', 'USER');

INSERT INTO users (username, password,  fullname, role)
VALUES ('lucas', 'abcd1234', 'Lucas Ngo', 'USER');
