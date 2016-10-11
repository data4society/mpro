import { Document } from 'substance'

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

export default Article
