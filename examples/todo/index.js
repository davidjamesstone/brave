var Dom = require('../..')
var itemTemplate = require('./_item.html')
var listTemplate = require('./_list.html')
var menuItemTemplate = require('./_menu-item.html')

require('../login')

var item = {
  updateDisplayText: function () {
    this.display.innerHTML = this.displayText()
  },
  displayText: function () {
    return '(' + this.data.text + ')'
  },
  template: itemTemplate,
  on: {
    'input:input[type=text]': function (e) {
      this.data.text = e.target.value
      this.updateDisplayText()
    },
    'change:input[type=checkbox]': function (e) {
      this.data.completed = e.target.checked
      this.setClearButtonState()
    }
  }
}

var list = {
  initialize: function () {
    // Create some common used properties
    this.todos = this.data.todos
    this.newTodo = this.data.newTodo
  },
  get hasCompleted () {
    return !!this.todos.find(function (item) {
      return item.completed
    })
  },
  get isNewTodoValid () {
    return !!this.newTodo.text
  },
  setAddButtonState: function () {
    this.addTodo.disabled = !this.isNewTodoValid
  },
  setClearButtonState: function () {
    this.clearTodos.disabled = !this.hasCompleted
  },
  template: listTemplate,
  clearCompleted: function () {
    var todos = this.data.todos
    var length = todos.length
    for (var i = length - 1; i >= 0; i--) {
      if (todos[i].completed) {
        todos.splice(i, 1)
        this.body.rows[i].remove()
      }
    }
    this.setClearButtonState()
  },
  on: {
    'input:input#new-todo': function (e) {
      this.newTodo.text = e.target.value
      this.setAddButtonState()
    },
    'click:button#clear-todos': function (e) {
      this.clearCompleted()
    },
    'click:button#add-todo': function (e) {
      var todos = this.data.todos

      // Create a new todo
      var todo = {
        text: this.newTodoText.value,
        completed: false
      }
      this.newTodo.text = ''
      this.newTodoText.value = ''
      this.setAddButtonState()
      this.newTodoText.focus()

      todos.push(todo)

      // Create te new row and initialize
      var row = this.body.insertRow()
      row.setAttribute('item', 'todos[' + (todos.length - 1) + ']')
      Dom.scan(row, todo, this)
    }
  }
}

var menuItem = {
  template: menuItemTemplate,
  on: {
    'click': function (e) {
      e.preventDefault()
    }
  }
}

var menu = {
  isolate: true,
  template: '<ul><li menu-item="menu[0]"></li><li menu-item="menu[1]"></li</ul>',
  on: {
    'click': function () {
      console.log('menu clicked')
    }
  }
}

Dom.register({
  'list': list,
  'item': item,
  'menu': menu,
  'menu-item': menuItem,
  'app': {
    rootFn: function () {},
    on: {
      'loggedin': function (e) {
        console.log('Bubbled custom `loggedin` event', e)
      }
    }
  }
})

window.onload = function () {
  var app = {
    id: 1,
    name: 'My todo list',
    menu: [{ text: 'Home', url: '/home' }, { text: 'About', url: '/about' }],
    newTodo: { text: '', completed: false },
    todos: [{text: 'A', completed: false}, {text: 'B', completed: true}, {text: 'C', completed: false}],
    login: {email: 'hey', password: 'secret'}
  }

  Dom.scan(document.documentElement, app)

  window.app = app
}
