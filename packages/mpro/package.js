'use strict';

var SubConfigurator = require('../common/SubConfigurator');

var FiltersPackage = require('../filters/package');
var FacetsPackage = require('../facets/package');
var RubricsPackage = require('../rubrics/package');
var HeaderPackage = require('../header/package');
var FeedPackage = require('../feed/package');
var PagerPackage = require('../pager/package');
var InboxPackage = require('../inbox/package');
var ConfiguratorPackage = require('../configurator/package');
var LoaderPackage = require('../loader/package');
var ViewerPackage = require('../viewer/package');
var EditorPackage = require('../editor/package');
var NotificationPackage = require('../notification/package');
var CollaboratorsPackage = require('../collaborators/package');
var WelcomePackage = require('../welcome/package');

var Article = require('../article/package');
var articleViewerConfigurator = new SubConfigurator().import(ViewerPackage);
articleViewerConfigurator.import(Article);

var Vk = require('../vk/package');
var vkViewerConfigurator = new SubConfigurator().import(ViewerPackage);
vkViewerConfigurator.import(Vk);

var Tng = require('../tng/package');
var tngEditorConfigurator = new SubConfigurator().import(EditorPackage);
tngEditorConfigurator.import(Tng);

module.exports = {
  name: 'mpro',
  configure: function(config) {
    config.import(require('substance/packages/base/BasePackage'));
    config.import(InboxPackage);
    config.import(ConfiguratorPackage);
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
    config.addConfigurator('editor-mpro-tng', tngEditorConfigurator);
  }
};