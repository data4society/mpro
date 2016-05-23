'use strict';

var Router = require('substance/ui/Router');

function MproRouter(app) {
  Router.call(this);
  this.app = app;
}

MproRouter.Prototype = function() {

  // URL helpers
  this.openNote = function(documentId) {
    return '#' + Router.objectToRouteString({
      section: 'document',
      documentId: documentId
    });
  };
};

Router.extend(MproRouter);

module.exports = MproRouter;
