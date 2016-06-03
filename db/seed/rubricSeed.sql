-- seed rubrics:

insert into rubrics(rubric_id, name, parent_id)
values ('1', 'Freedom of Assembley', null),
('2', 'Detention', '1'),
('3', 'Freedom of Speech', null),
('4', 'Political Pressure', null);