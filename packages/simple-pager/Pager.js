import { Component, Button } from 'substance'

class Pager extends Component {

  render($$) {
    let total = this.props.total
    let page = this.props.page
    let perPage = this.props.perPage

    let isSinglePage = total <= perPage
    let isFirstPage = page === 1
    let isLastPage = page * perPage >= total

    let el = $$('div').addClass('sc-pager')

    if(!isSinglePage) {
      let firstBtnDisabled = false;
      let prevBtnDisabled = false;
      let nextBtnDisabled = false;
      let lastBtnDisabled = false;

      if(isFirstPage) {
        firstBtnDisabled = true;
        prevBtnDisabled = true;
      }

      if(isLastPage) {
        nextBtnDisabled = true;
        lastBtnDisabled = true;
      }

      let firstBtn = $$(Button, {disabled: firstBtnDisabled})
        .addClass('se-first').on('click', this.goToFirstPage).append('<< First')
      let prevBtn = $$(Button, {disabled: prevBtnDisabled})
        .addClass('se-prev').on('click', this.goToPrevPage).append('< Prev')
      let nextBtn = $$(Button, {disabled: nextBtnDisabled})
        .addClass('se-next').on('click', this.goToNextPage).append('Next >')
      let lastBtn = $$(Button, {disabled: lastBtnDisabled})
        .addClass('se-last').on('click', this.goToLastPage).append('Last >>')

      el.append(
        firstBtn,
        prevBtn,
        nextBtn,
        lastBtn
      )
    }

    return el
  }

  goToFirstPage(e) {
    e.preventDefault()
    this.send('changePage', 1)
  }

  goToPrevPage(e) {
    e.preventDefault()
    let page = this.props.page
    this.send('changePage', page - 1)
  }

  goToNextPage(e) {
    e.preventDefault()
    let page = this.props.page
    this.send('changePage', page + 1)
  }

  goToLastPage(e) {
    e.preventDefault()
    let total = this.props.total
    let perPage = this.props.perPage
    let lastPage = Math.floor(total/perPage)
    this.send('changePage', lastPage + 1)
  }

}

export default Pager
