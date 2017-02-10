UPDATE records
SET full_text = documents.stripped
FROM
 documents
WHERE
 documents.doc_id = records.source