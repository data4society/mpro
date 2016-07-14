'use strict';

var ProseEditorConfigurator = require('substance/packages/prose-editor/ProseEditorConfigurator');

var FiltersPackage = require('../filters/package');
var FacetsPackage = require('../facets/package');
var RubricsPackage = require('../rubrics/package');
var HeaderPackage = require('../header/package');
var FeedPackage = require('../feed/package');
var PagerPackage = require('../pager/package');
var InboxPackage = require('../inbox/package');
var LoaderPackage = require('../loader/package');
var ViewerPackage = require('../viewer/package');
var NotificationPackage = require('../notification/package');
var CollaboratorsPackage = require('../collaborators/package');
var WelcomePackage = require('../welcome/package');

var Article = require('../article/package');
var articleViewerConfigurator = new ProseEditorConfigurator().import(ViewerPackage);
articleViewerConfigurator.import(Article);

var Vk = require('../vk/package');
var vkViewerConfigurator = new ProseEditorConfigurator().import(ViewerPackage);
vkViewerConfigurator.import(Vk);

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
    config.import(LoaderPackage);
    config.import(NotificationPackage);
    config.import(CollaboratorsPackage);
    config.import(WelcomePackage);
    
    // Default configuration for available modes
    config.addConfigurator('viewer-mpro-article', articleViewerConfigurator);
    config.addConfigurator('viewer-mpro-vk', vkViewerConfigurator);
  }
};