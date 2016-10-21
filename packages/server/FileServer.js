let Err = require('substance').SubstanceError

/*
  FileServer module. Can be bound to an express instance
*/
class FileServer {
  constructor(config) {
    this.path = config.path
    this.store = config.store
  }

  /*
    Attach this server to an express instance
  */
  bind(app) {
    app.post(this.path, this._uploadFile.bind(this))
  }

  /*
    Upload a file
  */
  _uploadFile(req, res, next) {
    let self = this
    let uploader = this.store.getFileUploader('files')
    uploader(req, res, function (err) {
      if (err) {
        return next(new Err('FileStore.UploadError', {
          cause: err
        }))
      }
      res.json({name: self.store.getFileName(req)})
    })
  }
}

module.exports = FileServer
