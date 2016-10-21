let Document = require('substance').Document

/*
  Basic Article model.
*/

class Article extends Document {
  constructor(...args) {
    super(...args)
    this._initialize()
  }

  _initialize() {
    this.create({
      type: 'container',
      id: 'body',
      nodes: []
    })
  }
}

module.exports = Article
