import { Component, Button, Input } from 'substance'
import each from 'lodash/each'

class ApiForm extends Component {

  getInitialState() {
    let appsConfig = this.context.config.apps
    let apps = {}

    each(appsConfig, function(app, id) {
      if(app.configurator === false) {
        apps[id] = app.name
      }
    })

    return {
      record: {
        key: this.props.key,
        api: this.props.api || 'entity_docs',
        param: this.props.param || '',
        format: this.props.format || 'json',
        live: this.props.live || false,
        app_id: this.props.currentApp
      },
      apis: {
        'entity_docs': 'List documents related to entities with given params',
        'entities_list': 'List top-used entities with collection facets',
        'collection_docs': 'List documents related to colelctions with given params',
        'collections_list': 'List public collections',
        'get_document': 'Get document data'
      }, 
      formats: [
        'json',
        'iframe'
      ],
      apps: apps
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-api-form')

    let selectApi = $$('select').addClass('se-select sc-field-select').ref('api').on('change', this.commit)

    each(this.state.apis, function(opt, id) {
      let option = $$('option').attr({value: id}).append(opt)
      if(id === this.state.record.api) option.attr({selected: "selected"})
      selectApi.append(option)
    }.bind(this))


    let paramInput = $$('div').addClass('se-input').append(
      $$(Input, {
        type: 'text',
        placeholder: 'Enter param, separate nested with ", "',
        centered: true,
        value: this.props.param
      }).ref('param').on('keyup', this.commit)
    )

    let selectFormat = $$('select').addClass('se-select sc-field-select').ref('format').on('change', this.commit)

    each(this.state.formats, function(opt) {
      let option = $$('option').attr({value: opt}).append(opt)
      if(opt === this.state.record.format) option.attr({selected: "selected"})
      selectFormat.append(option)
    }.bind(this))

    let switchAttrs = {type: 'checkbox', class: 'se-switch-checkbox', id: 'live'}
    if(this.state.record.live) switchAttrs.checked = 'checked'

    let liveSwitcher = $$('div').addClass('se-switch').append(
      $$('input').attr(switchAttrs)
        .ref('live')
        .on('change', this.switch),
      $$('label').attr({class: 'se-switch-label', for: 'live'}).append(
        $$('span').addClass('se-switch-inner'),
        $$('span').addClass('se-switch-switch')
      )
    )

    el.append(
      selectApi,
      paramInput,
      selectFormat,
      liveSwitcher
    )

    return el
  }

  commit() {
    let record = this.state.record
    record.api = this.refs.api.val()
    record.param = this.refs.param.val()
    record.format = this.refs.format.val()
    this.extendState({record: record})
  }

  switch() {
    let record = this.state.record
    record.live = !record.live
    this.extendState({record: record})
  }

  // _createUser() {
  //   let newUser = {
  //     email: this.refs.email.val()
  //   }

  //   newUser.access = this.refs.access.el.el.checked;
  //   newUser.super = this.refs.super.el.el.checked;

  //   let emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  //   if (emailRegExp.test(newUser.email)) {
  //     this.send('addApi', newApi);
  //   } else {
  //     this.setState({'error': true});
  //   }
  // }
}

export default ApiForm