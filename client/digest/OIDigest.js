import { Component, Grid, Layout, SplitPane, request } from 'substance'
import concat from 'lodash/concat'
import each from 'lodash/each'
import isEqual from 'lodash/isEqual'
import map from 'lodash/map'
import moment from 'moment'
import OIHeader from './OIHeader'
import ListScrollPane from './ListScrollPane'
import Pager from './Pager'

class OIDigest extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadMore': this._loadMore
    })
  }

  didMount() {
    this._loadCollections()
    this._loadTopEntities()
  }

  didUpdate(oldProps, oldState) {
    if(!isEqual(this.state.collections, oldState.collections) || this.state.activeCollection !== oldState.activeCollection || !isEqual(this.state.activeEntity, oldState.activeEntity)) {
      this._loadDocuments()
    }
    if(this.state.activeCollection !== oldState.activeCollection) {
      this._loadTopEntities()
    }
    if(!isEqual(this.state.mode, oldState.mode)) {
      if(this.state.mode === 'documents') {
        this._loadDocuments()
      } else if (this.state.mode === 'entities') {
        this._loadEntities()
      }
    }

    if(!isEqual(this.state.dates, oldState.dates)) {
      this._loadCollections()
      this._loadTopEntities()
      this._loadDocuments()
    }

    if(this.refs.dateFilter) {
      let el = this.refs.dateFilter.el.el
      el.flatpickr({
        mode: 'range',
        wrap: true,
        clickOpens: false,
        defaultDate: this.state.dates,
        onChange: this._changeDateFilter.bind(this)
      })
    }
  }

  getInitialState() {
    return {
      endpoint: 'https://mpro.ovdinfo.org',
      collectionsKey: '93ba5954-e316-cccf-a7b2-825f534c071f',
      collectionDocsKey: 'd9de7254-c794-5471-d460-87015ddf2e56',
      entityDocsKey: '9b3f0254-e7b9-8310-f6d3-60c9c76d04ba',
      topEntitiesKey: 'b2a1b608-f832-65ff-e852-6015f542e15b',
      title: 'Все новости',
      collections: [],
      topEntities: [],
      activeCollection: '',
      activeEntity: {},
      perPage: 10,
      page: 1,
      mode: 'documents',
      items: [],
      dates: null
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-digest sc-container')
    
    let layout = $$(Layout, {
      width: 'large',
      textAlign: 'left',
      noPadding: false
    })

    let total = this.state.total
    let docsPanel

    if(total > 0) {
      docsPanel = $$(ListScrollPane, {
        scrollbarType: 'substance',
        scrollbarPosition: 'right'
      }).append(this.renderContent($$))
    } else if (total === '0') {
      docsPanel = $$('div').addClass('se-no-results').append(
        'К сожалению по вашему запросу не найдено новостей'
      )
    } else {
      docsPanel = this.renderSpinner($$)
    }

    layout.append(
      $$(SplitPane, {
        sizeA: '300px',
        splitType: 'vertical'
      }).append(
        this.renderSideBar($$),
        docsPanel
      ).addClass('se-digest')
    )

    let aboutBtnIcon = this.state.about ? 'fa-times' : 'fa-info-circle'
    let aboutBtn = $$('div').addClass('se-header-about').append(
      $$('i').addClass('fa ' + aboutBtnIcon)
    ).on('click', this._toggleAboutSection)

    el.append(
      $$(OIHeader),
      aboutBtn,
      this.renderHeader($$),
      layout
    )

    if(this.state.about) {
      el.append(this.renderAbout($$))
    }

    return el
  }

  renderHeader($$) {
    let wrapper = $$('div').addClass('se-top-panel')
    let el = $$('div').addClass('se-header-panel')

    el.append(
      $$('div').addClass('se-header-title').setInnerHTML(this.state.title)   
    )

    if(this.state.activeEntity.id && !this.state.activeCollection) {
      el.append(
        $$('span').addClass('se-clear-entity-filter').append('☓')
          .on('click', this._resetEntityFilter)
      )
    }

    if(this.state.dates) {
      let dates = this.state.dates[0]
      if(this.state.dates.length > 1) dates += ' - ' + this.state.dates[1]
      el.append(
        $$('div').addClass('se-header-dates').append(
          dates,
          $$('i').addClass('fa fa-calendar-times-o')
            .on('click', this._resetDateFilter)
        )
      )
    }

    if(this.state.total) {
      el.append(
        $$('div').addClass('se-header-stats').append(
          this.state.total,
          $$('i').addClass('fa fa-newspaper-o')
        )
      )
    }

    let dateFilter = $$('div').addClass('se-date-filter').append(
      $$('input').attr({'data-input': true}),
      $$('span').attr({'data-toggle': true}).append($$('i').addClass('fa fa-calendar'))
    ).ref('dateFilter')

    el.append(
      dateFilter
    )

    wrapper.append(el)

    return wrapper
  }

  renderSideBar($$) {
    let el = $$('div').addClass('sc-collections')
    let collections = this.state.collections
    let entities = this.state.topEntities
    
    el.append($$('div').addClass('se-title').append('Темы:'))
    each(collections, function(collection) {
      let item = $$('div').addClass('se-collection-node').append(
        $$('span').addClass('se-node-name').append(collection.name),
        $$('span').addClass('se-node-count').append(collection.cnt)
      )
      .attr({title: collection.description})
      .ref(collection.collection)
      .on('click', this._collectionFilter.bind(this, collection.collection))

      if(collection.collection === this.state.activeCollection) {
        item.addClass('se-active')
      }

      el.append(item)
    }.bind(this))


    let entitiesEl = $$('div').addClass('se-entities-list')
    entitiesEl.append(
      $$('div').addClass('se-title')
        .append(
          'Упоминания:',
          $$('span').addClass('se-expand-mentions').append(
            'все',
            $$('i').addClass('fa fa-expand')
          ).on('click', this._switchMode.bind(this, 'entities'))
        )
    )
    let entitiesNodesEl = $$('div').addClass('se-entities-nodes')
    each(entities, function(entity) {
      let item = $$('div').addClass('se-entity-node').append(
        $$('span').addClass('se-node-name').append(entity.name),
        $$('span').addClass('se-node-count').append(entity.cnt)
      ).on('click', this._entityFilter.bind(this, entity, false))

      if(entity.id === this.state.activeEntity.id) {
        item.addClass('se-active')
      }

      entitiesNodesEl.append(item)
    }.bind(this))

    entitiesEl.append(entitiesNodesEl)

    el.append(entitiesEl)

    return el
  }

  renderContent($$) {
    let items = this.state.items
    let total = this.state.total
    let el = $$('div').addClass('se-list-not-empty')
    let grid = $$(Grid)

    if (items) {
      if(this.state.mode === 'documents') {
        items.forEach(function(item) {
          let entities = $$(Grid.Row).addClass('se-item-entities')
          item.entities.forEach(function(entity) {
            if(entity.name !== '') {
              let entityItem = $$('span')
                .addClass('se-item-entity')
                .append(entity.name)
                .on('click', this._entityFilter.bind(this, entity, true))

              entities.append(entityItem)
            }
          }.bind(this))
          let published = moment(item.meta.published).format('DD.MM.YYYY')
          let sourceName = this._getSourceName(item.meta.source)
          grid.append(
            $$(Grid.Row).addClass('se-source').ref(item.doc_id).append(
              $$(Grid.Cell, {columns: 6}).addClass('se-source-name').append(sourceName),
              $$(Grid.Cell, {columns: 6}).addClass('se-item-published').append(published),
              $$('div').addClass('se-divider'),
              $$('a').addClass('se-row se-item-title').attr({href: item.meta.source, target: '_blank'}).append(item.meta.title),
              $$('a').addClass('se-row se-item-abstract').attr({href: item.meta.source, target: '_blank'}).append(item.meta.abstract),
              entities
            )
          )
        }.bind(this))
      } else if (this.state.mode === 'entities') {
        items.forEach(item => {
          grid.append(
            $$(Grid.Row).addClass('se-row se-entity-list-item').ref(item.id).append(
              $$(Grid.Cell, {columns: 11}).addClass('se-entity-name').append(item.name),
              $$(Grid.Cell, {columns: 1}).addClass('se-entity-counter').append(item.cnt)
            ).on('click', this._entityFilter.bind(this, item, false))
          )
        })
      }

      el.append(grid)
      if(items.length < total) {
        el.append($$(Pager, {total: total, loaded: items.length}))
      }
    }

    return el
  }

  renderSpinner($$) {
    let el = $$('div').addClass('se-spinner')
    el.append($$('img').attr({src: '/digest/assets/loader.gif'}))
    return el
  }

  renderAbout($$) {
    let el = $$('div').addClass('se-about')
    let content = `Медиа-радар&nbsp;&#151; это&nbsp;автоматический мониторинг СМИ. Мы&nbsp;автоматически ищем в&nbsp;русскоязычных СМИ&nbsp;публикации, в&nbsp;которых описываются нарушения прав человека в&nbsp;России, собираем их&nbsp;вместе и&nbsp;выделяем в&nbsp;них самую важную информацию&nbsp;&#151; имена людей, упоминавшихся в&nbsp;новостях, географические данные, название организаций и&nbsp;статьи уголовного и&nbsp;административных кодексов. 

<h3>Зачем нужен Медиа-радар?</h3>ОВД-Инфо специализируется на&nbsp;информации о&nbsp;политических преследованиях и&nbsp;нарушении права на&nbsp;свободу собраний, и&nbsp;про все&nbsp;подобные случаи мы&nbsp;пишем довольно подробные новости. К&nbsp;сожалению, в&nbsp;России ежедневно происходит множество других случаев нарушений прав человека, и&nbsp;писать про&nbsp;ОВД-Инфо не&nbsp;может. Наш&nbsp;автоматический мониторинг СМИ&nbsp;позволяет восполнить лакуны нашей собственной новостной ленты и&nbsp;погрузить читателя в&nbsp;более широкий контекст нарушения гражданских прав. 

<h3>Для кого Медиа-радар?</h3>Прежде всего&nbsp;&#151; для&nbsp;профессиональной аудитории: иметь возможность оперативно знакомиться с&nbsp;хорошо структурированной информацией о&nbsp;нарушениях прав человека будет полезно для&nbsp;правозащитников, журналистов и&nbsp;юристов. Но&nbsp;мы надеемся, что&nbsp;Медиа-радар станет удобным новостным агрегатором для&nbsp;всех наших читателей.

<h3>Как работает Медиа-радар?</h3>Мы&nbsp;собираем новости автоматически из&nbsp;5000 источников&nbsp;&#151; это, прежде всего, российские СМИ&nbsp;и сайты государственных органов. Все&nbsp;новости проходят рубрикацию&nbsp;&#151; этот алгоритм основан на&nbsp;машинном обучении: редакция ОВД-Инфо обучила машину, чтобы она&nbsp;научилась различать те&nbsp;тексты, в&nbsp;которых упоминаются нарушения прав человека, от&nbsp;всех прочих новостных заметок. После этого из&nbsp;одобренных машиной текстов извлекаются данные&nbsp;&#151; этот алгоритм также основан на&nbsp;машинном обучении с&nbsp;применением нейронной сети. Технология, которую мы&nbsp;используем, создана нашими друзьями и&nbsp;партнерами из&nbsp;Data for&nbsp;Society, и&nbsp;находится в&nbsp;пока в&nbsp;режиме тестирования. Из-за того, что&nbsp;поиск и&nbsp;отбор новостей осуществляется в&nbsp;автоматическом режиме, иногда в&nbsp;подборку той&nbsp;или иной тематики могут попадать новости, не&nbsp;содержащие информации о&nbsp;нарушениях прав человека: мы&nbsp;работаем над&nbsp;этим и&nbsp;будем благодарны, если вы&nbsp;будете <a href="mailto:info@ovdinfo.org">сообщать нам</a> о&nbsp;таких случаях.  

<h3>О чем&nbsp;Медиа-радар?</h3>На&nbsp;данный момент мы&nbsp;агрегируем новости из&nbsp;русскоязычных СМИ&nbsp;по шести тематикам:

<em>ЛГБТ</em>&nbsp;&#151; нарушение прав людей с&nbsp;альтернативной сексуальной ориентацией. В&nbsp;эту рубрику попадают новости про&nbsp;преследования ЛГБТ, возбуждение административных и&nbsp;уголовных дел&nbsp;за так&nbsp;называемую &laquo;пропаганду гомосексуализма&raquo;, срывы ЛГБТ-мероприятий, угрозы и&nbsp;диффамация. 

<em>Искусство</em>&nbsp;&#151; нарушение права на&nbsp;свободное художественное высказывание. В&nbsp;эту рубрику попадают новости про&nbsp;различные случаи цензуры со&nbsp;стороны государства, а&nbsp;также про&nbsp;попытки навязать цензуры со&nbsp;стороны радикальных активистких группировок. 

<em>Насилие</em>&nbsp;&#151; применение насилия по&nbsp;отношению к&nbsp;активистам, политикам и&nbsp;журналистам. В&nbsp;эту рубрику попадают случаи насилия вне&nbsp;зависимости от&nbsp;того, кто&nbsp;применяет насилия&nbsp;&#151; мы&nbsp;считаем, что&nbsp;любое насилие&nbsp;&#151; ответственность государства. В&nbsp;том случае, если насилие применяют не&nbsp;сотрудники государственных органов, именно государство должно обеспечить безопасность граждан и&nbsp;расследовать соответствующие преступления. 

<em>Отчисления и&nbsp;увольнения</em>&nbsp;&#151; случаи внесудебного давления на&nbsp;активистов со&nbsp;стороны работодателя или&nbsp;ВУЗа. 

<em>Угрозы</em>&nbsp;&#151; угрозы применения насилия по&nbsp;отношению к&nbsp;активистам, политикам, журналистам. В&nbsp;эту рубрику попадают новости про&nbsp;угрозы как&nbsp;со стороны сотрудников государственных органов, так&nbsp;и со&nbsp;стороны неизвестных лиц. Мы&nbsp;считаем, что&nbsp;любые угрозы по&nbsp;отношению к&nbsp;активистам&nbsp;&#151; ответственность государства: именно государство должно обеспечить безопасность граждан и&nbsp;расследовать соответствующие преступления.  

<em>Интернет</em>&nbsp;&#151; нарушение права на&nbsp;свободу высказывания в&nbsp;Интернете. В&nbsp;эту рубрику попадают новости про&nbsp;блокировки, возбуждения административных и&nbsp;уголовных дел&nbsp;за посты и&nbsp;репосты и&nbsp;другие случаи давления.

<h3>Кто это&nbsp;делает?</h3>Проект &laquo;Медиа-радар: нарушения прав человека&raquo; реализуется <a href="https://ovdinfo.org/about" target="_blank">независимым правозащитным медиа-проектом ОВД-Инфо</a>. 

Программные решения: команда Data for&nbsp;Society
Концепция: Григорий Охотин, Даниил Бейлинсон
Программирование: Даниил Бейлинсон

Связаться с&nbsp;командой можно по&nbsp;е-мейлу <a href="mailto:info@ovdinfo.org">info@ovdinfo.org</a> или&nbsp;через форму обратной связи&nbsp;&#151; мы&nbsp;всегда будем рады вашим письмам. 
<div class="se-copyright"><a href="http://creativecommons.org/licenses/by/3.0/deed.en_US" rel="license"><img alt="Creative Commons License" src="//i.creativecommons.org/l/by/3.0/88x31.png" style="border-width:0"></a>
<div class="se-copyright-content">ОВД-Инфо &laquo;Медиа-радар: нарушения прав человека&raquo; (digest.ovdinfo.org) лицензировано в&nbsp;соответствии с&nbsp;Creative Commons Attribution&nbsp;3.0 Unported License.</div></div>
    `

    el.append(
      $$('div').addClass('se-content').setInnerHTML(content)
    )

    return el
  }

  _getSourceName(url) {
    let re = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
    let res = re.exec(url)
    if(res) {
      return res[1]
    } else {
      return ''
    }
  }

  _collectionFilter(colId) {
    let activeCollection = this.state.activeCollection !== colId ? colId : ''
    let colNode
    each(this.state.collections, col => {
      if(col.collection === colId) {
        colNode = col
        return
      }
    })
    let state = {activeCollection: activeCollection, activeEntity: {}, title: 'Новости по теме: <em>' + colNode.name + '</em>', mode: 'documents', items: [], total: null}
    if(this.state.activeCollection === colId) state.title = 'Все новости'
    this.extendState(state)
  }

  _entityFilter(entity, force, e) {
    e.preventDefault()
    if(!isEqual(this.state.activeEntity, entity)) {
      let state = {activeEntity: entity, mode: 'documents', items: [], total: null}
      if(this.state.mode === 'entities') state.activeCollection = ''
      if(!this.state.activeCollection || force) state.title = 'Все новости о: <em>' + entity.name + '</em>'
      if(force) state.activeCollection = ''
      this.extendState(state)
    } else {
      let state = {activeEntity: {}, items: [], total: null}
      if(!this.state.activeCollection) state.title = 'Все новости'
      this.extendState(state)
    }
  }

  _loadMore() {
    if(this.state.mode === 'documents') {
      this._loadDocuments(true)
    } else if(this.state.mode === 'entities') {
      this._loadEntities(true)
    }
  }

  _loadCollections() {
    let options = {}

    if(this.state.dates) {
      options.dateFilter = this.state.dates
    }

    let optionsRequest = encodeURIComponent(JSON.stringify(options))

    let url = this.state.endpoint + '/api/public/' + this.state.collectionsKey + '?options=' + optionsRequest
    request('GET', url, null, function(err, collections) {
      if (err) {
        console.error('ERROR', err)
        return
      }

      this.extendState({collections: collections})
    }.bind(this))
  }

  _loadDocuments(pagination) {
    let perPage = this.state.perPage
    
    let options = {
      limit: perPage, 
      offset: pagination ? this.state.items.length : 0,
      entities: true
    }

    if(this.state.activeEntity.id) {
      options.entityFilters = [this.state.activeEntity.id]
    }

    if(this.state.dates) {
      options.dateFilter = this.state.dates
    }

    let optionsRequest = encodeURIComponent(JSON.stringify(options))

    let query
    let key

    if(this.state.activeCollection) {
      key = this.state.collectionDocsKey
      query = this.state.activeCollection
    } else {
      let colIds = map(this.state.collections, function(c) {
        return c.collection
      })
      query = colIds.join(',')
      key = this.state.collectionDocsKey
    }

    let url = this.state.endpoint + '/api/public/' + key + '/?query=' + query + '&options=' + optionsRequest
    
    request('GET', url, null, function(err, results) {
      if (err) {
        console.error('ERROR', err)
        return
      }

      let items
      if(pagination) {
        items = concat(this.state.items, results.records)
      } else {
        items = results.records
      }

      this.extendState({
        items: items,
        total: results.total
      })
    }.bind(this))
  }

  _loadEntities(pagination) {
    let perPage = this.state.perPage
    
    let options = {
      limit: perPage, 
      offset: pagination ? this.state.items.length : 0
    }
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    let url = this.state.endpoint + '/api/public/' + this.state.topEntitiesKey + '?options=' + optionsRequest

    request('GET', url, null, function(err, results) {
      if (err) {
        console.error('ERROR', err)
        return
      }

      let items
      if(pagination) {
        items = concat(this.state.items, results.records)
      } else {
        items = results.records
      }

      this.extendState({
        items: items,
        total: results.total
      })
    }.bind(this))
  }

  _loadTopEntities() {
    let options = {}

    if(this.state.dates) {
      options.dateFilter = this.state.dates
    }

    let optionsRequest = encodeURIComponent(JSON.stringify(options))

    let url = this.state.endpoint + '/api/public/' + this.state.topEntitiesKey
    if(this.state.activeCollection) {
      url += '?query="' + this.state.activeCollection + '"&options=' + optionsRequest
    } else {
      url += '?options=' + optionsRequest
    }
    request('GET', url, null, function(err, topEntities) {
      if (err) {
        console.error('ERROR', err)
        return
      }

      this.extendState({topEntities: topEntities.records})
    }.bind(this))
  }

  _switchMode(mode) {
    this.extendState({mode: mode, items: [], total: null})
  }

  _toggleAboutSection() {
    let showAbout = !this.state.about
    this.extendState({about: showAbout})
  }

  _changeDateFilter(selectedDates, dateStr, instance) {
    let dates = []
    if(selectedDates.length > 1) {
      instance.close()
      dates.push(moment(selectedDates[0]).format('YYYY-MM-DD'))
      if(selectedDates[0].toString() !== selectedDates[1].toString()) {
        dates.push(moment(selectedDates[1]).format('YYYY-MM-DD'))
      }

      this.extendState({mode: 'documents', items: [], total: null, dates: dates, about: false})
    } else {
      dates.push(moment(selectedDates[0]).format('YYYY-MM-DD'))
    }
  }

  _resetEntityFilter() {
    let activeCollection = this.state.activeCollection
    let title = 'Все новости'
    if(activeCollection) {
      let colNode
      each(this.state.collections, col => {
        if(col.collection === activeCollection) {
          colNode = col
          return
        }
      })
      title = 'Новости по теме: <em>' + colNode.name + '</em>'
    }
    this.extendState({mode: 'documents', items: [], total: null, activeEntity: {}, title: title})
  }

  _resetDateFilter() {
    this.extendState({mode: 'documents', items: [], total: null, dates: null})
  }

}

export default OIDigest
