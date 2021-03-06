import { DocumentClient } from 'substance'

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

  getConfig(cb) {
    this.request('GET', '/api/config', null, cb)
  }

  createDocument(newDocument, cb) {
    this.request('POST', this.config.httpUrl, newDocument, cb)
  }

  getDocument(documentId, cb) {
    this.request('GET', this.config.httpUrl+documentId, null, cb)
  }

  deleteDocument(documentId, cb) {
    this.request('DELETE', this.config.httpUrl+documentId, null, cb)
  }

  listDocuments(filters, options, cb) {
    // TODO: send filters and options to server
    let filtersRequest = encodeURIComponent(JSON.stringify(filters));
    let optionsRequest = encodeURIComponent(JSON.stringify(options));
    this.request('GET', '/api/documents?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  listThemedDocuments(filters, options, cb) {
    // TODO: send filters and options to server
    let filtersRequest = encodeURIComponent(JSON.stringify(filters));
    let optionsRequest = encodeURIComponent(JSON.stringify(options));
    this.request('GET', '/api/documents/themed?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  listClasses(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    this.request('GET', '/api/classes?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  listFacets(facets, training, cb) {
    let facetsRequest = encodeURIComponent(JSON.stringify(facets));
    this.request('GET', '/api/facets?facets=' + facetsRequest + '&training=' + training, null, cb)
  }

  importData(file, classes, importer, cb) {
    this.request('GET', '/api/import?file=' + file + '&classes=' + classes + '&importer=' + importer, null, cb)
  }

  createSource(sourceData, cb) {
    this.request('POST', '/api/sources', sourceData, cb)
  }

  updateSource(documentId, sourceData, cb) {
    this.request('PUT', '/api/sources/' + documentId, sourceData, cb)
  }

  exportOIExpress(data, cb) {
    let request = new XMLHttpRequest();
    let urlEncodedDataPairs = [];
    let urlEncodedData = "";
    request.open('POST', this.config.oiExpress.url)
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        let res = request.responseText;
        if(isJson(res)) res = JSON.parse(res);
        cb(null, res);
      } else {
        return cb(new Error('Request failed. Returned status: ' + request.status))
      }
    }


    if (data && this.config.oiExpress) {
      data.pass = this.config.oiExpress.pass
      for(let key in data) {
        if(data[key]) {
          urlEncodedDataPairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
      }
      urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+')

      request.send(urlEncodedData)
    }
  }

  /*
    Create an entity
  */
  createEntity(entityData, cb) {
    this.request('POST', '/api/entities', entityData, cb)
  }

  /*
    Read an entity
  */
  getEntity(entityId, cb) {
    this.request('GET', '/api/entities/' + entityId, null, cb)
  }

  /*
    Update an entity
  */
  updateEntity(entityId, entityData, cb) {
    this.request('PUT', '/api/entities/' + entityId, entityData, cb)
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
    this.request('GET', '/api/entities/search?value=' + value + '&restrictions=' + restrictionsRequest, null, cb)
  }

  /*
    Create a rubric
  */
  createRubric(rubricData, cb) {
    this.request('POST', '/api/rubrics', rubricData, cb)
  }

  /*
    Read a rubric
  */
  getRubric(rubricId, cb) {
    this.request('GET', '/api/rubrics/' + rubricId, null, cb)
  }

  /*
    Update a rubric
  */
  updateRubric(rubricId, rubricData, cb) {
    this.request('PUT', '/api/rubrics/' + rubricId, rubricData, cb)
  }

  /*
    Get rubrics from the server
  */
  listRubrics(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters));
    let optionsRequest = encodeURIComponent(JSON.stringify(options));
    this.request('GET', '/api/rubrics?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  /*
    Create a collection
  */
  createCollection(collectionData, cb) {
    this.request('POST', '/api/collections', collectionData, cb)
  }

  /*
    Read a collection
  */
  getCollection(collectionId, cb) {
    this.request('GET', '/api/collections/' + collectionId, null, cb)
  }

  /*
    Update a collection
  */
  updateCollection(collectionId, collectionData, cb) {
    this.request('PUT', '/api/collections/' + collectionId, collectionData, cb)
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
    this.request('GET', '/api/collections/search?value=' + value + '&restrictions=' + restrictionsRequest, null, cb)
  }

  /*
    Create a rule
  */
  createRule(ruleData, cb) {
    this.request('POST', '/api/rules', ruleData, cb)
  }

  /*
    Update a rule
  */
  updateRule(ruleId, ruleData, cb) {
    this.request('PUT', '/api/rules/' + ruleId, ruleData, cb)
  }

  /*
    Delete a rule
  */
  removeRule(ruleId, cb) {
    this.request('DELETE', '/api/rules/' + ruleId, null, cb)
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
    Create a public API
  */
  createApi(apiData, cb) {
    this.request('POST', '/api/apis', apiData, cb)
  }

  /*
    Update a public API
  */
  updateApi(key, apiData, cb) {
    this.request('PUT', '/api/apis/' + key, apiData, cb)
  }

  /*
    Delete a public API
  */
  removeApi(key, cb) {
    this.request('DELETE', '/api/apis/' + key, null, cb)
  }

  /*
    Get public APIs from the server
  */
  listApis(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    this.request('GET', '/api/apis?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
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

  requestNewPassword(userId, cb) {
    this.request('GET', '/api/users/reset/' + userId, null, cb)
  }

  /*
    Get users from the server
  */
  listUsers(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    this.request('GET', '/api/users?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  /*
    Get distinct values for filters from the server
  */
  getFilterValues(filters, source, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    this.request('GET', '/api/filters?filters=' + filtersRequest + '&source=' + source, null, cb)
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
