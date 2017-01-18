SELECT * from
(SELECT DISTINCT ON (theme_id) *,
(SELECT COUNT(*) FROM themed_records_materialized_view a WHERE a.theme_id = t.theme_id) AS count
FROM themed_records_materialized_view t
ORDER BY theme_id, created DESC LIMIT 30) as foo
ORDER BY created DESC;