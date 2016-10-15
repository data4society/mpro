let uuid = require('substance').uuid
let multer = require('multer')

/*
  Implements Substance Store API.
*/
class FileStore {
  constructor(config) {
    this.storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, config.destination)
      },
      filename: function (req, file, cb) {
        let extension = file.originalname.split('.').pop()
        cb(null, uuid() + '.' + extension)
      }
    })
    this.uploader = multer({
      storage: this.storage,
      limits: {
        fieldSize: '10MB'
      }
    })
  }

  /*
    Returns middleware for file uploading
  */
  getFileUploader(fieldname) {
    return this.uploader.single(fieldname)
  }

  /*
    Get name of stored file
  */
  getFileName(req) {
    return req.file.filename
  }
}

module.exports = FileStore
