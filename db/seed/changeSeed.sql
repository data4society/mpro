-- seed changes:

insert into changes(document_id, version, data, created, owner)
values (
  '1',
  1,
  E'{"sessionId":1,"sha":"bd2cbad90f84f19d5b62e5b663e5c35d","before":{"selection":null},"ops":[{"type":"create","path":["meta"],"val":{"id":"meta","type":"meta","title":"Untitled","categories":[]}},{"type":"create","path":["p1"],"val":{"id":"p1","type":"paragraph","content":"Paste your arcticle here."}},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"insert","pos":0,"val":"p1"}}],"info":{"title":"Untitled","training":true},"after":{"selection":null}}',
  NOW(),
  'testuser'
),
(
  '1',
  2,
  E'{"sessionId":1,"sha":"acb80605b9cd2ed28e8df6a813d660e0","before":{"selection":{"type":"property","path":["p1","content"],"startOffset":7,"endOffset":7,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"},"ops":[{"type":"update","path":["p1","content"],"propertyType":"string","diff":{"type":"insert","pos":7,"str":"d"}}],"info":{"userId":"testuser","updatedAt":"2016-05-27T09:46:40.885Z"},"after":{"selection":{"type":"property","path":["p1","content"],"startOffset":8,"endOffset":8,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"}}',
  NOW(),
  'testuser'
),
(
  '1',
  3,
  E'{"sessionId":1,"sha":"f58145e8640609e28735e56a1272cc07","before":{"selection":{"type":"property","path":["p1","content"],"startOffset":8,"endOffset":8,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"},"ops":[{"type":"update","path":["p1","content"],"propertyType":"string","diff":{"type":"insert","pos":8,"str":"d"}}],"info":{"userId":"testuser","updatedAt":"2016-05-27T09:46:41.076Z"},"after":{"selection":{"type":"property","path":["p1","content"],"startOffset":9,"endOffset":9,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"}}',
  NOW(),
  'testuser'
),
(
  '1',
  4,
  E'{"sessionId":1,"sha":"71b26e3f5d8b40bc49755f1a2b654359","before":{"selection":{"type":"property","path":["p1","content"],"startOffset":9,"endOffset":9,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"},"ops":[{"type":"update","path":["p1","content"],"propertyType":"string","diff":{"type":"insert","pos":9,"str":"d"}}],"info":{"userId":"testuser","updatedAt":"2016-05-27T09:46:41.230Z"},"after":{"selection":{"type":"property","path":["p1","content"],"startOffset":10,"endOffset":10,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"}}',
  NOW(),
  'testuser'
),
(
  '2',
  1,
  E'{"sessionId":1,"sha":"2027a4d475bdbbd672507d7a628a8511","before":{"selection":{"type":"property","path":["comment-63ed3cb888e45cd850117aed564fcd10","content"],"startOffset":15,"endOffset":15,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"},"ops":[{"type":"create","path":["paragraph-b6e35cb3a70c33501ffcb669e27b72b3"],"val":{"id":"paragraph-b6e35cb3a70c33501ffcb669e27b72b3","type":"paragraph","content":"Substance is a JavaScript library for web-based content editing. Build simple text editors or full-featured publishing systems. Substance provides you building blocks for your very custom editor."}},{"type":"set","path":["m1","path"],"val":["paragraph-b6e35cb3a70c33501ffcb669e27b72b3","content"],"original":["comment-63ed3cb888e45cd850117aed564fcd10","content"]},{"type":"set","path":["m1","startOffset"],"val":0,"original":0},{"type":"set","path":["m1","endOffset"],"val":9,"original":9},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"delete","pos":0,"val":"comment-63ed3cb888e45cd850117aed564fcd10"}},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"insert","pos":0,"val":"paragraph-b6e35cb3a70c33501ffcb669e27b72b3"}},{"type":"delete","path":["comment-63ed3cb888e45cd850117aed564fcd10"],"val":{"type":"comment","id":"comment-63ed3cb888e45cd850117aed564fcd10","content":"Substance is a JavaScript library for web-based content editing. Build simple text editors or full-featured publishing systems. Substance provides you building blocks for your very custom editor.","author":"","date":"2016-03-05T13:46:37.269Z"}}],"after":{"selection":{"type":"property","path":["paragraph-b6e35cb3a70c33501ffcb669e27b72b3","content"],"startOffset":15,"endOffset":15,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"}}',
  NOW(),
  'testuser'
),
(
  '3',
  1,
  E'{"sessionId":1,"sha":"2027a4d475bdbbd672507d7a628a8511","before":{"selection":{"type":"property","path":["comment-63ed3cb888e45cd850117aed564fcd10","content"],"startOffset":15,"endOffset":15,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"},"ops":[{"type":"create","path":["paragraph-b6e35cb3a70c33501ffcb669e27b72b3"],"val":{"id":"paragraph-b6e35cb3a70c33501ffcb669e27b72b3","type":"paragraph","content":"Substance is a JavaScript library for web-based content editing. Build simple text editors or full-featured publishing systems. Substance provides you building blocks for your very custom editor."}},{"type":"set","path":["m1","path"],"val":["paragraph-b6e35cb3a70c33501ffcb669e27b72b3","content"],"original":["comment-63ed3cb888e45cd850117aed564fcd10","content"]},{"type":"set","path":["m1","startOffset"],"val":0,"original":0},{"type":"set","path":["m1","endOffset"],"val":9,"original":9},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"delete","pos":0,"val":"comment-63ed3cb888e45cd850117aed564fcd10"}},{"type":"update","path":["body","nodes"],"propertyType":"array","diff":{"type":"insert","pos":0,"val":"paragraph-b6e35cb3a70c33501ffcb669e27b72b3"}},{"type":"delete","path":["comment-63ed3cb888e45cd850117aed564fcd10"],"val":{"type":"comment","id":"comment-63ed3cb888e45cd850117aed564fcd10","content":"Substance is a JavaScript library for web-based content editing. Build simple text editors or full-featured publishing systems. Substance provides you building blocks for your very custom editor.","author":"","date":"2016-03-05T13:46:37.269Z"}}],"after":{"selection":{"type":"property","path":["paragraph-b6e35cb3a70c33501ffcb669e27b72b3","content"],"startOffset":15,"endOffset":15,"reverse":false,"surfaceId":"bodyEditor"},"surfaceId":"bodyEditor"}}',
  NOW(),
  'testuser'
);