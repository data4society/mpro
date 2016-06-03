'use strict';

var createDocumentFactory = require('substance/model/createDocumentFactory');
var Article = require('./Article');

module.exports = createDocumentFactory(Article, function(tx) {
  var body = tx.get('body');

  tx.create({
    id: 'meta',
    type: 'meta',
    title: 'Untitled',
    rubrics: []
  });

  tx.create({
    id: 'p1',
    type: 'paragraph',
    content: 'Paste your arcticle here.'
  });
  body.show('p1');
});