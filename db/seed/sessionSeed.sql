-- seed sessions:

insert into sessions(session_id, owner, created)
values ('1', 'testuser', NOW()),
('2', 'testuser2', NOW()),
('3', 'testuser3', NOW());