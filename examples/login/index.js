var Dom = require('../..')
var template = require('./template.html')

var login = {
  enableButton: function (state) {
    state
      ? this.button.removeAttribute('disabled')
      : this.button.setAttribute('disabled', 'disabled')
  },
  template: template,
  on: {
    'keyup:input': function (e) {
      this.enableButton(this.email.value && this.password.value)
      // console.log('click login form input', this, e, data, this.form.but)
    },
    'submit:form': function (e) {
      e.preventDefault()
      var el = e.target

      el.dispatchEvent(new window.CustomEvent('loggedin', {
        detail: {
          component: this
        },
        bubbles: true,
        cancelable: false
      }))
    }
  }
}

module.exports = Dom.register('login', login)
