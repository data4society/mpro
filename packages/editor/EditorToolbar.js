import { Toolbar, ToolGroup } from 'substance'

class EditorToolbar extends Toolbar {

  render($$) {
    let el = $$("div").addClass(this.getClassNames())
    let commandStates = this.props.commandStates
    let toolRegistry = this.context.toolRegistry
    let tools = []
    toolRegistry.forEach(function(tool, name) {
      if (!tool.options.overlay && tool.options.editor) {
        tools.push(
          $$(tool.Class, commandStates[name])
        )
      }
    })
    el.append(
      $$(ToolGroup).append(tools)
    )
    return el
  }

  getClassNames() {
    return 'sc-editor-toolbar'
  }
}

export default EditorToolbar
