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
var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<table as="table">   <caption>', data.name ,'</caption>   <tbody as="body">     '); for (var i = 0; i < todos.length; i++) { p.push('       <tr item="todos[', i ,']"></tr>     '); } p.push('   </tbody>   <tfoot>     <tr>       <td><input id="new-todo" as="newTodoText" type="text" value="', newTodo.text ,'" placeholder="Add new todo"></td>       <td><button id="add-todo" as="addTodo" ', isNewTodoValid ? '' : 'disabled' ,'>Add new</button></td>       <td><button id="clear-todos" as="clearTodos" ', hasCompleted ? '' : 'disabled' ,'>Clear completed</button></td>     </tr>   </tfoot> </table> ');}return p.join('');
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

function Login (data) {
  this.email = data.email
  this.password = data.password
}

window.onload = function () {
  var app = {
    id: 1,
    name: 'My todo list',
    menu: [{ text: 'Home', url: '/home' }, { text: 'About', url: '/about' }],
    newTodo: { text: '', completed: false },
    todos: [{text: 'A', completed: false}, {text: 'B', completed: true}, {text: 'C', completed: false}],
    login: new Login({email: 'hey', password: 'secret'})
  }

  Dom.scan(document.documentElement, app)

  window.app = app
}

},{"../..":7,"../login":1,"./_item.html":3,"./_list.html":4,"./_menu-item.html":5}],7:[function(require,module,exports){
var get = require('get-object-path')
var Delegate = require('dom-delegate').Delegate

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
    el: {
      value: el
    },
    data: {
      value: data
    },
    component: {
      value: component
    }
  })

  Object.defineProperties(ctx, {
    __: {
      value: info
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
      var colonidx = event.indexOf(':')
      var name, selector
      if (colonidx === -1) {
        name = event
        del.on(name, proxy(component.on[event]))
      } else {
        name = event.substr(0, colonidx)
        selector = event.substr(colonidx + 1)
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

/**
* Convert a NodeList into an Array
* @method nodeListToArray
* @param NodeList nodeList
* @return nodeArray
*/
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

function getElementDepth (el, parent) {
  var depth = 0
  while (el.parentNode && el !== parent) {
    depth++
    el = el.parentNode
  }
  return depth
}

function findParentContext (el, contexts) {
  do {
    el = el.parentNode
    if (el) {
      for (var i = contexts.length - 1; i > -1 ; i--) {
        if (contexts[i].ctx.__.el === el) {
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
  return function (dontScan) {
    setHtml(currEl, component, ctx)
    if (!dontScan) {
      for (var i = 0; i < currEl.children.length; i++) {
        Dom.scan(currEl.children[i], ctx.data, ctx)
      }
    }
  }
}

function initializer (component, ctx, el, data) {
  return function () {
    component.initialize.call(ctx, el, data)
  }
}

function scan (el, data, parent) {
  var matches = getMatchingElements(el)
  var contexts = []
  var initializers = []
  var currEl

  while (matches.length) {
    currEl = matches.shift()
    var ref = getElementComponent(currEl)
    var component = ref.component
    var depth = getElementDepth(currEl, el)
    var parentContext = findParentContext(currEl, contexts) || parent
    var parentData = parentContext ? parentContext.data : data
    var elData = getElementData(currEl, ref.key, parentData) || parentData
    var ctx = createContext(currEl, elData, component, parentContext)
    var del = createElementDelegate(currEl, ctx, component)

    Object.defineProperty(ctx.__, 'del', { value: del })

    extend(ctx, component)

    contexts.push({ depth: depth, ctx: ctx })

    if (component.initialize) {
      initializers.push(initializer(component, ctx, currEl, elData))
    }

    if (component.template) {
      var render = renderer(currEl, component, ctx)
      render(true)
      var children = getMatchingElements(currEl, true)
      if (children.length) {
        Array.prototype.unshift.apply(matches, children)
      }
      ctx.__.render = render
    }
  }

  var i, j
  for (i = contexts.length - 1; i >= 0; i--) {
    var aliasContext = contexts[i].ctx
    var aliasEl = aliasContext.__.el
    var aliases = aliasEl.querySelectorAll('[as]:not([as=""])')
    for (j = 0; j < aliases.length; j++) {
      var attr = aliases[j].getAttribute('as')
      aliasContext[attr] = aliases[j]
      aliases[j].removeAttribute('as')
    }
  }

  for (i = 0; i < initializers.length; i++) {
    initializers[i]()
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9sb2dpbi9pbmRleC5qcyIsImV4YW1wbGVzL2xvZ2luL3RlbXBsYXRlLmh0bWwiLCJleGFtcGxlcy90b2RvL19pdGVtLmh0bWwiLCJleGFtcGxlcy90b2RvL19saXN0Lmh0bWwiLCJleGFtcGxlcy90b2RvL19tZW51LWl0ZW0uaHRtbCIsImV4YW1wbGVzL3RvZG8vaW5kZXguanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20tZGVsZWdhdGUvbGliL2RlbGVnYXRlLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1kZWxlZ2F0ZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ2V0LW9iamVjdC1wYXRoL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBEb20gPSByZXF1aXJlKCcuLi8uLicpXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlLmh0bWwnKVxuXG52YXIgbG9naW4gPSB7XG4gIGVuYWJsZUJ1dHRvbjogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgc3RhdGVcbiAgICAgID8gdGhpcy5idXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICA6IHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKVxuICB9LFxuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIG9uOiB7XG4gICAgJ2tleXVwOmlucHV0JzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuZW5hYmxlQnV0dG9uKHRoaXMuZW1haWwudmFsdWUgJiYgdGhpcy5wYXNzd29yZC52YWx1ZSlcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdjbGljayBsb2dpbiBmb3JtIGlucHV0JywgdGhpcywgZSwgZGF0YSwgdGhpcy5mb3JtLmJ1dClcbiAgICB9LFxuICAgICdzdWJtaXQ6Zm9ybSc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHZhciBlbCA9IGUudGFyZ2V0XG5cbiAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IHdpbmRvdy5DdXN0b21FdmVudCgnbG9nZ2VkaW4nLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGNvbXBvbmVudDogdGhpc1xuICAgICAgICB9LFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZVxuICAgICAgfSkpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRG9tLnJlZ2lzdGVyKCdsb2dpbicsIGxvZ2luKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhbm9ueW1vdXMob2JqXG4vKiovKSB7XG52YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTt3aXRoKG9iail7cC5wdXNoKCc8Zm9ybT4gICA8bGVnZW5kPkxvZ2luIGZvcm08L2xlZ2VuZD4gICBFbWFpbDogPGlucHV0IGFzPVwiZW1haWxcInZhbHVlPVwiJywgZGF0YS5lbWFpbCAsJ1wiIHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ+PGJyPiAgIFBhc3N3b3JkOiA8aW5wdXQgYXM9XCJwYXNzd29yZFwiIHZhbHVlPVwiJywgZGF0YS5wYXNzd29yZCAsJ1wiIHR5cGU9XCJwYXNzd29yZFwiIHJlcXVpcmVkPiAgIDxidXR0b24gYXM9XCJidXR0b25cIiB0eXBlPVwic3VibWl0XCI+TG9naW48L2J1dHRvbj4gPC9mb3JtPiAnKTt9cmV0dXJuIHAuam9pbignJyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYW5vbnltb3VzKG9ialxuLyoqLykge1xudmFyIHA9W10scHJpbnQ9ZnVuY3Rpb24oKXtwLnB1c2guYXBwbHkocCxhcmd1bWVudHMpO307d2l0aChvYmope3AucHVzaCgnPHRkPiAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJywgZGF0YS50ZXh0ICwnXCI+IDwvdGQ+IDx0ZD4gICA8c3BhbiBhcz1cImRpc3BsYXlcIj4nLCBkaXNwbGF5VGV4dCgpICwnPC9zcGFuPiA8L3RkPiA8dGQ+ICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiICcsIGRhdGEuY29tcGxldGVkID8gJ2NoZWNrZWQnIDogJycgLCc+IDwvdGQ+ICcpO31yZXR1cm4gcC5qb2luKCcnKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhbm9ueW1vdXMob2JqXG4vKiovKSB7XG52YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTt3aXRoKG9iail7cC5wdXNoKCc8dGFibGUgYXM9XCJ0YWJsZVwiPiAgIDxjYXB0aW9uPicsIGRhdGEubmFtZSAsJzwvY2FwdGlvbj4gICA8dGJvZHkgYXM9XCJib2R5XCI+ICAgICAnKTsgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2Rvcy5sZW5ndGg7IGkrKykgeyBwLnB1c2goJyAgICAgICA8dHIgaXRlbT1cInRvZG9zWycsIGkgLCddXCI+PC90cj4gICAgICcpOyB9IHAucHVzaCgnICAgPC90Ym9keT4gICA8dGZvb3Q+ICAgICA8dHI+ICAgICAgIDx0ZD48aW5wdXQgaWQ9XCJuZXctdG9kb1wiIGFzPVwibmV3VG9kb1RleHRcIiB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJywgbmV3VG9kby50ZXh0ICwnXCIgcGxhY2Vob2xkZXI9XCJBZGQgbmV3IHRvZG9cIj48L3RkPiAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImFkZC10b2RvXCIgYXM9XCJhZGRUb2RvXCIgJywgaXNOZXdUb2RvVmFsaWQgPyAnJyA6ICdkaXNhYmxlZCcgLCc+QWRkIG5ldzwvYnV0dG9uPjwvdGQ+ICAgICAgIDx0ZD48YnV0dG9uIGlkPVwiY2xlYXItdG9kb3NcIiBhcz1cImNsZWFyVG9kb3NcIiAnLCBoYXNDb21wbGV0ZWQgPyAnJyA6ICdkaXNhYmxlZCcgLCc+Q2xlYXIgY29tcGxldGVkPC9idXR0b24+PC90ZD4gICAgIDwvdHI+ICAgPC90Zm9vdD4gPC90YWJsZT4gJyk7fXJldHVybiBwLmpvaW4oJycpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFub255bW91cyhvYmpcbi8qKi8pIHtcbnZhciBwPVtdLHByaW50PWZ1bmN0aW9uKCl7cC5wdXNoLmFwcGx5KHAsYXJndW1lbnRzKTt9O3dpdGgob2JqKXtwLnB1c2goJzxsaT48YSBocmVmPVwiJywgZGF0YS51cmwgLCdcIj4nLCBkYXRhLnRleHQgLCc8L2E+PC9saT4gJyk7fXJldHVybiBwLmpvaW4oJycpO1xufTsiLCJ2YXIgRG9tID0gcmVxdWlyZSgnLi4vLi4nKVxudmFyIGl0ZW1UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vX2l0ZW0uaHRtbCcpXG52YXIgbGlzdFRlbXBsYXRlID0gcmVxdWlyZSgnLi9fbGlzdC5odG1sJylcbnZhciBtZW51SXRlbVRlbXBsYXRlID0gcmVxdWlyZSgnLi9fbWVudS1pdGVtLmh0bWwnKVxuXG5yZXF1aXJlKCcuLi9sb2dpbicpXG5cbnZhciBpdGVtID0ge1xuICB1cGRhdGVEaXNwbGF5VGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGlzcGxheS5pbm5lckhUTUwgPSB0aGlzLmRpc3BsYXlUZXh0KClcbiAgfSxcbiAgZGlzcGxheVRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJygnICsgdGhpcy5kYXRhLnRleHQgKyAnKSdcbiAgfSxcbiAgdGVtcGxhdGU6IGl0ZW1UZW1wbGF0ZSxcbiAgb246IHtcbiAgICAnaW5wdXQ6aW5wdXRbdHlwZT10ZXh0XSc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLmRhdGEudGV4dCA9IGUudGFyZ2V0LnZhbHVlXG4gICAgICB0aGlzLnVwZGF0ZURpc3BsYXlUZXh0KClcbiAgICB9LFxuICAgICdjaGFuZ2U6aW5wdXRbdHlwZT1jaGVja2JveF0nOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5kYXRhLmNvbXBsZXRlZCA9IGUudGFyZ2V0LmNoZWNrZWRcbiAgICAgIHRoaXMuc2V0Q2xlYXJCdXR0b25TdGF0ZSgpXG4gICAgfVxuICB9XG59XG5cbnZhciBsaXN0ID0ge1xuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gQ3JlYXRlIHNvbWUgY29tbW9uIHVzZWQgcHJvcGVydGllc1xuICAgIHRoaXMudG9kb3MgPSB0aGlzLmRhdGEudG9kb3NcbiAgICB0aGlzLm5ld1RvZG8gPSB0aGlzLmRhdGEubmV3VG9kb1xuICB9LFxuICBnZXQgaGFzQ29tcGxldGVkICgpIHtcbiAgICByZXR1cm4gISF0aGlzLnRvZG9zLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLmNvbXBsZXRlZFxuICAgIH0pXG4gIH0sXG4gIGdldCBpc05ld1RvZG9WYWxpZCAoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5uZXdUb2RvLnRleHRcbiAgfSxcbiAgc2V0QWRkQnV0dG9uU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFkZFRvZG8uZGlzYWJsZWQgPSAhdGhpcy5pc05ld1RvZG9WYWxpZFxuICB9LFxuICBzZXRDbGVhckJ1dHRvblN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jbGVhclRvZG9zLmRpc2FibGVkID0gIXRoaXMuaGFzQ29tcGxldGVkXG4gIH0sXG4gIHRlbXBsYXRlOiBsaXN0VGVtcGxhdGUsXG4gIGNsZWFyQ29tcGxldGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRvZG9zID0gdGhpcy5kYXRhLnRvZG9zXG4gICAgdmFyIGxlbmd0aCA9IHRvZG9zLmxlbmd0aFxuICAgIGZvciAodmFyIGkgPSBsZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKHRvZG9zW2ldLmNvbXBsZXRlZCkge1xuICAgICAgICB0b2Rvcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgdGhpcy5ib2R5LnJvd3NbaV0ucmVtb3ZlKClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG9uOiB7XG4gICAgJ2lucHV0OmlucHV0I25ldy10b2RvJzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMubmV3VG9kby50ZXh0ID0gZS50YXJnZXQudmFsdWVcbiAgICAgIHRoaXMuc2V0QWRkQnV0dG9uU3RhdGUoKVxuICAgIH0sXG4gICAgJ2NsaWNrOmJ1dHRvbiNjbGVhci10b2Rvcyc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLmNsZWFyQ29tcGxldGVkKClcbiAgICB9LFxuICAgICdjbGljazpidXR0b24jYWRkLXRvZG8nOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHRvZG9zID0gdGhpcy5kYXRhLnRvZG9zXG5cbiAgICAgIC8vIENyZWF0ZSBhIG5ldyB0b2RvXG4gICAgICB2YXIgdG9kbyA9IHtcbiAgICAgICAgdGV4dDogdGhpcy5uZXdUb2RvVGV4dC52YWx1ZSxcbiAgICAgICAgY29tcGxldGVkOiBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy5uZXdUb2RvLnRleHQgPSAnJ1xuICAgICAgdGhpcy5uZXdUb2RvVGV4dC52YWx1ZSA9ICcnXG4gICAgICB0aGlzLnNldEFkZEJ1dHRvblN0YXRlKClcbiAgICAgIHRoaXMubmV3VG9kb1RleHQuZm9jdXMoKVxuXG4gICAgICB0b2Rvcy5wdXNoKHRvZG8pXG5cbiAgICAgIC8vIENyZWF0ZSB0ZSBuZXcgcm93IGFuZCBpbml0aWFsaXplXG4gICAgICB2YXIgcm93ID0gdGhpcy5ib2R5Lmluc2VydFJvdygpXG4gICAgICByb3cuc2V0QXR0cmlidXRlKCdpdGVtJywgJ3RvZG9zWycgKyAodG9kb3MubGVuZ3RoIC0gMSkgKyAnXScpXG4gICAgICBEb20uc2Nhbihyb3csIHRvZG8sIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbnZhciBtZW51SXRlbSA9IHtcbiAgdGVtcGxhdGU6IG1lbnVJdGVtVGVtcGxhdGUsXG4gIG9uOiB7XG4gICAgJ2NsaWNrJzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIH1cbiAgfVxufVxuXG52YXIgbWVudSA9IHtcbiAgaXNvbGF0ZTogdHJ1ZSxcbiAgdGVtcGxhdGU6ICc8dWw+PGxpIG1lbnUtaXRlbT1cIm1lbnVbMF1cIj48L2xpPjxsaSBtZW51LWl0ZW09XCJtZW51WzFdXCI+PC9saTwvdWw+JyxcbiAgb246IHtcbiAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnbWVudSBjbGlja2VkJylcbiAgICB9XG4gIH1cbn1cblxuRG9tLnJlZ2lzdGVyKHtcbiAgJ2xpc3QnOiBsaXN0LFxuICAnaXRlbSc6IGl0ZW0sXG4gICdtZW51JzogbWVudSxcbiAgJ21lbnUtaXRlbSc6IG1lbnVJdGVtLFxuICAnYXBwJzoge1xuICAgIHJvb3RGbjogZnVuY3Rpb24gKCkge30sXG4gICAgb246IHtcbiAgICAgICdsb2dnZWRpbic6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdCdWJibGVkIGN1c3RvbSBgbG9nZ2VkaW5gIGV2ZW50JywgZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG5cbmZ1bmN0aW9uIExvZ2luIChkYXRhKSB7XG4gIHRoaXMuZW1haWwgPSBkYXRhLmVtYWlsXG4gIHRoaXMucGFzc3dvcmQgPSBkYXRhLnBhc3N3b3JkXG59XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcHAgPSB7XG4gICAgaWQ6IDEsXG4gICAgbmFtZTogJ015IHRvZG8gbGlzdCcsXG4gICAgbWVudTogW3sgdGV4dDogJ0hvbWUnLCB1cmw6ICcvaG9tZScgfSwgeyB0ZXh0OiAnQWJvdXQnLCB1cmw6ICcvYWJvdXQnIH1dLFxuICAgIG5ld1RvZG86IHsgdGV4dDogJycsIGNvbXBsZXRlZDogZmFsc2UgfSxcbiAgICB0b2RvczogW3t0ZXh0OiAnQScsIGNvbXBsZXRlZDogZmFsc2V9LCB7dGV4dDogJ0InLCBjb21wbGV0ZWQ6IHRydWV9LCB7dGV4dDogJ0MnLCBjb21wbGV0ZWQ6IGZhbHNlfV0sXG4gICAgbG9naW46IG5ldyBMb2dpbih7ZW1haWw6ICdoZXknLCBwYXNzd29yZDogJ3NlY3JldCd9KVxuICB9XG5cbiAgRG9tLnNjYW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBhcHApXG5cbiAgd2luZG93LmFwcCA9IGFwcFxufVxuIiwidmFyIGdldCA9IHJlcXVpcmUoJ2dldC1vYmplY3QtcGF0aCcpXG52YXIgRGVsZWdhdGUgPSByZXF1aXJlKCdkb20tZGVsZWdhdGUnKS5EZWxlZ2F0ZVxuXG5mdW5jdGlvbiBSZWdpc3RlciAoKSB7fVxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVnaXN0ZXIucHJvdG90eXBlLCB7XG4gIHNlbGVjdG9yOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpXG4gICAgICByZXR1cm4ga2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gJ1snICsga2V5ICsgJ10nXG4gICAgICB9KS5qb2luKCcsICcpXG4gICAgfVxuICB9LFxuICBrZXlzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcylcbiAgICB9XG4gIH1cbn0pXG5cbnZhciByZWdpc3RlciA9IG5ldyBSZWdpc3RlcigpXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQgKGVsLCBkYXRhLCBjb21wb25lbnQsIHBhcmVudCkge1xuICB2YXIgY3R4ID0gT2JqZWN0LmNyZWF0ZShjb21wb25lbnQuaXNvbGF0ZSA/IHt9IDogcGFyZW50IHx8IHt9KVxuXG4gIHZhciBpbmZvID0gT2JqZWN0LmNyZWF0ZSh7fSwge1xuICAgIGVsOiB7XG4gICAgICB2YWx1ZTogZWxcbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIHZhbHVlOiBkYXRhXG4gICAgfSxcbiAgICBjb21wb25lbnQ6IHtcbiAgICAgIHZhbHVlOiBjb21wb25lbnRcbiAgICB9XG4gIH0pXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY3R4LCB7XG4gICAgX186IHtcbiAgICAgIHZhbHVlOiBpbmZvXG4gICAgfVxuICB9KVxuXG4gIGN0eC5kYXRhID0gZGF0YVxuXG4gIHJldHVybiBjdHhcbn1cblxudmFyIGlnbm9yZSA9IFsnb24nLCAndGVtcGxhdGUnLCAnaW5pdGlhbGl6ZScsICdpc29sYXRlJ11cbmZ1bmN0aW9uIGV4dGVuZCAob2JqKSB7XG4gIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IsIHByb3BcbiAgICBpZiAoc291cmNlKSB7XG4gICAgICBmb3IgKHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgaWdub3JlLmluZGV4T2YocHJvcCkgPT09IC0xKSB7XG4gICAgICAgICAgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBwcm9wKVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2NyaXB0b3IpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIHJldHVybiBvYmpcbn1cbmZ1bmN0aW9uIGdldEVsZW1lbnRDb21wb25lbnQgKGVsKSB7XG4gIHZhciByZWdpc3RlcktleXMgPSByZWdpc3Rlci5rZXlzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWwuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZHggPSByZWdpc3RlcktleXMuaW5kZXhPZihlbC5hdHRyaWJ1dGVzW2ldLm5hbWUpXG4gICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IHJlZ2lzdGVyS2V5c1tpZHhdLFxuICAgICAgICBjb21wb25lbnQ6IHJlZ2lzdGVyW3JlZ2lzdGVyS2V5c1tpZHhdXVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50RGVsZWdhdGUgKGVsLCBjdHgsIGNvbXBvbmVudCkge1xuICB2YXIgZGVsID0gbmV3IERlbGVnYXRlKGVsKVxuXG4gIC8vIEFkZCBldmVudCBsaXN0ZW5lcnNcbiAgdmFyIHByb3h5ID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgICBmbi5jYWxsKGN0eCwgZSlcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBldmVudCBpbiBjb21wb25lbnQub24pIHtcbiAgICBpZiAoY29tcG9uZW50Lm9uLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xuICAgICAgdmFyIGNvbG9uaWR4ID0gZXZlbnQuaW5kZXhPZignOicpXG4gICAgICB2YXIgbmFtZSwgc2VsZWN0b3JcbiAgICAgIGlmIChjb2xvbmlkeCA9PT0gLTEpIHtcbiAgICAgICAgbmFtZSA9IGV2ZW50XG4gICAgICAgIGRlbC5vbihuYW1lLCBwcm94eShjb21wb25lbnQub25bZXZlbnRdKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgPSBldmVudC5zdWJzdHIoMCwgY29sb25pZHgpXG4gICAgICAgIHNlbGVjdG9yID0gZXZlbnQuc3Vic3RyKGNvbG9uaWR4ICsgMSlcbiAgICAgICAgZGVsLm9uKG5hbWUsIHNlbGVjdG9yLCBwcm94eShjb21wb25lbnQub25bZXZlbnRdKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVsXG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnREYXRhIChlbCwgY29tcG9uZW50TmFtZSwgcGFyZW50KSB7XG4gIHZhciBhdHRyID0gZWwuZ2V0QXR0cmlidXRlKGNvbXBvbmVudE5hbWUpXG4gIHJldHVybiBhdHRyICYmIGdldChwYXJlbnQsIGF0dHIpXG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyQ29tcG9uZW50IChuYW1lLCBvYmopIHtcbiAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGtleSBpbiBuYW1lKSB7XG4gICAgICBpZiAobmFtZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHJlZ2lzdGVyW2tleV0gPSBuYW1lW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVnaXN0ZXJbbmFtZV0gPSBvYmpcbiAgfVxufVxuXG4vKipcbiogQ29udmVydCBhIE5vZGVMaXN0IGludG8gYW4gQXJyYXlcbiogQG1ldGhvZCBub2RlTGlzdFRvQXJyYXlcbiogQHBhcmFtIE5vZGVMaXN0IG5vZGVMaXN0XG4qIEByZXR1cm4gbm9kZUFycmF5XG4qL1xuZnVuY3Rpb24gbm9kZUxpc3RUb0FycmF5IChub2RlTGlzdCkge1xuICB2YXIgbm9kZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIG5vZGVBcnJheS5wdXNoKG5vZGVMaXN0W2ldKVxuICB9XG4gIHJldHVybiBub2RlQXJyYXlcbn1cblxuZnVuY3Rpb24gZ2V0TWF0Y2hpbmdFbGVtZW50cyAoZWwsIGNoaWxkcmVuT25seSkge1xuICB2YXIgc2VsZWN0b3IgPSBEb20uX3JlZ2lzdGVyLnNlbGVjdG9yXG4gIHZhciBtYXRjaGVzID0gbm9kZUxpc3RUb0FycmF5KGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKVxuXG4gIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IGdldEVsZW1lbnRDb21wb25lbnQoZWwpXG5cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICBtYXRjaGVzLnVuc2hpZnQoZWwpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXNcbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudERlcHRoIChlbCwgcGFyZW50KSB7XG4gIHZhciBkZXB0aCA9IDBcbiAgd2hpbGUgKGVsLnBhcmVudE5vZGUgJiYgZWwgIT09IHBhcmVudCkge1xuICAgIGRlcHRoKytcbiAgICBlbCA9IGVsLnBhcmVudE5vZGVcbiAgfVxuICByZXR1cm4gZGVwdGhcbn1cblxuZnVuY3Rpb24gZmluZFBhcmVudENvbnRleHQgKGVsLCBjb250ZXh0cykge1xuICBkbyB7XG4gICAgZWwgPSBlbC5wYXJlbnROb2RlXG4gICAgaWYgKGVsKSB7XG4gICAgICBmb3IgKHZhciBpID0gY29udGV4dHMubGVuZ3RoIC0gMTsgaSA+IC0xIDsgaS0tKSB7XG4gICAgICAgIGlmIChjb250ZXh0c1tpXS5jdHguX18uZWwgPT09IGVsKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHRzW2ldLmN0eFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IHdoaWxlIChlbClcbn1cblxuZnVuY3Rpb24gc2V0SHRtbCAoZWwsIGNvbXBvbmVudCwgY3R4KSB7XG4gIHZhciBodG1sID0gKHR5cGVvZiBjb21wb25lbnQudGVtcGxhdGUgPT09ICdmdW5jdGlvbicpXG4gICAgPyBjb21wb25lbnQudGVtcGxhdGUuY2FsbChjdHgsIGN0eClcbiAgICA6IGNvbXBvbmVudC50ZW1wbGF0ZVxuXG4gIGVsLmlubmVySFRNTCA9IGh0bWxcbn1cblxuZnVuY3Rpb24gcmVuZGVyZXIgKGN1cnJFbCwgY29tcG9uZW50LCBjdHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChkb250U2Nhbikge1xuICAgIHNldEh0bWwoY3VyckVsLCBjb21wb25lbnQsIGN0eClcbiAgICBpZiAoIWRvbnRTY2FuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJFbC5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBEb20uc2NhbihjdXJyRWwuY2hpbGRyZW5baV0sIGN0eC5kYXRhLCBjdHgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVyIChjb21wb25lbnQsIGN0eCwgZWwsIGRhdGEpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBjb21wb25lbnQuaW5pdGlhbGl6ZS5jYWxsKGN0eCwgZWwsIGRhdGEpXG4gIH1cbn1cblxuZnVuY3Rpb24gc2NhbiAoZWwsIGRhdGEsIHBhcmVudCkge1xuICB2YXIgbWF0Y2hlcyA9IGdldE1hdGNoaW5nRWxlbWVudHMoZWwpXG4gIHZhciBjb250ZXh0cyA9IFtdXG4gIHZhciBpbml0aWFsaXplcnMgPSBbXVxuICB2YXIgY3VyckVsXG5cbiAgd2hpbGUgKG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgY3VyckVsID0gbWF0Y2hlcy5zaGlmdCgpXG4gICAgdmFyIHJlZiA9IGdldEVsZW1lbnRDb21wb25lbnQoY3VyckVsKVxuICAgIHZhciBjb21wb25lbnQgPSByZWYuY29tcG9uZW50XG4gICAgdmFyIGRlcHRoID0gZ2V0RWxlbWVudERlcHRoKGN1cnJFbCwgZWwpXG4gICAgdmFyIHBhcmVudENvbnRleHQgPSBmaW5kUGFyZW50Q29udGV4dChjdXJyRWwsIGNvbnRleHRzKSB8fCBwYXJlbnRcbiAgICB2YXIgcGFyZW50RGF0YSA9IHBhcmVudENvbnRleHQgPyBwYXJlbnRDb250ZXh0LmRhdGEgOiBkYXRhXG4gICAgdmFyIGVsRGF0YSA9IGdldEVsZW1lbnREYXRhKGN1cnJFbCwgcmVmLmtleSwgcGFyZW50RGF0YSkgfHwgcGFyZW50RGF0YVxuICAgIHZhciBjdHggPSBjcmVhdGVDb250ZXh0KGN1cnJFbCwgZWxEYXRhLCBjb21wb25lbnQsIHBhcmVudENvbnRleHQpXG4gICAgdmFyIGRlbCA9IGNyZWF0ZUVsZW1lbnREZWxlZ2F0ZShjdXJyRWwsIGN0eCwgY29tcG9uZW50KVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0eC5fXywgJ2RlbCcsIHsgdmFsdWU6IGRlbCB9KVxuXG4gICAgZXh0ZW5kKGN0eCwgY29tcG9uZW50KVxuXG4gICAgY29udGV4dHMucHVzaCh7IGRlcHRoOiBkZXB0aCwgY3R4OiBjdHggfSlcblxuICAgIGlmIChjb21wb25lbnQuaW5pdGlhbGl6ZSkge1xuICAgICAgaW5pdGlhbGl6ZXJzLnB1c2goaW5pdGlhbGl6ZXIoY29tcG9uZW50LCBjdHgsIGN1cnJFbCwgZWxEYXRhKSlcbiAgICB9XG5cbiAgICBpZiAoY29tcG9uZW50LnRlbXBsYXRlKSB7XG4gICAgICB2YXIgcmVuZGVyID0gcmVuZGVyZXIoY3VyckVsLCBjb21wb25lbnQsIGN0eClcbiAgICAgIHJlbmRlcih0cnVlKVxuICAgICAgdmFyIGNoaWxkcmVuID0gZ2V0TWF0Y2hpbmdFbGVtZW50cyhjdXJyRWwsIHRydWUpXG4gICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KG1hdGNoZXMsIGNoaWxkcmVuKVxuICAgICAgfVxuICAgICAgY3R4Ll9fLnJlbmRlciA9IHJlbmRlclxuICAgIH1cbiAgfVxuXG4gIHZhciBpLCBqXG4gIGZvciAoaSA9IGNvbnRleHRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGFsaWFzQ29udGV4dCA9IGNvbnRleHRzW2ldLmN0eFxuICAgIHZhciBhbGlhc0VsID0gYWxpYXNDb250ZXh0Ll9fLmVsXG4gICAgdmFyIGFsaWFzZXMgPSBhbGlhc0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1thc106bm90KFthcz1cIlwiXSknKVxuICAgIGZvciAoaiA9IDA7IGogPCBhbGlhc2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICB2YXIgYXR0ciA9IGFsaWFzZXNbal0uZ2V0QXR0cmlidXRlKCdhcycpXG4gICAgICBhbGlhc0NvbnRleHRbYXR0cl0gPSBhbGlhc2VzW2pdXG4gICAgICBhbGlhc2VzW2pdLnJlbW92ZUF0dHJpYnV0ZSgnYXMnKVxuICAgIH1cbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBpbml0aWFsaXplcnMubGVuZ3RoOyBpKyspIHtcbiAgICBpbml0aWFsaXplcnNbaV0oKVxuICB9XG59XG5cbnZhciBEb20gPSBPYmplY3QuY3JlYXRlKHt9LCB7XG4gIF9yZWdpc3RlcjogeyB2YWx1ZTogcmVnaXN0ZXIgfSxcbiAgcmVnaXN0ZXI6IHsgdmFsdWU6IHJlZ2lzdGVyQ29tcG9uZW50IH0sXG4gIHNjYW46IHsgdmFsdWU6IHNjYW4gfVxufSlcblxubW9kdWxlLmV4cG9ydHMgPSBEb21cbiIsIi8qanNoaW50IGJyb3dzZXI6dHJ1ZSwgbm9kZTp0cnVlKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlbGVnYXRlO1xuXG4vKipcbiAqIERPTSBldmVudCBkZWxlZ2F0b3JcbiAqXG4gKiBUaGUgZGVsZWdhdG9yIHdpbGwgbGlzdGVuXG4gKiBmb3IgZXZlbnRzIHRoYXQgYnViYmxlIHVwXG4gKiB0byB0aGUgcm9vdCBub2RlLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtOb2RlfHN0cmluZ30gW3Jvb3RdIFRoZSByb290IG5vZGUgb3IgYSBzZWxlY3RvciBzdHJpbmcgbWF0Y2hpbmcgdGhlIHJvb3Qgbm9kZVxuICovXG5mdW5jdGlvbiBEZWxlZ2F0ZShyb290KSB7XG5cbiAgLyoqXG4gICAqIE1haW50YWluIGEgbWFwIG9mIGxpc3RlbmVyXG4gICAqIGxpc3RzLCBrZXllZCBieSBldmVudCBuYW1lLlxuICAgKlxuICAgKiBAdHlwZSBPYmplY3RcbiAgICovXG4gIHRoaXMubGlzdGVuZXJNYXAgPSBbe30sIHt9XTtcbiAgaWYgKHJvb3QpIHtcbiAgICB0aGlzLnJvb3Qocm9vdCk7XG4gIH1cblxuICAvKiogQHR5cGUgZnVuY3Rpb24oKSAqL1xuICB0aGlzLmhhbmRsZSA9IERlbGVnYXRlLnByb3RvdHlwZS5oYW5kbGUuYmluZCh0aGlzKTtcbn1cblxuLyoqXG4gKiBTdGFydCBsaXN0ZW5pbmcgZm9yIGV2ZW50c1xuICogb24gdGhlIHByb3ZpZGVkIERPTSBlbGVtZW50XG4gKlxuICogQHBhcmFtICB7Tm9kZXxzdHJpbmd9IFtyb290XSBUaGUgcm9vdCBub2RlIG9yIGEgc2VsZWN0b3Igc3RyaW5nIG1hdGNoaW5nIHRoZSByb290IG5vZGVcbiAqIEByZXR1cm5zIHtEZWxlZ2F0ZX0gVGhpcyBtZXRob2QgaXMgY2hhaW5hYmxlXG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5yb290ID0gZnVuY3Rpb24ocm9vdCkge1xuICB2YXIgbGlzdGVuZXJNYXAgPSB0aGlzLmxpc3RlbmVyTWFwO1xuICB2YXIgZXZlbnRUeXBlO1xuXG4gIC8vIFJlbW92ZSBtYXN0ZXIgZXZlbnQgbGlzdGVuZXJzXG4gIGlmICh0aGlzLnJvb3RFbGVtZW50KSB7XG4gICAgZm9yIChldmVudFR5cGUgaW4gbGlzdGVuZXJNYXBbMV0pIHtcbiAgICAgIGlmIChsaXN0ZW5lck1hcFsxXS5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKSB7XG4gICAgICAgIHRoaXMucm9vdEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIHRoaXMuaGFuZGxlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChldmVudFR5cGUgaW4gbGlzdGVuZXJNYXBbMF0pIHtcbiAgICAgIGlmIChsaXN0ZW5lck1hcFswXS5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKSB7XG4gICAgICAgIHRoaXMucm9vdEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIHRoaXMuaGFuZGxlLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgbm8gcm9vdCBvciByb290IGlzIG5vdFxuICAvLyBhIGRvbSBub2RlLCB0aGVuIHJlbW92ZSBpbnRlcm5hbFxuICAvLyByb290IHJlZmVyZW5jZSBhbmQgZXhpdCBoZXJlXG4gIGlmICghcm9vdCB8fCAhcm9vdC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMucm9vdEVsZW1lbnQpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLnJvb3RFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcm9vdCBub2RlIGF0IHdoaWNoXG4gICAqIGxpc3RlbmVycyBhcmUgYXR0YWNoZWQuXG4gICAqXG4gICAqIEB0eXBlIE5vZGVcbiAgICovXG4gIHRoaXMucm9vdEVsZW1lbnQgPSByb290O1xuXG4gIC8vIFNldCB1cCBtYXN0ZXIgZXZlbnQgbGlzdGVuZXJzXG4gIGZvciAoZXZlbnRUeXBlIGluIGxpc3RlbmVyTWFwWzFdKSB7XG4gICAgaWYgKGxpc3RlbmVyTWFwWzFdLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpIHtcbiAgICAgIHRoaXMucm9vdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIHRoaXMuaGFuZGxlLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgZm9yIChldmVudFR5cGUgaW4gbGlzdGVuZXJNYXBbMF0pIHtcbiAgICBpZiAobGlzdGVuZXJNYXBbMF0uaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSkge1xuICAgICAgdGhpcy5yb290RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZVxuICogQHJldHVybnMgYm9vbGVhblxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUuY2FwdHVyZUZvclR5cGUgPSBmdW5jdGlvbihldmVudFR5cGUpIHtcbiAgcmV0dXJuIFsnYmx1cicsICdlcnJvcicsICdmb2N1cycsICdsb2FkJywgJ3Jlc2l6ZScsICdzY3JvbGwnXS5pbmRleE9mKGV2ZW50VHlwZSkgIT09IC0xO1xufTtcblxuLyoqXG4gKiBBdHRhY2ggYSBoYW5kbGVyIHRvIG9uZVxuICogZXZlbnQgZm9yIGFsbCBlbGVtZW50c1xuICogdGhhdCBtYXRjaCB0aGUgc2VsZWN0b3IsXG4gKiBub3cgb3IgaW4gdGhlIGZ1dHVyZVxuICpcbiAqIFRoZSBoYW5kbGVyIGZ1bmN0aW9uIHJlY2VpdmVzXG4gKiB0aHJlZSBhcmd1bWVudHM6IHRoZSBET00gZXZlbnRcbiAqIG9iamVjdCwgdGhlIG5vZGUgdGhhdCBtYXRjaGVkXG4gKiB0aGUgc2VsZWN0b3Igd2hpbGUgdGhlIGV2ZW50XG4gKiB3YXMgYnViYmxpbmcgYW5kIGEgcmVmZXJlbmNlXG4gKiB0byBpdHNlbGYuIFdpdGhpbiB0aGUgaGFuZGxlcixcbiAqICd0aGlzJyBpcyBlcXVhbCB0byB0aGUgc2Vjb25kXG4gKiBhcmd1bWVudC5cbiAqXG4gKiBUaGUgbm9kZSB0aGF0IGFjdHVhbGx5IHJlY2VpdmVkXG4gKiB0aGUgZXZlbnQgY2FuIGJlIGFjY2Vzc2VkIHZpYVxuICogJ2V2ZW50LnRhcmdldCcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBMaXN0ZW4gZm9yIHRoZXNlIGV2ZW50c1xuICogQHBhcmFtIHtzdHJpbmd8dW5kZWZpbmVkfSBzZWxlY3RvciBPbmx5IGhhbmRsZSBldmVudHMgb24gZWxlbWVudHMgbWF0Y2hpbmcgdGhpcyBzZWxlY3RvciwgaWYgdW5kZWZpbmVkIG1hdGNoIHJvb3QgZWxlbWVudFxuICogQHBhcmFtIHtmdW5jdGlvbigpfSBoYW5kbGVyIEhhbmRsZXIgZnVuY3Rpb24gLSBldmVudCBkYXRhIHBhc3NlZCBoZXJlIHdpbGwgYmUgaW4gZXZlbnQuZGF0YVxuICogQHBhcmFtIHtPYmplY3R9IFtldmVudERhdGFdIERhdGEgdG8gcGFzcyBpbiBldmVudC5kYXRhXG4gKiBAcmV0dXJucyB7RGVsZWdhdGV9IFRoaXMgbWV0aG9kIGlzIGNoYWluYWJsZVxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldmVudFR5cGUsIHNlbGVjdG9yLCBoYW5kbGVyLCB1c2VDYXB0dXJlKSB7XG4gIHZhciByb290LCBsaXN0ZW5lck1hcCwgbWF0Y2hlciwgbWF0Y2hlclBhcmFtO1xuXG4gIGlmICghZXZlbnRUeXBlKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBldmVudCB0eXBlOiAnICsgZXZlbnRUeXBlKTtcbiAgfVxuXG4gIC8vIGhhbmRsZXIgY2FuIGJlIHBhc3NlZCBhc1xuICAvLyB0aGUgc2Vjb25kIG9yIHRoaXJkIGFyZ3VtZW50XG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICB1c2VDYXB0dXJlID0gaGFuZGxlcjtcbiAgICBoYW5kbGVyID0gc2VsZWN0b3I7XG4gICAgc2VsZWN0b3IgPSBudWxsO1xuICB9XG5cbiAgLy8gRmFsbGJhY2sgdG8gc2Vuc2libGUgZGVmYXVsdHNcbiAgLy8gaWYgdXNlQ2FwdHVyZSBub3Qgc2V0XG4gIGlmICh1c2VDYXB0dXJlID09PSB1bmRlZmluZWQpIHtcbiAgICB1c2VDYXB0dXJlID0gdGhpcy5jYXB0dXJlRm9yVHlwZShldmVudFR5cGUpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSGFuZGxlciBtdXN0IGJlIGEgdHlwZSBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgcm9vdCA9IHRoaXMucm9vdEVsZW1lbnQ7XG4gIGxpc3RlbmVyTWFwID0gdGhpcy5saXN0ZW5lck1hcFt1c2VDYXB0dXJlID8gMSA6IDBdO1xuXG4gIC8vIEFkZCBtYXN0ZXIgaGFuZGxlciBmb3IgdHlwZSBpZiBub3QgY3JlYXRlZCB5ZXRcbiAgaWYgKCFsaXN0ZW5lck1hcFtldmVudFR5cGVdKSB7XG4gICAgaWYgKHJvb3QpIHtcbiAgICAgIHJvb3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIHRoaXMuaGFuZGxlLCB1c2VDYXB0dXJlKTtcbiAgICB9XG4gICAgbGlzdGVuZXJNYXBbZXZlbnRUeXBlXSA9IFtdO1xuICB9XG5cbiAgaWYgKCFzZWxlY3Rvcikge1xuICAgIG1hdGNoZXJQYXJhbSA9IG51bGw7XG5cbiAgICAvLyBDT01QTEVYIC0gbWF0Y2hlc1Jvb3QgbmVlZHMgdG8gaGF2ZSBhY2Nlc3MgdG9cbiAgICAvLyB0aGlzLnJvb3RFbGVtZW50LCBzbyBiaW5kIHRoZSBmdW5jdGlvbiB0byB0aGlzLlxuICAgIG1hdGNoZXIgPSBtYXRjaGVzUm9vdC5iaW5kKHRoaXMpO1xuXG4gIC8vIENvbXBpbGUgYSBtYXRjaGVyIGZvciB0aGUgZ2l2ZW4gc2VsZWN0b3JcbiAgfSBlbHNlIGlmICgvXlthLXpdKyQvaS50ZXN0KHNlbGVjdG9yKSkge1xuICAgIG1hdGNoZXJQYXJhbSA9IHNlbGVjdG9yO1xuICAgIG1hdGNoZXIgPSBtYXRjaGVzVGFnO1xuICB9IGVsc2UgaWYgKC9eI1thLXowLTlcXC1fXSskL2kudGVzdChzZWxlY3RvcikpIHtcbiAgICBtYXRjaGVyUGFyYW0gPSBzZWxlY3Rvci5zbGljZSgxKTtcbiAgICBtYXRjaGVyID0gbWF0Y2hlc0lkO1xuICB9IGVsc2Uge1xuICAgIG1hdGNoZXJQYXJhbSA9IHNlbGVjdG9yO1xuICAgIG1hdGNoZXIgPSBtYXRjaGVzO1xuICB9XG5cbiAgLy8gQWRkIHRvIHRoZSBsaXN0IG9mIGxpc3RlbmVyc1xuICBsaXN0ZW5lck1hcFtldmVudFR5cGVdLnB1c2goe1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgIG1hdGNoZXI6IG1hdGNoZXIsXG4gICAgbWF0Y2hlclBhcmFtOiBtYXRjaGVyUGFyYW1cbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBldmVudCBoYW5kbGVyXG4gKiBmb3IgZWxlbWVudHMgdGhhdCBtYXRjaFxuICogdGhlIHNlbGVjdG9yLCBmb3JldmVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IFtldmVudFR5cGVdIFJlbW92ZSBoYW5kbGVycyBmb3IgZXZlbnRzIG1hdGNoaW5nIHRoaXMgdHlwZSwgY29uc2lkZXJpbmcgdGhlIG90aGVyIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc2VsZWN0b3JdIElmIHRoaXMgcGFyYW1ldGVyIGlzIG9taXR0ZWQsIG9ubHkgaGFuZGxlcnMgd2hpY2ggbWF0Y2ggdGhlIG90aGVyIHR3byB3aWxsIGJlIHJlbW92ZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gW2hhbmRsZXJdIElmIHRoaXMgcGFyYW1ldGVyIGlzIG9taXR0ZWQsIG9ubHkgaGFuZGxlcnMgd2hpY2ggbWF0Y2ggdGhlIHByZXZpb3VzIHR3byB3aWxsIGJlIHJlbW92ZWRcbiAqIEByZXR1cm5zIHtEZWxlZ2F0ZX0gVGhpcyBtZXRob2QgaXMgY2hhaW5hYmxlXG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbihldmVudFR5cGUsIHNlbGVjdG9yLCBoYW5kbGVyLCB1c2VDYXB0dXJlKSB7XG4gIHZhciBpLCBsaXN0ZW5lciwgbGlzdGVuZXJNYXAsIGxpc3RlbmVyTGlzdCwgc2luZ2xlRXZlbnRUeXBlO1xuXG4gIC8vIEhhbmRsZXIgY2FuIGJlIHBhc3NlZCBhc1xuICAvLyB0aGUgc2Vjb25kIG9yIHRoaXJkIGFyZ3VtZW50XG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICB1c2VDYXB0dXJlID0gaGFuZGxlcjtcbiAgICBoYW5kbGVyID0gc2VsZWN0b3I7XG4gICAgc2VsZWN0b3IgPSBudWxsO1xuICB9XG5cbiAgLy8gSWYgdXNlQ2FwdHVyZSBub3Qgc2V0LCByZW1vdmVcbiAgLy8gYWxsIGV2ZW50IGxpc3RlbmVyc1xuICBpZiAodXNlQ2FwdHVyZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5vZmYoZXZlbnRUeXBlLCBzZWxlY3RvciwgaGFuZGxlciwgdHJ1ZSk7XG4gICAgdGhpcy5vZmYoZXZlbnRUeXBlLCBzZWxlY3RvciwgaGFuZGxlciwgZmFsc2UpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJNYXAgPSB0aGlzLmxpc3RlbmVyTWFwW3VzZUNhcHR1cmUgPyAxIDogMF07XG4gIGlmICghZXZlbnRUeXBlKSB7XG4gICAgZm9yIChzaW5nbGVFdmVudFR5cGUgaW4gbGlzdGVuZXJNYXApIHtcbiAgICAgIGlmIChsaXN0ZW5lck1hcC5oYXNPd25Qcm9wZXJ0eShzaW5nbGVFdmVudFR5cGUpKSB7XG4gICAgICAgIHRoaXMub2ZmKHNpbmdsZUV2ZW50VHlwZSwgc2VsZWN0b3IsIGhhbmRsZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJMaXN0ID0gbGlzdGVuZXJNYXBbZXZlbnRUeXBlXTtcbiAgaWYgKCFsaXN0ZW5lckxpc3QgfHwgIWxpc3RlbmVyTGlzdC5sZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIFJlbW92ZSBvbmx5IHBhcmFtZXRlciBtYXRjaGVzXG4gIC8vIGlmIHNwZWNpZmllZFxuICBmb3IgKGkgPSBsaXN0ZW5lckxpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBsaXN0ZW5lciA9IGxpc3RlbmVyTGlzdFtpXTtcblxuICAgIGlmICgoIXNlbGVjdG9yIHx8IHNlbGVjdG9yID09PSBsaXN0ZW5lci5zZWxlY3RvcikgJiYgKCFoYW5kbGVyIHx8IGhhbmRsZXIgPT09IGxpc3RlbmVyLmhhbmRsZXIpKSB7XG4gICAgICBsaXN0ZW5lckxpc3Quc3BsaWNlKGksIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEFsbCBsaXN0ZW5lcnMgcmVtb3ZlZFxuICBpZiAoIWxpc3RlbmVyTGlzdC5sZW5ndGgpIHtcbiAgICBkZWxldGUgbGlzdGVuZXJNYXBbZXZlbnRUeXBlXTtcblxuICAgIC8vIFJlbW92ZSB0aGUgbWFpbiBoYW5kbGVyXG4gICAgaWYgKHRoaXMucm9vdEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucm9vdEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIHRoaXMuaGFuZGxlLCB1c2VDYXB0dXJlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBIYW5kbGUgYW4gYXJiaXRyYXJ5IGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5oYW5kbGUgPSBmdW5jdGlvbihldmVudCkge1xuICB2YXIgaSwgbCwgdHlwZSA9IGV2ZW50LnR5cGUsIHJvb3QsIHBoYXNlLCBsaXN0ZW5lciwgcmV0dXJuZWQsIGxpc3RlbmVyTGlzdCA9IFtdLCB0YXJnZXQsIC8qKiBAY29uc3QgKi8gRVZFTlRJR05PUkUgPSAnZnRMYWJzRGVsZWdhdGVJZ25vcmUnO1xuXG4gIGlmIChldmVudFtFVkVOVElHTk9SRV0gPT09IHRydWUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cbiAgLy8gSGFyZGNvZGUgdmFsdWUgb2YgTm9kZS5URVhUX05PREVcbiAgLy8gYXMgbm90IGRlZmluZWQgaW4gSUU4XG4gIGlmICh0YXJnZXQubm9kZVR5cGUgPT09IDMpIHtcbiAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcbiAgfVxuXG4gIHJvb3QgPSB0aGlzLnJvb3RFbGVtZW50O1xuXG4gIHBoYXNlID0gZXZlbnQuZXZlbnRQaGFzZSB8fCAoIGV2ZW50LnRhcmdldCAhPT0gZXZlbnQuY3VycmVudFRhcmdldCA/IDMgOiAyICk7XG4gIFxuICBzd2l0Y2ggKHBoYXNlKSB7XG4gICAgY2FzZSAxOiAvL0V2ZW50LkNBUFRVUklOR19QSEFTRTpcbiAgICAgIGxpc3RlbmVyTGlzdCA9IHRoaXMubGlzdGVuZXJNYXBbMV1bdHlwZV07XG4gICAgYnJlYWs7XG4gICAgY2FzZSAyOiAvL0V2ZW50LkFUX1RBUkdFVDpcbiAgICAgIGlmICh0aGlzLmxpc3RlbmVyTWFwWzBdICYmIHRoaXMubGlzdGVuZXJNYXBbMF1bdHlwZV0pIGxpc3RlbmVyTGlzdCA9IGxpc3RlbmVyTGlzdC5jb25jYXQodGhpcy5saXN0ZW5lck1hcFswXVt0eXBlXSk7XG4gICAgICBpZiAodGhpcy5saXN0ZW5lck1hcFsxXSAmJiB0aGlzLmxpc3RlbmVyTWFwWzFdW3R5cGVdKSBsaXN0ZW5lckxpc3QgPSBsaXN0ZW5lckxpc3QuY29uY2F0KHRoaXMubGlzdGVuZXJNYXBbMV1bdHlwZV0pO1xuICAgIGJyZWFrO1xuICAgIGNhc2UgMzogLy9FdmVudC5CVUJCTElOR19QSEFTRTpcbiAgICAgIGxpc3RlbmVyTGlzdCA9IHRoaXMubGlzdGVuZXJNYXBbMF1bdHlwZV07XG4gICAgYnJlYWs7XG4gIH1cblxuICAvLyBOZWVkIHRvIGNvbnRpbnVvdXNseSBjaGVja1xuICAvLyB0aGF0IHRoZSBzcGVjaWZpYyBsaXN0IGlzXG4gIC8vIHN0aWxsIHBvcHVsYXRlZCBpbiBjYXNlIG9uZVxuICAvLyBvZiB0aGUgY2FsbGJhY2tzIGFjdHVhbGx5XG4gIC8vIGNhdXNlcyB0aGUgbGlzdCB0byBiZSBkZXN0cm95ZWQuXG4gIGwgPSBsaXN0ZW5lckxpc3QubGVuZ3RoO1xuICB3aGlsZSAodGFyZ2V0ICYmIGwpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyTGlzdFtpXTtcblxuICAgICAgLy8gQmFpbCBmcm9tIHRoaXMgbG9vcCBpZlxuICAgICAgLy8gdGhlIGxlbmd0aCBjaGFuZ2VkIGFuZFxuICAgICAgLy8gbm8gbW9yZSBsaXN0ZW5lcnMgYXJlXG4gICAgICAvLyBkZWZpbmVkIGJldHdlZW4gaSBhbmQgbC5cbiAgICAgIGlmICghbGlzdGVuZXIpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGZvciBtYXRjaCBhbmQgZmlyZVxuICAgICAgLy8gdGhlIGV2ZW50IGlmIHRoZXJlJ3Mgb25lXG4gICAgICAvL1xuICAgICAgLy8gVE9ETzpNQ0c6MjAxMjAxMTc6IE5lZWQgYSB3YXlcbiAgICAgIC8vIHRvIGNoZWNrIGlmIGV2ZW50I3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblxuICAgICAgLy8gd2FzIGNhbGxlZC4gSWYgc28sIGJyZWFrIGJvdGggbG9vcHMuXG4gICAgICBpZiAobGlzdGVuZXIubWF0Y2hlci5jYWxsKHRhcmdldCwgbGlzdGVuZXIubWF0Y2hlclBhcmFtLCB0YXJnZXQpKSB7XG4gICAgICAgIHJldHVybmVkID0gdGhpcy5maXJlKGV2ZW50LCB0YXJnZXQsIGxpc3RlbmVyKTtcbiAgICAgIH1cblxuICAgICAgLy8gU3RvcCBwcm9wYWdhdGlvbiB0byBzdWJzZXF1ZW50XG4gICAgICAvLyBjYWxsYmFja3MgaWYgdGhlIGNhbGxiYWNrIHJldHVybmVkXG4gICAgICAvLyBmYWxzZVxuICAgICAgaWYgKHJldHVybmVkID09PSBmYWxzZSkge1xuICAgICAgICBldmVudFtFVkVOVElHTk9SRV0gPSB0cnVlO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVE9ETzpNQ0c6MjAxMjAxMTc6IE5lZWQgYSB3YXkgdG9cbiAgICAvLyBjaGVjayBpZiBldmVudCNzdG9wUHJvcGFnYXRpb25cbiAgICAvLyB3YXMgY2FsbGVkLiBJZiBzbywgYnJlYWsgbG9vcGluZ1xuICAgIC8vIHRocm91Z2ggdGhlIERPTS4gU3RvcCBpZiB0aGVcbiAgICAvLyBkZWxlZ2F0aW9uIHJvb3QgaGFzIGJlZW4gcmVhY2hlZFxuICAgIGlmICh0YXJnZXQgPT09IHJvb3QpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGwgPSBsaXN0ZW5lckxpc3QubGVuZ3RoO1xuICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnRFbGVtZW50O1xuICB9XG59O1xuXG4vKipcbiAqIEZpcmUgYSBsaXN0ZW5lciBvbiBhIHRhcmdldC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBsaXN0ZW5lclxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5maXJlID0gZnVuY3Rpb24oZXZlbnQsIHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgcmV0dXJuIGxpc3RlbmVyLmhhbmRsZXIuY2FsbCh0YXJnZXQsIGV2ZW50LCB0YXJnZXQpO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIGVsZW1lbnRcbiAqIG1hdGNoZXMgYSBnZW5lcmljIHNlbGVjdG9yLlxuICpcbiAqIEB0eXBlIGZ1bmN0aW9uKClcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciBBIENTUyBzZWxlY3RvclxuICovXG52YXIgbWF0Y2hlcyA9IChmdW5jdGlvbihlbCkge1xuICBpZiAoIWVsKSByZXR1cm47XG4gIHZhciBwID0gZWwucHJvdG90eXBlO1xuICByZXR1cm4gKHAubWF0Y2hlcyB8fCBwLm1hdGNoZXNTZWxlY3RvciB8fCBwLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBwLm1vek1hdGNoZXNTZWxlY3RvciB8fCBwLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IHAub01hdGNoZXNTZWxlY3Rvcik7XG59KEVsZW1lbnQpKTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIGVsZW1lbnRcbiAqIG1hdGNoZXMgYSB0YWcgc2VsZWN0b3IuXG4gKlxuICogVGFncyBhcmUgTk9UIGNhc2Utc2Vuc2l0aXZlLFxuICogZXhjZXB0IGluIFhNTCAoYW5kIFhNTC1iYXNlZFxuICogbGFuZ3VhZ2VzIHN1Y2ggYXMgWEhUTUwpLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWdOYW1lIFRoZSB0YWcgbmFtZSB0byB0ZXN0IGFnYWluc3RcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byB0ZXN0IHdpdGhcbiAqIEByZXR1cm5zIGJvb2xlYW5cbiAqL1xuZnVuY3Rpb24gbWF0Y2hlc1RhZyh0YWdOYW1lLCBlbGVtZW50KSB7XG4gIHJldHVybiB0YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gZWxlbWVudFxuICogbWF0Y2hlcyB0aGUgcm9vdC5cbiAqXG4gKiBAcGFyYW0gez9TdHJpbmd9IHNlbGVjdG9yIEluIHRoaXMgY2FzZSB0aGlzIGlzIGFsd2F5cyBwYXNzZWQgdGhyb3VnaCBhcyBudWxsIGFuZCBub3QgdXNlZFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHRlc3Qgd2l0aFxuICogQHJldHVybnMgYm9vbGVhblxuICovXG5mdW5jdGlvbiBtYXRjaGVzUm9vdChzZWxlY3RvciwgZWxlbWVudCkge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSovXG4gIGlmICh0aGlzLnJvb3RFbGVtZW50ID09PSB3aW5kb3cpIHJldHVybiBlbGVtZW50ID09PSBkb2N1bWVudDtcbiAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQgPT09IGVsZW1lbnQ7XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgSUQgb2ZcbiAqIHRoZSBlbGVtZW50IGluICd0aGlzJ1xuICogbWF0Y2hlcyB0aGUgZ2l2ZW4gSUQuXG4gKlxuICogSURzIGFyZSBjYXNlLXNlbnNpdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIHRvIHRlc3QgYWdhaW5zdFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHRlc3Qgd2l0aFxuICogQHJldHVybnMgYm9vbGVhblxuICovXG5mdW5jdGlvbiBtYXRjaGVzSWQoaWQsIGVsZW1lbnQpIHtcbiAgcmV0dXJuIGlkID09PSBlbGVtZW50LmlkO1xufVxuXG4vKipcbiAqIFNob3J0IGhhbmQgZm9yIG9mZigpXG4gKiBhbmQgcm9vdCgpLCBpZSBib3RoXG4gKiB3aXRoIG5vIHBhcmFtZXRlcnNcbiAqXG4gKiBAcmV0dXJuIHZvaWRcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vZmYoKTtcbiAgdGhpcy5yb290KCk7XG59O1xuIiwiLypqc2hpbnQgYnJvd3Nlcjp0cnVlLCBub2RlOnRydWUqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHByZXNlcnZlIENyZWF0ZSBhbmQgbWFuYWdlIGEgRE9NIGV2ZW50IGRlbGVnYXRvci5cbiAqXG4gKiBAdmVyc2lvbiAwLjMuMFxuICogQGNvZGluZ3N0YW5kYXJkIGZ0bGFicy1qc3YyXG4gKiBAY29weXJpZ2h0IFRoZSBGaW5hbmNpYWwgVGltZXMgTGltaXRlZCBbQWxsIFJpZ2h0cyBSZXNlcnZlZF1cbiAqIEBsaWNlbnNlIE1JVCBMaWNlbnNlIChzZWUgTElDRU5TRS50eHQpXG4gKi9cbnZhciBEZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyb290KSB7XG4gIHJldHVybiBuZXcgRGVsZWdhdGUocm9vdCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5EZWxlZ2F0ZSA9IERlbGVnYXRlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBnZXQ7XG5cbmZ1bmN0aW9uIGdldCAoY29udGV4dCwgcGF0aCkge1xuICBpZiAocGF0aC5pbmRleE9mKCcuJykgPT0gLTEgJiYgcGF0aC5pbmRleE9mKCdbJykgPT0gLTEpIHtcbiAgICByZXR1cm4gY29udGV4dFtwYXRoXTtcbiAgfVxuXG4gIHZhciBjcnVtYnMgPSBwYXRoLnNwbGl0KC9cXC58XFxbfFxcXS9nKTtcbiAgdmFyIGkgPSAtMTtcbiAgdmFyIGxlbiA9IGNydW1icy5sZW5ndGg7XG4gIHZhciByZXN1bHQ7XG5cbiAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgIGlmIChpID09IDApIHJlc3VsdCA9IGNvbnRleHQ7XG4gICAgaWYgKCFjcnVtYnNbaV0pIGNvbnRpbnVlO1xuICAgIGlmIChyZXN1bHQgPT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICByZXN1bHQgPSByZXN1bHRbY3J1bWJzW2ldXTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=
