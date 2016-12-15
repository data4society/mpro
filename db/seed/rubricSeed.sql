-- seed rubrics:

insert into rubrics(rubric_id, name, parent_id, counter, description)
values ('0', 'ОВД-Инфо', null, false,''),
('1', 'искусство', 0, false, ''),
('2', 'интернет', 0, false, ''),
('3', 'ЛГБТ', 0, false, ''),
('4', 'насилие', 0, false, ''),
('5', 'отчисление и увольнение', 0, false, ''),
('6', 'угрозы', 0, false, ''),
('7', 'угрозы (-)', 0, true, '');

-- values ('1', 'тематика', null, ''),
-- ('2', 'свобода собраний', '1', ''),
-- ('3', 'система', '2', ''),
-- ('4', 'законодательство', '3', 'законодательство: внесение, рассмотрение принятие новых законопроектов, другие нормы, приказы, рекомендации и тп (создание, изменение, использование), решения КС'),
-- ('5', 'мероприятия в помещениях', '2', ''),
-- ('6', 'согласование', '2', ''),
-- ('7', 'уличные акции', '2', 'проблемы при проведении уличных акций'),
-- ('8', 'превентивные задержания', '7', ''),
-- ('9', 'участие провокаторов', '7', ''),
-- ('10', 'задержание', '7', ''),
-- ('11', 'принуждение к участию', '7', ''),
-- ('12', 'запрет информации', '7', ''),
-- ('13', 'судебное преследование', '2', ''),
-- ('14', 'административное преследование', '13', 'административное преследование участников уличных акций (все этапы процесса от протокола до ЕСПЧ)'),
-- ('15', 'уголовное преследование', '13', ''),
-- ('16', 'нарушения при задержании', '2', ''),
-- ('17', 'задержания журналистов', '16', ''),
-- ('18', 'избиение', '16', ''),
-- ('19', 'автозак', '16', ''),
-- ('20', 'свобода слова', '1', ''),
-- ('21', 'свобода ассоциаций', '1', ''),
-- ('22', 'свобода вероисповедания', '1', ''),
-- ('23', 'темы', null, ''),    
-- ('24', 'Украина', '23', ''),
-- ('25', 'искусство', '23', ''),
-- ('26', 'интернет', '23', ''),
-- ('27', 'антиэктремизм', '23', ''),
-- ('28', 'выборы', '23', ''),
-- ('29', 'ЛГБТ', '23', ''),
-- ('30', 'Украина', '23', ''),
-- ('31', 'способы преследования', null, ''),
-- ('32', 'политпрессинг', '31', ''),
-- ('33', 'система', '32', ''),
-- ('34', 'законодательство', '33', ''),
-- ('35', 'административное преследование', '32', ''),
-- ('36', 'уголовное преследование', '32', ''),
-- ('37', 'рассмотрение дела в суде', '32', ''),
-- ('38', 'поступление дела в суд', '37', ''),
-- ('39', 'прения сторон', '37', ''),
-- ('40', 'приговор', '37', ''),
-- ('41', 'обжалование решения', '37', ''),
-- ('42', 'ЕСПЧ', '37', ''),
-- ('43', 'судебное наказание', '37', ''),
-- ('44', 'административный арест', '43', ''),
-- ('45', 'лишение свободы', '43', ''),
-- ('46', 'условное лишение свободы', '43', ''),
-- ('47', 'штраф', '43', ''),
-- ('48', 'обязательные работы', '43', ''),
-- ('49', 'арест', '32', ''),
-- ('50', 'беседа', '32', ''),
-- ('51', 'блокировка счета', '32', ''),
-- ('52', 'взыскание в колонии', '32', ''),
-- ('53', 'внесистемное избиение', '32', ''),
-- ('54', 'давление', '32', ''),
-- ('55', 'домашний арест', '32', ''),
-- ('56', 'допрос', '32', ''),
-- ('57', 'задержание', '32', ''),
-- ('58', 'избиение', '32', ''),
-- ('59', 'изъятие предметов', '32', ''),
-- ('60', 'обыск', '32', ''),
-- ('61', 'отчисление', '32', ''),
-- ('62', 'повреждение имущества', '32', ''),
-- ('63', 'препятствие передвижению', '32', ''),
-- ('64', 'призыв в армию', '32', ''),
-- ('65', 'проблемы с визой', '32', ''),
-- ('66', 'прослушка', '32', ''),
-- ('67', 'убийство', '32', ''),
-- ('68', 'увольнение', '32', ''),
-- ('69', 'угрозы', '32', ''),
-- ('70', 'этапирование', '32', ''),
-- ('71', 'актор преследования', null, ''),
-- ('72', 'актор неизвестен', '71', ''),
-- ('73', 'МВД', '71', ''),
-- ('74', 'ОМОН', '73', ''),
-- ('75', 'Центр Э', '73', ''),
-- ('76', 'участковый', '73', ''),
-- ('77', 'ГИБДД', '73', ''),
-- ('78', 'ФСБ', '71', ''),
-- ('79', 'ФССП', '71', ''),
-- ('80', 'ФСИН', '71', ''),
-- ('81', 'работники колонии', '80', ''),
-- ('82', 'конвой', '80', ''),
-- ('83', 'Роскомнадзор', '71', ''),
-- ('84', 'Минюст', '71', ''),
-- ('85', 'СК', '71', ''),
-- ('86', 'Прокуратура', '71', ''),
-- ('87', 'нарушения', null, ''),
-- ('88', 'нарушения в ОВД', '87', ''),
-- ('89', 'избиение', '88', ''),
-- ('90', 'недопуск защитников', '88', ''),
-- ('91', 'дактилоскопия', '88', ''),
-- ('92', 'превышение срока задержания', '88', ''),
-- ('93', 'нарушение условий содержания', '88', ''),
-- ('94', 'психиатрия', '88', ''),
-- ('95', 'изъятие', '88', ''),
-- ('96', 'фальсификация', '88', ''),
-- ('97', 'нарушения в суде', '87', ''),
-- ('98', 'невызов в суд', '97', ''),
-- ('99', 'неверные время / дата / место рассмотрения', '97', ''),
-- ('100', 'суд в отсутствие задержанного', '97', ''),
-- ('101', 'суд в отсутствие защиты', '97', ''),
-- ('102', 'недопуск зрителей', '97', ''),
-- ('103', 'отказ в вызове свидетелей', '97', ''),
-- ('104', 'нарушения судебных приставов', '97', '');