import { Component, Button } from 'substance'

class Pager extends Component {

  render($$) {
    let total = this.props.total
    let page = this.props.page
    let perPage = this.props.perPage

    let isSinglePage = total <= perPage
    let isFirstPage = page === 1
    let isLastPage = page * perPage >= total

    let el = $$('div').addClass('sc-simple-pager')

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

      let firstBtn = $$(Button, {disabled: firstBtnDisabled, style: 'default', label: '<< First'})
        .addClass('se-first').on('click', this.goToFirstPage)
      let prevBtn = $$(Button, {disabled: prevBtnDisabled, style: 'default', label: '< Prev'})
        .addClass('se-prev').on('click', this.goToPrevPage)
      let nextBtn = $$(Button, {disabled: nextBtnDisabled, style: 'default', label: 'Next >'})
        .addClass('se-next').on('click', this.goToNextPage)
      let lastBtn = $$(Button, {disabled: lastBtnDisabled, style: 'default', label: 'Last >>'})
        .addClass('se-last').on('click', this.goToLastPage)

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
    if(total%perPage !== 0) {
      lastPage = lastPage + 1
    }
    this.send('changePage', lastPage)
  }

}

export default Pager
