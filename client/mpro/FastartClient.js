/*
  HTTP client for talking with FastartServer
*/
class FastartClient {
  constructor(config) {
    this.config = config
  }

  request(method, url, data, cb) {
    let request = new XMLHttpRequest();
    request.open(method, url, true)
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
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
}

function isJson(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export default FastartClient
