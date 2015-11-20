(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../..":7,"./template.html":2}],2:[function(require,module,exports){
module.exports = function anonymous(obj
/**/) {
var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<form>   <legend>Login form</legend>   Email: <input as="email"value="', data.email ,'" type="text" required><br>   Password: <input as="password" value="', data.password ,'" type="password" required>   <button as="button" type="submit">Login</button> </form> ');}return p.join('');
};
},{}],3:[function(require,module,exports){
module.exports = function anonymous(obj
/**/) {
var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<td>   <input type="text" value="', data.text ,'"> </td> <td>   <span as="display">', displayText() ,'</span> </td> <td>   <input type="checkbox" ', data.completed ? 'checked' : '' ,'> </td> ');}return p.join('');
};
},{}],4:[function(require,module,exports){
module.exports = function anonymous(obj
/**/) {
var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<table as="table">   <caption>', data.name ,'</caption>   <tbody as="body">     '); for (var i = 0; i < data.todos.length; i++) { p.push('       <tr item="todos[', i ,']"></tr>     '); } p.push('   </tbody>   <tfoot>     <tr>       <td><input id="new-todo" as="newTodoText" type="text" value="', data.newTodo.text ,'" placeholder="Add new todo"></td>       <td><button id="add-todo" as="addTodo" disabled>Add new</button></td>       <td><button id="clear-todos" as="clearTodos" ', hasCompleted ? '' : 'disabled' ,'>Clear completed</button></td>     </tr>   </tfoot> </table> ');}return p.join('');
};
},{}],5:[function(require,module,exports){
module.exports = function anonymous(obj
/**/) {
var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<li><a href="', data.url ,'">', data.text ,'</a></li> ');}return p.join('');
};
},{}],6:[function(require,module,exports){
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

},{"../..":7,"../login":1,"./_item.html":3,"./_list.html":4,"./_menu-item.html":5}],7:[function(require,module,exports){
var get = require('get-object-path')
var Delegate = require('dom-delegate').Delegate
var onEvents = Object.getOwnPropertyNames(document).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(document)))).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(window))).filter(function (i) {return !i.indexOf('on') && (document[i] == null || typeof document[i] == 'function');}).filter(function (elem, pos, self) {return self.indexOf(elem) == pos;})
var onEventsSelector = onEvents.map(function (key) {
  return '[' + key + ']:not([' + key + '=""])'
}).join(',')

function Register () {}
Object.defineProperties(Register.prototype, {
  selector: {
    get: function () {
      var keys = Object.keys(this)
      return keys.map(function (key) {
        return '[' + key + ']'
      }).join(', ')
    }
  },
  keys: {
    get: function () {
      return Object.keys(this)
    }
  }
})

var register = new Register()

function createContext (el, data, component, parent) {
  var ctx = Object.create(component.isolate ? {} : parent || {})

  var info = Object.create({}, {
    component: {
      value: component
    }
  })

  Object.defineProperties(ctx, {
    __: {
      value: info
    },
    el: {
      value: el
    }
  })

  ctx.data = data

  return ctx
}

var ignore = ['on', 'template', 'initialize', 'isolate']
function extend (obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function (source) {
    var descriptor, prop
    if (source) {
      for (prop in source) {
        if (source.hasOwnProperty(prop) && ignore.indexOf(prop) === -1) {
          descriptor = Object.getOwnPropertyDescriptor(source, prop)
          Object.defineProperty(obj, prop, descriptor)
        }
      }
    }
  })
  return obj
}

function getElementComponent (el) {
  var registerKeys = register.keys
  for (var i = 0; i < el.attributes.length; i++) {
    var idx = registerKeys.indexOf(el.attributes[i].name)
    if (idx > -1) {
      return {
        key: registerKeys[idx],
        component: register[registerKeys[idx]]
      }
    }
  }
}

function createElementDelegate (el, ctx, component) {
  var del = new Delegate(el)

  // Add event listeners
  var proxy = function (fn) {
    return function (e) {
      fn.call(ctx, e)
    }
  }

  for (var event in component.on) {
    if (component.on.hasOwnProperty(event)) {
      var colon = event.indexOf(':')
      var name, selector
      if (colon === -1) {
        name = event
        del.on(name, proxy(component.on[event]))
      } else {
        name = event.substr(0, colon)
        selector = event.substr(colon + 1)
        del.on(name, selector, proxy(component.on[event]))
      }
    }
  }

  return del
}

function getElementData (el, componentName, parent) {
  var attr = el.getAttribute(componentName)
  return attr && get(parent, attr)
}

function registerComponent (name, obj) {
  if (typeof name === 'object') {
    for (var key in name) {
      if (name.hasOwnProperty(key)) {
        register[key] = name[key]
      }
    }
  } else {
    register[name] = obj
  }
}

function nodeListToArray (nodeList) {
  var nodeArray = []
  for (var i = 0; i < nodeList.length; i++) {
    nodeArray.push(nodeList[i])
  }

  return nodeArray
}

function getMatchingElements (el, childrenOnly) {
  var selector = Dom._register.selector
  var matches = nodeListToArray(el.querySelectorAll(selector))

  if (!childrenOnly) {
    var component = getElementComponent(el)

    if (component) {
      matches.unshift(el)
    }
  }

  return matches
}

function findParentContext (el, contexts) {
  do {
    el = el.parentNode
    if (el) {
      for (var i = contexts.length - 1; i > -1; i--) {
        if (contexts[i].ctx.el === el) {
          return contexts[i].ctx
        }
      }
    }
  } while (el)
  }

  function setHtml (el, component, ctx) {
    var html = (typeof component.template === 'function')
      ? component.template.call(ctx, ctx)
      : component.template

    el.innerHTML = html
  }

  function renderer (currEl, component, ctx) {
    return function () {
      setHtml(currEl, component, ctx)
      Dom.scan(currEl, ctx.data, ctx, true)
    }
  }

  function scan (el, data, parent, childrenOnly) {
    var matches = getMatchingElements(el, childrenOnly)
    var contexts = []
    if (parent) {
      contexts.push({ctx: parent})
    }

    var currEl
    while (matches.length) {
      currEl = matches.shift()
      var ref = getElementComponent(currEl)
      var component = ref.component
      var parentContext = findParentContext(currEl, contexts) || parent
      var parentData = parentContext ? parentContext.data : data
      var elData = getElementData(currEl, ref.key, parentData) || parentData
      var ctx = createContext(currEl, elData, component, parentContext)
      var del = createElementDelegate(currEl, ctx, component)

      Object.defineProperty(ctx.__, 'del', { value: del })

      extend(ctx, component)

      contexts.push({
        key: ref.key, ctx: ctx, initialize: component.initialize,
        template: component.template, component: component, el: currEl
      })
    }

    var i, j
    var processed = []
    for (i = contexts.length - 1; i >= 0; i--) {
      var aliasContext = contexts[i].ctx
      var aliasEl = aliasContext.el
      var aliases = aliasEl.querySelectorAll('[as]:not([as=""])')
      for (j = 0; j < aliases.length; j++) {
        if (processed.indexOf(aliases[j]) < 0) {
          var attr = aliases[j].getAttribute('as')
          aliasContext[attr] = aliases[j]
          processed.push(aliases[j])
        }
      }
    }

    // processed = []
    // for (i = contexts.length - 1; i >= 0; i--) {
    //   var onContext = contexts[i].ctx
    //   var onEl = onContext.el
    //   var ons = onEl.querySelectorAll('[onclick]:not([onclick=""])')
    //   for (j = 0; j < ons.length; j++) {
    //     if (processed.indexOf(ons[j]) < 0) {
    //       attr = ons[j].getAttribute('onclick')
    //       // var fn = ons[j].onclick
    //       var fn = new Function('with (this) {\n\treturn ' + attr + '\n}')
    //       ons[j].onclick = fn.bind(onContext)
    //       processed.push(ons[j])
    //     }
    //   }
    // }
    processed = []
    for (i = contexts.length - 1; i >= 0; i--) {
      var onContext = contexts[i].ctx
      var onEl = onContext.el
      var ons = nodeListToArray(onEl.querySelectorAll(onEventsSelector))
      ons.unshift(onEl)
      for (j = 0; j < ons.length; j++) {
        if (processed.indexOf(ons[j]) < 0) {
          processed.push(ons[j])
          for (var k = 0; k < onEvents.length; k++) {
            if (ons[j].attributes[onEvents[k]]) {
              attr = ons[j].attributes[onEvents[k]].value
              // var fn = ons[j].onclick
              // var fn = new Function('e', 'with (this) {\n\treturn ' + attr + '\n}')
              // ons[j][onEvents[k]] = fn.bind(onContext)
              function handler (fn, ctx) {
                return function (e) {
                  return fn.call(this, e, ctx)
                }
              }

              var fn = new Function('e, ctx', 'with (ctx) {\n\treturn ' + attr + '\n}')
              ons[j][onEvents[k]] = handler(fn, onContext)
            }
          }
        }
      }
    }

    for (i = 0; i < contexts.length; i++) {
      if (contexts[i].initialize) {
        contexts[i].initialize.call(contexts[i].ctx)
      }
    }

    for (i = 0; i < contexts.length; i++) {
      if (contexts[i].template) {
        var render = renderer(contexts[i].ctx.el, contexts[i].component, contexts[i].ctx)
        render()
        contexts[i].ctx.render = render
      }
    }
  }

  var Dom = Object.create({}, {
    _register: { value: register },
    register: { value: registerComponent },
    scan: { value: scan }
  })

  module.exports = Dom

},{"dom-delegate":9,"get-object-path":10}],8:[function(require,module,exports){
/*jshint browser:true, node:true*/

'use strict';

module.exports = Delegate;

/**
 * DOM event delegator
 *
 * The delegator will listen
 * for events that bubble up
 * to the root node.
 *
 * @constructor
 * @param {Node|string} [root] The root node or a selector string matching the root node
 */
function Delegate(root) {

  /**
   * Maintain a map of listener
   * lists, keyed by event name.
   *
   * @type Object
   */
  this.listenerMap = [{}, {}];
  if (root) {
    this.root(root);
  }

  /** @type function() */
  this.handle = Delegate.prototype.handle.bind(this);
}

/**
 * Start listening for events
 * on the provided DOM element
 *
 * @param  {Node|string} [root] The root node or a selector string matching the root node
 * @returns {Delegate} This method is chainable
 */
Delegate.prototype.root = function(root) {
  var listenerMap = this.listenerMap;
  var eventType;

  // Remove master event listeners
  if (this.rootElement) {
    for (eventType in listenerMap[1]) {
      if (listenerMap[1].hasOwnProperty(eventType)) {
        this.rootElement.removeEventListener(eventType, this.handle, true);
      }
    }
    for (eventType in listenerMap[0]) {
      if (listenerMap[0].hasOwnProperty(eventType)) {
        this.rootElement.removeEventListener(eventType, this.handle, false);
      }
    }
  }

  // If no root or root is not
  // a dom node, then remove internal
  // root reference and exit here
  if (!root || !root.addEventListener) {
    if (this.rootElement) {
      delete this.rootElement;
    }
    return this;
  }

  /**
   * The root node at which
   * listeners are attached.
   *
   * @type Node
   */
  this.rootElement = root;

  // Set up master event listeners
  for (eventType in listenerMap[1]) {
    if (listenerMap[1].hasOwnProperty(eventType)) {
      this.rootElement.addEventListener(eventType, this.handle, true);
    }
  }
  for (eventType in listenerMap[0]) {
    if (listenerMap[0].hasOwnProperty(eventType)) {
      this.rootElement.addEventListener(eventType, this.handle, false);
    }
  }

  return this;
};

/**
 * @param {string} eventType
 * @returns boolean
 */
Delegate.prototype.captureForType = function(eventType) {
  return ['blur', 'error', 'focus', 'load', 'resize', 'scroll'].indexOf(eventType) !== -1;
};

/**
 * Attach a handler to one
 * event for all elements
 * that match the selector,
 * now or in the future
 *
 * The handler function receives
 * three arguments: the DOM event
 * object, the node that matched
 * the selector while the event
 * was bubbling and a reference
 * to itself. Within the handler,
 * 'this' is equal to the second
 * argument.
 *
 * The node that actually received
 * the event can be accessed via
 * 'event.target'.
 *
 * @param {string} eventType Listen for these events
 * @param {string|undefined} selector Only handle events on elements matching this selector, if undefined match root element
 * @param {function()} handler Handler function - event data passed here will be in event.data
 * @param {Object} [eventData] Data to pass in event.data
 * @returns {Delegate} This method is chainable
 */
Delegate.prototype.on = function(eventType, selector, handler, useCapture) {
  var root, listenerMap, matcher, matcherParam;

  if (!eventType) {
    throw new TypeError('Invalid event type: ' + eventType);
  }

  // handler can be passed as
  // the second or third argument
  if (typeof selector === 'function') {
    useCapture = handler;
    handler = selector;
    selector = null;
  }

  // Fallback to sensible defaults
  // if useCapture not set
  if (useCapture === undefined) {
    useCapture = this.captureForType(eventType);
  }

  if (typeof handler !== 'function') {
    throw new TypeError('Handler must be a type of Function');
  }

  root = this.rootElement;
  listenerMap = this.listenerMap[useCapture ? 1 : 0];

  // Add master handler for type if not created yet
  if (!listenerMap[eventType]) {
    if (root) {
      root.addEventListener(eventType, this.handle, useCapture);
    }
    listenerMap[eventType] = [];
  }

  if (!selector) {
    matcherParam = null;

    // COMPLEX - matchesRoot needs to have access to
    // this.rootElement, so bind the function to this.
    matcher = matchesRoot.bind(this);

  // Compile a matcher for the given selector
  } else if (/^[a-z]+$/i.test(selector)) {
    matcherParam = selector;
    matcher = matchesTag;
  } else if (/^#[a-z0-9\-_]+$/i.test(selector)) {
    matcherParam = selector.slice(1);
    matcher = matchesId;
  } else {
    matcherParam = selector;
    matcher = matches;
  }

  // Add to the list of listeners
  listenerMap[eventType].push({
    selector: selector,
    handler: handler,
    matcher: matcher,
    matcherParam: matcherParam
  });

  return this;
};

/**
 * Remove an event handler
 * for elements that match
 * the selector, forever
 *
 * @param {string} [eventType] Remove handlers for events matching this type, considering the other parameters
 * @param {string} [selector] If this parameter is omitted, only handlers which match the other two will be removed
 * @param {function()} [handler] If this parameter is omitted, only handlers which match the previous two will be removed
 * @returns {Delegate} This method is chainable
 */
Delegate.prototype.off = function(eventType, selector, handler, useCapture) {
  var i, listener, listenerMap, listenerList, singleEventType;

  // Handler can be passed as
  // the second or third argument
  if (typeof selector === 'function') {
    useCapture = handler;
    handler = selector;
    selector = null;
  }

  // If useCapture not set, remove
  // all event listeners
  if (useCapture === undefined) {
    this.off(eventType, selector, handler, true);
    this.off(eventType, selector, handler, false);
    return this;
  }

  listenerMap = this.listenerMap[useCapture ? 1 : 0];
  if (!eventType) {
    for (singleEventType in listenerMap) {
      if (listenerMap.hasOwnProperty(singleEventType)) {
        this.off(singleEventType, selector, handler);
      }
    }

    return this;
  }

  listenerList = listenerMap[eventType];
  if (!listenerList || !listenerList.length) {
    return this;
  }

  // Remove only parameter matches
  // if specified
  for (i = listenerList.length - 1; i >= 0; i--) {
    listener = listenerList[i];

    if ((!selector || selector === listener.selector) && (!handler || handler === listener.handler)) {
      listenerList.splice(i, 1);
    }
  }

  // All listeners removed
  if (!listenerList.length) {
    delete listenerMap[eventType];

    // Remove the main handler
    if (this.rootElement) {
      this.rootElement.removeEventListener(eventType, this.handle, useCapture);
    }
  }

  return this;
};


/**
 * Handle an arbitrary event.
 *
 * @param {Event} event
 */
Delegate.prototype.handle = function(event) {
  var i, l, type = event.type, root, phase, listener, returned, listenerList = [], target, /** @const */ EVENTIGNORE = 'ftLabsDelegateIgnore';

  if (event[EVENTIGNORE] === true) {
    return;
  }

  target = event.target;

  // Hardcode value of Node.TEXT_NODE
  // as not defined in IE8
  if (target.nodeType === 3) {
    target = target.parentNode;
  }

  root = this.rootElement;

  phase = event.eventPhase || ( event.target !== event.currentTarget ? 3 : 2 );
  
  switch (phase) {
    case 1: //Event.CAPTURING_PHASE:
      listenerList = this.listenerMap[1][type];
    break;
    case 2: //Event.AT_TARGET:
      if (this.listenerMap[0] && this.listenerMap[0][type]) listenerList = listenerList.concat(this.listenerMap[0][type]);
      if (this.listenerMap[1] && this.listenerMap[1][type]) listenerList = listenerList.concat(this.listenerMap[1][type]);
    break;
    case 3: //Event.BUBBLING_PHASE:
      listenerList = this.listenerMap[0][type];
    break;
  }

  // Need to continuously check
  // that the specific list is
  // still populated in case one
  // of the callbacks actually
  // causes the list to be destroyed.
  l = listenerList.length;
  while (target && l) {
    for (i = 0; i < l; i++) {
      listener = listenerList[i];

      // Bail from this loop if
      // the length changed and
      // no more listeners are
      // defined between i and l.
      if (!listener) {
        break;
      }

      // Check for match and fire
      // the event if there's one
      //
      // TODO:MCG:20120117: Need a way
      // to check if event#stopImmediatePropagation
      // was called. If so, break both loops.
      if (listener.matcher.call(target, listener.matcherParam, target)) {
        returned = this.fire(event, target, listener);
      }

      // Stop propagation to subsequent
      // callbacks if the callback returned
      // false
      if (returned === false) {
        event[EVENTIGNORE] = true;
        event.preventDefault();
        return;
      }
    }

    // TODO:MCG:20120117: Need a way to
    // check if event#stopPropagation
    // was called. If so, break looping
    // through the DOM. Stop if the
    // delegation root has been reached
    if (target === root) {
      break;
    }

    l = listenerList.length;
    target = target.parentElement;
  }
};

/**
 * Fire a listener on a target.
 *
 * @param {Event} event
 * @param {Node} target
 * @param {Object} listener
 * @returns {boolean}
 */
Delegate.prototype.fire = function(event, target, listener) {
  return listener.handler.call(target, event, target);
};

/**
 * Check whether an element
 * matches a generic selector.
 *
 * @type function()
 * @param {string} selector A CSS selector
 */
var matches = (function(el) {
  if (!el) return;
  var p = el.prototype;
  return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector);
}(Element));

/**
 * Check whether an element
 * matches a tag selector.
 *
 * Tags are NOT case-sensitive,
 * except in XML (and XML-based
 * languages such as XHTML).
 *
 * @param {string} tagName The tag name to test against
 * @param {Element} element The element to test with
 * @returns boolean
 */
function matchesTag(tagName, element) {
  return tagName.toLowerCase() === element.tagName.toLowerCase();
}

/**
 * Check whether an element
 * matches the root.
 *
 * @param {?String} selector In this case this is always passed through as null and not used
 * @param {Element} element The element to test with
 * @returns boolean
 */
function matchesRoot(selector, element) {
  /*jshint validthis:true*/
  if (this.rootElement === window) return element === document;
  return this.rootElement === element;
}

/**
 * Check whether the ID of
 * the element in 'this'
 * matches the given ID.
 *
 * IDs are case-sensitive.
 *
 * @param {string} id The ID to test against
 * @param {Element} element The element to test with
 * @returns boolean
 */
function matchesId(id, element) {
  return id === element.id;
}

/**
 * Short hand for off()
 * and root(), ie both
 * with no parameters
 *
 * @return void
 */
Delegate.prototype.destroy = function() {
  this.off();
  this.root();
};

},{}],9:[function(require,module,exports){
/*jshint browser:true, node:true*/

'use strict';

/**
 * @preserve Create and manage a DOM event delegator.
 *
 * @version 0.3.0
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */
var Delegate = require('./delegate');

module.exports = function(root) {
  return new Delegate(root);
};

module.exports.Delegate = Delegate;

},{"./delegate":8}],10:[function(require,module,exports){
module.exports = get;

function get (context, path) {
  if (path.indexOf('.') == -1 && path.indexOf('[') == -1) {
    return context[path];
  }

  var crumbs = path.split(/\.|\[|\]/g);
  var i = -1;
  var len = crumbs.length;
  var result;

  while (++i < len) {
    if (i == 0) result = context;
    if (!crumbs[i]) continue;
    if (result == undefined) break;
    result = result[crumbs[i]];
  }

  return result;
}

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9sb2dpbi9pbmRleC5qcyIsImV4YW1wbGVzL2xvZ2luL3RlbXBsYXRlLmh0bWwiLCJleGFtcGxlcy90b2RvL19pdGVtLmh0bWwiLCJleGFtcGxlcy90b2RvL19saXN0Lmh0bWwiLCJleGFtcGxlcy90b2RvL19tZW51LWl0ZW0uaHRtbCIsImV4YW1wbGVzL3RvZG8vaW5kZXguanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20tZGVsZWdhdGUvbGliL2RlbGVnYXRlLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1kZWxlZ2F0ZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ2V0LW9iamVjdC1wYXRoL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBEb20gPSByZXF1aXJlKCcuLi8uLicpXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlLmh0bWwnKVxuXG52YXIgbG9naW4gPSB7XG4gIGVuYWJsZUJ1dHRvbjogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgc3RhdGVcbiAgICAgID8gdGhpcy5idXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICA6IHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKVxuICB9LFxuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIG9uOiB7XG4gICAgJ2tleXVwOmlucHV0JzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuZW5hYmxlQnV0dG9uKHRoaXMuZW1haWwudmFsdWUgJiYgdGhpcy5wYXNzd29yZC52YWx1ZSlcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdjbGljayBsb2dpbiBmb3JtIGlucHV0JywgdGhpcywgZSwgZGF0YSwgdGhpcy5mb3JtLmJ1dClcbiAgICB9LFxuICAgICdzdWJtaXQ6Zm9ybSc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHZhciBlbCA9IGUudGFyZ2V0XG5cbiAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IHdpbmRvdy5DdXN0b21FdmVudCgnbG9nZ2VkaW4nLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGNvbXBvbmVudDogdGhpc1xuICAgICAgICB9LFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZVxuICAgICAgfSkpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRG9tLnJlZ2lzdGVyKCdsb2dpbicsIGxvZ2luKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhbm9ueW1vdXMob2JqXG4vKiovKSB7XG52YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTt3aXRoKG9iail7cC5wdXNoKCc8Zm9ybT4gICA8bGVnZW5kPkxvZ2luIGZvcm08L2xlZ2VuZD4gICBFbWFpbDogPGlucHV0IGFzPVwiZW1haWxcInZhbHVlPVwiJywgZGF0YS5lbWFpbCAsJ1wiIHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ+PGJyPiAgIFBhc3N3b3JkOiA8aW5wdXQgYXM9XCJwYXNzd29yZFwiIHZhbHVlPVwiJywgZGF0YS5wYXNzd29yZCAsJ1wiIHR5cGU9XCJwYXNzd29yZFwiIHJlcXVpcmVkPiAgIDxidXR0b24gYXM9XCJidXR0b25cIiB0eXBlPVwic3VibWl0XCI+TG9naW48L2J1dHRvbj4gPC9mb3JtPiAnKTt9cmV0dXJuIHAuam9pbignJyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYW5vbnltb3VzKG9ialxuLyoqLykge1xudmFyIHA9W10scHJpbnQ9ZnVuY3Rpb24oKXtwLnB1c2guYXBwbHkocCxhcmd1bWVudHMpO307d2l0aChvYmope3AucHVzaCgnPHRkPiAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJywgZGF0YS50ZXh0ICwnXCI+IDwvdGQ+IDx0ZD4gICA8c3BhbiBhcz1cImRpc3BsYXlcIj4nLCBkaXNwbGF5VGV4dCgpICwnPC9zcGFuPiA8L3RkPiA8dGQ+ICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiICcsIGRhdGEuY29tcGxldGVkID8gJ2NoZWNrZWQnIDogJycgLCc+IDwvdGQ+ICcpO31yZXR1cm4gcC5qb2luKCcnKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhbm9ueW1vdXMob2JqXG4vKiovKSB7XG52YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTt3aXRoKG9iail7cC5wdXNoKCc8dGFibGUgYXM9XCJ0YWJsZVwiPiAgIDxjYXB0aW9uPicsIGRhdGEubmFtZSAsJzwvY2FwdGlvbj4gICA8dGJvZHkgYXM9XCJib2R5XCI+ICAgICAnKTsgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnRvZG9zLmxlbmd0aDsgaSsrKSB7IHAucHVzaCgnICAgICAgIDx0ciBpdGVtPVwidG9kb3NbJywgaSAsJ11cIj48L3RyPiAgICAgJyk7IH0gcC5wdXNoKCcgICA8L3Rib2R5PiAgIDx0Zm9vdD4gICAgIDx0cj4gICAgICAgPHRkPjxpbnB1dCBpZD1cIm5ldy10b2RvXCIgYXM9XCJuZXdUb2RvVGV4dFwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCInLCBkYXRhLm5ld1RvZG8udGV4dCAsJ1wiIHBsYWNlaG9sZGVyPVwiQWRkIG5ldyB0b2RvXCI+PC90ZD4gICAgICAgPHRkPjxidXR0b24gaWQ9XCJhZGQtdG9kb1wiIGFzPVwiYWRkVG9kb1wiIGRpc2FibGVkPkFkZCBuZXc8L2J1dHRvbj48L3RkPiAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImNsZWFyLXRvZG9zXCIgYXM9XCJjbGVhclRvZG9zXCIgJywgaGFzQ29tcGxldGVkID8gJycgOiAnZGlzYWJsZWQnICwnPkNsZWFyIGNvbXBsZXRlZDwvYnV0dG9uPjwvdGQ+ICAgICA8L3RyPiAgIDwvdGZvb3Q+IDwvdGFibGU+ICcpO31yZXR1cm4gcC5qb2luKCcnKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhbm9ueW1vdXMob2JqXG4vKiovKSB7XG52YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTt3aXRoKG9iail7cC5wdXNoKCc8bGk+PGEgaHJlZj1cIicsIGRhdGEudXJsICwnXCI+JywgZGF0YS50ZXh0ICwnPC9hPjwvbGk+ICcpO31yZXR1cm4gcC5qb2luKCcnKTtcbn07IiwidmFyIERvbSA9IHJlcXVpcmUoJy4uLy4uJylcbnZhciBpdGVtVGVtcGxhdGUgPSByZXF1aXJlKCcuL19pdGVtLmh0bWwnKVxudmFyIGxpc3RUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vX2xpc3QuaHRtbCcpXG52YXIgbWVudUl0ZW1UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vX21lbnUtaXRlbS5odG1sJylcblxucmVxdWlyZSgnLi4vbG9naW4nKVxuXG52YXIgaXRlbSA9IHtcbiAgdXBkYXRlRGlzcGxheVRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmRpc3BsYXkuaW5uZXJIVE1MID0gdGhpcy5kaXNwbGF5VGV4dCgpXG4gIH0sXG4gIGRpc3BsYXlUZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcoJyArIHRoaXMuZGF0YS50ZXh0ICsgJyknXG4gIH0sXG4gIHRlbXBsYXRlOiBpdGVtVGVtcGxhdGUsXG4gIG9uOiB7XG4gICAgJ2lucHV0OmlucHV0W3R5cGU9dGV4dF0nOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5kYXRhLnRleHQgPSBlLnRhcmdldC52YWx1ZVxuICAgICAgdGhpcy51cGRhdGVEaXNwbGF5VGV4dCgpXG4gICAgfSxcbiAgICAnY2hhbmdlOmlucHV0W3R5cGU9Y2hlY2tib3hdJzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuZGF0YS5jb21wbGV0ZWQgPSBlLnRhcmdldC5jaGVja2VkXG4gICAgICB0aGlzLnNldENsZWFyQnV0dG9uU3RhdGUoKVxuICAgIH1cbiAgfVxufVxuXG52YXIgbGlzdCA9IHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIC8vIENyZWF0ZSBzb21lIGNvbW1vbiB1c2VkIHByb3BlcnRpZXNcbiAgICB0aGlzLnRvZG9zID0gdGhpcy5kYXRhLnRvZG9zXG4gICAgdGhpcy5uZXdUb2RvID0gdGhpcy5kYXRhLm5ld1RvZG9cbiAgfSxcbiAgZ2V0IGhhc0NvbXBsZXRlZCAoKSB7XG4gICAgcmV0dXJuICEhdGhpcy50b2Rvcy5maW5kKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5jb21wbGV0ZWRcbiAgICB9KVxuICB9LFxuICBnZXQgaXNOZXdUb2RvVmFsaWQgKCkge1xuICAgIHJldHVybiAhIXRoaXMubmV3VG9kby50ZXh0XG4gIH0sXG4gIHNldEFkZEJ1dHRvblN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hZGRUb2RvLmRpc2FibGVkID0gIXRoaXMuaXNOZXdUb2RvVmFsaWRcbiAgfSxcbiAgc2V0Q2xlYXJCdXR0b25TdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY2xlYXJUb2Rvcy5kaXNhYmxlZCA9ICF0aGlzLmhhc0NvbXBsZXRlZFxuICB9LFxuICB0ZW1wbGF0ZTogbGlzdFRlbXBsYXRlLFxuICBjbGVhckNvbXBsZXRlZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0b2RvcyA9IHRoaXMuZGF0YS50b2Rvc1xuICAgIHZhciBsZW5ndGggPSB0b2Rvcy5sZW5ndGhcbiAgICBmb3IgKHZhciBpID0gbGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmICh0b2Rvc1tpXS5jb21wbGV0ZWQpIHtcbiAgICAgICAgdG9kb3Muc3BsaWNlKGksIDEpXG4gICAgICAgIHRoaXMuYm9keS5yb3dzW2ldLnJlbW92ZSgpXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2V0Q2xlYXJCdXR0b25TdGF0ZSgpXG4gIH0sXG4gIG9uOiB7XG4gICAgJ2lucHV0OmlucHV0I25ldy10b2RvJzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMubmV3VG9kby50ZXh0ID0gZS50YXJnZXQudmFsdWVcbiAgICAgIHRoaXMuc2V0QWRkQnV0dG9uU3RhdGUoKVxuICAgIH0sXG4gICAgJ2NsaWNrOmJ1dHRvbiNjbGVhci10b2Rvcyc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLmNsZWFyQ29tcGxldGVkKClcbiAgICB9LFxuICAgICdjbGljazpidXR0b24jYWRkLXRvZG8nOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHRvZG9zID0gdGhpcy5kYXRhLnRvZG9zXG5cbiAgICAgIC8vIENyZWF0ZSBhIG5ldyB0b2RvXG4gICAgICB2YXIgdG9kbyA9IHtcbiAgICAgICAgdGV4dDogdGhpcy5uZXdUb2RvVGV4dC52YWx1ZSxcbiAgICAgICAgY29tcGxldGVkOiBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy5uZXdUb2RvLnRleHQgPSAnJ1xuICAgICAgdGhpcy5uZXdUb2RvVGV4dC52YWx1ZSA9ICcnXG4gICAgICB0aGlzLnNldEFkZEJ1dHRvblN0YXRlKClcbiAgICAgIHRoaXMubmV3VG9kb1RleHQuZm9jdXMoKVxuXG4gICAgICB0b2Rvcy5wdXNoKHRvZG8pXG5cbiAgICAgIC8vIENyZWF0ZSB0ZSBuZXcgcm93IGFuZCBpbml0aWFsaXplXG4gICAgICB2YXIgcm93ID0gdGhpcy5ib2R5Lmluc2VydFJvdygpXG4gICAgICByb3cuc2V0QXR0cmlidXRlKCdpdGVtJywgJ3RvZG9zWycgKyAodG9kb3MubGVuZ3RoIC0gMSkgKyAnXScpXG4gICAgICBEb20uc2Nhbihyb3csIHRvZG8sIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbnZhciBtZW51SXRlbSA9IHtcbiAgdGVtcGxhdGU6IG1lbnVJdGVtVGVtcGxhdGUsXG4gIG9uOiB7XG4gICAgJ2NsaWNrJzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIH1cbiAgfVxufVxuXG52YXIgbWVudSA9IHtcbiAgaXNvbGF0ZTogdHJ1ZSxcbiAgdGVtcGxhdGU6ICc8dWw+PGxpIG1lbnUtaXRlbT1cIm1lbnVbMF1cIj48L2xpPjxsaSBtZW51LWl0ZW09XCJtZW51WzFdXCI+PC9saTwvdWw+JyxcbiAgb246IHtcbiAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnbWVudSBjbGlja2VkJylcbiAgICB9XG4gIH1cbn1cblxuRG9tLnJlZ2lzdGVyKHtcbiAgJ2xpc3QnOiBsaXN0LFxuICAnaXRlbSc6IGl0ZW0sXG4gICdtZW51JzogbWVudSxcbiAgJ21lbnUtaXRlbSc6IG1lbnVJdGVtLFxuICAnYXBwJzoge1xuICAgIHJvb3RGbjogZnVuY3Rpb24gKCkge30sXG4gICAgb246IHtcbiAgICAgICdsb2dnZWRpbic6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdCdWJibGVkIGN1c3RvbSBgbG9nZ2VkaW5gIGV2ZW50JywgZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcHAgPSB7XG4gICAgaWQ6IDEsXG4gICAgbmFtZTogJ015IHRvZG8gbGlzdCcsXG4gICAgbWVudTogW3sgdGV4dDogJ0hvbWUnLCB1cmw6ICcvaG9tZScgfSwgeyB0ZXh0OiAnQWJvdXQnLCB1cmw6ICcvYWJvdXQnIH1dLFxuICAgIG5ld1RvZG86IHsgdGV4dDogJycsIGNvbXBsZXRlZDogZmFsc2UgfSxcbiAgICB0b2RvczogW3t0ZXh0OiAnQScsIGNvbXBsZXRlZDogZmFsc2V9LCB7dGV4dDogJ0InLCBjb21wbGV0ZWQ6IHRydWV9LCB7dGV4dDogJ0MnLCBjb21wbGV0ZWQ6IGZhbHNlfV0sXG4gICAgbG9naW46IHtlbWFpbDogJ2hleScsIHBhc3N3b3JkOiAnc2VjcmV0J31cbiAgfVxuXG4gIERvbS5zY2FuKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgYXBwKVxuXG4gIHdpbmRvdy5hcHAgPSBhcHBcbn1cbiIsInZhciBnZXQgPSByZXF1aXJlKCdnZXQtb2JqZWN0LXBhdGgnKVxudmFyIERlbGVnYXRlID0gcmVxdWlyZSgnZG9tLWRlbGVnYXRlJykuRGVsZWdhdGVcbnZhciBvbkV2ZW50cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGRvY3VtZW50KS5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoT2JqZWN0LmdldFByb3RvdHlwZU9mKE9iamVjdC5nZXRQcm90b3R5cGVPZihkb2N1bWVudCkpKSkuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE9iamVjdC5nZXRQcm90b3R5cGVPZih3aW5kb3cpKSkuZmlsdGVyKGZ1bmN0aW9uIChpKSB7cmV0dXJuICFpLmluZGV4T2YoJ29uJykgJiYgKGRvY3VtZW50W2ldID09IG51bGwgfHwgdHlwZW9mIGRvY3VtZW50W2ldID09ICdmdW5jdGlvbicpO30pLmZpbHRlcihmdW5jdGlvbiAoZWxlbSwgcG9zLCBzZWxmKSB7cmV0dXJuIHNlbGYuaW5kZXhPZihlbGVtKSA9PSBwb3M7fSlcbnZhciBvbkV2ZW50c1NlbGVjdG9yID0gb25FdmVudHMubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdbJyArIGtleSArICddOm5vdChbJyArIGtleSArICc9XCJcIl0pJ1xufSkuam9pbignLCcpXG5cbmZ1bmN0aW9uIFJlZ2lzdGVyICgpIHt9XG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZWdpc3Rlci5wcm90b3R5cGUsIHtcbiAgc2VsZWN0b3I6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcylcbiAgICAgIHJldHVybiBrZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiAnWycgKyBrZXkgKyAnXSdcbiAgICAgIH0pLmpvaW4oJywgJylcbiAgICB9XG4gIH0sXG4gIGtleXM6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzKVxuICAgIH1cbiAgfVxufSlcblxudmFyIHJlZ2lzdGVyID0gbmV3IFJlZ2lzdGVyKClcblxuZnVuY3Rpb24gY3JlYXRlQ29udGV4dCAoZWwsIGRhdGEsIGNvbXBvbmVudCwgcGFyZW50KSB7XG4gIHZhciBjdHggPSBPYmplY3QuY3JlYXRlKGNvbXBvbmVudC5pc29sYXRlID8ge30gOiBwYXJlbnQgfHwge30pXG5cbiAgdmFyIGluZm8gPSBPYmplY3QuY3JlYXRlKHt9LCB7XG4gICAgY29tcG9uZW50OiB7XG4gICAgICB2YWx1ZTogY29tcG9uZW50XG4gICAgfVxuICB9KVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGN0eCwge1xuICAgIF9fOiB7XG4gICAgICB2YWx1ZTogaW5mb1xuICAgIH0sXG4gICAgZWw6IHtcbiAgICAgIHZhbHVlOiBlbFxuICAgIH1cbiAgfSlcblxuICBjdHguZGF0YSA9IGRhdGFcblxuICByZXR1cm4gY3R4XG59XG5cbnZhciBpZ25vcmUgPSBbJ29uJywgJ3RlbXBsYXRlJywgJ2luaXRpYWxpemUnLCAnaXNvbGF0ZSddXG5mdW5jdGlvbiBleHRlbmQgKG9iaikge1xuICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHZhciBkZXNjcmlwdG9yLCBwcm9wXG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgZm9yIChwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3ApICYmIGlnbm9yZS5pbmRleE9mKHByb3ApID09PSAtMSkge1xuICAgICAgICAgIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgcHJvcClcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjcmlwdG9yKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KVxuICByZXR1cm4gb2JqXG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRDb21wb25lbnQgKGVsKSB7XG4gIHZhciByZWdpc3RlcktleXMgPSByZWdpc3Rlci5rZXlzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWwuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZHggPSByZWdpc3RlcktleXMuaW5kZXhPZihlbC5hdHRyaWJ1dGVzW2ldLm5hbWUpXG4gICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IHJlZ2lzdGVyS2V5c1tpZHhdLFxuICAgICAgICBjb21wb25lbnQ6IHJlZ2lzdGVyW3JlZ2lzdGVyS2V5c1tpZHhdXVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50RGVsZWdhdGUgKGVsLCBjdHgsIGNvbXBvbmVudCkge1xuICB2YXIgZGVsID0gbmV3IERlbGVnYXRlKGVsKVxuXG4gIC8vIEFkZCBldmVudCBsaXN0ZW5lcnNcbiAgdmFyIHByb3h5ID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgICBmbi5jYWxsKGN0eCwgZSlcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBldmVudCBpbiBjb21wb25lbnQub24pIHtcbiAgICBpZiAoY29tcG9uZW50Lm9uLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xuICAgICAgdmFyIGNvbG9uID0gZXZlbnQuaW5kZXhPZignOicpXG4gICAgICB2YXIgbmFtZSwgc2VsZWN0b3JcbiAgICAgIGlmIChjb2xvbiA9PT0gLTEpIHtcbiAgICAgICAgbmFtZSA9IGV2ZW50XG4gICAgICAgIGRlbC5vbihuYW1lLCBwcm94eShjb21wb25lbnQub25bZXZlbnRdKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgPSBldmVudC5zdWJzdHIoMCwgY29sb24pXG4gICAgICAgIHNlbGVjdG9yID0gZXZlbnQuc3Vic3RyKGNvbG9uICsgMSlcbiAgICAgICAgZGVsLm9uKG5hbWUsIHNlbGVjdG9yLCBwcm94eShjb21wb25lbnQub25bZXZlbnRdKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVsXG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnREYXRhIChlbCwgY29tcG9uZW50TmFtZSwgcGFyZW50KSB7XG4gIHZhciBhdHRyID0gZWwuZ2V0QXR0cmlidXRlKGNvbXBvbmVudE5hbWUpXG4gIHJldHVybiBhdHRyICYmIGdldChwYXJlbnQsIGF0dHIpXG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyQ29tcG9uZW50IChuYW1lLCBvYmopIHtcbiAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGtleSBpbiBuYW1lKSB7XG4gICAgICBpZiAobmFtZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHJlZ2lzdGVyW2tleV0gPSBuYW1lW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVnaXN0ZXJbbmFtZV0gPSBvYmpcbiAgfVxufVxuXG5mdW5jdGlvbiBub2RlTGlzdFRvQXJyYXkgKG5vZGVMaXN0KSB7XG4gIHZhciBub2RlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbm9kZUFycmF5LnB1c2gobm9kZUxpc3RbaV0pXG4gIH1cblxuICByZXR1cm4gbm9kZUFycmF5XG59XG5cbmZ1bmN0aW9uIGdldE1hdGNoaW5nRWxlbWVudHMgKGVsLCBjaGlsZHJlbk9ubHkpIHtcbiAgdmFyIHNlbGVjdG9yID0gRG9tLl9yZWdpc3Rlci5zZWxlY3RvclxuICB2YXIgbWF0Y2hlcyA9IG5vZGVMaXN0VG9BcnJheShlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcblxuICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgIHZhciBjb21wb25lbnQgPSBnZXRFbGVtZW50Q29tcG9uZW50KGVsKVxuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgbWF0Y2hlcy51bnNoaWZ0KGVsKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXRjaGVzXG59XG5cbmZ1bmN0aW9uIGZpbmRQYXJlbnRDb250ZXh0IChlbCwgY29udGV4dHMpIHtcbiAgZG8ge1xuICAgIGVsID0gZWwucGFyZW50Tm9kZVxuICAgIGlmIChlbCkge1xuICAgICAgZm9yICh2YXIgaSA9IGNvbnRleHRzLmxlbmd0aCAtIDE7IGkgPiAtMTsgaS0tKSB7XG4gICAgICAgIGlmIChjb250ZXh0c1tpXS5jdHguZWwgPT09IGVsKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHRzW2ldLmN0eFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IHdoaWxlIChlbClcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEh0bWwgKGVsLCBjb21wb25lbnQsIGN0eCkge1xuICAgIHZhciBodG1sID0gKHR5cGVvZiBjb21wb25lbnQudGVtcGxhdGUgPT09ICdmdW5jdGlvbicpXG4gICAgICA/IGNvbXBvbmVudC50ZW1wbGF0ZS5jYWxsKGN0eCwgY3R4KVxuICAgICAgOiBjb21wb25lbnQudGVtcGxhdGVcblxuICAgIGVsLmlubmVySFRNTCA9IGh0bWxcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcmVyIChjdXJyRWwsIGNvbXBvbmVudCwgY3R4KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNldEh0bWwoY3VyckVsLCBjb21wb25lbnQsIGN0eClcbiAgICAgIERvbS5zY2FuKGN1cnJFbCwgY3R4LmRhdGEsIGN0eCwgdHJ1ZSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzY2FuIChlbCwgZGF0YSwgcGFyZW50LCBjaGlsZHJlbk9ubHkpIHtcbiAgICB2YXIgbWF0Y2hlcyA9IGdldE1hdGNoaW5nRWxlbWVudHMoZWwsIGNoaWxkcmVuT25seSlcbiAgICB2YXIgY29udGV4dHMgPSBbXVxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGNvbnRleHRzLnB1c2goe2N0eDogcGFyZW50fSlcbiAgICB9XG5cbiAgICB2YXIgY3VyckVsXG4gICAgd2hpbGUgKG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgICBjdXJyRWwgPSBtYXRjaGVzLnNoaWZ0KClcbiAgICAgIHZhciByZWYgPSBnZXRFbGVtZW50Q29tcG9uZW50KGN1cnJFbClcbiAgICAgIHZhciBjb21wb25lbnQgPSByZWYuY29tcG9uZW50XG4gICAgICB2YXIgcGFyZW50Q29udGV4dCA9IGZpbmRQYXJlbnRDb250ZXh0KGN1cnJFbCwgY29udGV4dHMpIHx8IHBhcmVudFxuICAgICAgdmFyIHBhcmVudERhdGEgPSBwYXJlbnRDb250ZXh0ID8gcGFyZW50Q29udGV4dC5kYXRhIDogZGF0YVxuICAgICAgdmFyIGVsRGF0YSA9IGdldEVsZW1lbnREYXRhKGN1cnJFbCwgcmVmLmtleSwgcGFyZW50RGF0YSkgfHwgcGFyZW50RGF0YVxuICAgICAgdmFyIGN0eCA9IGNyZWF0ZUNvbnRleHQoY3VyckVsLCBlbERhdGEsIGNvbXBvbmVudCwgcGFyZW50Q29udGV4dClcbiAgICAgIHZhciBkZWwgPSBjcmVhdGVFbGVtZW50RGVsZWdhdGUoY3VyckVsLCBjdHgsIGNvbXBvbmVudClcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0eC5fXywgJ2RlbCcsIHsgdmFsdWU6IGRlbCB9KVxuXG4gICAgICBleHRlbmQoY3R4LCBjb21wb25lbnQpXG5cbiAgICAgIGNvbnRleHRzLnB1c2goe1xuICAgICAgICBrZXk6IHJlZi5rZXksIGN0eDogY3R4LCBpbml0aWFsaXplOiBjb21wb25lbnQuaW5pdGlhbGl6ZSxcbiAgICAgICAgdGVtcGxhdGU6IGNvbXBvbmVudC50ZW1wbGF0ZSwgY29tcG9uZW50OiBjb21wb25lbnQsIGVsOiBjdXJyRWxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdmFyIGksIGpcbiAgICB2YXIgcHJvY2Vzc2VkID0gW11cbiAgICBmb3IgKGkgPSBjb250ZXh0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGFsaWFzQ29udGV4dCA9IGNvbnRleHRzW2ldLmN0eFxuICAgICAgdmFyIGFsaWFzRWwgPSBhbGlhc0NvbnRleHQuZWxcbiAgICAgIHZhciBhbGlhc2VzID0gYWxpYXNFbC5xdWVyeVNlbGVjdG9yQWxsKCdbYXNdOm5vdChbYXM9XCJcIl0pJylcbiAgICAgIGZvciAoaiA9IDA7IGogPCBhbGlhc2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChwcm9jZXNzZWQuaW5kZXhPZihhbGlhc2VzW2pdKSA8IDApIHtcbiAgICAgICAgICB2YXIgYXR0ciA9IGFsaWFzZXNbal0uZ2V0QXR0cmlidXRlKCdhcycpXG4gICAgICAgICAgYWxpYXNDb250ZXh0W2F0dHJdID0gYWxpYXNlc1tqXVxuICAgICAgICAgIHByb2Nlc3NlZC5wdXNoKGFsaWFzZXNbal0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBwcm9jZXNzZWQgPSBbXVxuICAgIC8vIGZvciAoaSA9IGNvbnRleHRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgLy8gICB2YXIgb25Db250ZXh0ID0gY29udGV4dHNbaV0uY3R4XG4gICAgLy8gICB2YXIgb25FbCA9IG9uQ29udGV4dC5lbFxuICAgIC8vICAgdmFyIG9ucyA9IG9uRWwucXVlcnlTZWxlY3RvckFsbCgnW29uY2xpY2tdOm5vdChbb25jbGljaz1cIlwiXSknKVxuICAgIC8vICAgZm9yIChqID0gMDsgaiA8IG9ucy5sZW5ndGg7IGorKykge1xuICAgIC8vICAgICBpZiAocHJvY2Vzc2VkLmluZGV4T2Yob25zW2pdKSA8IDApIHtcbiAgICAvLyAgICAgICBhdHRyID0gb25zW2pdLmdldEF0dHJpYnV0ZSgnb25jbGljaycpXG4gICAgLy8gICAgICAgLy8gdmFyIGZuID0gb25zW2pdLm9uY2xpY2tcbiAgICAvLyAgICAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24oJ3dpdGggKHRoaXMpIHtcXG5cXHRyZXR1cm4gJyArIGF0dHIgKyAnXFxufScpXG4gICAgLy8gICAgICAgb25zW2pdLm9uY2xpY2sgPSBmbi5iaW5kKG9uQ29udGV4dClcbiAgICAvLyAgICAgICBwcm9jZXNzZWQucHVzaChvbnNbal0pXG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH1cbiAgICAvLyB9XG4gICAgcHJvY2Vzc2VkID0gW11cbiAgICBmb3IgKGkgPSBjb250ZXh0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIG9uQ29udGV4dCA9IGNvbnRleHRzW2ldLmN0eFxuICAgICAgdmFyIG9uRWwgPSBvbkNvbnRleHQuZWxcbiAgICAgIHZhciBvbnMgPSBub2RlTGlzdFRvQXJyYXkob25FbC5xdWVyeVNlbGVjdG9yQWxsKG9uRXZlbnRzU2VsZWN0b3IpKVxuICAgICAgb25zLnVuc2hpZnQob25FbClcbiAgICAgIGZvciAoaiA9IDA7IGogPCBvbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHByb2Nlc3NlZC5pbmRleE9mKG9uc1tqXSkgPCAwKSB7XG4gICAgICAgICAgcHJvY2Vzc2VkLnB1c2gob25zW2pdKVxuICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgb25FdmVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChvbnNbal0uYXR0cmlidXRlc1tvbkV2ZW50c1trXV0pIHtcbiAgICAgICAgICAgICAgYXR0ciA9IG9uc1tqXS5hdHRyaWJ1dGVzW29uRXZlbnRzW2tdXS52YWx1ZVxuICAgICAgICAgICAgICAvLyB2YXIgZm4gPSBvbnNbal0ub25jbGlja1xuICAgICAgICAgICAgICAvLyB2YXIgZm4gPSBuZXcgRnVuY3Rpb24oJ2UnLCAnd2l0aCAodGhpcykge1xcblxcdHJldHVybiAnICsgYXR0ciArICdcXG59JylcbiAgICAgICAgICAgICAgLy8gb25zW2pdW29uRXZlbnRzW2tdXSA9IGZuLmJpbmQob25Db250ZXh0KVxuICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVyIChmbiwgY3R4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlLCBjdHgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIGZuID0gbmV3IEZ1bmN0aW9uKCdlLCBjdHgnLCAnd2l0aCAoY3R4KSB7XFxuXFx0cmV0dXJuICcgKyBhdHRyICsgJ1xcbn0nKVxuICAgICAgICAgICAgICBvbnNbal1bb25FdmVudHNba11dID0gaGFuZGxlcihmbiwgb25Db250ZXh0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBjb250ZXh0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNvbnRleHRzW2ldLmluaXRpYWxpemUpIHtcbiAgICAgICAgY29udGV4dHNbaV0uaW5pdGlhbGl6ZS5jYWxsKGNvbnRleHRzW2ldLmN0eClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgY29udGV4dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjb250ZXh0c1tpXS50ZW1wbGF0ZSkge1xuICAgICAgICB2YXIgcmVuZGVyID0gcmVuZGVyZXIoY29udGV4dHNbaV0uY3R4LmVsLCBjb250ZXh0c1tpXS5jb21wb25lbnQsIGNvbnRleHRzW2ldLmN0eClcbiAgICAgICAgcmVuZGVyKClcbiAgICAgICAgY29udGV4dHNbaV0uY3R4LnJlbmRlciA9IHJlbmRlclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBEb20gPSBPYmplY3QuY3JlYXRlKHt9LCB7XG4gICAgX3JlZ2lzdGVyOiB7IHZhbHVlOiByZWdpc3RlciB9LFxuICAgIHJlZ2lzdGVyOiB7IHZhbHVlOiByZWdpc3RlckNvbXBvbmVudCB9LFxuICAgIHNjYW46IHsgdmFsdWU6IHNjYW4gfVxuICB9KVxuXG4gIG1vZHVsZS5leHBvcnRzID0gRG9tXG4iLCIvKmpzaGludCBicm93c2VyOnRydWUsIG5vZGU6dHJ1ZSovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBEZWxlZ2F0ZTtcblxuLyoqXG4gKiBET00gZXZlbnQgZGVsZWdhdG9yXG4gKlxuICogVGhlIGRlbGVnYXRvciB3aWxsIGxpc3RlblxuICogZm9yIGV2ZW50cyB0aGF0IGJ1YmJsZSB1cFxuICogdG8gdGhlIHJvb3Qgbm9kZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7Tm9kZXxzdHJpbmd9IFtyb290XSBUaGUgcm9vdCBub2RlIG9yIGEgc2VsZWN0b3Igc3RyaW5nIG1hdGNoaW5nIHRoZSByb290IG5vZGVcbiAqL1xuZnVuY3Rpb24gRGVsZWdhdGUocm9vdCkge1xuXG4gIC8qKlxuICAgKiBNYWludGFpbiBhIG1hcCBvZiBsaXN0ZW5lclxuICAgKiBsaXN0cywga2V5ZWQgYnkgZXZlbnQgbmFtZS5cbiAgICpcbiAgICogQHR5cGUgT2JqZWN0XG4gICAqL1xuICB0aGlzLmxpc3RlbmVyTWFwID0gW3t9LCB7fV07XG4gIGlmIChyb290KSB7XG4gICAgdGhpcy5yb290KHJvb3QpO1xuICB9XG5cbiAgLyoqIEB0eXBlIGZ1bmN0aW9uKCkgKi9cbiAgdGhpcy5oYW5kbGUgPSBEZWxlZ2F0ZS5wcm90b3R5cGUuaGFuZGxlLmJpbmQodGhpcyk7XG59XG5cbi8qKlxuICogU3RhcnQgbGlzdGVuaW5nIGZvciBldmVudHNcbiAqIG9uIHRoZSBwcm92aWRlZCBET00gZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge05vZGV8c3RyaW5nfSBbcm9vdF0gVGhlIHJvb3Qgbm9kZSBvciBhIHNlbGVjdG9yIHN0cmluZyBtYXRjaGluZyB0aGUgcm9vdCBub2RlXG4gKiBAcmV0dXJucyB7RGVsZWdhdGV9IFRoaXMgbWV0aG9kIGlzIGNoYWluYWJsZVxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUucm9vdCA9IGZ1bmN0aW9uKHJvb3QpIHtcbiAgdmFyIGxpc3RlbmVyTWFwID0gdGhpcy5saXN0ZW5lck1hcDtcbiAgdmFyIGV2ZW50VHlwZTtcblxuICAvLyBSZW1vdmUgbWFzdGVyIGV2ZW50IGxpc3RlbmVyc1xuICBpZiAodGhpcy5yb290RWxlbWVudCkge1xuICAgIGZvciAoZXZlbnRUeXBlIGluIGxpc3RlbmVyTWFwWzFdKSB7XG4gICAgICBpZiAobGlzdGVuZXJNYXBbMV0uaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSkge1xuICAgICAgICB0aGlzLnJvb3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoZXZlbnRUeXBlIGluIGxpc3RlbmVyTWFwWzBdKSB7XG4gICAgICBpZiAobGlzdGVuZXJNYXBbMF0uaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSkge1xuICAgICAgICB0aGlzLnJvb3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIElmIG5vIHJvb3Qgb3Igcm9vdCBpcyBub3RcbiAgLy8gYSBkb20gbm9kZSwgdGhlbiByZW1vdmUgaW50ZXJuYWxcbiAgLy8gcm9vdCByZWZlcmVuY2UgYW5kIGV4aXQgaGVyZVxuICBpZiAoIXJvb3QgfHwgIXJvb3QuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLnJvb3RFbGVtZW50KSB7XG4gICAgICBkZWxldGUgdGhpcy5yb290RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJvb3Qgbm9kZSBhdCB3aGljaFxuICAgKiBsaXN0ZW5lcnMgYXJlIGF0dGFjaGVkLlxuICAgKlxuICAgKiBAdHlwZSBOb2RlXG4gICAqL1xuICB0aGlzLnJvb3RFbGVtZW50ID0gcm9vdDtcblxuICAvLyBTZXQgdXAgbWFzdGVyIGV2ZW50IGxpc3RlbmVyc1xuICBmb3IgKGV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcFsxXSkge1xuICAgIGlmIChsaXN0ZW5lck1hcFsxXS5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKSB7XG4gICAgICB0aGlzLnJvb3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIGZvciAoZXZlbnRUeXBlIGluIGxpc3RlbmVyTWFwWzBdKSB7XG4gICAgaWYgKGxpc3RlbmVyTWFwWzBdLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpIHtcbiAgICAgIHRoaXMucm9vdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIHRoaXMuaGFuZGxlLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGVcbiAqIEByZXR1cm5zIGJvb2xlYW5cbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLmNhcHR1cmVGb3JUeXBlID0gZnVuY3Rpb24oZXZlbnRUeXBlKSB7XG4gIHJldHVybiBbJ2JsdXInLCAnZXJyb3InLCAnZm9jdXMnLCAnbG9hZCcsICdyZXNpemUnLCAnc2Nyb2xsJ10uaW5kZXhPZihldmVudFR5cGUpICE9PSAtMTtcbn07XG5cbi8qKlxuICogQXR0YWNoIGEgaGFuZGxlciB0byBvbmVcbiAqIGV2ZW50IGZvciBhbGwgZWxlbWVudHNcbiAqIHRoYXQgbWF0Y2ggdGhlIHNlbGVjdG9yLFxuICogbm93IG9yIGluIHRoZSBmdXR1cmVcbiAqXG4gKiBUaGUgaGFuZGxlciBmdW5jdGlvbiByZWNlaXZlc1xuICogdGhyZWUgYXJndW1lbnRzOiB0aGUgRE9NIGV2ZW50XG4gKiBvYmplY3QsIHRoZSBub2RlIHRoYXQgbWF0Y2hlZFxuICogdGhlIHNlbGVjdG9yIHdoaWxlIHRoZSBldmVudFxuICogd2FzIGJ1YmJsaW5nIGFuZCBhIHJlZmVyZW5jZVxuICogdG8gaXRzZWxmLiBXaXRoaW4gdGhlIGhhbmRsZXIsXG4gKiAndGhpcycgaXMgZXF1YWwgdG8gdGhlIHNlY29uZFxuICogYXJndW1lbnQuXG4gKlxuICogVGhlIG5vZGUgdGhhdCBhY3R1YWxseSByZWNlaXZlZFxuICogdGhlIGV2ZW50IGNhbiBiZSBhY2Nlc3NlZCB2aWFcbiAqICdldmVudC50YXJnZXQnLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgTGlzdGVuIGZvciB0aGVzZSBldmVudHNcbiAqIEBwYXJhbSB7c3RyaW5nfHVuZGVmaW5lZH0gc2VsZWN0b3IgT25seSBoYW5kbGUgZXZlbnRzIG9uIGVsZW1lbnRzIG1hdGNoaW5nIHRoaXMgc2VsZWN0b3IsIGlmIHVuZGVmaW5lZCBtYXRjaCByb290IGVsZW1lbnRcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gaGFuZGxlciBIYW5kbGVyIGZ1bmN0aW9uIC0gZXZlbnQgZGF0YSBwYXNzZWQgaGVyZSB3aWxsIGJlIGluIGV2ZW50LmRhdGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBbZXZlbnREYXRhXSBEYXRhIHRvIHBhc3MgaW4gZXZlbnQuZGF0YVxuICogQHJldHVybnMge0RlbGVnYXRlfSBUaGlzIG1ldGhvZCBpcyBjaGFpbmFibGVcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBzZWxlY3RvciwgaGFuZGxlciwgdXNlQ2FwdHVyZSkge1xuICB2YXIgcm9vdCwgbGlzdGVuZXJNYXAsIG1hdGNoZXIsIG1hdGNoZXJQYXJhbTtcblxuICBpZiAoIWV2ZW50VHlwZSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgZXZlbnQgdHlwZTogJyArIGV2ZW50VHlwZSk7XG4gIH1cblxuICAvLyBoYW5kbGVyIGNhbiBiZSBwYXNzZWQgYXNcbiAgLy8gdGhlIHNlY29uZCBvciB0aGlyZCBhcmd1bWVudFxuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdXNlQ2FwdHVyZSA9IGhhbmRsZXI7XG4gICAgaGFuZGxlciA9IHNlbGVjdG9yO1xuICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgfVxuXG4gIC8vIEZhbGxiYWNrIHRvIHNlbnNpYmxlIGRlZmF1bHRzXG4gIC8vIGlmIHVzZUNhcHR1cmUgbm90IHNldFxuICBpZiAodXNlQ2FwdHVyZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdXNlQ2FwdHVyZSA9IHRoaXMuY2FwdHVyZUZvclR5cGUoZXZlbnRUeXBlKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0hhbmRsZXIgbXVzdCBiZSBhIHR5cGUgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIHJvb3QgPSB0aGlzLnJvb3RFbGVtZW50O1xuICBsaXN0ZW5lck1hcCA9IHRoaXMubGlzdGVuZXJNYXBbdXNlQ2FwdHVyZSA/IDEgOiAwXTtcblxuICAvLyBBZGQgbWFzdGVyIGhhbmRsZXIgZm9yIHR5cGUgaWYgbm90IGNyZWF0ZWQgeWV0XG4gIGlmICghbGlzdGVuZXJNYXBbZXZlbnRUeXBlXSkge1xuICAgIGlmIChyb290KSB7XG4gICAgICByb290LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgdXNlQ2FwdHVyZSk7XG4gICAgfVxuICAgIGxpc3RlbmVyTWFwW2V2ZW50VHlwZV0gPSBbXTtcbiAgfVxuXG4gIGlmICghc2VsZWN0b3IpIHtcbiAgICBtYXRjaGVyUGFyYW0gPSBudWxsO1xuXG4gICAgLy8gQ09NUExFWCAtIG1hdGNoZXNSb290IG5lZWRzIHRvIGhhdmUgYWNjZXNzIHRvXG4gICAgLy8gdGhpcy5yb290RWxlbWVudCwgc28gYmluZCB0aGUgZnVuY3Rpb24gdG8gdGhpcy5cbiAgICBtYXRjaGVyID0gbWF0Y2hlc1Jvb3QuYmluZCh0aGlzKTtcblxuICAvLyBDb21waWxlIGEgbWF0Y2hlciBmb3IgdGhlIGdpdmVuIHNlbGVjdG9yXG4gIH0gZWxzZSBpZiAoL15bYS16XSskL2kudGVzdChzZWxlY3RvcikpIHtcbiAgICBtYXRjaGVyUGFyYW0gPSBzZWxlY3RvcjtcbiAgICBtYXRjaGVyID0gbWF0Y2hlc1RhZztcbiAgfSBlbHNlIGlmICgvXiNbYS16MC05XFwtX10rJC9pLnRlc3Qoc2VsZWN0b3IpKSB7XG4gICAgbWF0Y2hlclBhcmFtID0gc2VsZWN0b3Iuc2xpY2UoMSk7XG4gICAgbWF0Y2hlciA9IG1hdGNoZXNJZDtcbiAgfSBlbHNlIHtcbiAgICBtYXRjaGVyUGFyYW0gPSBzZWxlY3RvcjtcbiAgICBtYXRjaGVyID0gbWF0Y2hlcztcbiAgfVxuXG4gIC8vIEFkZCB0byB0aGUgbGlzdCBvZiBsaXN0ZW5lcnNcbiAgbGlzdGVuZXJNYXBbZXZlbnRUeXBlXS5wdXNoKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICBtYXRjaGVyOiBtYXRjaGVyLFxuICAgIG1hdGNoZXJQYXJhbTogbWF0Y2hlclBhcmFtXG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gZXZlbnQgaGFuZGxlclxuICogZm9yIGVsZW1lbnRzIHRoYXQgbWF0Y2hcbiAqIHRoZSBzZWxlY3RvciwgZm9yZXZlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbZXZlbnRUeXBlXSBSZW1vdmUgaGFuZGxlcnMgZm9yIGV2ZW50cyBtYXRjaGluZyB0aGlzIHR5cGUsIGNvbnNpZGVyaW5nIHRoZSBvdGhlciBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge3N0cmluZ30gW3NlbGVjdG9yXSBJZiB0aGlzIHBhcmFtZXRlciBpcyBvbWl0dGVkLCBvbmx5IGhhbmRsZXJzIHdoaWNoIG1hdGNoIHRoZSBvdGhlciB0d28gd2lsbCBiZSByZW1vdmVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCl9IFtoYW5kbGVyXSBJZiB0aGlzIHBhcmFtZXRlciBpcyBvbWl0dGVkLCBvbmx5IGhhbmRsZXJzIHdoaWNoIG1hdGNoIHRoZSBwcmV2aW91cyB0d28gd2lsbCBiZSByZW1vdmVkXG4gKiBAcmV0dXJucyB7RGVsZWdhdGV9IFRoaXMgbWV0aG9kIGlzIGNoYWluYWJsZVxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBzZWxlY3RvciwgaGFuZGxlciwgdXNlQ2FwdHVyZSkge1xuICB2YXIgaSwgbGlzdGVuZXIsIGxpc3RlbmVyTWFwLCBsaXN0ZW5lckxpc3QsIHNpbmdsZUV2ZW50VHlwZTtcblxuICAvLyBIYW5kbGVyIGNhbiBiZSBwYXNzZWQgYXNcbiAgLy8gdGhlIHNlY29uZCBvciB0aGlyZCBhcmd1bWVudFxuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdXNlQ2FwdHVyZSA9IGhhbmRsZXI7XG4gICAgaGFuZGxlciA9IHNlbGVjdG9yO1xuICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgfVxuXG4gIC8vIElmIHVzZUNhcHR1cmUgbm90IHNldCwgcmVtb3ZlXG4gIC8vIGFsbCBldmVudCBsaXN0ZW5lcnNcbiAgaWYgKHVzZUNhcHR1cmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMub2ZmKGV2ZW50VHlwZSwgc2VsZWN0b3IsIGhhbmRsZXIsIHRydWUpO1xuICAgIHRoaXMub2ZmKGV2ZW50VHlwZSwgc2VsZWN0b3IsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVyTWFwID0gdGhpcy5saXN0ZW5lck1hcFt1c2VDYXB0dXJlID8gMSA6IDBdO1xuICBpZiAoIWV2ZW50VHlwZSkge1xuICAgIGZvciAoc2luZ2xlRXZlbnRUeXBlIGluIGxpc3RlbmVyTWFwKSB7XG4gICAgICBpZiAobGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkoc2luZ2xlRXZlbnRUeXBlKSkge1xuICAgICAgICB0aGlzLm9mZihzaW5nbGVFdmVudFR5cGUsIHNlbGVjdG9yLCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVyTGlzdCA9IGxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG4gIGlmICghbGlzdGVuZXJMaXN0IHx8ICFsaXN0ZW5lckxpc3QubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBSZW1vdmUgb25seSBwYXJhbWV0ZXIgbWF0Y2hlc1xuICAvLyBpZiBzcGVjaWZpZWRcbiAgZm9yIChpID0gbGlzdGVuZXJMaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGlzdGVuZXIgPSBsaXN0ZW5lckxpc3RbaV07XG5cbiAgICBpZiAoKCFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gbGlzdGVuZXIuc2VsZWN0b3IpICYmICghaGFuZGxlciB8fCBoYW5kbGVyID09PSBsaXN0ZW5lci5oYW5kbGVyKSkge1xuICAgICAgbGlzdGVuZXJMaXN0LnNwbGljZShpLCAxKTtcbiAgICB9XG4gIH1cblxuICAvLyBBbGwgbGlzdGVuZXJzIHJlbW92ZWRcbiAgaWYgKCFsaXN0ZW5lckxpc3QubGVuZ3RoKSB7XG4gICAgZGVsZXRlIGxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG5cbiAgICAvLyBSZW1vdmUgdGhlIG1haW4gaGFuZGxlclxuICAgIGlmICh0aGlzLnJvb3RFbGVtZW50KSB7XG4gICAgICB0aGlzLnJvb3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgdXNlQ2FwdHVyZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogSGFuZGxlIGFuIGFyYml0cmFyeSBldmVudC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUuaGFuZGxlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgdmFyIGksIGwsIHR5cGUgPSBldmVudC50eXBlLCByb290LCBwaGFzZSwgbGlzdGVuZXIsIHJldHVybmVkLCBsaXN0ZW5lckxpc3QgPSBbXSwgdGFyZ2V0LCAvKiogQGNvbnN0ICovIEVWRU5USUdOT1JFID0gJ2Z0TGFic0RlbGVnYXRlSWdub3JlJztcblxuICBpZiAoZXZlbnRbRVZFTlRJR05PUkVdID09PSB0cnVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXG4gIC8vIEhhcmRjb2RlIHZhbHVlIG9mIE5vZGUuVEVYVF9OT0RFXG4gIC8vIGFzIG5vdCBkZWZpbmVkIGluIElFOFxuICBpZiAodGFyZ2V0Lm5vZGVUeXBlID09PSAzKSB7XG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gIH1cblxuICByb290ID0gdGhpcy5yb290RWxlbWVudDtcblxuICBwaGFzZSA9IGV2ZW50LmV2ZW50UGhhc2UgfHwgKCBldmVudC50YXJnZXQgIT09IGV2ZW50LmN1cnJlbnRUYXJnZXQgPyAzIDogMiApO1xuICBcbiAgc3dpdGNoIChwaGFzZSkge1xuICAgIGNhc2UgMTogLy9FdmVudC5DQVBUVVJJTkdfUEhBU0U6XG4gICAgICBsaXN0ZW5lckxpc3QgPSB0aGlzLmxpc3RlbmVyTWFwWzFdW3R5cGVdO1xuICAgIGJyZWFrO1xuICAgIGNhc2UgMjogLy9FdmVudC5BVF9UQVJHRVQ6XG4gICAgICBpZiAodGhpcy5saXN0ZW5lck1hcFswXSAmJiB0aGlzLmxpc3RlbmVyTWFwWzBdW3R5cGVdKSBsaXN0ZW5lckxpc3QgPSBsaXN0ZW5lckxpc3QuY29uY2F0KHRoaXMubGlzdGVuZXJNYXBbMF1bdHlwZV0pO1xuICAgICAgaWYgKHRoaXMubGlzdGVuZXJNYXBbMV0gJiYgdGhpcy5saXN0ZW5lck1hcFsxXVt0eXBlXSkgbGlzdGVuZXJMaXN0ID0gbGlzdGVuZXJMaXN0LmNvbmNhdCh0aGlzLmxpc3RlbmVyTWFwWzFdW3R5cGVdKTtcbiAgICBicmVhaztcbiAgICBjYXNlIDM6IC8vRXZlbnQuQlVCQkxJTkdfUEhBU0U6XG4gICAgICBsaXN0ZW5lckxpc3QgPSB0aGlzLmxpc3RlbmVyTWFwWzBdW3R5cGVdO1xuICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gTmVlZCB0byBjb250aW51b3VzbHkgY2hlY2tcbiAgLy8gdGhhdCB0aGUgc3BlY2lmaWMgbGlzdCBpc1xuICAvLyBzdGlsbCBwb3B1bGF0ZWQgaW4gY2FzZSBvbmVcbiAgLy8gb2YgdGhlIGNhbGxiYWNrcyBhY3R1YWxseVxuICAvLyBjYXVzZXMgdGhlIGxpc3QgdG8gYmUgZGVzdHJveWVkLlxuICBsID0gbGlzdGVuZXJMaXN0Lmxlbmd0aDtcbiAgd2hpbGUgKHRhcmdldCAmJiBsKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lckxpc3RbaV07XG5cbiAgICAgIC8vIEJhaWwgZnJvbSB0aGlzIGxvb3AgaWZcbiAgICAgIC8vIHRoZSBsZW5ndGggY2hhbmdlZCBhbmRcbiAgICAgIC8vIG5vIG1vcmUgbGlzdGVuZXJzIGFyZVxuICAgICAgLy8gZGVmaW5lZCBiZXR3ZWVuIGkgYW5kIGwuXG4gICAgICBpZiAoIWxpc3RlbmVyKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBmb3IgbWF0Y2ggYW5kIGZpcmVcbiAgICAgIC8vIHRoZSBldmVudCBpZiB0aGVyZSdzIG9uZVxuICAgICAgLy9cbiAgICAgIC8vIFRPRE86TUNHOjIwMTIwMTE3OiBOZWVkIGEgd2F5XG4gICAgICAvLyB0byBjaGVjayBpZiBldmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25cbiAgICAgIC8vIHdhcyBjYWxsZWQuIElmIHNvLCBicmVhayBib3RoIGxvb3BzLlxuICAgICAgaWYgKGxpc3RlbmVyLm1hdGNoZXIuY2FsbCh0YXJnZXQsIGxpc3RlbmVyLm1hdGNoZXJQYXJhbSwgdGFyZ2V0KSkge1xuICAgICAgICByZXR1cm5lZCA9IHRoaXMuZmlyZShldmVudCwgdGFyZ2V0LCBsaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIC8vIFN0b3AgcHJvcGFnYXRpb24gdG8gc3Vic2VxdWVudFxuICAgICAgLy8gY2FsbGJhY2tzIGlmIHRoZSBjYWxsYmFjayByZXR1cm5lZFxuICAgICAgLy8gZmFsc2VcbiAgICAgIGlmIChyZXR1cm5lZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgZXZlbnRbRVZFTlRJR05PUkVdID0gdHJ1ZTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE86TUNHOjIwMTIwMTE3OiBOZWVkIGEgd2F5IHRvXG4gICAgLy8gY2hlY2sgaWYgZXZlbnQjc3RvcFByb3BhZ2F0aW9uXG4gICAgLy8gd2FzIGNhbGxlZC4gSWYgc28sIGJyZWFrIGxvb3BpbmdcbiAgICAvLyB0aHJvdWdoIHRoZSBET00uIFN0b3AgaWYgdGhlXG4gICAgLy8gZGVsZWdhdGlvbiByb290IGhhcyBiZWVuIHJlYWNoZWRcbiAgICBpZiAodGFyZ2V0ID09PSByb290KSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBsID0gbGlzdGVuZXJMaXN0Lmxlbmd0aDtcbiAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgfVxufTtcblxuLyoqXG4gKiBGaXJlIGEgbGlzdGVuZXIgb24gYSB0YXJnZXQuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge09iamVjdH0gbGlzdGVuZXJcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUuZmlyZSA9IGZ1bmN0aW9uKGV2ZW50LCB0YXJnZXQsIGxpc3RlbmVyKSB7XG4gIHJldHVybiBsaXN0ZW5lci5oYW5kbGVyLmNhbGwodGFyZ2V0LCBldmVudCwgdGFyZ2V0KTtcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBlbGVtZW50XG4gKiBtYXRjaGVzIGEgZ2VuZXJpYyBzZWxlY3Rvci5cbiAqXG4gKiBAdHlwZSBmdW5jdGlvbigpXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgQSBDU1Mgc2VsZWN0b3JcbiAqL1xudmFyIG1hdGNoZXMgPSAoZnVuY3Rpb24oZWwpIHtcbiAgaWYgKCFlbCkgcmV0dXJuO1xuICB2YXIgcCA9IGVsLnByb3RvdHlwZTtcbiAgcmV0dXJuIChwLm1hdGNoZXMgfHwgcC5tYXRjaGVzU2VsZWN0b3IgfHwgcC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgcC5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgcC5tc01hdGNoZXNTZWxlY3RvciB8fCBwLm9NYXRjaGVzU2VsZWN0b3IpO1xufShFbGVtZW50KSk7XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBlbGVtZW50XG4gKiBtYXRjaGVzIGEgdGFnIHNlbGVjdG9yLlxuICpcbiAqIFRhZ3MgYXJlIE5PVCBjYXNlLXNlbnNpdGl2ZSxcbiAqIGV4Y2VwdCBpbiBYTUwgKGFuZCBYTUwtYmFzZWRcbiAqIGxhbmd1YWdlcyBzdWNoIGFzIFhIVE1MKS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnTmFtZSBUaGUgdGFnIG5hbWUgdG8gdGVzdCBhZ2FpbnN0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdGVzdCB3aXRoXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNUYWcodGFnTmFtZSwgZWxlbWVudCkge1xuICByZXR1cm4gdGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIGVsZW1lbnRcbiAqIG1hdGNoZXMgdGhlIHJvb3QuXG4gKlxuICogQHBhcmFtIHs/U3RyaW5nfSBzZWxlY3RvciBJbiB0aGlzIGNhc2UgdGhpcyBpcyBhbHdheXMgcGFzc2VkIHRocm91Z2ggYXMgbnVsbCBhbmQgbm90IHVzZWRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byB0ZXN0IHdpdGhcbiAqIEByZXR1cm5zIGJvb2xlYW5cbiAqL1xuZnVuY3Rpb24gbWF0Y2hlc1Jvb3Qoc2VsZWN0b3IsIGVsZW1lbnQpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUqL1xuICBpZiAodGhpcy5yb290RWxlbWVudCA9PT0gd2luZG93KSByZXR1cm4gZWxlbWVudCA9PT0gZG9jdW1lbnQ7XG4gIHJldHVybiB0aGlzLnJvb3RFbGVtZW50ID09PSBlbGVtZW50O1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIElEIG9mXG4gKiB0aGUgZWxlbWVudCBpbiAndGhpcydcbiAqIG1hdGNoZXMgdGhlIGdpdmVuIElELlxuICpcbiAqIElEcyBhcmUgY2FzZS1zZW5zaXRpdmUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCB0byB0ZXN0IGFnYWluc3RcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byB0ZXN0IHdpdGhcbiAqIEByZXR1cm5zIGJvb2xlYW5cbiAqL1xuZnVuY3Rpb24gbWF0Y2hlc0lkKGlkLCBlbGVtZW50KSB7XG4gIHJldHVybiBpZCA9PT0gZWxlbWVudC5pZDtcbn1cblxuLyoqXG4gKiBTaG9ydCBoYW5kIGZvciBvZmYoKVxuICogYW5kIHJvb3QoKSwgaWUgYm90aFxuICogd2l0aCBubyBwYXJhbWV0ZXJzXG4gKlxuICogQHJldHVybiB2b2lkXG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub2ZmKCk7XG4gIHRoaXMucm9vdCgpO1xufTtcbiIsIi8qanNoaW50IGJyb3dzZXI6dHJ1ZSwgbm9kZTp0cnVlKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwcmVzZXJ2ZSBDcmVhdGUgYW5kIG1hbmFnZSBhIERPTSBldmVudCBkZWxlZ2F0b3IuXG4gKlxuICogQHZlcnNpb24gMC4zLjBcbiAqIEBjb2RpbmdzdGFuZGFyZCBmdGxhYnMtanN2MlxuICogQGNvcHlyaWdodCBUaGUgRmluYW5jaWFsIFRpbWVzIExpbWl0ZWQgW0FsbCBSaWdodHMgUmVzZXJ2ZWRdXG4gKiBAbGljZW5zZSBNSVQgTGljZW5zZSAoc2VlIExJQ0VOU0UudHh0KVxuICovXG52YXIgRGVsZWdhdGUgPSByZXF1aXJlKCcuL2RlbGVnYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocm9vdCkge1xuICByZXR1cm4gbmV3IERlbGVnYXRlKHJvb3QpO1xufTtcblxubW9kdWxlLmV4cG9ydHMuRGVsZWdhdGUgPSBEZWxlZ2F0ZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZ2V0O1xuXG5mdW5jdGlvbiBnZXQgKGNvbnRleHQsIHBhdGgpIHtcbiAgaWYgKHBhdGguaW5kZXhPZignLicpID09IC0xICYmIHBhdGguaW5kZXhPZignWycpID09IC0xKSB7XG4gICAgcmV0dXJuIGNvbnRleHRbcGF0aF07XG4gIH1cblxuICB2YXIgY3J1bWJzID0gcGF0aC5zcGxpdCgvXFwufFxcW3xcXF0vZyk7XG4gIHZhciBpID0gLTE7XG4gIHZhciBsZW4gPSBjcnVtYnMubGVuZ3RoO1xuICB2YXIgcmVzdWx0O1xuXG4gIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICBpZiAoaSA9PSAwKSByZXN1bHQgPSBjb250ZXh0O1xuICAgIGlmICghY3J1bWJzW2ldKSBjb250aW51ZTtcbiAgICBpZiAocmVzdWx0ID09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgcmVzdWx0ID0gcmVzdWx0W2NydW1ic1tpXV07XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19
