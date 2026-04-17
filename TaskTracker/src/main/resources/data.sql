DELETE FROM task;


INSERT INTO task (title, description, status, assigned_to)
VALUES ('Build Backend', 'Spring Boot API', 'IN_PROGRESS', 'Minh');

INSERT INTO task (title, description, status, assigned_to)
VALUES ('Deploy App', 'Docker', 'DONE', 'Minh');

INSERT INTO task (title, description, status, assigned_to)
VALUES ('Build fullstack project', 'Angular Frontend + Springboot Backend', 'DONE', 'Minh');

INSERT INTO task (title, description, status, assigned_to)
VALUES ('Play pickleball', 'Practice Dink and drop ', 'TODO', 'Mngo');

INSERT INTO task (title, description, status, assigned_to)
VALUES ('Play Tennis', 'Play tennis today. Practice forehand', 'TODO', 'Mngo');

DELETE FROM users;

INSERT INTO users (username, password, role)
VALUES ('admin', '1234', 'ADMIN');

INSERT INTO users (username, password, role)
VALUES ('user', '1234', 'USER');
