-- seed entities:

insert into entities(entity_id, name, created, edited, author, entity_class, data)
values ('1', 'Martin Luther King, Jr', NOW(), NOW(), 'testuser', 'Person', '{"firstname": "Martin Luther", "lastname": "King", "occupation": ["Baptist minister", "social activist"], "organization": "African-American Civil Rights Movement"}'),
('2', 'Jim Morrison', NOW(), NOW(), 'testuser', 'Person', '{"firstname": "Jim", "lastname": "Morisson", "occupation": ["musician", "poet"], "organization": "The Doors"}'),
('3', 'Amnesty International', NOW(), NOW(), 'testuser2', 'Organization', '{"type": "NGO", "founded": "1961", "location": "London"}'),
('4', 'Berlin Wall collapse', NOW(), NOW(), 'testuser2', 'Event', '{"date": "1989-11-09T21:00:00.000Z", "location": "Berlin"}'),
('5', 'Jim Morrison', NOW(), NOW(), 'testuser', 'person', '{"firstname": "Jim", "lastname": "Morisson", "middlename": "", "nickname": "Lizard King", "status": "хэлпер", "position": "Singer", "role": "Rock n Roll King"}');