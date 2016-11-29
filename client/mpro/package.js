import MproPackage from '../../packages/mpro/package'
import AuthenticationClient from './AuthenticationClient'
import DocumentClient from './DocumentClient'
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
    // Define File Client
    config.setFileServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/files/')
    config.setFileClient(FileClient)
  }
}
