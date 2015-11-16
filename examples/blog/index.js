var Dom = require('../..')
var template = require('./login-box.html')

var app = {
  initialize: function () {
    console.log('initialize app')
    document.title = this.data.name
  },

  somethingApp: function () {},

  on: {
    'click:a': function (e) {
      console.log(e.target)
    }
  }
}

var loginBox = {
  template: template
}

var archive = {
  initialize: function (el, data) {
    console.log('initialize archive', el, data)
  },
  changeLinkText: function (el) {
    var res = window.prompt('What text should I be?', el.textContent)
    if (res !== null) { // noop if `cancel` is clicked
      el.textContent = res || '<Click to edit link text>'
    }
  },
  on: {
    'click:a': function (e) {
      e.preventDefault()
      this.changeLinkText(e.target)
    }
  }
}

var external = {
  initialize: function () {
    console.log('initialize external')
  },

  somethingExternal: function () {},

  on: {
    'click:a': function (e) {
      e.preventDefault()
      window.alert('External clicked')
    }
  }
}

var links = {
  initialize: function () {
    console.log('initialize links')
  },

  template: function () {
    var s = '<ul>'
    for (var i = 0; i < this.data.length; i++) {
      s += '<li link="[' + i + ']"></li>'
    }
    s += '</ul>'
    return s
  },

  on: {
    'click:a': function (e) {
      e.preventDefault()
      window.alert('Links clicked')
    }
  }
}

var link = {
  template: function () {
    return '<a as="anchor">' + this.data + '</a>'
  },

  on: {
    'click': function (e) {
      e.preventDefault()
      window.alert('Link clicked')
    }
  }
}

Dom.register({
  'login-box': loginBox,
  'root': {
    on: {
      'click': function (e) {
        console.log('clicked html root')
      }
    }
  },
  'app': app,
  'archive-history': archive,
  'external-links': external,
  'archive-history-list': {
    somethingAHL: function () {
    },
    on: {
      'click:a': function (e) {
        e.preventDefault()
        console.log('ahl click')
      }
    }
  },
  'links': links,
  'link': link
})

window.onload = function () {
  var data = {
    name: 'Blog Example',
    links: [1, 2, 3],
    user: {
      email: 'a@b.com',
      password: 'secret'
    }
  }

  Dom.scan(document.documentElement, data)
}
