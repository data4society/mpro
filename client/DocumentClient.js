import { DocumentClient, request } from 'substance'

/*
  HTTP client for talking with DocumentServer
*/

class MproDocumentClient extends DocumentClient {
  constructor(config) {
    super(config)

    this.config = config
    this.authClient = config.authClient
  }

  request(method, url, data, cb) {
    let request = new XMLHttpRequest();
    request.open(method, url, true)
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    request.setRequestHeader('x-access-token', this.authClient.getSessionToken())
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        let res = request.responseText;
        if(isJson(res)) res = JSON.parse(res);
        cb(null, res);
      } else {
        return cb(new Error('Request failed. Returned status: ' + request.status))
      }
    }

    if (data) {
      request.send(JSON.stringify(data))
    } else {
      request.send()
    }
  }

  listDocuments(filters, options, cb) {
    // TODO: send filters and options to server
    let filtersRequest = encodeURIComponent(JSON.stringify(filters));
    let optionsRequest = encodeURIComponent(JSON.stringify(options));
    request('GET', '/api/documents?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  listRubrics(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters));
    let optionsRequest = encodeURIComponent(JSON.stringify(options));
    request('GET', '/api/rubrics?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  listClasses(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/classes?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  listFacets(facets, training, cb) {
    let facetsRequest = encodeURIComponent(JSON.stringify(facets));
    request('GET', '/api/facets?facets=' + facetsRequest + '&training=' + training, null, cb)
  }

  importData(file, classes, importer, cb) {
    request('GET', '/api/import?file=' + file + '&classes=' + classes + '&importer=' + importer, null, cb)
  }

  updateSource(documentId, sourceData, cb) {
    request('PUT', '/api/sources/' + documentId, sourceData, cb)
  }

  createEntity(entityData, cb) {
    request('POST', '/api/entities', entityData, cb)
  }

  getEntity(entityId, cb) {
    request('GET', '/api/entities/' + entityId, null, cb)
  }

  updateEntity(entityId, entityData, cb) {
    request('PUT', '/api/entities/' + entityId, entityData, cb)
  }

  findEntities(value, restrictions, cb) {
    let restrictionsRequest = encodeURIComponent(JSON.stringify(restrictions))
    request('GET', '/api/entities/search?value=' + value + '&restrictions=' + restrictionsRequest, null, cb)
  }
}

function isJson(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export default MproDocumentClient
