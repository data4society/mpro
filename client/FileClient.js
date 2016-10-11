/*
  HTTP client for talking with DocumentServer
*/
class FileClient {
  constructor(config) {
    this.config = config
  }

  /*
    Upload file to the server
  */
  uploadFile(file, cb) {

    function transferComplete(e) {
      if(e.currentTarget.status === 200) {
        let data = JSON.parse(e.currentTarget.response)
        let path = '/media/' + data.name
        cb(null, path)
      } else {
        cb(new Error(e.currentTarget.response))
      }
    }

    function updateProgress(e) {
      if (e.lengthComputable) {
        //var percentage = (e.loaded / e.total) * 100;
        //self.documentSession.hubClient.emit('upload', percentage);
      }
    }

    let formData = new window.FormData()
    formData.append("files", file)
    let xhr = new window.XMLHttpRequest()
    xhr.addEventListener("load", transferComplete)
    xhr.upload.addEventListener("progress", updateProgress)
    xhr.open('post', this.config.httpUrl, true)
    xhr.send(formData)
  }

}

export default FileClient
