-- seed collections:

insert into collections(collection_id, name, created, edited, author, description)
values ('1', 'Test news', NOW(), NOW(), 'testuser', 'This is a test collection #1'),
('2', 'Test news', NOW(), NOW(), 'testuser', 'This is a test collection #2'),
('3', 'Test news', NOW(), NOW(), 'testuser2', 'This is a test collection #3'),
('4', 'Test news', NOW(), NOW(), 'testuser2', 'This is a test collection #4'),
('5', 'Test news', NOW(), NOW(), 'testuser', 'This is a test collection #5');