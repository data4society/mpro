import EntityFacets from './EntityFacets'

export default {
  name: 'entity-facets',
  configure: function(config) {
    config.addComponent('entity-facets', EntityFacets)

    config.addIcon('facets-edit', { 'fontawesome': 'fa-edit' })
    config.addIcon('facets-save', { 'fontawesome': 'fa-save' })
    config.addIcon('facets-load', { 'fontawesome': 'fa-folder-open-o' })
  }
}
