-- seed rules:

insert into rules(rule_id, collection_id, rubrics, entities)
values ('1', '1', '{1,2}', '{1}'),
('2', '1', '{1}', '{1,2}'),
('3', '1', '{}', '{3,4}'),
('4', '1', '{3,4}', '{}');