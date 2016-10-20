-- seed users:

insert into users(user_id, email, name, login_key, password, access, super)
values ('testuser', 'test@example.com', 'Test User', '1234', '$2a$10$jMNvFQrz7iRDRv3dczKBJOvnZkQWFNJ0r1YsjE/FgqkIw/zv7DbMW', true, false),
('testuser2', 'test2@example.com', 'Test User 2', '12345', '$2a$10$jMNvFQrz7iRDRv3dczKBJOvnZkQWFNJ0r1YsjE/FgqkIw/zv7DbMW', true, true),
('testuser3', 'test3@example.com', 'Test User 3', '123456', '$2a$10$jMNvFQrz7iRDRv3dczKBJOvnZkQWFNJ0r1YsjE/FgqkIw/zv7DbMW', true, true);