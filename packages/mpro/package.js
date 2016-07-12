'use strict';

var ProseEditorConfigurator = require('substance/packages/prose-editor/ProseEditorConfigurator');

var FiltersPackage = require('../filters/package');
var FacetsPackage = require('../facets/package');
var RubricsPackage = require('../rubrics/package');
var HeaderPackage = require('../header/package');
var FeedPackage = require('../feed/package');
var PagerPackage = require('../pager/package');
var InboxPackage = require('../inbox/package');
// var ViewerPackage = require('../viewer/package');

module.exports = {
  name: 'mpro',
  configure: function(config) {
    config.import(require('substance/packages/base/BasePackage'));
    config.import(InboxPackage);
    config.import(HeaderPackage);
    config.import(FeedPackage);
    config.import(PagerPackage);
    config.import(RubricsPackage);
    config.import(FiltersPackage);
    config.import(FacetsPackage);
    // // Default configuration for available modes
    // config.addConfigurator('viewer', new ProseEditorConfigurator().import(ViewerPackage));
  }
};