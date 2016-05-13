-- seed sessions:

insert into sessions(session_token, owner, created)
values ('testusertoken', 'testuser', NOW()),
('testuser2token', 'testuser2', NOW()),
('testuser3token', 'testuser3', NOW());