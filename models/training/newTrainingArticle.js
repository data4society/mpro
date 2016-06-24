'use strict';

var createDocumentFactory = require('substance/model/createDocumentFactory');
var TrainingArticle = require('./TrainingArticle');

module.exports = createDocumentFactory(TrainingArticle, function(tx) {
  var body = tx.get('body');

  tx.create({
    id: 'meta',
    type: 'meta',
    title: 'Untitled Article',
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
});