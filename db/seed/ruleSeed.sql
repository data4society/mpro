-- seed rules:

insert into rules(rule_id, collection_id, rubrics, entities, app_id)
values ('1', '1', '{1,2}', '{1}', 'fctestwr'),
('2', '1', '{1}', '{1,2}', 'fctestwr'),
('3', '1', '{}', '{3,4}', 'fctestwr'),
('4', '1', '{3,4}', '{}', 'fctestwr');