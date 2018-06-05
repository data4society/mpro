import MproPackage from '../../packages/mpro/package'
import AuthenticationClient from './AuthenticationClient'
import DocumentClient from './DocumentClient'
import FastartClient from './FastartClient'
import FileClient from './FileClient'

let appConfig = 'MPROCONFIG'
appConfig = JSON.parse(appConfig)

export default {
  name: 'mpro-app',
  configure: function(config) {
    // Use the default Mpro package
    config.import(MproPackage)

    config.setAppConfig(appConfig)

    // Define Authentication Client
    config.setAuthenticationServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/auth/')
    config.setAuthenticationClient(AuthenticationClient)
    // Define Document Client
    config.setDocumentServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/documents/')
    config.setDocumentClient(DocumentClient)
    // Define OI express news connection
    config.setOIExpressParams(appConfig.express_endpoint, appConfig.express_pass)
    // Define File Client
    config.setFileServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/files/')
    config.setFileClient(FileClient)
    // Define FastartClient
    config.setFastartServerUrl(appConfig.fastartUrl)
    config.setFastartClient(FastartClient)
  }
}
