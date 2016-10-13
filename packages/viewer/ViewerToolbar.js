import { Toolbar, ToolGroup } from 'substance'

class ViewerToolbar extends Toolbar {

  render($$) {
    let el = $$("div").addClass(this.getClassNames())
    let commandStates = this.props.commandStates
    let toolRegistry = this.context.toolRegistry
    let tools = [];
    toolRegistry.forEach(function(tool, name) {
      if (!tool.options.overlay && tool.options.viewer) {
        tools.push(
          $$(tool.Class, commandStates[name])
        );
      }
    });
    el.append(
      $$(ToolGroup).append(tools)
    );
    return el;
  }

  getClassNames() {
    return 'sc-viewer-toolbar'
  }
}

export default ViewerToolbar
