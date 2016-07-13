'use strict';

var RubricatorTool = require('./RubricatorTool');
var RubricatorCommand = require('./RubricatorCommand');

module.exports = {
  name: 'rubricator',
  configure: function(config) {
    config.addTool(RubricatorTool, {viewer: true});
    config.addCommand(RubricatorCommand);
    config.addIcon(RubricatorCommand.static.name, { 'fontawesome': 'fa-tags' });
    config.addIcon('collapsed', { 'fontawesome': 'fa-caret-right' });
    config.addIcon('expanded', { 'fontawesome': 'fa-caret-down' });
    config.addIcon('checked', { 'fontawesome': 'fa-check-square-o' });
    config.addIcon('unchecked', { 'fontawesome': 'fa-square-o' });
    config.addIcon('helper-on', { 'fontawesome': 'fa-question-circle' });
    config.addIcon('helper-off', { 'fontawesome': 'fa-question-circle-o' });
    config.addStyle(__dirname, '_rubricator');
    // config.addLabel('load-more', {
    //   en: 'Load more',
    //   ru: 'Загрузить еще'
    // });
  }
};