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

  /*
    Create an entity
  */
  createEntity(entityData, cb) {
    request('POST', '/api/entities', entityData, cb)
  }

  /*
    Read an entity
  */
  getEntity(entityId, cb) {
    request('GET', '/api/entities/' + entityId, null, cb)
  }

  /*
    Update an entity
  */
  updateEntity(entityId, entityData, cb) {
    request('PUT', '/api/entities/' + entityId, entityData, cb)
  }

  /*
    Get entities from the server
  */
  listEntities(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    this.request('GET', '/api/entities?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  /*
    Find an entity
  */
  findEntities(value, restrictions, cb) {
    let restrictionsRequest = encodeURIComponent(JSON.stringify(restrictions))
    request('GET', '/api/entities/search?value=' + value + '&restrictions=' + restrictionsRequest, null, cb)
  }

  /*
    Create a collection
  */
  createCollection(collectionData, cb) {
    request('POST', '/api/collections', collectionData, cb)
  }

  /*
    Read a collection
  */
  getCollection(collectionId, cb) {
    request('GET', '/api/collections/' + collectionId, null, cb)
  }

  /*
    Update a collection
  */
  updateCollection(collectionId, collectionData, cb) {
    request('PUT', '/api/collections/' + collectionId, collectionData, cb)
  }

  /*
    Get collections from the server
  */
  listCollections(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    this.request('GET', '/api/collections?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  /*
    Find a collection
  */
  findCollections(value, restrictions, cb) {
    let restrictionsRequest = encodeURIComponent(JSON.stringify(restrictions))
    request('GET', '/api/collections/search?value=' + value + '&restrictions=' + restrictionsRequest, null, cb)
  }

  /*
    Create a rule
  */
  createRule(ruleData, cb) {
    request('POST', '/api/rules', ruleData, cb)
  }

  /*
    Update a rule
  */
  updateRule(ruleId, ruleData, cb) {
    request('PUT', '/api/rules/' + ruleId, ruleData, cb)
  }

  /*
    Delete a rule
  */
  removeRule(ruleId, cb) {
    request('DELETE', '/api/rules/' + ruleId, null, cb)
  }

  /*
    Get rules from the server
  */
  listRules(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    this.request('GET', '/api/rules?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  /*
    Update documents with given rule
  */
  reapplyRule(ruleId, cb) {
    this.request('GET', '/api/rules/' + ruleId + '/reapply', null, cb)
  }

  /*
    Create a user
  */
  createUser(data, cb) {
    this.request('POST', '/api/users', data, cb)
  }

  /*
    Update a user
  */
  updateUser(userId, data, cb) {
    this.request('PUT', '/api/users/' + userId, data, cb)
  }

  /*
    Get users from the server
  */
  listUsers(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    this.request('GET', '/api/users?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
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
