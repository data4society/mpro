'use strict';

var MproPackage = require('../packages/mpro/package');
var AuthenticationClient = require('./AuthenticationClient');
var DocumentClient = require('./DocumentClient');
var FileClient = require('./FileClient');

var appConfig = {
  protocol: "http",
  host: "localhost",
  port: 5000
};

module.exports = {
  name: 'mpro-app',
  configure: function(config) {
    // Use the default Mpro package
    config.import(MproPackage);

    // Add app's root style
    config.addStyle(__dirname, 'app.scss');

    config.setAppConfig({
      protocol: appConfig.protocol,
      host: appConfig.host,
      port: appConfig.port
    });

    // Define Authentication Client
    config.setAuthenticationServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/auth/');
    config.setAuthenticationClient(AuthenticationClient);
    // Define Document Client
    config.setDocumentServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/documents/');
    config.setDocumentClient(DocumentClient);
    // Define File Client
    config.setFileServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/files/');
    config.setFileClient(FileClient);
  }
};
