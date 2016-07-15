var seed = function(tx) {
  var body = tx.get('body');

  tx.create({
    id: 'meta',
    type: 'meta',
    title: 'Untitled Article',
    abstract: '',
    rubrics: [],
    entities: [],
    accepted: false
  });

  tx.create({
    id: 'p1',
    type: 'paragraph',
    content: 'Paste your article here.'
  });
  body.show('p1');
};

module.exports = seed;