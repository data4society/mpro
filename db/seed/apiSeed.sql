-- seed apis:

insert into apis(key, api, format, param, live, app_id)
values ('1', 'collection_docs', 'json', 'collection_id', true, 'fctestwr'),
('2', 'entity_docs', 'json', 'entity_id', true, 'fctestwr'),
('3', 'collections_list', 'json', '', true, 'fctestwr'),
('4', 'entities_list', 'json', '', true, 'fctestwr'),
('5', 'get_document', 'json', '', true, 'fctestwr');