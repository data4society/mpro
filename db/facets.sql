SELECT rubric, cnt, rubrics.name FROM (
  SELECT DISTINCT
    unnest(records.rubrics) AS rubric,
    COUNT(*) OVER (PARTITION BY unnest(records.rubrics)) cnt
  FROM records WHERE $1 <@ rubrics AND training = $2
) AS docs INNER JOIN rubrics ON (docs.rubric = rubrics.rubric_id::text);