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

function scan (el, data, parent) {
  var matches = getMatchingElements(el)
  var contexts = []
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
      component.initialize.call(ctx, currEl, elData)
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

  for (var i = contexts.length - 1; i >= 0; i--) {
    var aliasContext = contexts[i].ctx
    var aliasEl = aliasContext.__.el
    var aliases = aliasEl.querySelectorAll('[as]:not([as=""])')
    for (var j = 0; j < aliases.length; j++) {
      var attr = aliases[j].getAttribute('as')
      aliasContext[attr] = aliases[j]
      aliases[j].removeAttribute('as')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9sb2dpbi9pbmRleC5qcyIsImV4YW1wbGVzL2xvZ2luL3RlbXBsYXRlLmh0bWwiLCJleGFtcGxlcy90b2RvL19pdGVtLmh0bWwiLCJleGFtcGxlcy90b2RvL19saXN0Lmh0bWwiLCJleGFtcGxlcy90b2RvL19tZW51LWl0ZW0uaHRtbCIsImV4YW1wbGVzL3RvZG8vaW5kZXguanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20tZGVsZWdhdGUvbGliL2RlbGVnYXRlLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1kZWxlZ2F0ZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ2V0LW9iamVjdC1wYXRoL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBEb20gPSByZXF1aXJlKCcuLi8uLicpXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlLmh0bWwnKVxuXG52YXIgbG9naW4gPSB7XG4gIGVuYWJsZUJ1dHRvbjogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgc3RhdGVcbiAgICAgID8gdGhpcy5idXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICA6IHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKVxuICB9LFxuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIG9uOiB7XG4gICAgJ2tleXVwOmlucHV0JzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuZW5hYmxlQnV0dG9uKHRoaXMuZW1haWwudmFsdWUgJiYgdGhpcy5wYXNzd29yZC52YWx1ZSlcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdjbGljayBsb2dpbiBmb3JtIGlucHV0JywgdGhpcywgZSwgZGF0YSwgdGhpcy5mb3JtLmJ1dClcbiAgICB9LFxuICAgICdzdWJtaXQ6Zm9ybSc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHZhciBlbCA9IGUudGFyZ2V0XG5cbiAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IHdpbmRvdy5DdXN0b21FdmVudCgnbG9nZ2VkaW4nLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGNvbXBvbmVudDogdGhpc1xuICAgICAgICB9LFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZVxuICAgICAgfSkpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRG9tLnJlZ2lzdGVyKCdsb2dpbicsIGxvZ2luKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhbm9ueW1vdXMob2JqXG4vKiovKSB7XG52YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTt3aXRoKG9iail7cC5wdXNoKCc8Zm9ybT4gICA8bGVnZW5kPkxvZ2luIGZvcm08L2xlZ2VuZD4gICBFbWFpbDogPGlucHV0IGFzPVwiZW1haWxcInZhbHVlPVwiJywgZGF0YS5lbWFpbCAsJ1wiIHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ+PGJyPiAgIFBhc3N3b3JkOiA8aW5wdXQgYXM9XCJwYXNzd29yZFwiIHZhbHVlPVwiJywgZGF0YS5wYXNzd29yZCAsJ1wiIHR5cGU9XCJwYXNzd29yZFwiIHJlcXVpcmVkPiAgIDxidXR0b24gYXM9XCJidXR0b25cIiB0eXBlPVwic3VibWl0XCI+TG9naW48L2J1dHRvbj4gPC9mb3JtPiAnKTt9cmV0dXJuIHAuam9pbignJyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYW5vbnltb3VzKG9ialxuLyoqLykge1xudmFyIHA9W10scHJpbnQ9ZnVuY3Rpb24oKXtwLnB1c2guYXBwbHkocCxhcmd1bWVudHMpO307d2l0aChvYmope3AucHVzaCgnPHRkPiAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJywgZGF0YS50ZXh0ICwnXCI+IDwvdGQ+IDx0ZD4gICA8c3BhbiBhcz1cImRpc3BsYXlcIj4nLCBkaXNwbGF5VGV4dCgpICwnPC9zcGFuPiA8L3RkPiA8dGQ+ICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiICcsIGRhdGEuY29tcGxldGVkID8gJ2NoZWNrZWQnIDogJycgLCc+IDwvdGQ+ICcpO31yZXR1cm4gcC5qb2luKCcnKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhbm9ueW1vdXMob2JqXG4vKiovKSB7XG52YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTt3aXRoKG9iail7cC5wdXNoKCc8dGFibGUgYXM9XCJ0YWJsZVwiPiAgIDxjYXB0aW9uPicsIGRhdGEubmFtZSAsJzwvY2FwdGlvbj4gICA8dGJvZHkgYXM9XCJib2R5XCI+ICAgICAnKTsgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2Rvcy5sZW5ndGg7IGkrKykgeyBwLnB1c2goJyAgICAgICA8dHIgaXRlbT1cInRvZG9zWycsIGkgLCddXCI+PC90cj4gICAgICcpOyB9IHAucHVzaCgnICAgPC90Ym9keT4gICA8dGZvb3Q+ICAgICA8dHI+ICAgICAgIDx0ZD48aW5wdXQgaWQ9XCJuZXctdG9kb1wiIGFzPVwibmV3VG9kb1RleHRcIiB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJywgbmV3VG9kby50ZXh0ICwnXCIgcGxhY2Vob2xkZXI9XCJBZGQgbmV3IHRvZG9cIj48L3RkPiAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImFkZC10b2RvXCIgYXM9XCJhZGRUb2RvXCIgJywgaXNOZXdUb2RvVmFsaWQgPyAnJyA6ICdkaXNhYmxlZCcgLCc+QWRkIG5ldzwvYnV0dG9uPjwvdGQ+ICAgICAgIDx0ZD48YnV0dG9uIGlkPVwiY2xlYXItdG9kb3NcIiBhcz1cImNsZWFyVG9kb3NcIiAnLCBoYXNDb21wbGV0ZWQgPyAnJyA6ICdkaXNhYmxlZCcgLCc+Q2xlYXIgY29tcGxldGVkPC9idXR0b24+PC90ZD4gICAgIDwvdHI+ICAgPC90Zm9vdD4gPC90YWJsZT4gJyk7fXJldHVybiBwLmpvaW4oJycpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFub255bW91cyhvYmpcbi8qKi8pIHtcbnZhciBwPVtdLHByaW50PWZ1bmN0aW9uKCl7cC5wdXNoLmFwcGx5KHAsYXJndW1lbnRzKTt9O3dpdGgob2JqKXtwLnB1c2goJzxsaT48YSBocmVmPVwiJywgZGF0YS51cmwgLCdcIj4nLCBkYXRhLnRleHQgLCc8L2E+PC9saT4gJyk7fXJldHVybiBwLmpvaW4oJycpO1xufTsiLCJ2YXIgRG9tID0gcmVxdWlyZSgnLi4vLi4nKVxudmFyIGl0ZW1UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vX2l0ZW0uaHRtbCcpXG52YXIgbGlzdFRlbXBsYXRlID0gcmVxdWlyZSgnLi9fbGlzdC5odG1sJylcbnZhciBtZW51SXRlbVRlbXBsYXRlID0gcmVxdWlyZSgnLi9fbWVudS1pdGVtLmh0bWwnKVxuXG5yZXF1aXJlKCcuLi9sb2dpbicpXG5cbnZhciBpdGVtID0ge1xuICB1cGRhdGVEaXNwbGF5VGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGlzcGxheS5pbm5lckhUTUwgPSB0aGlzLmRpc3BsYXlUZXh0KClcbiAgfSxcbiAgZGlzcGxheVRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJygnICsgdGhpcy5kYXRhLnRleHQgKyAnKSdcbiAgfSxcbiAgdGVtcGxhdGU6IGl0ZW1UZW1wbGF0ZSxcbiAgb246IHtcbiAgICAnaW5wdXQ6aW5wdXRbdHlwZT10ZXh0XSc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLmRhdGEudGV4dCA9IGUudGFyZ2V0LnZhbHVlXG4gICAgICB0aGlzLnVwZGF0ZURpc3BsYXlUZXh0KClcbiAgICB9LFxuICAgICdjaGFuZ2U6aW5wdXRbdHlwZT1jaGVja2JveF0nOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5kYXRhLmNvbXBsZXRlZCA9IGUudGFyZ2V0LmNoZWNrZWRcbiAgICAgIHRoaXMuc2V0Q2xlYXJCdXR0b25TdGF0ZSgpXG4gICAgfVxuICB9XG59XG5cbnZhciBsaXN0ID0ge1xuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gQ3JlYXRlIHNvbWUgY29tbW9uIHVzZWQgcHJvcGVydGllc1xuICAgIHRoaXMudG9kb3MgPSB0aGlzLmRhdGEudG9kb3NcbiAgICB0aGlzLm5ld1RvZG8gPSB0aGlzLmRhdGEubmV3VG9kb1xuICB9LFxuICBnZXQgaGFzQ29tcGxldGVkICgpIHtcbiAgICByZXR1cm4gISF0aGlzLnRvZG9zLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLmNvbXBsZXRlZFxuICAgIH0pXG4gIH0sXG4gIGdldCBpc05ld1RvZG9WYWxpZCAoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5uZXdUb2RvLnRleHRcbiAgfSxcbiAgc2V0QWRkQnV0dG9uU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFkZFRvZG8uZGlzYWJsZWQgPSAhdGhpcy5pc05ld1RvZG9WYWxpZFxuICB9LFxuICBzZXRDbGVhckJ1dHRvblN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jbGVhclRvZG9zLmRpc2FibGVkID0gIXRoaXMuaGFzQ29tcGxldGVkXG4gIH0sXG4gIHRlbXBsYXRlOiBsaXN0VGVtcGxhdGUsXG4gIGNsZWFyQ29tcGxldGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRvZG9zID0gdGhpcy5kYXRhLnRvZG9zXG4gICAgdmFyIGxlbmd0aCA9IHRvZG9zLmxlbmd0aFxuICAgIGZvciAodmFyIGkgPSBsZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKHRvZG9zW2ldLmNvbXBsZXRlZCkge1xuICAgICAgICB0b2Rvcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgdGhpcy5ib2R5LnJvd3NbaV0ucmVtb3ZlKClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG9uOiB7XG4gICAgJ2lucHV0OmlucHV0I25ldy10b2RvJzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMubmV3VG9kby50ZXh0ID0gZS50YXJnZXQudmFsdWVcbiAgICAgIHRoaXMuc2V0QWRkQnV0dG9uU3RhdGUoKVxuICAgIH0sXG4gICAgJ2NsaWNrOmJ1dHRvbiNjbGVhci10b2Rvcyc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLmNsZWFyQ29tcGxldGVkKClcbiAgICB9LFxuICAgICdjbGljazpidXR0b24jYWRkLXRvZG8nOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHRvZG9zID0gdGhpcy5kYXRhLnRvZG9zXG5cbiAgICAgIC8vIENyZWF0ZSBhIG5ldyB0b2RvXG4gICAgICB2YXIgdG9kbyA9IHtcbiAgICAgICAgdGV4dDogdGhpcy5uZXdUb2RvVGV4dC52YWx1ZSxcbiAgICAgICAgY29tcGxldGVkOiBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy5uZXdUb2RvLnRleHQgPSAnJ1xuICAgICAgdGhpcy5uZXdUb2RvVGV4dC52YWx1ZSA9ICcnXG4gICAgICB0aGlzLnNldEFkZEJ1dHRvblN0YXRlKClcbiAgICAgIHRoaXMubmV3VG9kb1RleHQuZm9jdXMoKVxuXG4gICAgICB0b2Rvcy5wdXNoKHRvZG8pXG5cbiAgICAgIC8vIENyZWF0ZSB0ZSBuZXcgcm93IGFuZCBpbml0aWFsaXplXG4gICAgICB2YXIgcm93ID0gdGhpcy5ib2R5Lmluc2VydFJvdygpXG4gICAgICByb3cuc2V0QXR0cmlidXRlKCdpdGVtJywgJ3RvZG9zWycgKyAodG9kb3MubGVuZ3RoIC0gMSkgKyAnXScpXG4gICAgICBEb20uc2Nhbihyb3csIHRvZG8sIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbnZhciBtZW51SXRlbSA9IHtcbiAgdGVtcGxhdGU6IG1lbnVJdGVtVGVtcGxhdGUsXG4gIG9uOiB7XG4gICAgJ2NsaWNrJzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIH1cbiAgfVxufVxuXG52YXIgbWVudSA9IHtcbiAgaXNvbGF0ZTogdHJ1ZSxcbiAgdGVtcGxhdGU6ICc8dWw+PGxpIG1lbnUtaXRlbT1cIm1lbnVbMF1cIj48L2xpPjxsaSBtZW51LWl0ZW09XCJtZW51WzFdXCI+PC9saTwvdWw+JyxcbiAgb246IHtcbiAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnbWVudSBjbGlja2VkJylcbiAgICB9XG4gIH1cbn1cblxuRG9tLnJlZ2lzdGVyKHtcbiAgJ2xpc3QnOiBsaXN0LFxuICAnaXRlbSc6IGl0ZW0sXG4gICdtZW51JzogbWVudSxcbiAgJ21lbnUtaXRlbSc6IG1lbnVJdGVtLFxuICAnYXBwJzoge1xuICAgIHJvb3RGbjogZnVuY3Rpb24gKCkge30sXG4gICAgb246IHtcbiAgICAgICdsb2dnZWRpbic6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdCdWJibGVkIGN1c3RvbSBgbG9nZ2VkaW5gIGV2ZW50JywgZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG5cbmZ1bmN0aW9uIExvZ2luIChkYXRhKSB7XG4gIHRoaXMuZW1haWwgPSBkYXRhLmVtYWlsXG4gIHRoaXMucGFzc3dvcmQgPSBkYXRhLnBhc3N3b3JkXG59XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcHAgPSB7XG4gICAgaWQ6IDEsXG4gICAgbmFtZTogJ015IHRvZG8gbGlzdCcsXG4gICAgbWVudTogW3sgdGV4dDogJ0hvbWUnLCB1cmw6ICcvaG9tZScgfSwgeyB0ZXh0OiAnQWJvdXQnLCB1cmw6ICcvYWJvdXQnIH1dLFxuICAgIG5ld1RvZG86IHsgdGV4dDogJycsIGNvbXBsZXRlZDogZmFsc2UgfSxcbiAgICB0b2RvczogW3t0ZXh0OiAnQScsIGNvbXBsZXRlZDogZmFsc2V9LCB7dGV4dDogJ0InLCBjb21wbGV0ZWQ6IHRydWV9LCB7dGV4dDogJ0MnLCBjb21wbGV0ZWQ6IGZhbHNlfV0sXG4gICAgbG9naW46IG5ldyBMb2dpbih7ZW1haWw6ICdoZXknLCBwYXNzd29yZDogJ3NlY3JldCd9KVxuICB9XG5cbiAgRG9tLnNjYW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBhcHApXG5cbiAgd2luZG93LmFwcCA9IGFwcFxufVxuIiwidmFyIGdldCA9IHJlcXVpcmUoJ2dldC1vYmplY3QtcGF0aCcpXG52YXIgRGVsZWdhdGUgPSByZXF1aXJlKCdkb20tZGVsZWdhdGUnKS5EZWxlZ2F0ZVxuXG5mdW5jdGlvbiBSZWdpc3RlciAoKSB7fVxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVnaXN0ZXIucHJvdG90eXBlLCB7XG4gIHNlbGVjdG9yOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpXG4gICAgICByZXR1cm4ga2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gJ1snICsga2V5ICsgJ10nXG4gICAgICB9KS5qb2luKCcsICcpXG4gICAgfVxuICB9LFxuICBrZXlzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcylcbiAgICB9XG4gIH1cbn0pXG5cbnZhciByZWdpc3RlciA9IG5ldyBSZWdpc3RlcigpXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQgKGVsLCBkYXRhLCBjb21wb25lbnQsIHBhcmVudCkge1xuICB2YXIgY3R4ID0gT2JqZWN0LmNyZWF0ZShjb21wb25lbnQuaXNvbGF0ZSA/IHt9IDogcGFyZW50IHx8IHt9KVxuXG4gIHZhciBpbmZvID0gT2JqZWN0LmNyZWF0ZSh7fSwge1xuICAgIGVsOiB7XG4gICAgICB2YWx1ZTogZWxcbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIHZhbHVlOiBkYXRhXG4gICAgfSxcbiAgICBjb21wb25lbnQ6IHtcbiAgICAgIHZhbHVlOiBjb21wb25lbnRcbiAgICB9XG4gIH0pXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY3R4LCB7XG4gICAgX186IHtcbiAgICAgIHZhbHVlOiBpbmZvXG4gICAgfVxuICB9KVxuXG4gIGN0eC5kYXRhID0gZGF0YVxuXG4gIHJldHVybiBjdHhcbn1cblxudmFyIGlnbm9yZSA9IFsnb24nLCAndGVtcGxhdGUnLCAnaW5pdGlhbGl6ZScsICdpc29sYXRlJ11cbmZ1bmN0aW9uIGV4dGVuZCAob2JqKSB7XG4gIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IsIHByb3BcbiAgICBpZiAoc291cmNlKSB7XG4gICAgICBmb3IgKHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgaWdub3JlLmluZGV4T2YocHJvcCkgPT09IC0xKSB7XG4gICAgICAgICAgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBwcm9wKVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2NyaXB0b3IpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIHJldHVybiBvYmpcbn1cbmZ1bmN0aW9uIGdldEVsZW1lbnRDb21wb25lbnQgKGVsKSB7XG4gIHZhciByZWdpc3RlcktleXMgPSByZWdpc3Rlci5rZXlzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWwuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZHggPSByZWdpc3RlcktleXMuaW5kZXhPZihlbC5hdHRyaWJ1dGVzW2ldLm5hbWUpXG4gICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IHJlZ2lzdGVyS2V5c1tpZHhdLFxuICAgICAgICBjb21wb25lbnQ6IHJlZ2lzdGVyW3JlZ2lzdGVyS2V5c1tpZHhdXVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50RGVsZWdhdGUgKGVsLCBjdHgsIGNvbXBvbmVudCkge1xuICB2YXIgZGVsID0gbmV3IERlbGVnYXRlKGVsKVxuXG4gIC8vIEFkZCBldmVudCBsaXN0ZW5lcnNcbiAgdmFyIHByb3h5ID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgICBmbi5jYWxsKGN0eCwgZSlcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBldmVudCBpbiBjb21wb25lbnQub24pIHtcbiAgICBpZiAoY29tcG9uZW50Lm9uLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xuICAgICAgdmFyIGNvbG9uaWR4ID0gZXZlbnQuaW5kZXhPZignOicpXG4gICAgICB2YXIgbmFtZSwgc2VsZWN0b3JcbiAgICAgIGlmIChjb2xvbmlkeCA9PT0gLTEpIHtcbiAgICAgICAgbmFtZSA9IGV2ZW50XG4gICAgICAgIGRlbC5vbihuYW1lLCBwcm94eShjb21wb25lbnQub25bZXZlbnRdKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgPSBldmVudC5zdWJzdHIoMCwgY29sb25pZHgpXG4gICAgICAgIHNlbGVjdG9yID0gZXZlbnQuc3Vic3RyKGNvbG9uaWR4ICsgMSlcbiAgICAgICAgZGVsLm9uKG5hbWUsIHNlbGVjdG9yLCBwcm94eShjb21wb25lbnQub25bZXZlbnRdKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVsXG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnREYXRhIChlbCwgY29tcG9uZW50TmFtZSwgcGFyZW50KSB7XG4gIHZhciBhdHRyID0gZWwuZ2V0QXR0cmlidXRlKGNvbXBvbmVudE5hbWUpXG4gIHJldHVybiBhdHRyICYmIGdldChwYXJlbnQsIGF0dHIpXG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyQ29tcG9uZW50IChuYW1lLCBvYmopIHtcbiAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGtleSBpbiBuYW1lKSB7XG4gICAgICBpZiAobmFtZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHJlZ2lzdGVyW2tleV0gPSBuYW1lW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVnaXN0ZXJbbmFtZV0gPSBvYmpcbiAgfVxufVxuXG4vKipcbiogQ29udmVydCBhIE5vZGVMaXN0IGludG8gYW4gQXJyYXlcbiogQG1ldGhvZCBub2RlTGlzdFRvQXJyYXlcbiogQHBhcmFtIE5vZGVMaXN0IG5vZGVMaXN0XG4qIEByZXR1cm4gbm9kZUFycmF5XG4qL1xuZnVuY3Rpb24gbm9kZUxpc3RUb0FycmF5IChub2RlTGlzdCkge1xuICB2YXIgbm9kZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIG5vZGVBcnJheS5wdXNoKG5vZGVMaXN0W2ldKVxuICB9XG4gIHJldHVybiBub2RlQXJyYXlcbn1cblxuZnVuY3Rpb24gZ2V0TWF0Y2hpbmdFbGVtZW50cyAoZWwsIGNoaWxkcmVuT25seSkge1xuICB2YXIgc2VsZWN0b3IgPSBEb20uX3JlZ2lzdGVyLnNlbGVjdG9yXG4gIHZhciBtYXRjaGVzID0gbm9kZUxpc3RUb0FycmF5KGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKVxuXG4gIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IGdldEVsZW1lbnRDb21wb25lbnQoZWwpXG5cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICBtYXRjaGVzLnVuc2hpZnQoZWwpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXNcbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudERlcHRoIChlbCwgcGFyZW50KSB7XG4gIHZhciBkZXB0aCA9IDBcbiAgd2hpbGUgKGVsLnBhcmVudE5vZGUgJiYgZWwgIT09IHBhcmVudCkge1xuICAgIGRlcHRoKytcbiAgICBlbCA9IGVsLnBhcmVudE5vZGVcbiAgfVxuICByZXR1cm4gZGVwdGhcbn1cblxuZnVuY3Rpb24gZmluZFBhcmVudENvbnRleHQgKGVsLCBjb250ZXh0cykge1xuICBkbyB7XG4gICAgZWwgPSBlbC5wYXJlbnROb2RlXG4gICAgaWYgKGVsKSB7XG4gICAgICBmb3IgKHZhciBpID0gY29udGV4dHMubGVuZ3RoIC0gMTsgaSA+IC0xIDsgaS0tKSB7XG4gICAgICAgIGlmIChjb250ZXh0c1tpXS5jdHguX18uZWwgPT09IGVsKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHRzW2ldLmN0eFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IHdoaWxlIChlbClcbn1cblxuZnVuY3Rpb24gc2V0SHRtbCAoZWwsIGNvbXBvbmVudCwgY3R4KSB7XG4gIHZhciBodG1sID0gKHR5cGVvZiBjb21wb25lbnQudGVtcGxhdGUgPT09ICdmdW5jdGlvbicpXG4gICAgPyBjb21wb25lbnQudGVtcGxhdGUuY2FsbChjdHgsIGN0eClcbiAgICA6IGNvbXBvbmVudC50ZW1wbGF0ZVxuXG4gIGVsLmlubmVySFRNTCA9IGh0bWxcbn1cblxuZnVuY3Rpb24gcmVuZGVyZXIgKGN1cnJFbCwgY29tcG9uZW50LCBjdHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChkb250U2Nhbikge1xuICAgIHNldEh0bWwoY3VyckVsLCBjb21wb25lbnQsIGN0eClcbiAgICBpZiAoIWRvbnRTY2FuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJFbC5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBEb20uc2NhbihjdXJyRWwuY2hpbGRyZW5baV0sIGN0eC5kYXRhLCBjdHgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNjYW4gKGVsLCBkYXRhLCBwYXJlbnQpIHtcbiAgdmFyIG1hdGNoZXMgPSBnZXRNYXRjaGluZ0VsZW1lbnRzKGVsKVxuICB2YXIgY29udGV4dHMgPSBbXVxuICB2YXIgY3VyckVsXG5cbiAgd2hpbGUgKG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgY3VyckVsID0gbWF0Y2hlcy5zaGlmdCgpXG4gICAgdmFyIHJlZiA9IGdldEVsZW1lbnRDb21wb25lbnQoY3VyckVsKVxuICAgIHZhciBjb21wb25lbnQgPSByZWYuY29tcG9uZW50XG4gICAgdmFyIGRlcHRoID0gZ2V0RWxlbWVudERlcHRoKGN1cnJFbCwgZWwpXG4gICAgdmFyIHBhcmVudENvbnRleHQgPSBmaW5kUGFyZW50Q29udGV4dChjdXJyRWwsIGNvbnRleHRzKSB8fCBwYXJlbnRcbiAgICB2YXIgcGFyZW50RGF0YSA9IHBhcmVudENvbnRleHQgPyBwYXJlbnRDb250ZXh0LmRhdGEgOiBkYXRhXG4gICAgdmFyIGVsRGF0YSA9IGdldEVsZW1lbnREYXRhKGN1cnJFbCwgcmVmLmtleSwgcGFyZW50RGF0YSkgfHwgcGFyZW50RGF0YVxuICAgIHZhciBjdHggPSBjcmVhdGVDb250ZXh0KGN1cnJFbCwgZWxEYXRhLCBjb21wb25lbnQsIHBhcmVudENvbnRleHQpXG4gICAgdmFyIGRlbCA9IGNyZWF0ZUVsZW1lbnREZWxlZ2F0ZShjdXJyRWwsIGN0eCwgY29tcG9uZW50KVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0eC5fXywgJ2RlbCcsIHsgdmFsdWU6IGRlbCB9KVxuXG4gICAgZXh0ZW5kKGN0eCwgY29tcG9uZW50KVxuXG4gICAgY29udGV4dHMucHVzaCh7IGRlcHRoOiBkZXB0aCwgY3R4OiBjdHggfSlcblxuICAgIGlmIChjb21wb25lbnQuaW5pdGlhbGl6ZSkge1xuICAgICAgY29tcG9uZW50LmluaXRpYWxpemUuY2FsbChjdHgsIGN1cnJFbCwgZWxEYXRhKVxuICAgIH1cblxuICAgIGlmIChjb21wb25lbnQudGVtcGxhdGUpIHtcbiAgICAgIHZhciByZW5kZXIgPSByZW5kZXJlcihjdXJyRWwsIGNvbXBvbmVudCwgY3R4KVxuICAgICAgcmVuZGVyKHRydWUpXG4gICAgICB2YXIgY2hpbGRyZW4gPSBnZXRNYXRjaGluZ0VsZW1lbnRzKGN1cnJFbCwgdHJ1ZSlcbiAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkobWF0Y2hlcywgY2hpbGRyZW4pXG4gICAgICB9XG4gICAgICBjdHguX18ucmVuZGVyID0gcmVuZGVyXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IGNvbnRleHRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGFsaWFzQ29udGV4dCA9IGNvbnRleHRzW2ldLmN0eFxuICAgIHZhciBhbGlhc0VsID0gYWxpYXNDb250ZXh0Ll9fLmVsXG4gICAgdmFyIGFsaWFzZXMgPSBhbGlhc0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1thc106bm90KFthcz1cIlwiXSknKVxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWxpYXNlcy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIGF0dHIgPSBhbGlhc2VzW2pdLmdldEF0dHJpYnV0ZSgnYXMnKVxuICAgICAgYWxpYXNDb250ZXh0W2F0dHJdID0gYWxpYXNlc1tqXVxuICAgICAgYWxpYXNlc1tqXS5yZW1vdmVBdHRyaWJ1dGUoJ2FzJylcbiAgICB9XG4gIH1cbn1cblxudmFyIERvbSA9IE9iamVjdC5jcmVhdGUoe30sIHtcbiAgX3JlZ2lzdGVyOiB7IHZhbHVlOiByZWdpc3RlciB9LFxuICByZWdpc3RlcjogeyB2YWx1ZTogcmVnaXN0ZXJDb21wb25lbnQgfSxcbiAgc2NhbjogeyB2YWx1ZTogc2NhbiB9XG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9IERvbVxuIiwiLypqc2hpbnQgYnJvd3Nlcjp0cnVlLCBub2RlOnRydWUqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVsZWdhdGU7XG5cbi8qKlxuICogRE9NIGV2ZW50IGRlbGVnYXRvclxuICpcbiAqIFRoZSBkZWxlZ2F0b3Igd2lsbCBsaXN0ZW5cbiAqIGZvciBldmVudHMgdGhhdCBidWJibGUgdXBcbiAqIHRvIHRoZSByb290IG5vZGUuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge05vZGV8c3RyaW5nfSBbcm9vdF0gVGhlIHJvb3Qgbm9kZSBvciBhIHNlbGVjdG9yIHN0cmluZyBtYXRjaGluZyB0aGUgcm9vdCBub2RlXG4gKi9cbmZ1bmN0aW9uIERlbGVnYXRlKHJvb3QpIHtcblxuICAvKipcbiAgICogTWFpbnRhaW4gYSBtYXAgb2YgbGlzdGVuZXJcbiAgICogbGlzdHMsIGtleWVkIGJ5IGV2ZW50IG5hbWUuXG4gICAqXG4gICAqIEB0eXBlIE9iamVjdFxuICAgKi9cbiAgdGhpcy5saXN0ZW5lck1hcCA9IFt7fSwge31dO1xuICBpZiAocm9vdCkge1xuICAgIHRoaXMucm9vdChyb290KTtcbiAgfVxuXG4gIC8qKiBAdHlwZSBmdW5jdGlvbigpICovXG4gIHRoaXMuaGFuZGxlID0gRGVsZWdhdGUucHJvdG90eXBlLmhhbmRsZS5iaW5kKHRoaXMpO1xufVxuXG4vKipcbiAqIFN0YXJ0IGxpc3RlbmluZyBmb3IgZXZlbnRzXG4gKiBvbiB0aGUgcHJvdmlkZWQgRE9NIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtOb2RlfHN0cmluZ30gW3Jvb3RdIFRoZSByb290IG5vZGUgb3IgYSBzZWxlY3RvciBzdHJpbmcgbWF0Y2hpbmcgdGhlIHJvb3Qgbm9kZVxuICogQHJldHVybnMge0RlbGVnYXRlfSBUaGlzIG1ldGhvZCBpcyBjaGFpbmFibGVcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLnJvb3QgPSBmdW5jdGlvbihyb290KSB7XG4gIHZhciBsaXN0ZW5lck1hcCA9IHRoaXMubGlzdGVuZXJNYXA7XG4gIHZhciBldmVudFR5cGU7XG5cbiAgLy8gUmVtb3ZlIG1hc3RlciBldmVudCBsaXN0ZW5lcnNcbiAgaWYgKHRoaXMucm9vdEVsZW1lbnQpIHtcbiAgICBmb3IgKGV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcFsxXSkge1xuICAgICAgaWYgKGxpc3RlbmVyTWFwWzFdLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpIHtcbiAgICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcFswXSkge1xuICAgICAgaWYgKGxpc3RlbmVyTWFwWzBdLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpIHtcbiAgICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiBubyByb290IG9yIHJvb3QgaXMgbm90XG4gIC8vIGEgZG9tIG5vZGUsIHRoZW4gcmVtb3ZlIGludGVybmFsXG4gIC8vIHJvb3QgcmVmZXJlbmNlIGFuZCBleGl0IGhlcmVcbiAgaWYgKCFyb290IHx8ICFyb290LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICBpZiAodGhpcy5yb290RWxlbWVudCkge1xuICAgICAgZGVsZXRlIHRoaXMucm9vdEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByb290IG5vZGUgYXQgd2hpY2hcbiAgICogbGlzdGVuZXJzIGFyZSBhdHRhY2hlZC5cbiAgICpcbiAgICogQHR5cGUgTm9kZVxuICAgKi9cbiAgdGhpcy5yb290RWxlbWVudCA9IHJvb3Q7XG5cbiAgLy8gU2V0IHVwIG1hc3RlciBldmVudCBsaXN0ZW5lcnNcbiAgZm9yIChldmVudFR5cGUgaW4gbGlzdGVuZXJNYXBbMV0pIHtcbiAgICBpZiAobGlzdGVuZXJNYXBbMV0uaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSkge1xuICAgICAgdGhpcy5yb290RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHRydWUpO1xuICAgIH1cbiAgfVxuICBmb3IgKGV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcFswXSkge1xuICAgIGlmIChsaXN0ZW5lck1hcFswXS5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKSB7XG4gICAgICB0aGlzLnJvb3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5jYXB0dXJlRm9yVHlwZSA9IGZ1bmN0aW9uKGV2ZW50VHlwZSkge1xuICByZXR1cm4gWydibHVyJywgJ2Vycm9yJywgJ2ZvY3VzJywgJ2xvYWQnLCAncmVzaXplJywgJ3Njcm9sbCddLmluZGV4T2YoZXZlbnRUeXBlKSAhPT0gLTE7XG59O1xuXG4vKipcbiAqIEF0dGFjaCBhIGhhbmRsZXIgdG8gb25lXG4gKiBldmVudCBmb3IgYWxsIGVsZW1lbnRzXG4gKiB0aGF0IG1hdGNoIHRoZSBzZWxlY3RvcixcbiAqIG5vdyBvciBpbiB0aGUgZnV0dXJlXG4gKlxuICogVGhlIGhhbmRsZXIgZnVuY3Rpb24gcmVjZWl2ZXNcbiAqIHRocmVlIGFyZ3VtZW50czogdGhlIERPTSBldmVudFxuICogb2JqZWN0LCB0aGUgbm9kZSB0aGF0IG1hdGNoZWRcbiAqIHRoZSBzZWxlY3RvciB3aGlsZSB0aGUgZXZlbnRcbiAqIHdhcyBidWJibGluZyBhbmQgYSByZWZlcmVuY2VcbiAqIHRvIGl0c2VsZi4gV2l0aGluIHRoZSBoYW5kbGVyLFxuICogJ3RoaXMnIGlzIGVxdWFsIHRvIHRoZSBzZWNvbmRcbiAqIGFyZ3VtZW50LlxuICpcbiAqIFRoZSBub2RlIHRoYXQgYWN0dWFsbHkgcmVjZWl2ZWRcbiAqIHRoZSBldmVudCBjYW4gYmUgYWNjZXNzZWQgdmlhXG4gKiAnZXZlbnQudGFyZ2V0Jy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIExpc3RlbiBmb3IgdGhlc2UgZXZlbnRzXG4gKiBAcGFyYW0ge3N0cmluZ3x1bmRlZmluZWR9IHNlbGVjdG9yIE9ubHkgaGFuZGxlIGV2ZW50cyBvbiBlbGVtZW50cyBtYXRjaGluZyB0aGlzIHNlbGVjdG9yLCBpZiB1bmRlZmluZWQgbWF0Y2ggcm9vdCBlbGVtZW50XG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCl9IGhhbmRsZXIgSGFuZGxlciBmdW5jdGlvbiAtIGV2ZW50IGRhdGEgcGFzc2VkIGhlcmUgd2lsbCBiZSBpbiBldmVudC5kYXRhXG4gKiBAcGFyYW0ge09iamVjdH0gW2V2ZW50RGF0YV0gRGF0YSB0byBwYXNzIGluIGV2ZW50LmRhdGFcbiAqIEByZXR1cm5zIHtEZWxlZ2F0ZX0gVGhpcyBtZXRob2QgaXMgY2hhaW5hYmxlXG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgc2VsZWN0b3IsIGhhbmRsZXIsIHVzZUNhcHR1cmUpIHtcbiAgdmFyIHJvb3QsIGxpc3RlbmVyTWFwLCBtYXRjaGVyLCBtYXRjaGVyUGFyYW07XG5cbiAgaWYgKCFldmVudFR5cGUpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGV2ZW50IHR5cGU6ICcgKyBldmVudFR5cGUpO1xuICB9XG5cbiAgLy8gaGFuZGxlciBjYW4gYmUgcGFzc2VkIGFzXG4gIC8vIHRoZSBzZWNvbmQgb3IgdGhpcmQgYXJndW1lbnRcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHVzZUNhcHR1cmUgPSBoYW5kbGVyO1xuICAgIGhhbmRsZXIgPSBzZWxlY3RvcjtcbiAgICBzZWxlY3RvciA9IG51bGw7XG4gIH1cblxuICAvLyBGYWxsYmFjayB0byBzZW5zaWJsZSBkZWZhdWx0c1xuICAvLyBpZiB1c2VDYXB0dXJlIG5vdCBzZXRcbiAgaWYgKHVzZUNhcHR1cmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHVzZUNhcHR1cmUgPSB0aGlzLmNhcHR1cmVGb3JUeXBlKGV2ZW50VHlwZSk7XG4gIH1cblxuICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIYW5kbGVyIG11c3QgYmUgYSB0eXBlIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICByb290ID0gdGhpcy5yb290RWxlbWVudDtcbiAgbGlzdGVuZXJNYXAgPSB0aGlzLmxpc3RlbmVyTWFwW3VzZUNhcHR1cmUgPyAxIDogMF07XG5cbiAgLy8gQWRkIG1hc3RlciBoYW5kbGVyIGZvciB0eXBlIGlmIG5vdCBjcmVhdGVkIHlldFxuICBpZiAoIWxpc3RlbmVyTWFwW2V2ZW50VHlwZV0pIHtcbiAgICBpZiAocm9vdCkge1xuICAgICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHVzZUNhcHR1cmUpO1xuICAgIH1cbiAgICBsaXN0ZW5lck1hcFtldmVudFR5cGVdID0gW107XG4gIH1cblxuICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgbWF0Y2hlclBhcmFtID0gbnVsbDtcblxuICAgIC8vIENPTVBMRVggLSBtYXRjaGVzUm9vdCBuZWVkcyB0byBoYXZlIGFjY2VzcyB0b1xuICAgIC8vIHRoaXMucm9vdEVsZW1lbnQsIHNvIGJpbmQgdGhlIGZ1bmN0aW9uIHRvIHRoaXMuXG4gICAgbWF0Y2hlciA9IG1hdGNoZXNSb290LmJpbmQodGhpcyk7XG5cbiAgLy8gQ29tcGlsZSBhIG1hdGNoZXIgZm9yIHRoZSBnaXZlbiBzZWxlY3RvclxuICB9IGVsc2UgaWYgKC9eW2Etel0rJC9pLnRlc3Qoc2VsZWN0b3IpKSB7XG4gICAgbWF0Y2hlclBhcmFtID0gc2VsZWN0b3I7XG4gICAgbWF0Y2hlciA9IG1hdGNoZXNUYWc7XG4gIH0gZWxzZSBpZiAoL14jW2EtejAtOVxcLV9dKyQvaS50ZXN0KHNlbGVjdG9yKSkge1xuICAgIG1hdGNoZXJQYXJhbSA9IHNlbGVjdG9yLnNsaWNlKDEpO1xuICAgIG1hdGNoZXIgPSBtYXRjaGVzSWQ7XG4gIH0gZWxzZSB7XG4gICAgbWF0Y2hlclBhcmFtID0gc2VsZWN0b3I7XG4gICAgbWF0Y2hlciA9IG1hdGNoZXM7XG4gIH1cblxuICAvLyBBZGQgdG8gdGhlIGxpc3Qgb2YgbGlzdGVuZXJzXG4gIGxpc3RlbmVyTWFwW2V2ZW50VHlwZV0ucHVzaCh7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgbWF0Y2hlcjogbWF0Y2hlcixcbiAgICBtYXRjaGVyUGFyYW06IG1hdGNoZXJQYXJhbVxuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGV2ZW50IGhhbmRsZXJcbiAqIGZvciBlbGVtZW50cyB0aGF0IG1hdGNoXG4gKiB0aGUgc2VsZWN0b3IsIGZvcmV2ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gW2V2ZW50VHlwZV0gUmVtb3ZlIGhhbmRsZXJzIGZvciBldmVudHMgbWF0Y2hpbmcgdGhpcyB0eXBlLCBjb25zaWRlcmluZyB0aGUgb3RoZXIgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtzdHJpbmd9IFtzZWxlY3Rvcl0gSWYgdGhpcyBwYXJhbWV0ZXIgaXMgb21pdHRlZCwgb25seSBoYW5kbGVycyB3aGljaCBtYXRjaCB0aGUgb3RoZXIgdHdvIHdpbGwgYmUgcmVtb3ZlZFxuICogQHBhcmFtIHtmdW5jdGlvbigpfSBbaGFuZGxlcl0gSWYgdGhpcyBwYXJhbWV0ZXIgaXMgb21pdHRlZCwgb25seSBoYW5kbGVycyB3aGljaCBtYXRjaCB0aGUgcHJldmlvdXMgdHdvIHdpbGwgYmUgcmVtb3ZlZFxuICogQHJldHVybnMge0RlbGVnYXRlfSBUaGlzIG1ldGhvZCBpcyBjaGFpbmFibGVcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgc2VsZWN0b3IsIGhhbmRsZXIsIHVzZUNhcHR1cmUpIHtcbiAgdmFyIGksIGxpc3RlbmVyLCBsaXN0ZW5lck1hcCwgbGlzdGVuZXJMaXN0LCBzaW5nbGVFdmVudFR5cGU7XG5cbiAgLy8gSGFuZGxlciBjYW4gYmUgcGFzc2VkIGFzXG4gIC8vIHRoZSBzZWNvbmQgb3IgdGhpcmQgYXJndW1lbnRcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHVzZUNhcHR1cmUgPSBoYW5kbGVyO1xuICAgIGhhbmRsZXIgPSBzZWxlY3RvcjtcbiAgICBzZWxlY3RvciA9IG51bGw7XG4gIH1cblxuICAvLyBJZiB1c2VDYXB0dXJlIG5vdCBzZXQsIHJlbW92ZVxuICAvLyBhbGwgZXZlbnQgbGlzdGVuZXJzXG4gIGlmICh1c2VDYXB0dXJlID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLm9mZihldmVudFR5cGUsIHNlbGVjdG9yLCBoYW5kbGVyLCB0cnVlKTtcbiAgICB0aGlzLm9mZihldmVudFR5cGUsIHNlbGVjdG9yLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lck1hcCA9IHRoaXMubGlzdGVuZXJNYXBbdXNlQ2FwdHVyZSA/IDEgOiAwXTtcbiAgaWYgKCFldmVudFR5cGUpIHtcbiAgICBmb3IgKHNpbmdsZUV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcCkge1xuICAgICAgaWYgKGxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KHNpbmdsZUV2ZW50VHlwZSkpIHtcbiAgICAgICAgdGhpcy5vZmYoc2luZ2xlRXZlbnRUeXBlLCBzZWxlY3RvciwgaGFuZGxlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lckxpc3QgPSBsaXN0ZW5lck1hcFtldmVudFR5cGVdO1xuICBpZiAoIWxpc3RlbmVyTGlzdCB8fCAhbGlzdGVuZXJMaXN0Lmxlbmd0aCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gUmVtb3ZlIG9ubHkgcGFyYW1ldGVyIG1hdGNoZXNcbiAgLy8gaWYgc3BlY2lmaWVkXG4gIGZvciAoaSA9IGxpc3RlbmVyTGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGxpc3RlbmVyID0gbGlzdGVuZXJMaXN0W2ldO1xuXG4gICAgaWYgKCghc2VsZWN0b3IgfHwgc2VsZWN0b3IgPT09IGxpc3RlbmVyLnNlbGVjdG9yKSAmJiAoIWhhbmRsZXIgfHwgaGFuZGxlciA9PT0gbGlzdGVuZXIuaGFuZGxlcikpIHtcbiAgICAgIGxpc3RlbmVyTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWxsIGxpc3RlbmVycyByZW1vdmVkXG4gIGlmICghbGlzdGVuZXJMaXN0Lmxlbmd0aCkge1xuICAgIGRlbGV0ZSBsaXN0ZW5lck1hcFtldmVudFR5cGVdO1xuXG4gICAgLy8gUmVtb3ZlIHRoZSBtYWluIGhhbmRsZXJcbiAgICBpZiAodGhpcy5yb290RWxlbWVudCkge1xuICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHVzZUNhcHR1cmUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEhhbmRsZSBhbiBhcmJpdHJhcnkgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLmhhbmRsZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIHZhciBpLCBsLCB0eXBlID0gZXZlbnQudHlwZSwgcm9vdCwgcGhhc2UsIGxpc3RlbmVyLCByZXR1cm5lZCwgbGlzdGVuZXJMaXN0ID0gW10sIHRhcmdldCwgLyoqIEBjb25zdCAqLyBFVkVOVElHTk9SRSA9ICdmdExhYnNEZWxlZ2F0ZUlnbm9yZSc7XG5cbiAgaWYgKGV2ZW50W0VWRU5USUdOT1JFXSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcblxuICAvLyBIYXJkY29kZSB2YWx1ZSBvZiBOb2RlLlRFWFRfTk9ERVxuICAvLyBhcyBub3QgZGVmaW5lZCBpbiBJRThcbiAgaWYgKHRhcmdldC5ub2RlVHlwZSA9PT0gMykge1xuICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICB9XG5cbiAgcm9vdCA9IHRoaXMucm9vdEVsZW1lbnQ7XG5cbiAgcGhhc2UgPSBldmVudC5ldmVudFBoYXNlIHx8ICggZXZlbnQudGFyZ2V0ICE9PSBldmVudC5jdXJyZW50VGFyZ2V0ID8gMyA6IDIgKTtcbiAgXG4gIHN3aXRjaCAocGhhc2UpIHtcbiAgICBjYXNlIDE6IC8vRXZlbnQuQ0FQVFVSSU5HX1BIQVNFOlxuICAgICAgbGlzdGVuZXJMaXN0ID0gdGhpcy5saXN0ZW5lck1hcFsxXVt0eXBlXTtcbiAgICBicmVhaztcbiAgICBjYXNlIDI6IC8vRXZlbnQuQVRfVEFSR0VUOlxuICAgICAgaWYgKHRoaXMubGlzdGVuZXJNYXBbMF0gJiYgdGhpcy5saXN0ZW5lck1hcFswXVt0eXBlXSkgbGlzdGVuZXJMaXN0ID0gbGlzdGVuZXJMaXN0LmNvbmNhdCh0aGlzLmxpc3RlbmVyTWFwWzBdW3R5cGVdKTtcbiAgICAgIGlmICh0aGlzLmxpc3RlbmVyTWFwWzFdICYmIHRoaXMubGlzdGVuZXJNYXBbMV1bdHlwZV0pIGxpc3RlbmVyTGlzdCA9IGxpc3RlbmVyTGlzdC5jb25jYXQodGhpcy5saXN0ZW5lck1hcFsxXVt0eXBlXSk7XG4gICAgYnJlYWs7XG4gICAgY2FzZSAzOiAvL0V2ZW50LkJVQkJMSU5HX1BIQVNFOlxuICAgICAgbGlzdGVuZXJMaXN0ID0gdGhpcy5saXN0ZW5lck1hcFswXVt0eXBlXTtcbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIE5lZWQgdG8gY29udGludW91c2x5IGNoZWNrXG4gIC8vIHRoYXQgdGhlIHNwZWNpZmljIGxpc3QgaXNcbiAgLy8gc3RpbGwgcG9wdWxhdGVkIGluIGNhc2Ugb25lXG4gIC8vIG9mIHRoZSBjYWxsYmFja3MgYWN0dWFsbHlcbiAgLy8gY2F1c2VzIHRoZSBsaXN0IHRvIGJlIGRlc3Ryb3llZC5cbiAgbCA9IGxpc3RlbmVyTGlzdC5sZW5ndGg7XG4gIHdoaWxlICh0YXJnZXQgJiYgbCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJMaXN0W2ldO1xuXG4gICAgICAvLyBCYWlsIGZyb20gdGhpcyBsb29wIGlmXG4gICAgICAvLyB0aGUgbGVuZ3RoIGNoYW5nZWQgYW5kXG4gICAgICAvLyBubyBtb3JlIGxpc3RlbmVycyBhcmVcbiAgICAgIC8vIGRlZmluZWQgYmV0d2VlbiBpIGFuZCBsLlxuICAgICAgaWYgKCFsaXN0ZW5lcikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgZm9yIG1hdGNoIGFuZCBmaXJlXG4gICAgICAvLyB0aGUgZXZlbnQgaWYgdGhlcmUncyBvbmVcbiAgICAgIC8vXG4gICAgICAvLyBUT0RPOk1DRzoyMDEyMDExNzogTmVlZCBhIHdheVxuICAgICAgLy8gdG8gY2hlY2sgaWYgZXZlbnQjc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXG4gICAgICAvLyB3YXMgY2FsbGVkLiBJZiBzbywgYnJlYWsgYm90aCBsb29wcy5cbiAgICAgIGlmIChsaXN0ZW5lci5tYXRjaGVyLmNhbGwodGFyZ2V0LCBsaXN0ZW5lci5tYXRjaGVyUGFyYW0sIHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuZWQgPSB0aGlzLmZpcmUoZXZlbnQsIHRhcmdldCwgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICAvLyBTdG9wIHByb3BhZ2F0aW9uIHRvIHN1YnNlcXVlbnRcbiAgICAgIC8vIGNhbGxiYWNrcyBpZiB0aGUgY2FsbGJhY2sgcmV0dXJuZWRcbiAgICAgIC8vIGZhbHNlXG4gICAgICBpZiAocmV0dXJuZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGV2ZW50W0VWRU5USUdOT1JFXSA9IHRydWU7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOk1DRzoyMDEyMDExNzogTmVlZCBhIHdheSB0b1xuICAgIC8vIGNoZWNrIGlmIGV2ZW50I3N0b3BQcm9wYWdhdGlvblxuICAgIC8vIHdhcyBjYWxsZWQuIElmIHNvLCBicmVhayBsb29waW5nXG4gICAgLy8gdGhyb3VnaCB0aGUgRE9NLiBTdG9wIGlmIHRoZVxuICAgIC8vIGRlbGVnYXRpb24gcm9vdCBoYXMgYmVlbiByZWFjaGVkXG4gICAgaWYgKHRhcmdldCA9PT0gcm9vdCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgbCA9IGxpc3RlbmVyTGlzdC5sZW5ndGg7XG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gIH1cbn07XG5cbi8qKlxuICogRmlyZSBhIGxpc3RlbmVyIG9uIGEgdGFyZ2V0LlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtPYmplY3R9IGxpc3RlbmVyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLmZpcmUgPSBmdW5jdGlvbihldmVudCwgdGFyZ2V0LCBsaXN0ZW5lcikge1xuICByZXR1cm4gbGlzdGVuZXIuaGFuZGxlci5jYWxsKHRhcmdldCwgZXZlbnQsIHRhcmdldCk7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gZWxlbWVudFxuICogbWF0Y2hlcyBhIGdlbmVyaWMgc2VsZWN0b3IuXG4gKlxuICogQHR5cGUgZnVuY3Rpb24oKVxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIEEgQ1NTIHNlbGVjdG9yXG4gKi9cbnZhciBtYXRjaGVzID0gKGZ1bmN0aW9uKGVsKSB7XG4gIGlmICghZWwpIHJldHVybjtcbiAgdmFyIHAgPSBlbC5wcm90b3R5cGU7XG4gIHJldHVybiAocC5tYXRjaGVzIHx8IHAubWF0Y2hlc1NlbGVjdG9yIHx8IHAud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IHAubW96TWF0Y2hlc1NlbGVjdG9yIHx8IHAubXNNYXRjaGVzU2VsZWN0b3IgfHwgcC5vTWF0Y2hlc1NlbGVjdG9yKTtcbn0oRWxlbWVudCkpO1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gZWxlbWVudFxuICogbWF0Y2hlcyBhIHRhZyBzZWxlY3Rvci5cbiAqXG4gKiBUYWdzIGFyZSBOT1QgY2FzZS1zZW5zaXRpdmUsXG4gKiBleGNlcHQgaW4gWE1MIChhbmQgWE1MLWJhc2VkXG4gKiBsYW5ndWFnZXMgc3VjaCBhcyBYSFRNTCkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZ05hbWUgVGhlIHRhZyBuYW1lIHRvIHRlc3QgYWdhaW5zdFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHRlc3Qgd2l0aFxuICogQHJldHVybnMgYm9vbGVhblxuICovXG5mdW5jdGlvbiBtYXRjaGVzVGFnKHRhZ05hbWUsIGVsZW1lbnQpIHtcbiAgcmV0dXJuIHRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBlbGVtZW50XG4gKiBtYXRjaGVzIHRoZSByb290LlxuICpcbiAqIEBwYXJhbSB7P1N0cmluZ30gc2VsZWN0b3IgSW4gdGhpcyBjYXNlIHRoaXMgaXMgYWx3YXlzIHBhc3NlZCB0aHJvdWdoIGFzIG51bGwgYW5kIG5vdCB1c2VkXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdGVzdCB3aXRoXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNSb290KHNlbGVjdG9yLCBlbGVtZW50KSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlKi9cbiAgaWYgKHRoaXMucm9vdEVsZW1lbnQgPT09IHdpbmRvdykgcmV0dXJuIGVsZW1lbnQgPT09IGRvY3VtZW50O1xuICByZXR1cm4gdGhpcy5yb290RWxlbWVudCA9PT0gZWxlbWVudDtcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBJRCBvZlxuICogdGhlIGVsZW1lbnQgaW4gJ3RoaXMnXG4gKiBtYXRjaGVzIHRoZSBnaXZlbiBJRC5cbiAqXG4gKiBJRHMgYXJlIGNhc2Utc2Vuc2l0aXZlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgdG8gdGVzdCBhZ2FpbnN0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdGVzdCB3aXRoXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNJZChpZCwgZWxlbWVudCkge1xuICByZXR1cm4gaWQgPT09IGVsZW1lbnQuaWQ7XG59XG5cbi8qKlxuICogU2hvcnQgaGFuZCBmb3Igb2ZmKClcbiAqIGFuZCByb290KCksIGllIGJvdGhcbiAqIHdpdGggbm8gcGFyYW1ldGVyc1xuICpcbiAqIEByZXR1cm4gdm9pZFxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9mZigpO1xuICB0aGlzLnJvb3QoKTtcbn07XG4iLCIvKmpzaGludCBicm93c2VyOnRydWUsIG5vZGU6dHJ1ZSovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcHJlc2VydmUgQ3JlYXRlIGFuZCBtYW5hZ2UgYSBET00gZXZlbnQgZGVsZWdhdG9yLlxuICpcbiAqIEB2ZXJzaW9uIDAuMy4wXG4gKiBAY29kaW5nc3RhbmRhcmQgZnRsYWJzLWpzdjJcbiAqIEBjb3B5cmlnaHQgVGhlIEZpbmFuY2lhbCBUaW1lcyBMaW1pdGVkIFtBbGwgUmlnaHRzIFJlc2VydmVkXVxuICogQGxpY2Vuc2UgTUlUIExpY2Vuc2UgKHNlZSBMSUNFTlNFLnR4dClcbiAqL1xudmFyIERlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJvb3QpIHtcbiAgcmV0dXJuIG5ldyBEZWxlZ2F0ZShyb290KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLkRlbGVnYXRlID0gRGVsZWdhdGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGdldDtcblxuZnVuY3Rpb24gZ2V0IChjb250ZXh0LCBwYXRoKSB7XG4gIGlmIChwYXRoLmluZGV4T2YoJy4nKSA9PSAtMSAmJiBwYXRoLmluZGV4T2YoJ1snKSA9PSAtMSkge1xuICAgIHJldHVybiBjb250ZXh0W3BhdGhdO1xuICB9XG5cbiAgdmFyIGNydW1icyA9IHBhdGguc3BsaXQoL1xcLnxcXFt8XFxdL2cpO1xuICB2YXIgaSA9IC0xO1xuICB2YXIgbGVuID0gY3J1bWJzLmxlbmd0aDtcbiAgdmFyIHJlc3VsdDtcblxuICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgaWYgKGkgPT0gMCkgcmVzdWx0ID0gY29udGV4dDtcbiAgICBpZiAoIWNydW1ic1tpXSkgY29udGludWU7XG4gICAgaWYgKHJlc3VsdCA9PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgIHJlc3VsdCA9IHJlc3VsdFtjcnVtYnNbaV1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==
