/*
  Holds custom info about a document.

  This data is owned by the server, we must find a way to update it
  in realtime during an editing session
*/
class DocumentInfo {
  constructor(props) {
    this.props = props

    if (!props.updatedBy) {
      this.props.updatedBy = 'Anonymous'
    }
  }
}

export default DocumentInfo
