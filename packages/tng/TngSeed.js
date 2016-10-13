let seed = function(tx) {
  let body = tx.get('body')

  tx.create({
    id: 'meta',
    type: 'meta',
    title: 'Untitled Article',
    abstract: '',
    rubrics: [],
    entities: [],
    accepted: false
  })

  tx.create({
    id: 'p1',
    type: 'paragraph',
    content: 'Paste your article here.'
  })
  body.show('p1')
}

export default seed
