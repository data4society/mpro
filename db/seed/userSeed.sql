-- seed users:

insert into users(user_id, email, name, login_key, password)
values ('testuser', 'test@example.com', 'Test User', '1234', '1234'),
('testuser2', 'test2@example.com', 'Test User 2', '12345', '1234'),
('testuser3', 'test3@example.com', 'Test User 3', '123456', '1234');