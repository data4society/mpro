import { Component } from 'substance'

class OIHeader extends Component {

  render($$) {
    let el = $$('div').addClass('sc-header')

    let logoSlogan = $$('div').addClass('se-logo-slogan').append(
      $$('a').attr({href: 'https://ovdinfo.org', terget: '_blank'}).addClass('se-logo').append(
        $$('img').attr({src: '/digest/assets/logo-oi.png'})
      ),
      $$('div').addClass('se-slogan').append(
        $$('a').attr({href: '/'}).append('Дайджест политических преследований')
      )
    )

    let socialDonate = $$('div').addClass('se-social-donate').append(
      $$('div').addClass('se-social').append(
        $$('span').append('Мы в соцсетях:'),
        $$('div').addClass('se-social-links').append(
          $$('a').attr({href: 'https://facebook.com/ovdinfo', target: '_blank'}).append($$('i').addClass('font-icon').append('')),
          $$('a').attr({href: 'https://vk.com/ovdinfo', target: '_blank'}).append($$('i').addClass('font-icon').append('')),
          $$('a').attr({href: 'https://twitter.com/ovdinfo', target: '_blank'}).append($$('i').addClass('font-icon').append('')),
          $$('a').attr({href: 'https://thequestion.ru/topic/1858/ovd-info', target: '_blank'}).append($$('i').addClass('font-icon').append('')),
          $$('a').attr({href: 'https://ovdinfo.org/rss.xml', target: '_blank'}).append($$('i').addClass('font-icon').append(''))
        )
      ),
      $$('a').addClass('se-donate').attr({href: 'https://donate.ovdinfo.org', target: '_blank'}).append('Помочь проекту')
    )

    el.append(
      logoSlogan,
      socialDonate
    )

    return el
  }

}

export default OIHeader