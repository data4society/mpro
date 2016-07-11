'use strict';

var Router = require('substance/ui/Router');

function MproRouter(app) {
  Router.call(this);
  this.app = app;
}

MproRouter.Prototype = function() {

  // URL helpers
  this.openDocument = function(documentId) {
    return '#' + Router.objectToRouteString({
      page: 'documents',
      documentId: documentId
    });
  };

  this.getRoute = function() {
    var routerString = this.getRouteString();
    return Router.routeStringToObject(routerString);
  };
};

Router.extend(MproRouter);

module.exports = MproRouter;
