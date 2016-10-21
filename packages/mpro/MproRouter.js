import { Router } from 'substance'

class MproRouter extends Router {
  constructor(app) {
    super(app)

    this.app = app
  }

  // URL helpers
  openDocument(documentId) {
    return '#' + Router.objectToRouteString({
      page: 'inbox',
      documentId: documentId
    })
  }

  getRoute() {
    let routerString = this.getRouteString()
    return Router.routeStringToObject(routerString)
  }
}

export default MproRouter
