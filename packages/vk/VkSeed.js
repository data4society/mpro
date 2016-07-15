var seed = function(tx) {
  var body = tx.get('body');

  tx.create({
    id: 'meta',
    type: 'meta',
    title: '',
    rubrics: []
  });

  tx.create({
    id: 'p1',
    type: 'paragraph',
    content: 'Paste your arcticle here.'
  });
  body.show('p1');
};

module.exports = seed;