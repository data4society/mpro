import { Button, Component } from 'substance'

class Pager extends Component {

  render($$) {
    let total = this.props.total;
    let loaded = this.props.loaded;
    let isLastPage = loaded >= total;

    let el = $$('div').addClass('sc-pager');

    let btn = $$(Button, {disabled: isLastPage}).append('Load more')
      .on('click', this._loadMore)

    el.append(btn)

    return el
  }

  _loadMore() {
    this.send('loadMore')
  }
}

export default Pager
