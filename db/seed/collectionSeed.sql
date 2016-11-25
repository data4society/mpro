-- seed collections:

insert into collections(collection_id, name, created, edited, author, description, public, private, app_id)
values ('1', 'Test news 1', NOW(), NOW(), 'testuser', 'This is a test collection #1', true, false, 'fctestwr'),
('2', 'Test news 2', NOW(), NOW(), 'testuser', 'This is a test collection #2', true, true, 'fctestwr'),
('3', 'Test news 3', NOW(), NOW(), 'testuser2', 'This is a test collection #3', true, false, 'pp'),
('4', 'Test news 4', NOW(), NOW(), 'testuser2', 'This is a test collection #4', true, true, 'fctestwr'),
('5', 'Test news 5', NOW(), NOW(), 'testuser', 'This is a test collection #5', true, false, 'pp');