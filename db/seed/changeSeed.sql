-- seed changes:

insert into changes(document_id, version, data, created, owner)
values (
  '1',
  1,
  E'{"sessionId":1,"sha":"a1f9f618363ac76e748486f7f199770b","before":{"selection":null},"ops":[{"type":"create","path":["p1"],"val":{"id":"p1","type":"paragraph","content":"Substance is a JavaScript library for web-based content editing. Build simple text editors or full-featured publishing systems. Substance provides you building blocks for your very custom editor."}},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"insert","pos":0,"val":"p1"}},{"type":"create","path":["m1"],"val":{"id":"m1","type":"mark","path":["p1","content"],"startOffset":0,"endOffset":9}},{"type":"create","path":["t1"],"val":{"id":"t1","type":"todo","done":false,"content":"Water the plants"}},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"insert","pos":1,"val":"t1"}},{"type":"create","path":["t2"],"val":{"id":"t2","type":"todo","done":true,"content":"Fix bug"}},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"insert","pos":2,"val":"t2"}},{"type":"create","path":["t3"],"val":{"id":"t3","type":"todo","done":true,"content":"Do taxes"}},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"insert","pos":3,"val":"t3"}}],"after":{"selection":null}}',
  NOW(),
  'testuser'
),
(
  '1',
  2,
  E'{"sessionId":1,"sha":"986d1547ed80c730cd5351e0ea09a46f","before":{"selection":{"type":"property","path":["t3","content"],"startOffset":8,"endOffset":8,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"},"ops":[{"type":"create","path":["todo-610b678d12a553a4fc4b1174eb58dccb"],"val":{"type":"paragraph","id":"todo-610b678d12a553a4fc4b1174eb58dccb","content":"","done":true}},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"insert","pos":4,"val":"todo-610b678d12a553a4fc4b1174eb58dccb"}}],"after":{"selection":{"type":"property","path":["todo-610b678d12a553a4fc4b1174eb58dccb","content"],"startOffset":0,"endOffset":0,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"}}',
  NOW(),
  'testuser'
),
(
  '1',
  3,
  E'{"sessionId":1,"sha":"552e2b03e91b0358c261d5b6ea96f7e9","before":{"selection":{"type":"property","path":["p1","content"],"startOffset":177,"endOffset":177,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"},"ops":[{"type":"create","path":["comment-63ed3cb888e45cd850117aed564fcd10"],"val":{"id":"comment-63ed3cb888e45cd850117aed564fcd10","type":"comment","content":"Substance is a JavaScript library for web-based content editing. Build simple text editors or full-featured publishing systems. Substance provides you building blocks for your very custom editor."}},{"type":"set","path":["m1","path"],"val":["comment-63ed3cb888e45cd850117aed564fcd10","content"],"original":["p1","content"]},{"type":"set","path":["m1","startOffset"],"val":0,"original":0},{"type":"set","path":["m1","endOffset"],"val":9,"original":9},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"delete","pos":0,"val":"p1"}},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"insert","pos":0,"val":"comment-63ed3cb888e45cd850117aed564fcd10"}},{"type":"delete","path":["p1"],"val":{"type":"paragraph","id":"p1","content":"Substance is a JavaScript library for web-based content editing. Build simple text editors or full-featured publishing systems. Substance provides you building blocks for your very custom editor."}}],"after":{"selection":{"type":"property","path":["comment-63ed3cb888e45cd850117aed564fcd10","content"],"startOffset":177,"endOffset":177,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"}}',
  NOW(),
  'testuser'
),
(
  '1',
  4,
  E'{"sessionId":1,"sha":"2027a4d475bdbbd672507d7a628a8511","before":{"selection":{"type":"property","path":["comment-63ed3cb888e45cd850117aed564fcd10","content"],"startOffset":15,"endOffset":15,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"},"ops":[{"type":"create","path":["paragraph-b6e35cb3a70c33501ffcb669e27b72b3"],"val":{"id":"paragraph-b6e35cb3a70c33501ffcb669e27b72b3","type":"paragraph","content":"Substance is a JavaScript library for web-based content editing. Build simple text editors or full-featured publishing systems. Substance provides you building blocks for your very custom editor."}},{"type":"set","path":["m1","path"],"val":["paragraph-b6e35cb3a70c33501ffcb669e27b72b3","content"],"original":["comment-63ed3cb888e45cd850117aed564fcd10","content"]},{"type":"set","path":["m1","startOffset"],"val":0,"original":0},{"type":"set","path":["m1","endOffset"],"val":9,"original":9},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"delete","pos":0,"val":"comment-63ed3cb888e45cd850117aed564fcd10"}},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"insert","pos":0,"val":"paragraph-b6e35cb3a70c33501ffcb669e27b72b3"}},{"type":"delete","path":["comment-63ed3cb888e45cd850117aed564fcd10"],"val":{"type":"comment","id":"comment-63ed3cb888e45cd850117aed564fcd10","content":"Substance is a JavaScript library for web-based content editing. Build simple text editors or full-featured publishing systems. Substance provides you building blocks for your very custom editor.","author":"","date":"2016-03-05T13:46:37.269Z"}}],"after":{"selection":{"type":"property","path":["paragraph-b6e35cb3a70c33501ffcb669e27b72b3","content"],"startOffset":15,"endOffset":15,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"}}',
  NOW(),
  'testuser'
);