(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../..":3,"./login-box.html":2}],2:[function(require,module,exports){
module.exports = function anonymous(obj
/**/) {
var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<form>   <legend>Login form</legend>   Email: <input as="email"value="', data.email ,'" type="text" required><br>   Password: <input as="password" value="', data.password ,'" type="password" required><br>   <button as="button" type="submit">Login</button> </form> ');}return p.join('');
};
},{}],3:[function(require,module,exports){
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

},{"dom-delegate":5,"get-object-path":6}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./delegate":4}],6:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9ibG9nL2luZGV4LmpzIiwiZXhhbXBsZXMvYmxvZy9sb2dpbi1ib3guaHRtbCIsImluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1kZWxlZ2F0ZS9saWIvZGVsZWdhdGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWRlbGVnYXRlL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9nZXQtb2JqZWN0LXBhdGgvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBEb20gPSByZXF1aXJlKCcuLi8uLicpXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuL2xvZ2luLWJveC5odG1sJylcblxudmFyIGFwcCA9IHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdpbml0aWFsaXplIGFwcCcpXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLmRhdGEubmFtZVxuICB9LFxuXG4gIHNvbWV0aGluZ0FwcDogZnVuY3Rpb24gKCkge30sXG5cbiAgb246IHtcbiAgICAnY2xpY2s6YSc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlLnRhcmdldClcbiAgICB9XG4gIH1cbn1cblxudmFyIGxvZ2luQm94ID0ge1xuICB0ZW1wbGF0ZTogdGVtcGxhdGVcbn1cblxudmFyIGFyY2hpdmUgPSB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChlbCwgZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKCdpbml0aWFsaXplIGFyY2hpdmUnLCBlbCwgZGF0YSlcbiAgfSxcbiAgY2hhbmdlTGlua1RleHQ6IGZ1bmN0aW9uIChlbCkge1xuICAgIHZhciByZXMgPSB3aW5kb3cucHJvbXB0KCdXaGF0IHRleHQgc2hvdWxkIEkgYmU/JywgZWwudGV4dENvbnRlbnQpXG4gICAgaWYgKHJlcyAhPT0gbnVsbCkgeyAvLyBub29wIGlmIGBjYW5jZWxgIGlzIGNsaWNrZWRcbiAgICAgIGVsLnRleHRDb250ZW50ID0gcmVzIHx8ICc8Q2xpY2sgdG8gZWRpdCBsaW5rIHRleHQ+J1xuICAgIH1cbiAgfSxcbiAgb246IHtcbiAgICAnY2xpY2s6YSc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHRoaXMuY2hhbmdlTGlua1RleHQoZS50YXJnZXQpXG4gICAgfVxuICB9XG59XG5cbnZhciBleHRlcm5hbCA9IHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdpbml0aWFsaXplIGV4dGVybmFsJylcbiAgfSxcblxuICBzb21ldGhpbmdFeHRlcm5hbDogZnVuY3Rpb24gKCkge30sXG5cbiAgb246IHtcbiAgICAnY2xpY2s6YSc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHdpbmRvdy5hbGVydCgnRXh0ZXJuYWwgY2xpY2tlZCcpXG4gICAgfVxuICB9XG59XG5cbnZhciBsaW5rcyA9IHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdpbml0aWFsaXplIGxpbmtzJylcbiAgfSxcblxuICB0ZW1wbGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzID0gJzx1bD4nXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHMgKz0gJzxsaSBsaW5rPVwiWycgKyBpICsgJ11cIj48L2xpPidcbiAgICB9XG4gICAgcyArPSAnPC91bD4nXG4gICAgcmV0dXJuIHNcbiAgfSxcblxuICBvbjoge1xuICAgICdjbGljazphJzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgd2luZG93LmFsZXJ0KCdMaW5rcyBjbGlja2VkJylcbiAgICB9XG4gIH1cbn1cblxudmFyIGxpbmsgPSB7XG4gIHRlbXBsYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICc8YSBhcz1cImFuY2hvclwiPicgKyB0aGlzLmRhdGEgKyAnPC9hPidcbiAgfSxcblxuICBvbjoge1xuICAgICdjbGljayc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHdpbmRvdy5hbGVydCgnTGluayBjbGlja2VkJylcbiAgICB9XG4gIH1cbn1cblxuRG9tLnJlZ2lzdGVyKHtcbiAgJ2xvZ2luLWJveCc6IGxvZ2luQm94LFxuICAncm9vdCc6IHtcbiAgICBvbjoge1xuICAgICAgJ2NsaWNrJzogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrZWQgaHRtbCByb290JylcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICdhcHAnOiBhcHAsXG4gICdhcmNoaXZlLWhpc3RvcnknOiBhcmNoaXZlLFxuICAnZXh0ZXJuYWwtbGlua3MnOiBleHRlcm5hbCxcbiAgJ2FyY2hpdmUtaGlzdG9yeS1saXN0Jzoge1xuICAgIHNvbWV0aGluZ0FITDogZnVuY3Rpb24gKCkge1xuICAgIH0sXG4gICAgb246IHtcbiAgICAgICdjbGljazphJzogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGNvbnNvbGUubG9nKCdhaGwgY2xpY2snKVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJ2xpbmtzJzogbGlua3MsXG4gICdsaW5rJzogbGlua1xufSlcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGRhdGEgPSB7XG4gICAgbmFtZTogJ0Jsb2cgRXhhbXBsZScsXG4gICAgbGlua3M6IFsxLCAyLCAzXSxcbiAgICB1c2VyOiB7XG4gICAgICBlbWFpbDogJ2FAYi5jb20nLFxuICAgICAgcGFzc3dvcmQ6ICdzZWNyZXQnXG4gICAgfVxuICB9XG5cbiAgRG9tLnNjYW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkYXRhKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhbm9ueW1vdXMob2JqXG4vKiovKSB7XG52YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTt3aXRoKG9iail7cC5wdXNoKCc8Zm9ybT4gICA8bGVnZW5kPkxvZ2luIGZvcm08L2xlZ2VuZD4gICBFbWFpbDogPGlucHV0IGFzPVwiZW1haWxcInZhbHVlPVwiJywgZGF0YS5lbWFpbCAsJ1wiIHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ+PGJyPiAgIFBhc3N3b3JkOiA8aW5wdXQgYXM9XCJwYXNzd29yZFwiIHZhbHVlPVwiJywgZGF0YS5wYXNzd29yZCAsJ1wiIHR5cGU9XCJwYXNzd29yZFwiIHJlcXVpcmVkPjxicj4gICA8YnV0dG9uIGFzPVwiYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPkxvZ2luPC9idXR0b24+IDwvZm9ybT4gJyk7fXJldHVybiBwLmpvaW4oJycpO1xufTsiLCJ2YXIgZ2V0ID0gcmVxdWlyZSgnZ2V0LW9iamVjdC1wYXRoJylcbnZhciBEZWxlZ2F0ZSA9IHJlcXVpcmUoJ2RvbS1kZWxlZ2F0ZScpLkRlbGVnYXRlXG52YXIgb25FdmVudHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhkb2N1bWVudCkuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE9iamVjdC5nZXRQcm90b3R5cGVPZihPYmplY3QuZ2V0UHJvdG90eXBlT2YoZG9jdW1lbnQpKSkpLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPYmplY3QuZ2V0UHJvdG90eXBlT2Yod2luZG93KSkpLmZpbHRlcihmdW5jdGlvbiAoaSkge3JldHVybiAhaS5pbmRleE9mKCdvbicpICYmIChkb2N1bWVudFtpXSA9PSBudWxsIHx8IHR5cGVvZiBkb2N1bWVudFtpXSA9PSAnZnVuY3Rpb24nKTt9KS5maWx0ZXIoZnVuY3Rpb24gKGVsZW0sIHBvcywgc2VsZikge3JldHVybiBzZWxmLmluZGV4T2YoZWxlbSkgPT0gcG9zO30pXG52YXIgb25FdmVudHNTZWxlY3RvciA9IG9uRXZlbnRzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnWycgKyBrZXkgKyAnXTpub3QoWycgKyBrZXkgKyAnPVwiXCJdKSdcbn0pLmpvaW4oJywnKVxuXG5mdW5jdGlvbiBSZWdpc3RlciAoKSB7fVxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVnaXN0ZXIucHJvdG90eXBlLCB7XG4gIHNlbGVjdG9yOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpXG4gICAgICByZXR1cm4ga2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gJ1snICsga2V5ICsgJ10nXG4gICAgICB9KS5qb2luKCcsICcpXG4gICAgfVxuICB9LFxuICBrZXlzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcylcbiAgICB9XG4gIH1cbn0pXG5cbnZhciByZWdpc3RlciA9IG5ldyBSZWdpc3RlcigpXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQgKGVsLCBkYXRhLCBjb21wb25lbnQsIHBhcmVudCkge1xuICB2YXIgY3R4ID0gT2JqZWN0LmNyZWF0ZShjb21wb25lbnQuaXNvbGF0ZSA/IHt9IDogcGFyZW50IHx8IHt9KVxuXG4gIHZhciBpbmZvID0gT2JqZWN0LmNyZWF0ZSh7fSwge1xuICAgIGNvbXBvbmVudDoge1xuICAgICAgdmFsdWU6IGNvbXBvbmVudFxuICAgIH1cbiAgfSlcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjdHgsIHtcbiAgICBfXzoge1xuICAgICAgdmFsdWU6IGluZm9cbiAgICB9LFxuICAgIGVsOiB7XG4gICAgICB2YWx1ZTogZWxcbiAgICB9XG4gIH0pXG5cbiAgY3R4LmRhdGEgPSBkYXRhXG5cbiAgcmV0dXJuIGN0eFxufVxuXG52YXIgaWdub3JlID0gWydvbicsICd0ZW1wbGF0ZScsICdpbml0aWFsaXplJywgJ2lzb2xhdGUnXVxuZnVuY3Rpb24gZXh0ZW5kIChvYmopIHtcbiAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICB2YXIgZGVzY3JpcHRvciwgcHJvcFxuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIGZvciAocHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiBpZ25vcmUuaW5kZXhPZihwcm9wKSA9PT0gLTEpIHtcbiAgICAgICAgICBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3ApXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzY3JpcHRvcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIG9ialxufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50Q29tcG9uZW50IChlbCkge1xuICB2YXIgcmVnaXN0ZXJLZXlzID0gcmVnaXN0ZXIua2V5c1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWR4ID0gcmVnaXN0ZXJLZXlzLmluZGV4T2YoZWwuYXR0cmlidXRlc1tpXS5uYW1lKVxuICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiByZWdpc3RlcktleXNbaWR4XSxcbiAgICAgICAgY29tcG9uZW50OiByZWdpc3RlcltyZWdpc3RlcktleXNbaWR4XV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudERlbGVnYXRlIChlbCwgY3R4LCBjb21wb25lbnQpIHtcbiAgdmFyIGRlbCA9IG5ldyBEZWxlZ2F0ZShlbClcblxuICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJzXG4gIHZhciBwcm94eSA9IGZ1bmN0aW9uIChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgICAgZm4uY2FsbChjdHgsIGUpXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgZXZlbnQgaW4gY29tcG9uZW50Lm9uKSB7XG4gICAgaWYgKGNvbXBvbmVudC5vbi5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcbiAgICAgIHZhciBjb2xvbiA9IGV2ZW50LmluZGV4T2YoJzonKVxuICAgICAgdmFyIG5hbWUsIHNlbGVjdG9yXG4gICAgICBpZiAoY29sb24gPT09IC0xKSB7XG4gICAgICAgIG5hbWUgPSBldmVudFxuICAgICAgICBkZWwub24obmFtZSwgcHJveHkoY29tcG9uZW50Lm9uW2V2ZW50XSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuYW1lID0gZXZlbnQuc3Vic3RyKDAsIGNvbG9uKVxuICAgICAgICBzZWxlY3RvciA9IGV2ZW50LnN1YnN0cihjb2xvbiArIDEpXG4gICAgICAgIGRlbC5vbihuYW1lLCBzZWxlY3RvciwgcHJveHkoY29tcG9uZW50Lm9uW2V2ZW50XSkpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlbFxufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50RGF0YSAoZWwsIGNvbXBvbmVudE5hbWUsIHBhcmVudCkge1xuICB2YXIgYXR0ciA9IGVsLmdldEF0dHJpYnV0ZShjb21wb25lbnROYW1lKVxuICByZXR1cm4gYXR0ciAmJiBnZXQocGFyZW50LCBhdHRyKVxufVxuXG5mdW5jdGlvbiByZWdpc3RlckNvbXBvbmVudCAobmFtZSwgb2JqKSB7XG4gIGlmICh0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xuICAgICAgaWYgKG5hbWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICByZWdpc3RlcltrZXldID0gbmFtZVtrZXldXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlZ2lzdGVyW25hbWVdID0gb2JqXG4gIH1cbn1cblxuZnVuY3Rpb24gbm9kZUxpc3RUb0FycmF5IChub2RlTGlzdCkge1xuICB2YXIgbm9kZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIG5vZGVBcnJheS5wdXNoKG5vZGVMaXN0W2ldKVxuICB9XG5cbiAgcmV0dXJuIG5vZGVBcnJheVxufVxuXG5mdW5jdGlvbiBnZXRNYXRjaGluZ0VsZW1lbnRzIChlbCwgY2hpbGRyZW5Pbmx5KSB7XG4gIHZhciBzZWxlY3RvciA9IERvbS5fcmVnaXN0ZXIuc2VsZWN0b3JcbiAgdmFyIG1hdGNoZXMgPSBub2RlTGlzdFRvQXJyYXkoZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpXG5cbiAgaWYgKCFjaGlsZHJlbk9ubHkpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gZ2V0RWxlbWVudENvbXBvbmVudChlbClcblxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIG1hdGNoZXMudW5zaGlmdChlbClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWF0Y2hlc1xufVxuXG5mdW5jdGlvbiBmaW5kUGFyZW50Q29udGV4dCAoZWwsIGNvbnRleHRzKSB7XG4gIGRvIHtcbiAgICBlbCA9IGVsLnBhcmVudE5vZGVcbiAgICBpZiAoZWwpIHtcbiAgICAgIGZvciAodmFyIGkgPSBjb250ZXh0cy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xuICAgICAgICBpZiAoY29udGV4dHNbaV0uY3R4LmVsID09PSBlbCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0c1tpXS5jdHhcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSB3aGlsZSAoZWwpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRIdG1sIChlbCwgY29tcG9uZW50LCBjdHgpIHtcbiAgICB2YXIgaHRtbCA9ICh0eXBlb2YgY29tcG9uZW50LnRlbXBsYXRlID09PSAnZnVuY3Rpb24nKVxuICAgICAgPyBjb21wb25lbnQudGVtcGxhdGUuY2FsbChjdHgsIGN0eClcbiAgICAgIDogY29tcG9uZW50LnRlbXBsYXRlXG5cbiAgICBlbC5pbm5lckhUTUwgPSBodG1sXG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJlciAoY3VyckVsLCBjb21wb25lbnQsIGN0eCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBzZXRIdG1sKGN1cnJFbCwgY29tcG9uZW50LCBjdHgpXG4gICAgICBEb20uc2NhbihjdXJyRWwsIGN0eC5kYXRhLCBjdHgsIHRydWUpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2NhbiAoZWwsIGRhdGEsIHBhcmVudCwgY2hpbGRyZW5Pbmx5KSB7XG4gICAgdmFyIG1hdGNoZXMgPSBnZXRNYXRjaGluZ0VsZW1lbnRzKGVsLCBjaGlsZHJlbk9ubHkpXG4gICAgdmFyIGNvbnRleHRzID0gW11cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBjb250ZXh0cy5wdXNoKHtjdHg6IHBhcmVudH0pXG4gICAgfVxuXG4gICAgdmFyIGN1cnJFbFxuICAgIHdoaWxlIChtYXRjaGVzLmxlbmd0aCkge1xuICAgICAgY3VyckVsID0gbWF0Y2hlcy5zaGlmdCgpXG4gICAgICB2YXIgcmVmID0gZ2V0RWxlbWVudENvbXBvbmVudChjdXJyRWwpXG4gICAgICB2YXIgY29tcG9uZW50ID0gcmVmLmNvbXBvbmVudFxuICAgICAgdmFyIHBhcmVudENvbnRleHQgPSBmaW5kUGFyZW50Q29udGV4dChjdXJyRWwsIGNvbnRleHRzKSB8fCBwYXJlbnRcbiAgICAgIHZhciBwYXJlbnREYXRhID0gcGFyZW50Q29udGV4dCA/IHBhcmVudENvbnRleHQuZGF0YSA6IGRhdGFcbiAgICAgIHZhciBlbERhdGEgPSBnZXRFbGVtZW50RGF0YShjdXJyRWwsIHJlZi5rZXksIHBhcmVudERhdGEpIHx8IHBhcmVudERhdGFcbiAgICAgIHZhciBjdHggPSBjcmVhdGVDb250ZXh0KGN1cnJFbCwgZWxEYXRhLCBjb21wb25lbnQsIHBhcmVudENvbnRleHQpXG4gICAgICB2YXIgZGVsID0gY3JlYXRlRWxlbWVudERlbGVnYXRlKGN1cnJFbCwgY3R4LCBjb21wb25lbnQpXG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdHguX18sICdkZWwnLCB7IHZhbHVlOiBkZWwgfSlcblxuICAgICAgZXh0ZW5kKGN0eCwgY29tcG9uZW50KVxuXG4gICAgICBjb250ZXh0cy5wdXNoKHtcbiAgICAgICAga2V5OiByZWYua2V5LCBjdHg6IGN0eCwgaW5pdGlhbGl6ZTogY29tcG9uZW50LmluaXRpYWxpemUsXG4gICAgICAgIHRlbXBsYXRlOiBjb21wb25lbnQudGVtcGxhdGUsIGNvbXBvbmVudDogY29tcG9uZW50LCBlbDogY3VyckVsXG4gICAgICB9KVxuICAgIH1cblxuICAgIHZhciBpLCBqXG4gICAgdmFyIHByb2Nlc3NlZCA9IFtdXG4gICAgZm9yIChpID0gY29udGV4dHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBhbGlhc0NvbnRleHQgPSBjb250ZXh0c1tpXS5jdHhcbiAgICAgIHZhciBhbGlhc0VsID0gYWxpYXNDb250ZXh0LmVsXG4gICAgICB2YXIgYWxpYXNlcyA9IGFsaWFzRWwucXVlcnlTZWxlY3RvckFsbCgnW2FzXTpub3QoW2FzPVwiXCJdKScpXG4gICAgICBmb3IgKGogPSAwOyBqIDwgYWxpYXNlcy5sZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocHJvY2Vzc2VkLmluZGV4T2YoYWxpYXNlc1tqXSkgPCAwKSB7XG4gICAgICAgICAgdmFyIGF0dHIgPSBhbGlhc2VzW2pdLmdldEF0dHJpYnV0ZSgnYXMnKVxuICAgICAgICAgIGFsaWFzQ29udGV4dFthdHRyXSA9IGFsaWFzZXNbal1cbiAgICAgICAgICBwcm9jZXNzZWQucHVzaChhbGlhc2VzW2pdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcHJvY2Vzc2VkID0gW11cbiAgICAvLyBmb3IgKGkgPSBjb250ZXh0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIC8vICAgdmFyIG9uQ29udGV4dCA9IGNvbnRleHRzW2ldLmN0eFxuICAgIC8vICAgdmFyIG9uRWwgPSBvbkNvbnRleHQuZWxcbiAgICAvLyAgIHZhciBvbnMgPSBvbkVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tvbmNsaWNrXTpub3QoW29uY2xpY2s9XCJcIl0pJylcbiAgICAvLyAgIGZvciAoaiA9IDA7IGogPCBvbnMubGVuZ3RoOyBqKyspIHtcbiAgICAvLyAgICAgaWYgKHByb2Nlc3NlZC5pbmRleE9mKG9uc1tqXSkgPCAwKSB7XG4gICAgLy8gICAgICAgYXR0ciA9IG9uc1tqXS5nZXRBdHRyaWJ1dGUoJ29uY2xpY2snKVxuICAgIC8vICAgICAgIC8vIHZhciBmbiA9IG9uc1tqXS5vbmNsaWNrXG4gICAgLy8gICAgICAgdmFyIGZuID0gbmV3IEZ1bmN0aW9uKCd3aXRoICh0aGlzKSB7XFxuXFx0cmV0dXJuICcgKyBhdHRyICsgJ1xcbn0nKVxuICAgIC8vICAgICAgIG9uc1tqXS5vbmNsaWNrID0gZm4uYmluZChvbkNvbnRleHQpXG4gICAgLy8gICAgICAgcHJvY2Vzc2VkLnB1c2gob25zW2pdKVxuICAgIC8vICAgICB9XG4gICAgLy8gICB9XG4gICAgLy8gfVxuICAgIHByb2Nlc3NlZCA9IFtdXG4gICAgZm9yIChpID0gY29udGV4dHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBvbkNvbnRleHQgPSBjb250ZXh0c1tpXS5jdHhcbiAgICAgIHZhciBvbkVsID0gb25Db250ZXh0LmVsXG4gICAgICB2YXIgb25zID0gbm9kZUxpc3RUb0FycmF5KG9uRWwucXVlcnlTZWxlY3RvckFsbChvbkV2ZW50c1NlbGVjdG9yKSlcbiAgICAgIG9ucy51bnNoaWZ0KG9uRWwpXG4gICAgICBmb3IgKGogPSAwOyBqIDwgb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChwcm9jZXNzZWQuaW5kZXhPZihvbnNbal0pIDwgMCkge1xuICAgICAgICAgIHByb2Nlc3NlZC5wdXNoKG9uc1tqXSlcbiAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IG9uRXZlbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBpZiAob25zW2pdLmF0dHJpYnV0ZXNbb25FdmVudHNba11dKSB7XG4gICAgICAgICAgICAgIGF0dHIgPSBvbnNbal0uYXR0cmlidXRlc1tvbkV2ZW50c1trXV0udmFsdWVcbiAgICAgICAgICAgICAgLy8gdmFyIGZuID0gb25zW2pdLm9uY2xpY2tcbiAgICAgICAgICAgICAgLy8gdmFyIGZuID0gbmV3IEZ1bmN0aW9uKCdlJywgJ3dpdGggKHRoaXMpIHtcXG5cXHRyZXR1cm4gJyArIGF0dHIgKyAnXFxufScpXG4gICAgICAgICAgICAgIC8vIG9uc1tqXVtvbkV2ZW50c1trXV0gPSBmbi5iaW5kKG9uQ29udGV4dClcbiAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlciAoZm4sIGN0eCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZSwgY3R4KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBmbiA9IG5ldyBGdW5jdGlvbignZSwgY3R4JywgJ3dpdGggKGN0eCkge1xcblxcdHJldHVybiAnICsgYXR0ciArICdcXG59JylcbiAgICAgICAgICAgICAgb25zW2pdW29uRXZlbnRzW2tdXSA9IGhhbmRsZXIoZm4sIG9uQ29udGV4dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgY29udGV4dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjb250ZXh0c1tpXS5pbml0aWFsaXplKSB7XG4gICAgICAgIGNvbnRleHRzW2ldLmluaXRpYWxpemUuY2FsbChjb250ZXh0c1tpXS5jdHgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGNvbnRleHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY29udGV4dHNbaV0udGVtcGxhdGUpIHtcbiAgICAgICAgdmFyIHJlbmRlciA9IHJlbmRlcmVyKGNvbnRleHRzW2ldLmN0eC5lbCwgY29udGV4dHNbaV0uY29tcG9uZW50LCBjb250ZXh0c1tpXS5jdHgpXG4gICAgICAgIHJlbmRlcigpXG4gICAgICAgIGNvbnRleHRzW2ldLmN0eC5yZW5kZXIgPSByZW5kZXJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgRG9tID0gT2JqZWN0LmNyZWF0ZSh7fSwge1xuICAgIF9yZWdpc3RlcjogeyB2YWx1ZTogcmVnaXN0ZXIgfSxcbiAgICByZWdpc3RlcjogeyB2YWx1ZTogcmVnaXN0ZXJDb21wb25lbnQgfSxcbiAgICBzY2FuOiB7IHZhbHVlOiBzY2FuIH1cbiAgfSlcblxuICBtb2R1bGUuZXhwb3J0cyA9IERvbVxuIiwiLypqc2hpbnQgYnJvd3Nlcjp0cnVlLCBub2RlOnRydWUqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVsZWdhdGU7XG5cbi8qKlxuICogRE9NIGV2ZW50IGRlbGVnYXRvclxuICpcbiAqIFRoZSBkZWxlZ2F0b3Igd2lsbCBsaXN0ZW5cbiAqIGZvciBldmVudHMgdGhhdCBidWJibGUgdXBcbiAqIHRvIHRoZSByb290IG5vZGUuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge05vZGV8c3RyaW5nfSBbcm9vdF0gVGhlIHJvb3Qgbm9kZSBvciBhIHNlbGVjdG9yIHN0cmluZyBtYXRjaGluZyB0aGUgcm9vdCBub2RlXG4gKi9cbmZ1bmN0aW9uIERlbGVnYXRlKHJvb3QpIHtcblxuICAvKipcbiAgICogTWFpbnRhaW4gYSBtYXAgb2YgbGlzdGVuZXJcbiAgICogbGlzdHMsIGtleWVkIGJ5IGV2ZW50IG5hbWUuXG4gICAqXG4gICAqIEB0eXBlIE9iamVjdFxuICAgKi9cbiAgdGhpcy5saXN0ZW5lck1hcCA9IFt7fSwge31dO1xuICBpZiAocm9vdCkge1xuICAgIHRoaXMucm9vdChyb290KTtcbiAgfVxuXG4gIC8qKiBAdHlwZSBmdW5jdGlvbigpICovXG4gIHRoaXMuaGFuZGxlID0gRGVsZWdhdGUucHJvdG90eXBlLmhhbmRsZS5iaW5kKHRoaXMpO1xufVxuXG4vKipcbiAqIFN0YXJ0IGxpc3RlbmluZyBmb3IgZXZlbnRzXG4gKiBvbiB0aGUgcHJvdmlkZWQgRE9NIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtOb2RlfHN0cmluZ30gW3Jvb3RdIFRoZSByb290IG5vZGUgb3IgYSBzZWxlY3RvciBzdHJpbmcgbWF0Y2hpbmcgdGhlIHJvb3Qgbm9kZVxuICogQHJldHVybnMge0RlbGVnYXRlfSBUaGlzIG1ldGhvZCBpcyBjaGFpbmFibGVcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLnJvb3QgPSBmdW5jdGlvbihyb290KSB7XG4gIHZhciBsaXN0ZW5lck1hcCA9IHRoaXMubGlzdGVuZXJNYXA7XG4gIHZhciBldmVudFR5cGU7XG5cbiAgLy8gUmVtb3ZlIG1hc3RlciBldmVudCBsaXN0ZW5lcnNcbiAgaWYgKHRoaXMucm9vdEVsZW1lbnQpIHtcbiAgICBmb3IgKGV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcFsxXSkge1xuICAgICAgaWYgKGxpc3RlbmVyTWFwWzFdLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpIHtcbiAgICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcFswXSkge1xuICAgICAgaWYgKGxpc3RlbmVyTWFwWzBdLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpIHtcbiAgICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiBubyByb290IG9yIHJvb3QgaXMgbm90XG4gIC8vIGEgZG9tIG5vZGUsIHRoZW4gcmVtb3ZlIGludGVybmFsXG4gIC8vIHJvb3QgcmVmZXJlbmNlIGFuZCBleGl0IGhlcmVcbiAgaWYgKCFyb290IHx8ICFyb290LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICBpZiAodGhpcy5yb290RWxlbWVudCkge1xuICAgICAgZGVsZXRlIHRoaXMucm9vdEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByb290IG5vZGUgYXQgd2hpY2hcbiAgICogbGlzdGVuZXJzIGFyZSBhdHRhY2hlZC5cbiAgICpcbiAgICogQHR5cGUgTm9kZVxuICAgKi9cbiAgdGhpcy5yb290RWxlbWVudCA9IHJvb3Q7XG5cbiAgLy8gU2V0IHVwIG1hc3RlciBldmVudCBsaXN0ZW5lcnNcbiAgZm9yIChldmVudFR5cGUgaW4gbGlzdGVuZXJNYXBbMV0pIHtcbiAgICBpZiAobGlzdGVuZXJNYXBbMV0uaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSkge1xuICAgICAgdGhpcy5yb290RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHRydWUpO1xuICAgIH1cbiAgfVxuICBmb3IgKGV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcFswXSkge1xuICAgIGlmIChsaXN0ZW5lck1hcFswXS5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKSB7XG4gICAgICB0aGlzLnJvb3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5jYXB0dXJlRm9yVHlwZSA9IGZ1bmN0aW9uKGV2ZW50VHlwZSkge1xuICByZXR1cm4gWydibHVyJywgJ2Vycm9yJywgJ2ZvY3VzJywgJ2xvYWQnLCAncmVzaXplJywgJ3Njcm9sbCddLmluZGV4T2YoZXZlbnRUeXBlKSAhPT0gLTE7XG59O1xuXG4vKipcbiAqIEF0dGFjaCBhIGhhbmRsZXIgdG8gb25lXG4gKiBldmVudCBmb3IgYWxsIGVsZW1lbnRzXG4gKiB0aGF0IG1hdGNoIHRoZSBzZWxlY3RvcixcbiAqIG5vdyBvciBpbiB0aGUgZnV0dXJlXG4gKlxuICogVGhlIGhhbmRsZXIgZnVuY3Rpb24gcmVjZWl2ZXNcbiAqIHRocmVlIGFyZ3VtZW50czogdGhlIERPTSBldmVudFxuICogb2JqZWN0LCB0aGUgbm9kZSB0aGF0IG1hdGNoZWRcbiAqIHRoZSBzZWxlY3RvciB3aGlsZSB0aGUgZXZlbnRcbiAqIHdhcyBidWJibGluZyBhbmQgYSByZWZlcmVuY2VcbiAqIHRvIGl0c2VsZi4gV2l0aGluIHRoZSBoYW5kbGVyLFxuICogJ3RoaXMnIGlzIGVxdWFsIHRvIHRoZSBzZWNvbmRcbiAqIGFyZ3VtZW50LlxuICpcbiAqIFRoZSBub2RlIHRoYXQgYWN0dWFsbHkgcmVjZWl2ZWRcbiAqIHRoZSBldmVudCBjYW4gYmUgYWNjZXNzZWQgdmlhXG4gKiAnZXZlbnQudGFyZ2V0Jy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIExpc3RlbiBmb3IgdGhlc2UgZXZlbnRzXG4gKiBAcGFyYW0ge3N0cmluZ3x1bmRlZmluZWR9IHNlbGVjdG9yIE9ubHkgaGFuZGxlIGV2ZW50cyBvbiBlbGVtZW50cyBtYXRjaGluZyB0aGlzIHNlbGVjdG9yLCBpZiB1bmRlZmluZWQgbWF0Y2ggcm9vdCBlbGVtZW50XG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCl9IGhhbmRsZXIgSGFuZGxlciBmdW5jdGlvbiAtIGV2ZW50IGRhdGEgcGFzc2VkIGhlcmUgd2lsbCBiZSBpbiBldmVudC5kYXRhXG4gKiBAcGFyYW0ge09iamVjdH0gW2V2ZW50RGF0YV0gRGF0YSB0byBwYXNzIGluIGV2ZW50LmRhdGFcbiAqIEByZXR1cm5zIHtEZWxlZ2F0ZX0gVGhpcyBtZXRob2QgaXMgY2hhaW5hYmxlXG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgc2VsZWN0b3IsIGhhbmRsZXIsIHVzZUNhcHR1cmUpIHtcbiAgdmFyIHJvb3QsIGxpc3RlbmVyTWFwLCBtYXRjaGVyLCBtYXRjaGVyUGFyYW07XG5cbiAgaWYgKCFldmVudFR5cGUpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGV2ZW50IHR5cGU6ICcgKyBldmVudFR5cGUpO1xuICB9XG5cbiAgLy8gaGFuZGxlciBjYW4gYmUgcGFzc2VkIGFzXG4gIC8vIHRoZSBzZWNvbmQgb3IgdGhpcmQgYXJndW1lbnRcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHVzZUNhcHR1cmUgPSBoYW5kbGVyO1xuICAgIGhhbmRsZXIgPSBzZWxlY3RvcjtcbiAgICBzZWxlY3RvciA9IG51bGw7XG4gIH1cblxuICAvLyBGYWxsYmFjayB0byBzZW5zaWJsZSBkZWZhdWx0c1xuICAvLyBpZiB1c2VDYXB0dXJlIG5vdCBzZXRcbiAgaWYgKHVzZUNhcHR1cmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHVzZUNhcHR1cmUgPSB0aGlzLmNhcHR1cmVGb3JUeXBlKGV2ZW50VHlwZSk7XG4gIH1cblxuICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIYW5kbGVyIG11c3QgYmUgYSB0eXBlIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICByb290ID0gdGhpcy5yb290RWxlbWVudDtcbiAgbGlzdGVuZXJNYXAgPSB0aGlzLmxpc3RlbmVyTWFwW3VzZUNhcHR1cmUgPyAxIDogMF07XG5cbiAgLy8gQWRkIG1hc3RlciBoYW5kbGVyIGZvciB0eXBlIGlmIG5vdCBjcmVhdGVkIHlldFxuICBpZiAoIWxpc3RlbmVyTWFwW2V2ZW50VHlwZV0pIHtcbiAgICBpZiAocm9vdCkge1xuICAgICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHVzZUNhcHR1cmUpO1xuICAgIH1cbiAgICBsaXN0ZW5lck1hcFtldmVudFR5cGVdID0gW107XG4gIH1cblxuICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgbWF0Y2hlclBhcmFtID0gbnVsbDtcblxuICAgIC8vIENPTVBMRVggLSBtYXRjaGVzUm9vdCBuZWVkcyB0byBoYXZlIGFjY2VzcyB0b1xuICAgIC8vIHRoaXMucm9vdEVsZW1lbnQsIHNvIGJpbmQgdGhlIGZ1bmN0aW9uIHRvIHRoaXMuXG4gICAgbWF0Y2hlciA9IG1hdGNoZXNSb290LmJpbmQodGhpcyk7XG5cbiAgLy8gQ29tcGlsZSBhIG1hdGNoZXIgZm9yIHRoZSBnaXZlbiBzZWxlY3RvclxuICB9IGVsc2UgaWYgKC9eW2Etel0rJC9pLnRlc3Qoc2VsZWN0b3IpKSB7XG4gICAgbWF0Y2hlclBhcmFtID0gc2VsZWN0b3I7XG4gICAgbWF0Y2hlciA9IG1hdGNoZXNUYWc7XG4gIH0gZWxzZSBpZiAoL14jW2EtejAtOVxcLV9dKyQvaS50ZXN0KHNlbGVjdG9yKSkge1xuICAgIG1hdGNoZXJQYXJhbSA9IHNlbGVjdG9yLnNsaWNlKDEpO1xuICAgIG1hdGNoZXIgPSBtYXRjaGVzSWQ7XG4gIH0gZWxzZSB7XG4gICAgbWF0Y2hlclBhcmFtID0gc2VsZWN0b3I7XG4gICAgbWF0Y2hlciA9IG1hdGNoZXM7XG4gIH1cblxuICAvLyBBZGQgdG8gdGhlIGxpc3Qgb2YgbGlzdGVuZXJzXG4gIGxpc3RlbmVyTWFwW2V2ZW50VHlwZV0ucHVzaCh7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgbWF0Y2hlcjogbWF0Y2hlcixcbiAgICBtYXRjaGVyUGFyYW06IG1hdGNoZXJQYXJhbVxuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGV2ZW50IGhhbmRsZXJcbiAqIGZvciBlbGVtZW50cyB0aGF0IG1hdGNoXG4gKiB0aGUgc2VsZWN0b3IsIGZvcmV2ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gW2V2ZW50VHlwZV0gUmVtb3ZlIGhhbmRsZXJzIGZvciBldmVudHMgbWF0Y2hpbmcgdGhpcyB0eXBlLCBjb25zaWRlcmluZyB0aGUgb3RoZXIgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtzdHJpbmd9IFtzZWxlY3Rvcl0gSWYgdGhpcyBwYXJhbWV0ZXIgaXMgb21pdHRlZCwgb25seSBoYW5kbGVycyB3aGljaCBtYXRjaCB0aGUgb3RoZXIgdHdvIHdpbGwgYmUgcmVtb3ZlZFxuICogQHBhcmFtIHtmdW5jdGlvbigpfSBbaGFuZGxlcl0gSWYgdGhpcyBwYXJhbWV0ZXIgaXMgb21pdHRlZCwgb25seSBoYW5kbGVycyB3aGljaCBtYXRjaCB0aGUgcHJldmlvdXMgdHdvIHdpbGwgYmUgcmVtb3ZlZFxuICogQHJldHVybnMge0RlbGVnYXRlfSBUaGlzIG1ldGhvZCBpcyBjaGFpbmFibGVcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgc2VsZWN0b3IsIGhhbmRsZXIsIHVzZUNhcHR1cmUpIHtcbiAgdmFyIGksIGxpc3RlbmVyLCBsaXN0ZW5lck1hcCwgbGlzdGVuZXJMaXN0LCBzaW5nbGVFdmVudFR5cGU7XG5cbiAgLy8gSGFuZGxlciBjYW4gYmUgcGFzc2VkIGFzXG4gIC8vIHRoZSBzZWNvbmQgb3IgdGhpcmQgYXJndW1lbnRcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHVzZUNhcHR1cmUgPSBoYW5kbGVyO1xuICAgIGhhbmRsZXIgPSBzZWxlY3RvcjtcbiAgICBzZWxlY3RvciA9IG51bGw7XG4gIH1cblxuICAvLyBJZiB1c2VDYXB0dXJlIG5vdCBzZXQsIHJlbW92ZVxuICAvLyBhbGwgZXZlbnQgbGlzdGVuZXJzXG4gIGlmICh1c2VDYXB0dXJlID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLm9mZihldmVudFR5cGUsIHNlbGVjdG9yLCBoYW5kbGVyLCB0cnVlKTtcbiAgICB0aGlzLm9mZihldmVudFR5cGUsIHNlbGVjdG9yLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lck1hcCA9IHRoaXMubGlzdGVuZXJNYXBbdXNlQ2FwdHVyZSA/IDEgOiAwXTtcbiAgaWYgKCFldmVudFR5cGUpIHtcbiAgICBmb3IgKHNpbmdsZUV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcCkge1xuICAgICAgaWYgKGxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KHNpbmdsZUV2ZW50VHlwZSkpIHtcbiAgICAgICAgdGhpcy5vZmYoc2luZ2xlRXZlbnRUeXBlLCBzZWxlY3RvciwgaGFuZGxlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lckxpc3QgPSBsaXN0ZW5lck1hcFtldmVudFR5cGVdO1xuICBpZiAoIWxpc3RlbmVyTGlzdCB8fCAhbGlzdGVuZXJMaXN0Lmxlbmd0aCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gUmVtb3ZlIG9ubHkgcGFyYW1ldGVyIG1hdGNoZXNcbiAgLy8gaWYgc3BlY2lmaWVkXG4gIGZvciAoaSA9IGxpc3RlbmVyTGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGxpc3RlbmVyID0gbGlzdGVuZXJMaXN0W2ldO1xuXG4gICAgaWYgKCghc2VsZWN0b3IgfHwgc2VsZWN0b3IgPT09IGxpc3RlbmVyLnNlbGVjdG9yKSAmJiAoIWhhbmRsZXIgfHwgaGFuZGxlciA9PT0gbGlzdGVuZXIuaGFuZGxlcikpIHtcbiAgICAgIGxpc3RlbmVyTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWxsIGxpc3RlbmVycyByZW1vdmVkXG4gIGlmICghbGlzdGVuZXJMaXN0Lmxlbmd0aCkge1xuICAgIGRlbGV0ZSBsaXN0ZW5lck1hcFtldmVudFR5cGVdO1xuXG4gICAgLy8gUmVtb3ZlIHRoZSBtYWluIGhhbmRsZXJcbiAgICBpZiAodGhpcy5yb290RWxlbWVudCkge1xuICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHVzZUNhcHR1cmUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEhhbmRsZSBhbiBhcmJpdHJhcnkgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLmhhbmRsZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIHZhciBpLCBsLCB0eXBlID0gZXZlbnQudHlwZSwgcm9vdCwgcGhhc2UsIGxpc3RlbmVyLCByZXR1cm5lZCwgbGlzdGVuZXJMaXN0ID0gW10sIHRhcmdldCwgLyoqIEBjb25zdCAqLyBFVkVOVElHTk9SRSA9ICdmdExhYnNEZWxlZ2F0ZUlnbm9yZSc7XG5cbiAgaWYgKGV2ZW50W0VWRU5USUdOT1JFXSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcblxuICAvLyBIYXJkY29kZSB2YWx1ZSBvZiBOb2RlLlRFWFRfTk9ERVxuICAvLyBhcyBub3QgZGVmaW5lZCBpbiBJRThcbiAgaWYgKHRhcmdldC5ub2RlVHlwZSA9PT0gMykge1xuICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICB9XG5cbiAgcm9vdCA9IHRoaXMucm9vdEVsZW1lbnQ7XG5cbiAgcGhhc2UgPSBldmVudC5ldmVudFBoYXNlIHx8ICggZXZlbnQudGFyZ2V0ICE9PSBldmVudC5jdXJyZW50VGFyZ2V0ID8gMyA6IDIgKTtcbiAgXG4gIHN3aXRjaCAocGhhc2UpIHtcbiAgICBjYXNlIDE6IC8vRXZlbnQuQ0FQVFVSSU5HX1BIQVNFOlxuICAgICAgbGlzdGVuZXJMaXN0ID0gdGhpcy5saXN0ZW5lck1hcFsxXVt0eXBlXTtcbiAgICBicmVhaztcbiAgICBjYXNlIDI6IC8vRXZlbnQuQVRfVEFSR0VUOlxuICAgICAgaWYgKHRoaXMubGlzdGVuZXJNYXBbMF0gJiYgdGhpcy5saXN0ZW5lck1hcFswXVt0eXBlXSkgbGlzdGVuZXJMaXN0ID0gbGlzdGVuZXJMaXN0LmNvbmNhdCh0aGlzLmxpc3RlbmVyTWFwWzBdW3R5cGVdKTtcbiAgICAgIGlmICh0aGlzLmxpc3RlbmVyTWFwWzFdICYmIHRoaXMubGlzdGVuZXJNYXBbMV1bdHlwZV0pIGxpc3RlbmVyTGlzdCA9IGxpc3RlbmVyTGlzdC5jb25jYXQodGhpcy5saXN0ZW5lck1hcFsxXVt0eXBlXSk7XG4gICAgYnJlYWs7XG4gICAgY2FzZSAzOiAvL0V2ZW50LkJVQkJMSU5HX1BIQVNFOlxuICAgICAgbGlzdGVuZXJMaXN0ID0gdGhpcy5saXN0ZW5lck1hcFswXVt0eXBlXTtcbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIE5lZWQgdG8gY29udGludW91c2x5IGNoZWNrXG4gIC8vIHRoYXQgdGhlIHNwZWNpZmljIGxpc3QgaXNcbiAgLy8gc3RpbGwgcG9wdWxhdGVkIGluIGNhc2Ugb25lXG4gIC8vIG9mIHRoZSBjYWxsYmFja3MgYWN0dWFsbHlcbiAgLy8gY2F1c2VzIHRoZSBsaXN0IHRvIGJlIGRlc3Ryb3llZC5cbiAgbCA9IGxpc3RlbmVyTGlzdC5sZW5ndGg7XG4gIHdoaWxlICh0YXJnZXQgJiYgbCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJMaXN0W2ldO1xuXG4gICAgICAvLyBCYWlsIGZyb20gdGhpcyBsb29wIGlmXG4gICAgICAvLyB0aGUgbGVuZ3RoIGNoYW5nZWQgYW5kXG4gICAgICAvLyBubyBtb3JlIGxpc3RlbmVycyBhcmVcbiAgICAgIC8vIGRlZmluZWQgYmV0d2VlbiBpIGFuZCBsLlxuICAgICAgaWYgKCFsaXN0ZW5lcikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgZm9yIG1hdGNoIGFuZCBmaXJlXG4gICAgICAvLyB0aGUgZXZlbnQgaWYgdGhlcmUncyBvbmVcbiAgICAgIC8vXG4gICAgICAvLyBUT0RPOk1DRzoyMDEyMDExNzogTmVlZCBhIHdheVxuICAgICAgLy8gdG8gY2hlY2sgaWYgZXZlbnQjc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXG4gICAgICAvLyB3YXMgY2FsbGVkLiBJZiBzbywgYnJlYWsgYm90aCBsb29wcy5cbiAgICAgIGlmIChsaXN0ZW5lci5tYXRjaGVyLmNhbGwodGFyZ2V0LCBsaXN0ZW5lci5tYXRjaGVyUGFyYW0sIHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuZWQgPSB0aGlzLmZpcmUoZXZlbnQsIHRhcmdldCwgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICAvLyBTdG9wIHByb3BhZ2F0aW9uIHRvIHN1YnNlcXVlbnRcbiAgICAgIC8vIGNhbGxiYWNrcyBpZiB0aGUgY2FsbGJhY2sgcmV0dXJuZWRcbiAgICAgIC8vIGZhbHNlXG4gICAgICBpZiAocmV0dXJuZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGV2ZW50W0VWRU5USUdOT1JFXSA9IHRydWU7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOk1DRzoyMDEyMDExNzogTmVlZCBhIHdheSB0b1xuICAgIC8vIGNoZWNrIGlmIGV2ZW50I3N0b3BQcm9wYWdhdGlvblxuICAgIC8vIHdhcyBjYWxsZWQuIElmIHNvLCBicmVhayBsb29waW5nXG4gICAgLy8gdGhyb3VnaCB0aGUgRE9NLiBTdG9wIGlmIHRoZVxuICAgIC8vIGRlbGVnYXRpb24gcm9vdCBoYXMgYmVlbiByZWFjaGVkXG4gICAgaWYgKHRhcmdldCA9PT0gcm9vdCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgbCA9IGxpc3RlbmVyTGlzdC5sZW5ndGg7XG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gIH1cbn07XG5cbi8qKlxuICogRmlyZSBhIGxpc3RlbmVyIG9uIGEgdGFyZ2V0LlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtPYmplY3R9IGxpc3RlbmVyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLmZpcmUgPSBmdW5jdGlvbihldmVudCwgdGFyZ2V0LCBsaXN0ZW5lcikge1xuICByZXR1cm4gbGlzdGVuZXIuaGFuZGxlci5jYWxsKHRhcmdldCwgZXZlbnQsIHRhcmdldCk7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gZWxlbWVudFxuICogbWF0Y2hlcyBhIGdlbmVyaWMgc2VsZWN0b3IuXG4gKlxuICogQHR5cGUgZnVuY3Rpb24oKVxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIEEgQ1NTIHNlbGVjdG9yXG4gKi9cbnZhciBtYXRjaGVzID0gKGZ1bmN0aW9uKGVsKSB7XG4gIGlmICghZWwpIHJldHVybjtcbiAgdmFyIHAgPSBlbC5wcm90b3R5cGU7XG4gIHJldHVybiAocC5tYXRjaGVzIHx8IHAubWF0Y2hlc1NlbGVjdG9yIHx8IHAud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IHAubW96TWF0Y2hlc1NlbGVjdG9yIHx8IHAubXNNYXRjaGVzU2VsZWN0b3IgfHwgcC5vTWF0Y2hlc1NlbGVjdG9yKTtcbn0oRWxlbWVudCkpO1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gZWxlbWVudFxuICogbWF0Y2hlcyBhIHRhZyBzZWxlY3Rvci5cbiAqXG4gKiBUYWdzIGFyZSBOT1QgY2FzZS1zZW5zaXRpdmUsXG4gKiBleGNlcHQgaW4gWE1MIChhbmQgWE1MLWJhc2VkXG4gKiBsYW5ndWFnZXMgc3VjaCBhcyBYSFRNTCkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZ05hbWUgVGhlIHRhZyBuYW1lIHRvIHRlc3QgYWdhaW5zdFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHRlc3Qgd2l0aFxuICogQHJldHVybnMgYm9vbGVhblxuICovXG5mdW5jdGlvbiBtYXRjaGVzVGFnKHRhZ05hbWUsIGVsZW1lbnQpIHtcbiAgcmV0dXJuIHRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBlbGVtZW50XG4gKiBtYXRjaGVzIHRoZSByb290LlxuICpcbiAqIEBwYXJhbSB7P1N0cmluZ30gc2VsZWN0b3IgSW4gdGhpcyBjYXNlIHRoaXMgaXMgYWx3YXlzIHBhc3NlZCB0aHJvdWdoIGFzIG51bGwgYW5kIG5vdCB1c2VkXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdGVzdCB3aXRoXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNSb290KHNlbGVjdG9yLCBlbGVtZW50KSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlKi9cbiAgaWYgKHRoaXMucm9vdEVsZW1lbnQgPT09IHdpbmRvdykgcmV0dXJuIGVsZW1lbnQgPT09IGRvY3VtZW50O1xuICByZXR1cm4gdGhpcy5yb290RWxlbWVudCA9PT0gZWxlbWVudDtcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBJRCBvZlxuICogdGhlIGVsZW1lbnQgaW4gJ3RoaXMnXG4gKiBtYXRjaGVzIHRoZSBnaXZlbiBJRC5cbiAqXG4gKiBJRHMgYXJlIGNhc2Utc2Vuc2l0aXZlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgdG8gdGVzdCBhZ2FpbnN0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdGVzdCB3aXRoXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNJZChpZCwgZWxlbWVudCkge1xuICByZXR1cm4gaWQgPT09IGVsZW1lbnQuaWQ7XG59XG5cbi8qKlxuICogU2hvcnQgaGFuZCBmb3Igb2ZmKClcbiAqIGFuZCByb290KCksIGllIGJvdGhcbiAqIHdpdGggbm8gcGFyYW1ldGVyc1xuICpcbiAqIEByZXR1cm4gdm9pZFxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9mZigpO1xuICB0aGlzLnJvb3QoKTtcbn07XG4iLCIvKmpzaGludCBicm93c2VyOnRydWUsIG5vZGU6dHJ1ZSovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcHJlc2VydmUgQ3JlYXRlIGFuZCBtYW5hZ2UgYSBET00gZXZlbnQgZGVsZWdhdG9yLlxuICpcbiAqIEB2ZXJzaW9uIDAuMy4wXG4gKiBAY29kaW5nc3RhbmRhcmQgZnRsYWJzLWpzdjJcbiAqIEBjb3B5cmlnaHQgVGhlIEZpbmFuY2lhbCBUaW1lcyBMaW1pdGVkIFtBbGwgUmlnaHRzIFJlc2VydmVkXVxuICogQGxpY2Vuc2UgTUlUIExpY2Vuc2UgKHNlZSBMSUNFTlNFLnR4dClcbiAqL1xudmFyIERlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJvb3QpIHtcbiAgcmV0dXJuIG5ldyBEZWxlZ2F0ZShyb290KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLkRlbGVnYXRlID0gRGVsZWdhdGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGdldDtcblxuZnVuY3Rpb24gZ2V0IChjb250ZXh0LCBwYXRoKSB7XG4gIGlmIChwYXRoLmluZGV4T2YoJy4nKSA9PSAtMSAmJiBwYXRoLmluZGV4T2YoJ1snKSA9PSAtMSkge1xuICAgIHJldHVybiBjb250ZXh0W3BhdGhdO1xuICB9XG5cbiAgdmFyIGNydW1icyA9IHBhdGguc3BsaXQoL1xcLnxcXFt8XFxdL2cpO1xuICB2YXIgaSA9IC0xO1xuICB2YXIgbGVuID0gY3J1bWJzLmxlbmd0aDtcbiAgdmFyIHJlc3VsdDtcblxuICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgaWYgKGkgPT0gMCkgcmVzdWx0ID0gY29udGV4dDtcbiAgICBpZiAoIWNydW1ic1tpXSkgY29udGludWU7XG4gICAgaWYgKHJlc3VsdCA9PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgIHJlc3VsdCA9IHJlc3VsdFtjcnVtYnNbaV1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==
