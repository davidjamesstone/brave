var Dom = require('../..')
var supermodels = require('supermodels.js')

var field = function (name) {
  return {
    __type: String,
    __validators: [function (val) {
      return val ? '' : (name + ' is required')
    }]
  }
}

var ContactUs = supermodels({
  name: field('Name'),
  question: field('Question'),
  email: field('Email'),
  line1: field('Line 1'),
  line2: field('Line 2'),
  postcode: field('Postcode'),
  get fullAddress () {
    return (this.line1 || '') + ' ' + (this.line2 || '') + ' ' + (this.postcode || '')
  }
})

Dom.register({
  'contact-us': {
    initialize: function () {
      console.log('initialize')
    },
    on: {
      'change:form input': function (e) {
        var el = e.target
        this.data[el.name] = el.value
        this.setButtonState()
      }
    },
    setButtonState: function () {
      this.sendButton.disabled = !!this.data.errors.length
    },
    template: require('./_contactus.html')
  },
  'address': {
    initialize: function () {
      var self = this
      this.data.on('change', function () {
        self.__.render()
      })
    },
    template: function (model) {
      return model.data.fullAddress
    }
  },
  'errors': {
    initialize: function () {
      var self = this
      this.data.on('change', function (e) {
        self.__.render()
      })
    },
    template: function () {
      var errors = this.data.errors
      return require('./_errors.html')(errors)
    }
  }
})

window.onload = function () {
  var model = {
    contactUs: new ContactUs()
  }
  Dom.scan(document.body, model)
}
