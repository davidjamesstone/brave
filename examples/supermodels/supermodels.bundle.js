(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function anonymous(obj
/**/) {
var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<form as="form">   <div errors>   </div>   <label id="name"><span class="label-text">Name: </span><input name="name" value="', data.name ,'" placeholder="Name" required><span class="indicator">*</span></label>   <label id="email"><span class="label-text">Email: </span><input name="email" value="', data.email ,'" placeholder="Email" required><span class="indicator">*</span></label>   <label id="question"><span class="label-text">Question: </span><input name="question" value="', data.question ,'" placeholder="Question" required><span class="indicator">*</span></label>   <label id="line1"><span class="label-text">Line 1: </span><input name="line1" value="', data.line1 ,'" placeholder="Line1" required><span class="indicator">*</span></label>   <label id="line2"><span class="label-text">Line 2: </span><input name="line2" value="', data.line2 ,'" placeholder="Line2" required><span class="indicator">*</span></label>   <label id="postcode"><span class="label-text">Postcode: </span><input name="postcode" value="', data.postcode ,'" placeholder="Postcode" required><span class="indicator">*</span></label>   <label id="name"><span class="label-text">Full Address: </span><address address></address></label>   <button as="sendButton" type="submit" ', data.errors.length ? 'disabled' : '' ,'>Send</button> </form> ');}return p.join('');
};
},{}],2:[function(require,module,exports){
module.exports = function anonymous(obj
/**/) {
var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<ul style="display: ', obj.length ? '' : 'none' ,'">   '); for (var i = 0; i < obj.length; i++) { p.push('     <li><a href="#', obj[i].key ,'">', obj[i].error ,'</a></li>   '); } p.push(' </ul> ');}return p.join('');
};
},{}],3:[function(require,module,exports){
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
        self.render()
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
        self.render()
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

},{"../..":4,"./_contactus.html":1,"./_errors.html":2,"supermodels.js":8}],4:[function(require,module,exports){
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
    var aliasEl = aliasContext.__.el
    var aliases = aliasEl.querySelectorAll('[as]:not([as=""])')
    for (j = 0; j < aliases.length; j++) {
      if (processed.indexOf(aliases[j]) < 0) {
        var attr = aliases[j].getAttribute('as')
        aliasContext[attr] = aliases[j]
        processed.push(aliases[j])
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
      var render = renderer(contexts[i].ctx.__.el, contexts[i].component, contexts[i].ctx)
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

},{"dom-delegate":6,"get-object-path":7}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./delegate":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
module.exports = require('./lib/supermodels');

},{"./lib/supermodels":18}],9:[function(require,module,exports){
'use strict'

var util = require('./util')
var createWrapperFactory = require('./factory')

function resolve (from) {
  var isCtor = util.isConstructor(from)
  var isSupermodelCtor = util.isSupermodelConstructor(from)
  var isArray = util.isArray(from)

  if (isCtor || isSupermodelCtor || isArray) {
    return {
      __type: from
    }
  }

  var isValue = !util.isObject(from)
  if (isValue) {
    return {
      __value: from
    }
  }

  return from
}

function createDef (from) {
  from = resolve(from)

  var __VALIDATORS = '__validators'
  var __VALUE = '__value'
  var __TYPE = '__type'
  var __DISPLAYNAME = '__displayName'
  var __GET = '__get'
  var __SET = '__set'
  var __ENUMERABLE = '__enumerable'
  var __CONFIGURABLE = '__configurable'
  var __WRITABLE = '__writable'
  var __SPECIAL_PROPS = [
    __VALIDATORS, __VALUE, __TYPE, __DISPLAYNAME,
    __GET, __SET, __ENUMERABLE, __CONFIGURABLE, __WRITABLE
  ]

  var def = {
    from: from,
    type: from[__TYPE],
    value: from[__VALUE],
    validators: from[__VALIDATORS] || [],
    enumerable: from[__ENUMERABLE] !== false,
    configurable: !!from[__CONFIGURABLE],
    writable: from[__WRITABLE] !== false,
    displayName: from[__DISPLAYNAME],
    getter: from[__GET],
    setter: from[__SET]
  }

  var type = def.type

  // Simple 'Constructor' Type
  if (util.isSimpleConstructor(type)) {
    def.isSimple = true

    def.cast = function (value) {
      return util.cast(value, type)
    }
  } else if (util.isSupermodelConstructor(type)) {
    def.isReference = true
  } else if (def.value) {
    // If a value is present, use
    // that and short-circuit the rest
    def.isSimple = true
  } else {
    // Otherwise look for other non-special
    // keys and also any item definition
    // in the case of Arrays

    var keys = Object.keys(from)
    var childKeys = keys.filter(function (item) {
      return __SPECIAL_PROPS.indexOf(item) === -1
    })

    if (childKeys.length) {
      var defs = {}
      var proto

      childKeys.forEach(function (key) {
        var descriptor = Object.getOwnPropertyDescriptor(from, key)
        var value

        if (descriptor.get || descriptor.set) {
          value = {
            __get: descriptor.get,
            __set: descriptor.set
          }
        } else {
          value = from[key]
        }

        if (!util.isConstructor(value) && !util.isSupermodelConstructor(value) && util.isFunction(value)) {
          if (!proto) {
            proto = {}
          }
          proto[key] = value
        } else {
          defs[key] = createDef(value)
        }
      })

      def.defs = defs
      def.proto = proto

    }

    // Check for Array
    if (type === Array || util.isArray(type)) {
      def.isArray = true

      if (type.length > 0) {
        def.def = createDef(type[0])
      }

    } else if (childKeys.length === 0) {
      def.isSimple = true
    }
  }

  def.create = createWrapperFactory(def)

  return def
}

module.exports = createDef

},{"./factory":13,"./util":19}],10:[function(require,module,exports){
'use strict'

module.exports = function (callback) {
  var arr = []

  /**
   * Proxied array mutators methods
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */
  var pop = function () {
    var result = Array.prototype.pop.apply(arr)

    callback('pop', arr, {
      value: result
    })

    return result
  }
  var push = function () {
    var result = Array.prototype.push.apply(arr, arguments)

    callback('push', arr, {
      value: result
    })

    return result
  }
  var shift = function () {
    var result = Array.prototype.shift.apply(arr)

    callback('shift', arr, {
      value: result
    })

    return result
  }
  var sort = function () {
    var result = Array.prototype.sort.apply(arr, arguments)

    callback('sort', arr, {
      value: result
    })

    return result
  }
  var unshift = function () {
    var result = Array.prototype.unshift.apply(arr, arguments)

    callback('unshift', arr, {
      value: result
    })

    return result
  }
  var reverse = function () {
    var result = Array.prototype.reverse.apply(arr)

    callback('reverse', arr, {
      value: result
    })

    return result
  }
  var splice = function () {
    if (!arguments.length) {
      return
    }

    var result = Array.prototype.splice.apply(arr, arguments)

    callback('splice', arr, {
      value: result,
      removed: result,
      added: Array.prototype.slice.call(arguments, 2)
    })

    return result
  }

  /**
   * Proxy all Array.prototype mutator methods on this array instance
   */
  arr.pop = arr.pop && pop
  arr.push = arr.push && push
  arr.shift = arr.shift && shift
  arr.unshift = arr.unshift && unshift
  arr.sort = arr.sort && sort
  arr.reverse = arr.reverse && reverse
  arr.splice = arr.splice && splice

  /**
   * Special update function since we can't detect
   * assignment by index e.g. arr[0] = 'something'
   */
  arr.update = function (index, value) {
    var oldValue = arr[index]
    var newValue = arr[index] = value

    callback('update', arr, {
      index: index,
      value: newValue,
      oldValue: oldValue
    })

    return newValue
  }

  return arr
}

},{}],11:[function(require,module,exports){
'use strict'

module.exports = function EmitterEvent (name, path, target, detail) {
  this.name = name
  this.path = path
  this.target = target

  if (detail) {
    this.detail = detail
  }
}

},{}],12:[function(require,module,exports){
'use strict'

/**
 * Expose `Emitter`.
 */

module.exports = Emitter

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter (obj) {
  var ctx = obj || this

  if (obj) {
    ctx = mixin(obj)
    return ctx
  }
}

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin (obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key]
  }
  return obj
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
  (this.__callbacks[event] = this.__callbacks[event] || [])
    .push(fn)
  return this
}

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function (event, fn) {
  function on () {
    this.off(event, on)
    fn.apply(this, arguments)
  }

  on.fn = fn
  this.on(event, on)
  return this
}

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off = Emitter.prototype.removeEventListener = Emitter.prototype.removeAllListeners = function (event, fn) {
  // all
  if (arguments.length === 0) {
    this.__callbacks = {}
    return this
  }

  // specific event
  var callbacks = this.__callbacks[event]
  if (!callbacks) {
    return this
  }

  // remove all handlers
  if (arguments.length === 1) {
    delete this.__callbacks[event]
    return this
  }

  // remove specific handler
  var cb
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i]
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1)
      break
    }
  }
  return this
}

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function (event) {
  var args = [].slice.call(arguments, 1)
  var callbacks = this.__callbacks[event]

  if (callbacks) {
    callbacks = callbacks.slice(0)
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args)
    }
  }

  return this
}

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function (event) {
  return this.__callbacks[event] || []
}

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function (event) {
  return !!this.listeners(event).length
}

},{}],13:[function(require,module,exports){
'use strict'

var util = require('./util')
var createModelPrototype = require('./proto')
var Wrapper = require('./wrapper')

function createModelDescriptors (def, parent) {
  var __ = {}

  var desc = {
    __: {
      value: __
    },
    __def: {
      value: def
    },
    __parent: {
      value: parent,
      writable: true
    },
    __callbacks: {
      value: {},
      writable: true
    }
  }

  return desc
}

function defineProperties (model) {
  var defs = model.__def.defs
  for (var key in defs) {
    defineProperty(model, key, defs[key])
  }
}

function defineProperty (model, key, def) {
  var desc = {
    get: function () {
      return this.__get(key)
    },
    enumerable: def.enumerable,
    configurable: def.configurable
  }

  if (def.writable) {
    desc.set = function (value) {
      this.__setNotifyChange(key, value)
    }
  }

  Object.defineProperty(model, key, desc)

  // Silently initialize the property wrapper
  model.__[key] = def.create(model)
}

function createWrapperFactory (def) {
  var wrapper, defaultValue, assert

  if (def.isSimple) {
    wrapper = new Wrapper(def.value, def.writable, def.validators, def.getter, def.setter, def.cast, null)
  } else if (def.isReference) {
    // Hold a reference to the
    // refererenced types' definition
    var refDef = def.type.def

    if (refDef.isSimple) {
      // If the referenced type is itself simple,
      // we can set just return a wrapper and
      // the property will get initialized.
      wrapper = new Wrapper(refDef.value, refDef.writable, refDef.validators, def.getter, def.setter, refDef.cast, null)
    } else {
      // If we're not dealing with a simple reference model
      // we need to define an assertion that the instance
      // being set is of the correct type. We do this be
      // comparing the defs.

      assert = function (value) {
        // compare the defintions of the value instance
        // being passed and the def property attached
        // to the type SupermodelConstructor. Allow the
        // value to be undefined or null also.
        var isCorrectType = false

        if (util.isNullOrUndefined(value)) {
          isCorrectType = true
        } else {
          isCorrectType = refDef === value.__def
        }

        if (!isCorrectType) {
          throw new Error('Value should be an instance of the referenced model, null or undefined')
        }
      }

      wrapper = new Wrapper(def.value, def.writable, def.validators, def.getter, def.setter, null, assert)
    }
  } else if (def.isArray) {
    defaultValue = function (parent) {
      // for Arrays, we create a new Array and each
      // time, mix the model properties into it
      var model = createModelPrototype(def)
      Object.defineProperties(model, createModelDescriptors(def, parent))
      defineProperties(model)
      return model
    }

    assert = function (value) {
      // todo: further array type validation
      if (!util.isArray(value)) {
        throw new Error('Value should be an array')
      }
    }

    wrapper = new Wrapper(defaultValue, def.writable, def.validators, def.getter, def.setter, null, assert)
  } else {
    // for Objects, we can create and reuse
    // a prototype object. We then need to only
    // define the defs and the 'instance' properties
    // e.g. __, parent etc.
    var proto = createModelPrototype(def)

    defaultValue = function (parent) {
      var model = Object.create(proto, createModelDescriptors(def, parent))
      defineProperties(model)
      return model
    }

    assert = function (value) {
      if (!proto.isPrototypeOf(value)) {
        throw new Error('Invalid prototype')
      }
    }

    wrapper = new Wrapper(defaultValue, def.writable, def.validators, def.getter, def.setter, null, assert)
  }

  var factory = function (parent) {
    var wrap = Object.create(wrapper)
    // if (!wrap.isInitialized) {
    wrap.initialize(parent)
    // }
    return wrap
  }

  // expose the wrapper, this is used
  // for validating array items later
  factory.wrapper = wrapper

  return factory
}

module.exports = createWrapperFactory

},{"./proto":16,"./util":19,"./wrapper":21}],14:[function(require,module,exports){
'use strict'

function merge (model, obj) {
  var isArray = model.__def.isArray
  var defs = model.__def.defs
  var defKeys, def, key, i, isSimple,
    isSimpleReference, isInitializedReference

  if (defs) {
    defKeys = Object.keys(defs)
    for (i = 0; i < defKeys.length; i++) {
      key = defKeys[i]
      if (obj.hasOwnProperty(key)) {
        def = defs[key]

        isSimple = def.isSimple
        isSimpleReference = def.isReference && def.type.def.isSimple
        isInitializedReference = def.isReference && obj[key] && obj[key].__supermodel

        if (isSimple || isSimpleReference || isInitializedReference) {
          model[key] = obj[key]
        } else if (obj[key]) {
          if (def.isReference) {
            model[key] = def.type()
          }
          merge(model[key], obj[key])
        }
      }
    }
  }

  if (isArray && Array.isArray(obj)) {
    for (i = 0; i < obj.length; i++) {
      var item = model.create()
      model.push(item && item.__supermodel ? merge(item, obj[i]) : obj[i])
    }
  }

  return model
}

module.exports = merge

},{}],15:[function(require,module,exports){
'use strict'

var EmitterEvent = require('./emitter-event')
var ValidationError = require('./validation-error')
var Wrapper = require('./wrapper')
var merge = require('./merge')

var descriptors = {
  __supermodel: {
    value: true
  },
  __keys: {
    get: function () {
      var keys = Object.keys(this)

      if (Array.isArray(this)) {
        var omit = [
          'addEventListener', 'on', 'once', 'removeEventListener', 'removeAllListeners',
          'removeListener', 'off', 'emit', 'listeners', 'hasListeners', 'pop', 'push',
          'reverse', 'shift', 'sort', 'splice', 'update', 'unshift', 'create', '__merge',
          '__setNotifyChange', '__notifyChange', '__set', '__get', '__chain', '__relativePath'
        ]

        keys = keys.filter(function (item) {
          return omit.indexOf(item) < 0
        })
      }

      return keys
    }
  },
  __name: {
    get: function () {
      if (this.__isRoot) {
        return ''
      }

      // Work out the 'name' of the model
      // Look up to the parent and loop through it's keys,
      // Any value or array found to contain the value of this (this model)
      // then we return the key and index in the case we found the model in an array.
      var parentKeys = this.__parent.__keys
      var parentKey, parentValue

      for (var i = 0; i < parentKeys.length; i++) {
        parentKey = parentKeys[i]
        parentValue = this.__parent[parentKey]

        if (parentValue === this) {
          return parentKey
        }
      }
    }
  },
  __path: {
    get: function () {
      if (this.__hasAncestors && !this.__parent.__isRoot) {
        return this.__parent.__path + '.' + this.__name
      } else {
        return this.__name
      }
    }
  },
  __isRoot: {
    get: function () {
      return !this.__hasAncestors
    }
  },
  __children: {
    get: function () {
      var children = []

      var keys = this.__keys
      var key, value

      for (var i = 0; i < keys.length; i++) {
        key = keys[i]
        value = this[key]

        if (value && value.__supermodel) {
          children.push(value)
        }
      }

      return children
    }
  },
  __ancestors: {
    get: function () {
      var ancestors = []
      var r = this

      while (r.__parent) {
        ancestors.push(r.__parent)
        r = r.__parent
      }

      return ancestors
    }
  },
  __descendants: {
    get: function () {
      var descendants = []

      function checkAndAddDescendantIfModel (obj) {
        var keys = obj.__keys
        var key, value

        for (var i = 0; i < keys.length; i++) {
          key = keys[i]
          value = obj[key]

          if (value && value.__supermodel) {
            descendants.push(value)
            checkAndAddDescendantIfModel(value)

          }
        }

      }

      checkAndAddDescendantIfModel(this)

      return descendants
    }
  },
  __hasAncestors: {
    get: function () {
      return !!this.__ancestors.length
    }
  },
  __hasDescendants: {
    get: function () {
      return !!this.__descendants.length
    }
  },
  errors: {
    get: function () {
      var errors = []
      var def = this.__def
      var validator, error, i, j

      // Run own validators
      var own = def.validators.slice(0)
      for (i = 0; i < own.length; i++) {
        validator = own[i]
        error = validator.call(this, this)

        if (error) {
          errors.push(new ValidationError(this, error, validator))
        }
      }

      // Run through keys and evaluate validators
      var keys = this.__keys
      var value, key, itemDef

      for (i = 0; i < keys.length; i++) {
        key = keys[i]

        // If we are an Array with an item definition
        // then we have to look into the Array for our value
        // and also get hold of the wrapper. We only need to
        // do this if the key is not a property of the array.
        // We check the defs to work this out (i.e. 0, 1, 2).
        // todo: This could be better to check !NaN on the key?
        if (def.isArray && def.def && (!def.defs || !(key in def.defs))) {
          // If we are an Array with a simple item definition
          // or a reference to a simple type definition
          // substitute the value with the wrapper we get from the
          // create factory function. Otherwise set the value to
          // the real value of the property.
          itemDef = def.def

          if (itemDef.isSimple) {
            value = itemDef.create.wrapper
            value.setValue(this[key])
          } else if (itemDef.isReference && itemDef.type.def.isSimple) {
            value = itemDef.type.def.create.wrapper
            value.setValue(this[key])
          } else {
            value = this[key]
          }
        } else {
          // Set the value to the wrapped value of the property
          value = this.__[key]
        }

        if (value) {
          if (value.__supermodel) {
            Array.prototype.push.apply(errors, value.errors)
          } else if (value instanceof Wrapper) {
            var wrapperValue = value.getValue(this)

            if (wrapperValue && wrapperValue.__supermodel) {
              Array.prototype.push.apply(errors, wrapperValue.errors)
            } else {
              var simple = value.validators
              for (j = 0; j < simple.length; j++) {
                validator = simple[j]
                error = validator.call(this, wrapperValue, key)

                if (error) {
                  errors.push(new ValidationError(this, error, validator, key))
                }
              }
            }
          }
        }
      }

      return errors
    }
  }
}

var proto = {
  __get: function (key) {
    return this.__[key].getValue(this)
  },
  __set: function (key, value) {
    this.__[key].setValue(value, this)
  },
  __relativePath: function (to, key) {
    var relativePath = this.__path ? to.substr(this.__path.length + 1) : to

    if (relativePath) {
      return key ? relativePath + '.' + key : relativePath
    }
    return key
  },
  __chain: function (fn) {
    return [this].concat(this.__ancestors).forEach(fn)
  },
  __merge: function (data) {
    return merge(this, data)
  },
  __notifyChange: function (key, newValue, oldValue) {
    var target = this
    var targetPath = this.__path
    var eventName = 'set'
    var data = {
      oldValue: oldValue,
      newValue: newValue
    }

    this.emit(eventName, new EmitterEvent(eventName, key, target, data))
    this.emit('change', new EmitterEvent(eventName, key, target, data))
    this.emit('change:' + key, new EmitterEvent(eventName, key, target, data))

    this.__ancestors.forEach(function (item) {
      var path = item.__relativePath(targetPath, key)
      item.emit('change', new EmitterEvent(eventName, path, target, data))
    })
  },
  __setNotifyChange: function (key, value) {
    var oldValue = this.__get(key)
    this.__set(key, value)
    var newValue = this.__get(key)
    this.__notifyChange(key, newValue, oldValue)
  }
}

module.exports = {
  proto: proto,
  descriptors: descriptors
}

},{"./emitter-event":11,"./merge":14,"./validation-error":20,"./wrapper":21}],16:[function(require,module,exports){
'use strict'

var emitter = require('./emitter-object')
var emitterArray = require('./emitter-array')
var EmitterEvent = require('./emitter-event')

var extend = require('./util').extend
var model = require('./model')
var modelProto = model.proto
var modelDescriptors = model.descriptors

var modelPrototype = Object.create(modelProto, modelDescriptors)
var objectPrototype = (function () {
  var p = Object.create(modelPrototype)

  emitter(p)

  return p
})()

function createArrayPrototype () {
  var p = emitterArray(function (eventName, arr, e) {
    if (eventName === 'update') {
      /**
       * Forward the special array update
       * events as standard __notifyChange events
       */
      arr.__notifyChange(e.index, e.value, e.oldValue)
    } else {
      /**
       * All other events e.g. push, splice are relayed
       */
      var target = arr
      var path = arr.__path
      var data = e
      var key = e.index

      arr.emit(eventName, new EmitterEvent(eventName, '', target, data))
      arr.emit('change', new EmitterEvent(eventName, '', target, data))
      arr.__ancestors.forEach(function (item) {
        var name = item.__relativePath(path, key)
        item.emit('change', new EmitterEvent(eventName, name, target, data))
      })

    }
  })

  Object.defineProperties(p, modelDescriptors)

  emitter(p)

  extend(p, modelProto)

  return p
}

function createObjectModelPrototype (proto) {
  var p = Object.create(objectPrototype)

  if (proto) {
    extend(p, proto)
  }

  return p
}

function createArrayModelPrototype (proto, itemDef) {
  // We do not to attempt to subclass Array,
  // instead create a new instance each time
  // and mixin the proto object
  var p = createArrayPrototype()

  if (proto) {
    extend(p, proto)
  }

  if (itemDef) {
    // We have a definition for the items
    // that belong in this array.

    // Use the `wrapper` prototype property as a
    // virtual Wrapper object we can use
    // validate all the items in the array.
    var arrItemWrapper = itemDef.create.wrapper

    // Validate new models by overriding the emitter array
    // mutators that can cause new items to enter the array.
    overrideArrayAddingMutators(p, arrItemWrapper)

    // Provide a convenient model factory
    // for creating array item instances
    p.create = function () {
      return itemDef.isReference ? itemDef.type() : itemDef.create().getValue(this)
    }
  }

  return p
}

function overrideArrayAddingMutators (arr, itemWrapper) {
  function getArrayArgs (items) {
    var args = []
    for (var i = 0; i < items.length; i++) {
      itemWrapper.setValue(items[i], arr)
      args.push(itemWrapper.getValue(arr))
    }
    return args
  }

  var push = arr.push
  var unshift = arr.unshift
  var splice = arr.splice
  var update = arr.update

  if (push) {
    arr.push = function () {
      var args = getArrayArgs(arguments)
      return push.apply(arr, args)
    }
  }

  if (unshift) {
    arr.unshift = function () {
      var args = getArrayArgs(arguments)
      return unshift.apply(arr, args)
    }
  }

  if (splice) {
    arr.splice = function () {
      var args = getArrayArgs(Array.prototype.slice.call(arguments, 2))
      args.unshift(arguments[1])
      args.unshift(arguments[0])
      return splice.apply(arr, args)
    }
  }

  if (update) {
    arr.update = function () {
      var args = getArrayArgs([arguments[1]])
      args.unshift(arguments[0])
      return update.apply(arr, args)
    }
  }
}

function createModelPrototype (def) {
  return def.isArray ? createArrayModelPrototype(def.proto, def.def) : createObjectModelPrototype(def.proto)
}

module.exports = createModelPrototype

},{"./emitter-array":10,"./emitter-event":11,"./emitter-object":12,"./model":15,"./util":19}],17:[function(require,module,exports){
'use strict'

module.exports = {}

},{}],18:[function(require,module,exports){
'use strict'

// var merge = require('./merge')
var createDef = require('./def')
var Supermodel = require('./supermodel')

function supermodels (schema, initializer) {
  var def = createDef(schema)

  function SupermodelConstructor (data) {
    var model = def.isSimple ? def.create() : def.create().getValue({})

    // Call any initializer
    if (initializer) {
      initializer.apply(model, arguments)
    } else if (data) {
      // if there's no initializer
      // but we have been passed some
      // data, merge it into the model.
      model.__merge(data)
    }
    return model
  }
  Object.defineProperty(SupermodelConstructor, 'def', {
    value: def // this is used to validate referenced SupermodelConstructors
  })
  SupermodelConstructor.prototype = Supermodel // this shared object is used, as a prototype, to identify SupermodelConstructors
  SupermodelConstructor.constructor = SupermodelConstructor
  return SupermodelConstructor
}

module.exports = supermodels

},{"./def":9,"./supermodel":17}],19:[function(require,module,exports){
'use strict'

var Supermodel = require('./supermodel')

function extend (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

var util = {
  extend: extend,
  typeOf: function (obj) {
    return Object.prototype.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  },
  isObject: function (value) {
    return this.typeOf(value) === 'object'
  },
  isArray: function (value) {
    return Array.isArray(value)
  },
  isSimple: function (value) {
    // 'Simple' here means anything
    // other than an Object or an Array
    // i.e. number, string, date, bool, null, undefined, regex...
    return !this.isObject(value) && !this.isArray(value)
  },
  isFunction: function (value) {
    return this.typeOf(value) === 'function'
  },
  isDate: function (value) {
    return this.typeOf(value) === 'date'
  },
  isNull: function (value) {
    return value === null
  },
  isUndefined: function (value) {
    return typeof (value) === 'undefined'
  },
  isNullOrUndefined: function (value) {
    return this.isNull(value) || this.isUndefined(value)
  },
  cast: function (value, type) {
    if (!type) {
      return value
    }

    switch (type) {
      case String:
        return util.castString(value)
      case Number:
        return util.castNumber(value)
      case Boolean:
        return util.castBoolean(value)
      case Date:
        return util.castDate(value)
      case Object:
      case Function:
        return value
      default:
        throw new Error('Invalid cast')
    }
  },
  castString: function (value) {
    if (value === undefined || value === null || util.typeOf(value) === 'string') {
      return value
    }
    return value.toString && value.toString()
  },
  castNumber: function (value) {
    if (value === undefined || value === null) {
      return NaN
    }
    if (util.typeOf(value) === 'number') {
      return value
    }
    return Number(value)
  },
  castBoolean: function (value) {
    if (!value) {
      return false
    }
    var falsey = ['0', 'false', 'off', 'no']
    return falsey.indexOf(value) === -1
  },
  castDate: function (value) {
    if (value === undefined || value === null || util.typeOf(value) === 'date') {
      return value
    }
    return new Date(value)
  },
  isConstructor: function (value) {
    return this.isSimpleConstructor(value) || [Array, Object].indexOf(value) > -1
  },
  isSimpleConstructor: function (value) {
    return [String, Number, Date, Boolean].indexOf(value) > -1
  },
  isSupermodelConstructor: function (value) {
    return this.isFunction(value) && value.prototype === Supermodel
  }
}

module.exports = util

},{"./supermodel":17}],20:[function(require,module,exports){
'use strict'

function ValidationError (target, error, validator, key) {
  this.target = target
  this.error = error
  this.validator = validator

  if (key) {
    this.key = key
  }
}

module.exports = ValidationError

},{}],21:[function(require,module,exports){
'use strict'

var util = require('./util')

function Wrapper (defaultValue, writable, validators, getter, setter, beforeSet, assert) {
  this.validators = validators

  this._defaultValue = defaultValue
  this._writable = writable
  this._getter = getter
  this._setter = setter
  this._beforeSet = beforeSet
  this._assert = assert
  this.isInitialized = false

  if (!util.isFunction(defaultValue)) {
    this.isInitialized = true

    if (!util.isUndefined(defaultValue)) {
      this._value = defaultValue
    }
  }
}
Wrapper.prototype.initialize = function (parent) {
  if (this.isInitialized) {
    return
  }

  this.setValue(this._defaultValue(parent), parent)
  this.isInitialized = true
}
Wrapper.prototype.getValue = function (model) {
  return this._getter ? this._getter.call(model) : this._value
}
Wrapper.prototype.setValue = function (value, model) {
  if (!this._writable) {
    throw new Error('Value is readonly')
  }

  // Hook up the parent ref if necessary
  if (value && value.__supermodel && model) {
    if (value.__parent !== model) {
      value.__parent = model
    }
  }

  var val
  if (this._setter) {
    this._setter.call(model, value)
    val = this.getValue(model)
  } else {
    val = this._beforeSet ? this._beforeSet(value) : value
  }

  if (this._assert) {
    this._assert(val)
  }

  this._value = val
}

module.exports = Wrapper

},{"./util":19}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9zdXBlcm1vZGVscy9fY29udGFjdHVzLmh0bWwiLCJleGFtcGxlcy9zdXBlcm1vZGVscy9fZXJyb3JzLmh0bWwiLCJleGFtcGxlcy9zdXBlcm1vZGVscy9pbmRleC5qcyIsImluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1kZWxlZ2F0ZS9saWIvZGVsZWdhdGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWRlbGVnYXRlL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9nZXQtb2JqZWN0LXBhdGgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvbGliL2RlZi5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcm1vZGVscy5qcy9saWIvZW1pdHRlci1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcm1vZGVscy5qcy9saWIvZW1pdHRlci1ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcm1vZGVscy5qcy9saWIvZW1pdHRlci1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvbGliL2ZhY3RvcnkuanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvbGliL21lcmdlLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVybW9kZWxzLmpzL2xpYi9tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcm1vZGVscy5qcy9saWIvcHJvdG8uanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvbGliL3N1cGVybW9kZWwuanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvbGliL3N1cGVybW9kZWxzLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVybW9kZWxzLmpzL2xpYi91dGlsLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVybW9kZWxzLmpzL2xpYi92YWxpZGF0aW9uLWVycm9yLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVybW9kZWxzLmpzL2xpYi93cmFwcGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFub255bW91cyhvYmpcbi8qKi8pIHtcbnZhciBwPVtdLHByaW50PWZ1bmN0aW9uKCl7cC5wdXNoLmFwcGx5KHAsYXJndW1lbnRzKTt9O3dpdGgob2JqKXtwLnB1c2goJzxmb3JtIGFzPVwiZm9ybVwiPiAgIDxkaXYgZXJyb3JzPiAgIDwvZGl2PiAgIDxsYWJlbCBpZD1cIm5hbWVcIj48c3BhbiBjbGFzcz1cImxhYmVsLXRleHRcIj5OYW1lOiA8L3NwYW4+PGlucHV0IG5hbWU9XCJuYW1lXCIgdmFsdWU9XCInLCBkYXRhLm5hbWUgLCdcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiByZXF1aXJlZD48c3BhbiBjbGFzcz1cImluZGljYXRvclwiPio8L3NwYW4+PC9sYWJlbD4gICA8bGFiZWwgaWQ9XCJlbWFpbFwiPjxzcGFuIGNsYXNzPVwibGFiZWwtdGV4dFwiPkVtYWlsOiA8L3NwYW4+PGlucHV0IG5hbWU9XCJlbWFpbFwiIHZhbHVlPVwiJywgZGF0YS5lbWFpbCAsJ1wiIHBsYWNlaG9sZGVyPVwiRW1haWxcIiByZXF1aXJlZD48c3BhbiBjbGFzcz1cImluZGljYXRvclwiPio8L3NwYW4+PC9sYWJlbD4gICA8bGFiZWwgaWQ9XCJxdWVzdGlvblwiPjxzcGFuIGNsYXNzPVwibGFiZWwtdGV4dFwiPlF1ZXN0aW9uOiA8L3NwYW4+PGlucHV0IG5hbWU9XCJxdWVzdGlvblwiIHZhbHVlPVwiJywgZGF0YS5xdWVzdGlvbiAsJ1wiIHBsYWNlaG9sZGVyPVwiUXVlc3Rpb25cIiByZXF1aXJlZD48c3BhbiBjbGFzcz1cImluZGljYXRvclwiPio8L3NwYW4+PC9sYWJlbD4gICA8bGFiZWwgaWQ9XCJsaW5lMVwiPjxzcGFuIGNsYXNzPVwibGFiZWwtdGV4dFwiPkxpbmUgMTogPC9zcGFuPjxpbnB1dCBuYW1lPVwibGluZTFcIiB2YWx1ZT1cIicsIGRhdGEubGluZTEgLCdcIiBwbGFjZWhvbGRlcj1cIkxpbmUxXCIgcmVxdWlyZWQ+PHNwYW4gY2xhc3M9XCJpbmRpY2F0b3JcIj4qPC9zcGFuPjwvbGFiZWw+ICAgPGxhYmVsIGlkPVwibGluZTJcIj48c3BhbiBjbGFzcz1cImxhYmVsLXRleHRcIj5MaW5lIDI6IDwvc3Bhbj48aW5wdXQgbmFtZT1cImxpbmUyXCIgdmFsdWU9XCInLCBkYXRhLmxpbmUyICwnXCIgcGxhY2Vob2xkZXI9XCJMaW5lMlwiIHJlcXVpcmVkPjxzcGFuIGNsYXNzPVwiaW5kaWNhdG9yXCI+Kjwvc3Bhbj48L2xhYmVsPiAgIDxsYWJlbCBpZD1cInBvc3Rjb2RlXCI+PHNwYW4gY2xhc3M9XCJsYWJlbC10ZXh0XCI+UG9zdGNvZGU6IDwvc3Bhbj48aW5wdXQgbmFtZT1cInBvc3Rjb2RlXCIgdmFsdWU9XCInLCBkYXRhLnBvc3Rjb2RlICwnXCIgcGxhY2Vob2xkZXI9XCJQb3N0Y29kZVwiIHJlcXVpcmVkPjxzcGFuIGNsYXNzPVwiaW5kaWNhdG9yXCI+Kjwvc3Bhbj48L2xhYmVsPiAgIDxsYWJlbCBpZD1cIm5hbWVcIj48c3BhbiBjbGFzcz1cImxhYmVsLXRleHRcIj5GdWxsIEFkZHJlc3M6IDwvc3Bhbj48YWRkcmVzcyBhZGRyZXNzPjwvYWRkcmVzcz48L2xhYmVsPiAgIDxidXR0b24gYXM9XCJzZW5kQnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiICcsIGRhdGEuZXJyb3JzLmxlbmd0aCA/ICdkaXNhYmxlZCcgOiAnJyAsJz5TZW5kPC9idXR0b24+IDwvZm9ybT4gJyk7fXJldHVybiBwLmpvaW4oJycpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFub255bW91cyhvYmpcbi8qKi8pIHtcbnZhciBwPVtdLHByaW50PWZ1bmN0aW9uKCl7cC5wdXNoLmFwcGx5KHAsYXJndW1lbnRzKTt9O3dpdGgob2JqKXtwLnB1c2goJzx1bCBzdHlsZT1cImRpc3BsYXk6ICcsIG9iai5sZW5ndGggPyAnJyA6ICdub25lJyAsJ1wiPiAgICcpOyBmb3IgKHZhciBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykgeyBwLnB1c2goJyAgICAgPGxpPjxhIGhyZWY9XCIjJywgb2JqW2ldLmtleSAsJ1wiPicsIG9ialtpXS5lcnJvciAsJzwvYT48L2xpPiAgICcpOyB9IHAucHVzaCgnIDwvdWw+ICcpO31yZXR1cm4gcC5qb2luKCcnKTtcbn07IiwidmFyIERvbSA9IHJlcXVpcmUoJy4uLy4uJylcbnZhciBzdXBlcm1vZGVscyA9IHJlcXVpcmUoJ3N1cGVybW9kZWxzLmpzJylcblxudmFyIGZpZWxkID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHtcbiAgICBfX3R5cGU6IFN0cmluZyxcbiAgICBfX3ZhbGlkYXRvcnM6IFtmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsID8gJycgOiAobmFtZSArICcgaXMgcmVxdWlyZWQnKVxuICAgIH1dXG4gIH1cbn1cblxudmFyIENvbnRhY3RVcyA9IHN1cGVybW9kZWxzKHtcbiAgbmFtZTogZmllbGQoJ05hbWUnKSxcbiAgcXVlc3Rpb246IGZpZWxkKCdRdWVzdGlvbicpLFxuICBlbWFpbDogZmllbGQoJ0VtYWlsJyksXG4gIGxpbmUxOiBmaWVsZCgnTGluZSAxJyksXG4gIGxpbmUyOiBmaWVsZCgnTGluZSAyJyksXG4gIHBvc3Rjb2RlOiBmaWVsZCgnUG9zdGNvZGUnKSxcbiAgZ2V0IGZ1bGxBZGRyZXNzICgpIHtcbiAgICByZXR1cm4gKHRoaXMubGluZTEgfHwgJycpICsgJyAnICsgKHRoaXMubGluZTIgfHwgJycpICsgJyAnICsgKHRoaXMucG9zdGNvZGUgfHwgJycpXG4gIH1cbn0pXG5cbkRvbS5yZWdpc3Rlcih7XG4gICdjb250YWN0LXVzJzoge1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdpbml0aWFsaXplJylcbiAgICB9LFxuICAgIG9uOiB7XG4gICAgICAnY2hhbmdlOmZvcm0gaW5wdXQnOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgZWwgPSBlLnRhcmdldFxuICAgICAgICB0aGlzLmRhdGFbZWwubmFtZV0gPSBlbC52YWx1ZVxuICAgICAgICB0aGlzLnNldEJ1dHRvblN0YXRlKClcbiAgICAgIH1cbiAgICB9LFxuICAgIHNldEJ1dHRvblN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNlbmRCdXR0b24uZGlzYWJsZWQgPSAhIXRoaXMuZGF0YS5lcnJvcnMubGVuZ3RoXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi9fY29udGFjdHVzLmh0bWwnKVxuICB9LFxuICAnYWRkcmVzcyc6IHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHRoaXMuZGF0YS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnJlbmRlcigpXG4gICAgICB9KVxuICAgIH0sXG4gICAgdGVtcGxhdGU6IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgcmV0dXJuIG1vZGVsLmRhdGEuZnVsbEFkZHJlc3NcbiAgICB9XG4gIH0sXG4gICdlcnJvcnMnOiB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICB0aGlzLmRhdGEub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHNlbGYucmVuZGVyKClcbiAgICAgIH0pXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVycm9ycyA9IHRoaXMuZGF0YS5lcnJvcnNcbiAgICAgIHJldHVybiByZXF1aXJlKCcuL19lcnJvcnMuaHRtbCcpKGVycm9ycylcbiAgICB9XG4gIH1cbn0pXG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtb2RlbCA9IHtcbiAgICBjb250YWN0VXM6IG5ldyBDb250YWN0VXMoKVxuICB9XG4gIERvbS5zY2FuKGRvY3VtZW50LmJvZHksIG1vZGVsKVxufVxuIiwidmFyIGdldCA9IHJlcXVpcmUoJ2dldC1vYmplY3QtcGF0aCcpXG52YXIgRGVsZWdhdGUgPSByZXF1aXJlKCdkb20tZGVsZWdhdGUnKS5EZWxlZ2F0ZVxuXG5mdW5jdGlvbiBSZWdpc3RlciAoKSB7fVxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVnaXN0ZXIucHJvdG90eXBlLCB7XG4gIHNlbGVjdG9yOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpXG4gICAgICByZXR1cm4ga2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gJ1snICsga2V5ICsgJ10nXG4gICAgICB9KS5qb2luKCcsICcpXG4gICAgfVxuICB9LFxuICBrZXlzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcylcbiAgICB9XG4gIH1cbn0pXG5cbnZhciByZWdpc3RlciA9IG5ldyBSZWdpc3RlcigpXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQgKGVsLCBkYXRhLCBjb21wb25lbnQsIHBhcmVudCkge1xuICB2YXIgY3R4ID0gT2JqZWN0LmNyZWF0ZShjb21wb25lbnQuaXNvbGF0ZSA/IHt9IDogcGFyZW50IHx8IHt9KVxuXG4gIHZhciBpbmZvID0gT2JqZWN0LmNyZWF0ZSh7fSwge1xuICAgIGVsOiB7XG4gICAgICB2YWx1ZTogZWxcbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIHZhbHVlOiBkYXRhXG4gICAgfSxcbiAgICBjb21wb25lbnQ6IHtcbiAgICAgIHZhbHVlOiBjb21wb25lbnRcbiAgICB9XG4gIH0pXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY3R4LCB7XG4gICAgX186IHtcbiAgICAgIHZhbHVlOiBpbmZvXG4gICAgfVxuICB9KVxuXG4gIGN0eC5kYXRhID0gZGF0YVxuXG4gIHJldHVybiBjdHhcbn1cblxudmFyIGlnbm9yZSA9IFsnb24nLCAndGVtcGxhdGUnLCAnaW5pdGlhbGl6ZScsICdpc29sYXRlJ11cbmZ1bmN0aW9uIGV4dGVuZCAob2JqKSB7XG4gIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IsIHByb3BcbiAgICBpZiAoc291cmNlKSB7XG4gICAgICBmb3IgKHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgaWdub3JlLmluZGV4T2YocHJvcCkgPT09IC0xKSB7XG4gICAgICAgICAgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBwcm9wKVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2NyaXB0b3IpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIHJldHVybiBvYmpcbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudENvbXBvbmVudCAoZWwpIHtcbiAgdmFyIHJlZ2lzdGVyS2V5cyA9IHJlZ2lzdGVyLmtleXNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkeCA9IHJlZ2lzdGVyS2V5cy5pbmRleE9mKGVsLmF0dHJpYnV0ZXNbaV0ubmFtZSlcbiAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtleTogcmVnaXN0ZXJLZXlzW2lkeF0sXG4gICAgICAgIGNvbXBvbmVudDogcmVnaXN0ZXJbcmVnaXN0ZXJLZXlzW2lkeF1dXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnREZWxlZ2F0ZSAoZWwsIGN0eCwgY29tcG9uZW50KSB7XG4gIHZhciBkZWwgPSBuZXcgRGVsZWdhdGUoZWwpXG5cbiAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyc1xuICB2YXIgcHJveHkgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGZuLmNhbGwoY3R4LCBlKVxuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGV2ZW50IGluIGNvbXBvbmVudC5vbikge1xuICAgIGlmIChjb21wb25lbnQub24uaGFzT3duUHJvcGVydHkoZXZlbnQpKSB7XG4gICAgICB2YXIgY29sb24gPSBldmVudC5pbmRleE9mKCc6JylcbiAgICAgIHZhciBuYW1lLCBzZWxlY3RvclxuICAgICAgaWYgKGNvbG9uID09PSAtMSkge1xuICAgICAgICBuYW1lID0gZXZlbnRcbiAgICAgICAgZGVsLm9uKG5hbWUsIHByb3h5KGNvbXBvbmVudC5vbltldmVudF0pKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmFtZSA9IGV2ZW50LnN1YnN0cigwLCBjb2xvbilcbiAgICAgICAgc2VsZWN0b3IgPSBldmVudC5zdWJzdHIoY29sb24gKyAxKVxuICAgICAgICBkZWwub24obmFtZSwgc2VsZWN0b3IsIHByb3h5KGNvbXBvbmVudC5vbltldmVudF0pKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZWxcbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudERhdGEgKGVsLCBjb21wb25lbnROYW1lLCBwYXJlbnQpIHtcbiAgdmFyIGF0dHIgPSBlbC5nZXRBdHRyaWJ1dGUoY29tcG9uZW50TmFtZSlcbiAgcmV0dXJuIGF0dHIgJiYgZ2V0KHBhcmVudCwgYXR0cilcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQgKG5hbWUsIG9iaikge1xuICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG5hbWUpIHtcbiAgICAgIGlmIChuYW1lLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgcmVnaXN0ZXJba2V5XSA9IG5hbWVba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZWdpc3RlcltuYW1lXSA9IG9ialxuICB9XG59XG5cbmZ1bmN0aW9uIG5vZGVMaXN0VG9BcnJheSAobm9kZUxpc3QpIHtcbiAgdmFyIG5vZGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBub2RlQXJyYXkucHVzaChub2RlTGlzdFtpXSlcbiAgfVxuXG4gIHJldHVybiBub2RlQXJyYXlcbn1cblxuZnVuY3Rpb24gZ2V0TWF0Y2hpbmdFbGVtZW50cyAoZWwsIGNoaWxkcmVuT25seSkge1xuICB2YXIgc2VsZWN0b3IgPSBEb20uX3JlZ2lzdGVyLnNlbGVjdG9yXG4gIHZhciBtYXRjaGVzID0gbm9kZUxpc3RUb0FycmF5KGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKVxuXG4gIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IGdldEVsZW1lbnRDb21wb25lbnQoZWwpXG5cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICBtYXRjaGVzLnVuc2hpZnQoZWwpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXNcbn1cblxuZnVuY3Rpb24gZmluZFBhcmVudENvbnRleHQgKGVsLCBjb250ZXh0cykge1xuICBkbyB7XG4gICAgZWwgPSBlbC5wYXJlbnROb2RlXG4gICAgaWYgKGVsKSB7XG4gICAgICBmb3IgKHZhciBpID0gY29udGV4dHMubGVuZ3RoIC0gMTsgaSA+IC0xIDsgaS0tKSB7XG4gICAgICAgIGlmIChjb250ZXh0c1tpXS5jdHguX18uZWwgPT09IGVsKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHRzW2ldLmN0eFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IHdoaWxlIChlbClcbn1cblxuZnVuY3Rpb24gc2V0SHRtbCAoZWwsIGNvbXBvbmVudCwgY3R4KSB7XG4gIHZhciBodG1sID0gKHR5cGVvZiBjb21wb25lbnQudGVtcGxhdGUgPT09ICdmdW5jdGlvbicpXG4gICAgPyBjb21wb25lbnQudGVtcGxhdGUuY2FsbChjdHgsIGN0eClcbiAgICA6IGNvbXBvbmVudC50ZW1wbGF0ZVxuXG4gIGVsLmlubmVySFRNTCA9IGh0bWxcbn1cblxuZnVuY3Rpb24gcmVuZGVyZXIgKGN1cnJFbCwgY29tcG9uZW50LCBjdHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBzZXRIdG1sKGN1cnJFbCwgY29tcG9uZW50LCBjdHgpXG4gICAgRG9tLnNjYW4oY3VyckVsLCBjdHguZGF0YSwgY3R4LCB0cnVlKVxuICB9XG59XG5cbmZ1bmN0aW9uIHNjYW4gKGVsLCBkYXRhLCBwYXJlbnQsIGNoaWxkcmVuT25seSkge1xuICB2YXIgbWF0Y2hlcyA9IGdldE1hdGNoaW5nRWxlbWVudHMoZWwsIGNoaWxkcmVuT25seSlcbiAgdmFyIGNvbnRleHRzID0gW11cbiAgaWYgKHBhcmVudCkge1xuICAgIGNvbnRleHRzLnB1c2goe2N0eDogcGFyZW50fSlcbiAgfVxuXG4gIHZhciBjdXJyRWxcbiAgd2hpbGUgKG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgY3VyckVsID0gbWF0Y2hlcy5zaGlmdCgpXG4gICAgdmFyIHJlZiA9IGdldEVsZW1lbnRDb21wb25lbnQoY3VyckVsKVxuICAgIHZhciBjb21wb25lbnQgPSByZWYuY29tcG9uZW50XG4gICAgdmFyIHBhcmVudENvbnRleHQgPSBmaW5kUGFyZW50Q29udGV4dChjdXJyRWwsIGNvbnRleHRzKSB8fCBwYXJlbnRcbiAgICB2YXIgcGFyZW50RGF0YSA9IHBhcmVudENvbnRleHQgPyBwYXJlbnRDb250ZXh0LmRhdGEgOiBkYXRhXG4gICAgdmFyIGVsRGF0YSA9IGdldEVsZW1lbnREYXRhKGN1cnJFbCwgcmVmLmtleSwgcGFyZW50RGF0YSkgfHwgcGFyZW50RGF0YVxuICAgIHZhciBjdHggPSBjcmVhdGVDb250ZXh0KGN1cnJFbCwgZWxEYXRhLCBjb21wb25lbnQsIHBhcmVudENvbnRleHQpXG4gICAgdmFyIGRlbCA9IGNyZWF0ZUVsZW1lbnREZWxlZ2F0ZShjdXJyRWwsIGN0eCwgY29tcG9uZW50KVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0eC5fXywgJ2RlbCcsIHsgdmFsdWU6IGRlbCB9KVxuXG4gICAgZXh0ZW5kKGN0eCwgY29tcG9uZW50KVxuXG4gICAgY29udGV4dHMucHVzaCh7XG4gICAgICBrZXk6IHJlZi5rZXksIGN0eDogY3R4LCBpbml0aWFsaXplOiBjb21wb25lbnQuaW5pdGlhbGl6ZSxcbiAgICAgIHRlbXBsYXRlOiBjb21wb25lbnQudGVtcGxhdGUsIGNvbXBvbmVudDogY29tcG9uZW50LCBlbDogY3VyckVsXG4gICAgfSlcbiAgfVxuXG4gIHZhciBpLCBqXG4gIHZhciBwcm9jZXNzZWQgPSBbXVxuICBmb3IgKGkgPSBjb250ZXh0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBhbGlhc0NvbnRleHQgPSBjb250ZXh0c1tpXS5jdHhcbiAgICB2YXIgYWxpYXNFbCA9IGFsaWFzQ29udGV4dC5fXy5lbFxuICAgIHZhciBhbGlhc2VzID0gYWxpYXNFbC5xdWVyeVNlbGVjdG9yQWxsKCdbYXNdOm5vdChbYXM9XCJcIl0pJylcbiAgICBmb3IgKGogPSAwOyBqIDwgYWxpYXNlcy5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKHByb2Nlc3NlZC5pbmRleE9mKGFsaWFzZXNbal0pIDwgMCkge1xuICAgICAgICB2YXIgYXR0ciA9IGFsaWFzZXNbal0uZ2V0QXR0cmlidXRlKCdhcycpXG4gICAgICAgIGFsaWFzQ29udGV4dFthdHRyXSA9IGFsaWFzZXNbal1cbiAgICAgICAgcHJvY2Vzc2VkLnB1c2goYWxpYXNlc1tqXSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgY29udGV4dHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoY29udGV4dHNbaV0uaW5pdGlhbGl6ZSkge1xuICAgICAgY29udGV4dHNbaV0uaW5pdGlhbGl6ZS5jYWxsKGNvbnRleHRzW2ldLmN0eClcbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgY29udGV4dHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoY29udGV4dHNbaV0udGVtcGxhdGUpIHtcbiAgICAgIHZhciByZW5kZXIgPSByZW5kZXJlcihjb250ZXh0c1tpXS5jdHguX18uZWwsIGNvbnRleHRzW2ldLmNvbXBvbmVudCwgY29udGV4dHNbaV0uY3R4KVxuICAgICAgcmVuZGVyKClcbiAgICAgIGNvbnRleHRzW2ldLmN0eC5yZW5kZXIgPSByZW5kZXJcbiAgICB9XG4gIH1cbn1cblxudmFyIERvbSA9IE9iamVjdC5jcmVhdGUoe30sIHtcbiAgX3JlZ2lzdGVyOiB7IHZhbHVlOiByZWdpc3RlciB9LFxuICByZWdpc3RlcjogeyB2YWx1ZTogcmVnaXN0ZXJDb21wb25lbnQgfSxcbiAgc2NhbjogeyB2YWx1ZTogc2NhbiB9XG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9IERvbVxuIiwiLypqc2hpbnQgYnJvd3Nlcjp0cnVlLCBub2RlOnRydWUqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVsZWdhdGU7XG5cbi8qKlxuICogRE9NIGV2ZW50IGRlbGVnYXRvclxuICpcbiAqIFRoZSBkZWxlZ2F0b3Igd2lsbCBsaXN0ZW5cbiAqIGZvciBldmVudHMgdGhhdCBidWJibGUgdXBcbiAqIHRvIHRoZSByb290IG5vZGUuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge05vZGV8c3RyaW5nfSBbcm9vdF0gVGhlIHJvb3Qgbm9kZSBvciBhIHNlbGVjdG9yIHN0cmluZyBtYXRjaGluZyB0aGUgcm9vdCBub2RlXG4gKi9cbmZ1bmN0aW9uIERlbGVnYXRlKHJvb3QpIHtcblxuICAvKipcbiAgICogTWFpbnRhaW4gYSBtYXAgb2YgbGlzdGVuZXJcbiAgICogbGlzdHMsIGtleWVkIGJ5IGV2ZW50IG5hbWUuXG4gICAqXG4gICAqIEB0eXBlIE9iamVjdFxuICAgKi9cbiAgdGhpcy5saXN0ZW5lck1hcCA9IFt7fSwge31dO1xuICBpZiAocm9vdCkge1xuICAgIHRoaXMucm9vdChyb290KTtcbiAgfVxuXG4gIC8qKiBAdHlwZSBmdW5jdGlvbigpICovXG4gIHRoaXMuaGFuZGxlID0gRGVsZWdhdGUucHJvdG90eXBlLmhhbmRsZS5iaW5kKHRoaXMpO1xufVxuXG4vKipcbiAqIFN0YXJ0IGxpc3RlbmluZyBmb3IgZXZlbnRzXG4gKiBvbiB0aGUgcHJvdmlkZWQgRE9NIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtOb2RlfHN0cmluZ30gW3Jvb3RdIFRoZSByb290IG5vZGUgb3IgYSBzZWxlY3RvciBzdHJpbmcgbWF0Y2hpbmcgdGhlIHJvb3Qgbm9kZVxuICogQHJldHVybnMge0RlbGVnYXRlfSBUaGlzIG1ldGhvZCBpcyBjaGFpbmFibGVcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLnJvb3QgPSBmdW5jdGlvbihyb290KSB7XG4gIHZhciBsaXN0ZW5lck1hcCA9IHRoaXMubGlzdGVuZXJNYXA7XG4gIHZhciBldmVudFR5cGU7XG5cbiAgLy8gUmVtb3ZlIG1hc3RlciBldmVudCBsaXN0ZW5lcnNcbiAgaWYgKHRoaXMucm9vdEVsZW1lbnQpIHtcbiAgICBmb3IgKGV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcFsxXSkge1xuICAgICAgaWYgKGxpc3RlbmVyTWFwWzFdLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpIHtcbiAgICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcFswXSkge1xuICAgICAgaWYgKGxpc3RlbmVyTWFwWzBdLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpIHtcbiAgICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiBubyByb290IG9yIHJvb3QgaXMgbm90XG4gIC8vIGEgZG9tIG5vZGUsIHRoZW4gcmVtb3ZlIGludGVybmFsXG4gIC8vIHJvb3QgcmVmZXJlbmNlIGFuZCBleGl0IGhlcmVcbiAgaWYgKCFyb290IHx8ICFyb290LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICBpZiAodGhpcy5yb290RWxlbWVudCkge1xuICAgICAgZGVsZXRlIHRoaXMucm9vdEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByb290IG5vZGUgYXQgd2hpY2hcbiAgICogbGlzdGVuZXJzIGFyZSBhdHRhY2hlZC5cbiAgICpcbiAgICogQHR5cGUgTm9kZVxuICAgKi9cbiAgdGhpcy5yb290RWxlbWVudCA9IHJvb3Q7XG5cbiAgLy8gU2V0IHVwIG1hc3RlciBldmVudCBsaXN0ZW5lcnNcbiAgZm9yIChldmVudFR5cGUgaW4gbGlzdGVuZXJNYXBbMV0pIHtcbiAgICBpZiAobGlzdGVuZXJNYXBbMV0uaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSkge1xuICAgICAgdGhpcy5yb290RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHRydWUpO1xuICAgIH1cbiAgfVxuICBmb3IgKGV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcFswXSkge1xuICAgIGlmIChsaXN0ZW5lck1hcFswXS5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKSB7XG4gICAgICB0aGlzLnJvb3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5jYXB0dXJlRm9yVHlwZSA9IGZ1bmN0aW9uKGV2ZW50VHlwZSkge1xuICByZXR1cm4gWydibHVyJywgJ2Vycm9yJywgJ2ZvY3VzJywgJ2xvYWQnLCAncmVzaXplJywgJ3Njcm9sbCddLmluZGV4T2YoZXZlbnRUeXBlKSAhPT0gLTE7XG59O1xuXG4vKipcbiAqIEF0dGFjaCBhIGhhbmRsZXIgdG8gb25lXG4gKiBldmVudCBmb3IgYWxsIGVsZW1lbnRzXG4gKiB0aGF0IG1hdGNoIHRoZSBzZWxlY3RvcixcbiAqIG5vdyBvciBpbiB0aGUgZnV0dXJlXG4gKlxuICogVGhlIGhhbmRsZXIgZnVuY3Rpb24gcmVjZWl2ZXNcbiAqIHRocmVlIGFyZ3VtZW50czogdGhlIERPTSBldmVudFxuICogb2JqZWN0LCB0aGUgbm9kZSB0aGF0IG1hdGNoZWRcbiAqIHRoZSBzZWxlY3RvciB3aGlsZSB0aGUgZXZlbnRcbiAqIHdhcyBidWJibGluZyBhbmQgYSByZWZlcmVuY2VcbiAqIHRvIGl0c2VsZi4gV2l0aGluIHRoZSBoYW5kbGVyLFxuICogJ3RoaXMnIGlzIGVxdWFsIHRvIHRoZSBzZWNvbmRcbiAqIGFyZ3VtZW50LlxuICpcbiAqIFRoZSBub2RlIHRoYXQgYWN0dWFsbHkgcmVjZWl2ZWRcbiAqIHRoZSBldmVudCBjYW4gYmUgYWNjZXNzZWQgdmlhXG4gKiAnZXZlbnQudGFyZ2V0Jy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIExpc3RlbiBmb3IgdGhlc2UgZXZlbnRzXG4gKiBAcGFyYW0ge3N0cmluZ3x1bmRlZmluZWR9IHNlbGVjdG9yIE9ubHkgaGFuZGxlIGV2ZW50cyBvbiBlbGVtZW50cyBtYXRjaGluZyB0aGlzIHNlbGVjdG9yLCBpZiB1bmRlZmluZWQgbWF0Y2ggcm9vdCBlbGVtZW50XG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCl9IGhhbmRsZXIgSGFuZGxlciBmdW5jdGlvbiAtIGV2ZW50IGRhdGEgcGFzc2VkIGhlcmUgd2lsbCBiZSBpbiBldmVudC5kYXRhXG4gKiBAcGFyYW0ge09iamVjdH0gW2V2ZW50RGF0YV0gRGF0YSB0byBwYXNzIGluIGV2ZW50LmRhdGFcbiAqIEByZXR1cm5zIHtEZWxlZ2F0ZX0gVGhpcyBtZXRob2QgaXMgY2hhaW5hYmxlXG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgc2VsZWN0b3IsIGhhbmRsZXIsIHVzZUNhcHR1cmUpIHtcbiAgdmFyIHJvb3QsIGxpc3RlbmVyTWFwLCBtYXRjaGVyLCBtYXRjaGVyUGFyYW07XG5cbiAgaWYgKCFldmVudFR5cGUpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGV2ZW50IHR5cGU6ICcgKyBldmVudFR5cGUpO1xuICB9XG5cbiAgLy8gaGFuZGxlciBjYW4gYmUgcGFzc2VkIGFzXG4gIC8vIHRoZSBzZWNvbmQgb3IgdGhpcmQgYXJndW1lbnRcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHVzZUNhcHR1cmUgPSBoYW5kbGVyO1xuICAgIGhhbmRsZXIgPSBzZWxlY3RvcjtcbiAgICBzZWxlY3RvciA9IG51bGw7XG4gIH1cblxuICAvLyBGYWxsYmFjayB0byBzZW5zaWJsZSBkZWZhdWx0c1xuICAvLyBpZiB1c2VDYXB0dXJlIG5vdCBzZXRcbiAgaWYgKHVzZUNhcHR1cmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHVzZUNhcHR1cmUgPSB0aGlzLmNhcHR1cmVGb3JUeXBlKGV2ZW50VHlwZSk7XG4gIH1cblxuICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIYW5kbGVyIG11c3QgYmUgYSB0eXBlIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICByb290ID0gdGhpcy5yb290RWxlbWVudDtcbiAgbGlzdGVuZXJNYXAgPSB0aGlzLmxpc3RlbmVyTWFwW3VzZUNhcHR1cmUgPyAxIDogMF07XG5cbiAgLy8gQWRkIG1hc3RlciBoYW5kbGVyIGZvciB0eXBlIGlmIG5vdCBjcmVhdGVkIHlldFxuICBpZiAoIWxpc3RlbmVyTWFwW2V2ZW50VHlwZV0pIHtcbiAgICBpZiAocm9vdCkge1xuICAgICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHVzZUNhcHR1cmUpO1xuICAgIH1cbiAgICBsaXN0ZW5lck1hcFtldmVudFR5cGVdID0gW107XG4gIH1cblxuICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgbWF0Y2hlclBhcmFtID0gbnVsbDtcblxuICAgIC8vIENPTVBMRVggLSBtYXRjaGVzUm9vdCBuZWVkcyB0byBoYXZlIGFjY2VzcyB0b1xuICAgIC8vIHRoaXMucm9vdEVsZW1lbnQsIHNvIGJpbmQgdGhlIGZ1bmN0aW9uIHRvIHRoaXMuXG4gICAgbWF0Y2hlciA9IG1hdGNoZXNSb290LmJpbmQodGhpcyk7XG5cbiAgLy8gQ29tcGlsZSBhIG1hdGNoZXIgZm9yIHRoZSBnaXZlbiBzZWxlY3RvclxuICB9IGVsc2UgaWYgKC9eW2Etel0rJC9pLnRlc3Qoc2VsZWN0b3IpKSB7XG4gICAgbWF0Y2hlclBhcmFtID0gc2VsZWN0b3I7XG4gICAgbWF0Y2hlciA9IG1hdGNoZXNUYWc7XG4gIH0gZWxzZSBpZiAoL14jW2EtejAtOVxcLV9dKyQvaS50ZXN0KHNlbGVjdG9yKSkge1xuICAgIG1hdGNoZXJQYXJhbSA9IHNlbGVjdG9yLnNsaWNlKDEpO1xuICAgIG1hdGNoZXIgPSBtYXRjaGVzSWQ7XG4gIH0gZWxzZSB7XG4gICAgbWF0Y2hlclBhcmFtID0gc2VsZWN0b3I7XG4gICAgbWF0Y2hlciA9IG1hdGNoZXM7XG4gIH1cblxuICAvLyBBZGQgdG8gdGhlIGxpc3Qgb2YgbGlzdGVuZXJzXG4gIGxpc3RlbmVyTWFwW2V2ZW50VHlwZV0ucHVzaCh7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgbWF0Y2hlcjogbWF0Y2hlcixcbiAgICBtYXRjaGVyUGFyYW06IG1hdGNoZXJQYXJhbVxuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGV2ZW50IGhhbmRsZXJcbiAqIGZvciBlbGVtZW50cyB0aGF0IG1hdGNoXG4gKiB0aGUgc2VsZWN0b3IsIGZvcmV2ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gW2V2ZW50VHlwZV0gUmVtb3ZlIGhhbmRsZXJzIGZvciBldmVudHMgbWF0Y2hpbmcgdGhpcyB0eXBlLCBjb25zaWRlcmluZyB0aGUgb3RoZXIgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtzdHJpbmd9IFtzZWxlY3Rvcl0gSWYgdGhpcyBwYXJhbWV0ZXIgaXMgb21pdHRlZCwgb25seSBoYW5kbGVycyB3aGljaCBtYXRjaCB0aGUgb3RoZXIgdHdvIHdpbGwgYmUgcmVtb3ZlZFxuICogQHBhcmFtIHtmdW5jdGlvbigpfSBbaGFuZGxlcl0gSWYgdGhpcyBwYXJhbWV0ZXIgaXMgb21pdHRlZCwgb25seSBoYW5kbGVycyB3aGljaCBtYXRjaCB0aGUgcHJldmlvdXMgdHdvIHdpbGwgYmUgcmVtb3ZlZFxuICogQHJldHVybnMge0RlbGVnYXRlfSBUaGlzIG1ldGhvZCBpcyBjaGFpbmFibGVcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgc2VsZWN0b3IsIGhhbmRsZXIsIHVzZUNhcHR1cmUpIHtcbiAgdmFyIGksIGxpc3RlbmVyLCBsaXN0ZW5lck1hcCwgbGlzdGVuZXJMaXN0LCBzaW5nbGVFdmVudFR5cGU7XG5cbiAgLy8gSGFuZGxlciBjYW4gYmUgcGFzc2VkIGFzXG4gIC8vIHRoZSBzZWNvbmQgb3IgdGhpcmQgYXJndW1lbnRcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHVzZUNhcHR1cmUgPSBoYW5kbGVyO1xuICAgIGhhbmRsZXIgPSBzZWxlY3RvcjtcbiAgICBzZWxlY3RvciA9IG51bGw7XG4gIH1cblxuICAvLyBJZiB1c2VDYXB0dXJlIG5vdCBzZXQsIHJlbW92ZVxuICAvLyBhbGwgZXZlbnQgbGlzdGVuZXJzXG4gIGlmICh1c2VDYXB0dXJlID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLm9mZihldmVudFR5cGUsIHNlbGVjdG9yLCBoYW5kbGVyLCB0cnVlKTtcbiAgICB0aGlzLm9mZihldmVudFR5cGUsIHNlbGVjdG9yLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lck1hcCA9IHRoaXMubGlzdGVuZXJNYXBbdXNlQ2FwdHVyZSA/IDEgOiAwXTtcbiAgaWYgKCFldmVudFR5cGUpIHtcbiAgICBmb3IgKHNpbmdsZUV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcCkge1xuICAgICAgaWYgKGxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KHNpbmdsZUV2ZW50VHlwZSkpIHtcbiAgICAgICAgdGhpcy5vZmYoc2luZ2xlRXZlbnRUeXBlLCBzZWxlY3RvciwgaGFuZGxlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lckxpc3QgPSBsaXN0ZW5lck1hcFtldmVudFR5cGVdO1xuICBpZiAoIWxpc3RlbmVyTGlzdCB8fCAhbGlzdGVuZXJMaXN0Lmxlbmd0aCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gUmVtb3ZlIG9ubHkgcGFyYW1ldGVyIG1hdGNoZXNcbiAgLy8gaWYgc3BlY2lmaWVkXG4gIGZvciAoaSA9IGxpc3RlbmVyTGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGxpc3RlbmVyID0gbGlzdGVuZXJMaXN0W2ldO1xuXG4gICAgaWYgKCghc2VsZWN0b3IgfHwgc2VsZWN0b3IgPT09IGxpc3RlbmVyLnNlbGVjdG9yKSAmJiAoIWhhbmRsZXIgfHwgaGFuZGxlciA9PT0gbGlzdGVuZXIuaGFuZGxlcikpIHtcbiAgICAgIGxpc3RlbmVyTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWxsIGxpc3RlbmVycyByZW1vdmVkXG4gIGlmICghbGlzdGVuZXJMaXN0Lmxlbmd0aCkge1xuICAgIGRlbGV0ZSBsaXN0ZW5lck1hcFtldmVudFR5cGVdO1xuXG4gICAgLy8gUmVtb3ZlIHRoZSBtYWluIGhhbmRsZXJcbiAgICBpZiAodGhpcy5yb290RWxlbWVudCkge1xuICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgdGhpcy5oYW5kbGUsIHVzZUNhcHR1cmUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEhhbmRsZSBhbiBhcmJpdHJhcnkgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLmhhbmRsZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIHZhciBpLCBsLCB0eXBlID0gZXZlbnQudHlwZSwgcm9vdCwgcGhhc2UsIGxpc3RlbmVyLCByZXR1cm5lZCwgbGlzdGVuZXJMaXN0ID0gW10sIHRhcmdldCwgLyoqIEBjb25zdCAqLyBFVkVOVElHTk9SRSA9ICdmdExhYnNEZWxlZ2F0ZUlnbm9yZSc7XG5cbiAgaWYgKGV2ZW50W0VWRU5USUdOT1JFXSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcblxuICAvLyBIYXJkY29kZSB2YWx1ZSBvZiBOb2RlLlRFWFRfTk9ERVxuICAvLyBhcyBub3QgZGVmaW5lZCBpbiBJRThcbiAgaWYgKHRhcmdldC5ub2RlVHlwZSA9PT0gMykge1xuICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICB9XG5cbiAgcm9vdCA9IHRoaXMucm9vdEVsZW1lbnQ7XG5cbiAgcGhhc2UgPSBldmVudC5ldmVudFBoYXNlIHx8ICggZXZlbnQudGFyZ2V0ICE9PSBldmVudC5jdXJyZW50VGFyZ2V0ID8gMyA6IDIgKTtcbiAgXG4gIHN3aXRjaCAocGhhc2UpIHtcbiAgICBjYXNlIDE6IC8vRXZlbnQuQ0FQVFVSSU5HX1BIQVNFOlxuICAgICAgbGlzdGVuZXJMaXN0ID0gdGhpcy5saXN0ZW5lck1hcFsxXVt0eXBlXTtcbiAgICBicmVhaztcbiAgICBjYXNlIDI6IC8vRXZlbnQuQVRfVEFSR0VUOlxuICAgICAgaWYgKHRoaXMubGlzdGVuZXJNYXBbMF0gJiYgdGhpcy5saXN0ZW5lck1hcFswXVt0eXBlXSkgbGlzdGVuZXJMaXN0ID0gbGlzdGVuZXJMaXN0LmNvbmNhdCh0aGlzLmxpc3RlbmVyTWFwWzBdW3R5cGVdKTtcbiAgICAgIGlmICh0aGlzLmxpc3RlbmVyTWFwWzFdICYmIHRoaXMubGlzdGVuZXJNYXBbMV1bdHlwZV0pIGxpc3RlbmVyTGlzdCA9IGxpc3RlbmVyTGlzdC5jb25jYXQodGhpcy5saXN0ZW5lck1hcFsxXVt0eXBlXSk7XG4gICAgYnJlYWs7XG4gICAgY2FzZSAzOiAvL0V2ZW50LkJVQkJMSU5HX1BIQVNFOlxuICAgICAgbGlzdGVuZXJMaXN0ID0gdGhpcy5saXN0ZW5lck1hcFswXVt0eXBlXTtcbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIE5lZWQgdG8gY29udGludW91c2x5IGNoZWNrXG4gIC8vIHRoYXQgdGhlIHNwZWNpZmljIGxpc3QgaXNcbiAgLy8gc3RpbGwgcG9wdWxhdGVkIGluIGNhc2Ugb25lXG4gIC8vIG9mIHRoZSBjYWxsYmFja3MgYWN0dWFsbHlcbiAgLy8gY2F1c2VzIHRoZSBsaXN0IHRvIGJlIGRlc3Ryb3llZC5cbiAgbCA9IGxpc3RlbmVyTGlzdC5sZW5ndGg7XG4gIHdoaWxlICh0YXJnZXQgJiYgbCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJMaXN0W2ldO1xuXG4gICAgICAvLyBCYWlsIGZyb20gdGhpcyBsb29wIGlmXG4gICAgICAvLyB0aGUgbGVuZ3RoIGNoYW5nZWQgYW5kXG4gICAgICAvLyBubyBtb3JlIGxpc3RlbmVycyBhcmVcbiAgICAgIC8vIGRlZmluZWQgYmV0d2VlbiBpIGFuZCBsLlxuICAgICAgaWYgKCFsaXN0ZW5lcikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgZm9yIG1hdGNoIGFuZCBmaXJlXG4gICAgICAvLyB0aGUgZXZlbnQgaWYgdGhlcmUncyBvbmVcbiAgICAgIC8vXG4gICAgICAvLyBUT0RPOk1DRzoyMDEyMDExNzogTmVlZCBhIHdheVxuICAgICAgLy8gdG8gY2hlY2sgaWYgZXZlbnQjc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXG4gICAgICAvLyB3YXMgY2FsbGVkLiBJZiBzbywgYnJlYWsgYm90aCBsb29wcy5cbiAgICAgIGlmIChsaXN0ZW5lci5tYXRjaGVyLmNhbGwodGFyZ2V0LCBsaXN0ZW5lci5tYXRjaGVyUGFyYW0sIHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuZWQgPSB0aGlzLmZpcmUoZXZlbnQsIHRhcmdldCwgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICAvLyBTdG9wIHByb3BhZ2F0aW9uIHRvIHN1YnNlcXVlbnRcbiAgICAgIC8vIGNhbGxiYWNrcyBpZiB0aGUgY2FsbGJhY2sgcmV0dXJuZWRcbiAgICAgIC8vIGZhbHNlXG4gICAgICBpZiAocmV0dXJuZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGV2ZW50W0VWRU5USUdOT1JFXSA9IHRydWU7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOk1DRzoyMDEyMDExNzogTmVlZCBhIHdheSB0b1xuICAgIC8vIGNoZWNrIGlmIGV2ZW50I3N0b3BQcm9wYWdhdGlvblxuICAgIC8vIHdhcyBjYWxsZWQuIElmIHNvLCBicmVhayBsb29waW5nXG4gICAgLy8gdGhyb3VnaCB0aGUgRE9NLiBTdG9wIGlmIHRoZVxuICAgIC8vIGRlbGVnYXRpb24gcm9vdCBoYXMgYmVlbiByZWFjaGVkXG4gICAgaWYgKHRhcmdldCA9PT0gcm9vdCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgbCA9IGxpc3RlbmVyTGlzdC5sZW5ndGg7XG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gIH1cbn07XG5cbi8qKlxuICogRmlyZSBhIGxpc3RlbmVyIG9uIGEgdGFyZ2V0LlxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtPYmplY3R9IGxpc3RlbmVyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLmZpcmUgPSBmdW5jdGlvbihldmVudCwgdGFyZ2V0LCBsaXN0ZW5lcikge1xuICByZXR1cm4gbGlzdGVuZXIuaGFuZGxlci5jYWxsKHRhcmdldCwgZXZlbnQsIHRhcmdldCk7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gZWxlbWVudFxuICogbWF0Y2hlcyBhIGdlbmVyaWMgc2VsZWN0b3IuXG4gKlxuICogQHR5cGUgZnVuY3Rpb24oKVxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIEEgQ1NTIHNlbGVjdG9yXG4gKi9cbnZhciBtYXRjaGVzID0gKGZ1bmN0aW9uKGVsKSB7XG4gIGlmICghZWwpIHJldHVybjtcbiAgdmFyIHAgPSBlbC5wcm90b3R5cGU7XG4gIHJldHVybiAocC5tYXRjaGVzIHx8IHAubWF0Y2hlc1NlbGVjdG9yIHx8IHAud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IHAubW96TWF0Y2hlc1NlbGVjdG9yIHx8IHAubXNNYXRjaGVzU2VsZWN0b3IgfHwgcC5vTWF0Y2hlc1NlbGVjdG9yKTtcbn0oRWxlbWVudCkpO1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gZWxlbWVudFxuICogbWF0Y2hlcyBhIHRhZyBzZWxlY3Rvci5cbiAqXG4gKiBUYWdzIGFyZSBOT1QgY2FzZS1zZW5zaXRpdmUsXG4gKiBleGNlcHQgaW4gWE1MIChhbmQgWE1MLWJhc2VkXG4gKiBsYW5ndWFnZXMgc3VjaCBhcyBYSFRNTCkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZ05hbWUgVGhlIHRhZyBuYW1lIHRvIHRlc3QgYWdhaW5zdFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHRlc3Qgd2l0aFxuICogQHJldHVybnMgYm9vbGVhblxuICovXG5mdW5jdGlvbiBtYXRjaGVzVGFnKHRhZ05hbWUsIGVsZW1lbnQpIHtcbiAgcmV0dXJuIHRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBlbGVtZW50XG4gKiBtYXRjaGVzIHRoZSByb290LlxuICpcbiAqIEBwYXJhbSB7P1N0cmluZ30gc2VsZWN0b3IgSW4gdGhpcyBjYXNlIHRoaXMgaXMgYWx3YXlzIHBhc3NlZCB0aHJvdWdoIGFzIG51bGwgYW5kIG5vdCB1c2VkXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdGVzdCB3aXRoXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNSb290KHNlbGVjdG9yLCBlbGVtZW50KSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlKi9cbiAgaWYgKHRoaXMucm9vdEVsZW1lbnQgPT09IHdpbmRvdykgcmV0dXJuIGVsZW1lbnQgPT09IGRvY3VtZW50O1xuICByZXR1cm4gdGhpcy5yb290RWxlbWVudCA9PT0gZWxlbWVudDtcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBJRCBvZlxuICogdGhlIGVsZW1lbnQgaW4gJ3RoaXMnXG4gKiBtYXRjaGVzIHRoZSBnaXZlbiBJRC5cbiAqXG4gKiBJRHMgYXJlIGNhc2Utc2Vuc2l0aXZlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgdG8gdGVzdCBhZ2FpbnN0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdGVzdCB3aXRoXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNJZChpZCwgZWxlbWVudCkge1xuICByZXR1cm4gaWQgPT09IGVsZW1lbnQuaWQ7XG59XG5cbi8qKlxuICogU2hvcnQgaGFuZCBmb3Igb2ZmKClcbiAqIGFuZCByb290KCksIGllIGJvdGhcbiAqIHdpdGggbm8gcGFyYW1ldGVyc1xuICpcbiAqIEByZXR1cm4gdm9pZFxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9mZigpO1xuICB0aGlzLnJvb3QoKTtcbn07XG4iLCIvKmpzaGludCBicm93c2VyOnRydWUsIG5vZGU6dHJ1ZSovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcHJlc2VydmUgQ3JlYXRlIGFuZCBtYW5hZ2UgYSBET00gZXZlbnQgZGVsZWdhdG9yLlxuICpcbiAqIEB2ZXJzaW9uIDAuMy4wXG4gKiBAY29kaW5nc3RhbmRhcmQgZnRsYWJzLWpzdjJcbiAqIEBjb3B5cmlnaHQgVGhlIEZpbmFuY2lhbCBUaW1lcyBMaW1pdGVkIFtBbGwgUmlnaHRzIFJlc2VydmVkXVxuICogQGxpY2Vuc2UgTUlUIExpY2Vuc2UgKHNlZSBMSUNFTlNFLnR4dClcbiAqL1xudmFyIERlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJvb3QpIHtcbiAgcmV0dXJuIG5ldyBEZWxlZ2F0ZShyb290KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLkRlbGVnYXRlID0gRGVsZWdhdGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGdldDtcblxuZnVuY3Rpb24gZ2V0IChjb250ZXh0LCBwYXRoKSB7XG4gIGlmIChwYXRoLmluZGV4T2YoJy4nKSA9PSAtMSAmJiBwYXRoLmluZGV4T2YoJ1snKSA9PSAtMSkge1xuICAgIHJldHVybiBjb250ZXh0W3BhdGhdO1xuICB9XG5cbiAgdmFyIGNydW1icyA9IHBhdGguc3BsaXQoL1xcLnxcXFt8XFxdL2cpO1xuICB2YXIgaSA9IC0xO1xuICB2YXIgbGVuID0gY3J1bWJzLmxlbmd0aDtcbiAgdmFyIHJlc3VsdDtcblxuICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgaWYgKGkgPT0gMCkgcmVzdWx0ID0gY29udGV4dDtcbiAgICBpZiAoIWNydW1ic1tpXSkgY29udGludWU7XG4gICAgaWYgKHJlc3VsdCA9PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgIHJlc3VsdCA9IHJlc3VsdFtjcnVtYnNbaV1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvc3VwZXJtb2RlbHMnKTtcbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpXG52YXIgY3JlYXRlV3JhcHBlckZhY3RvcnkgPSByZXF1aXJlKCcuL2ZhY3RvcnknKVxuXG5mdW5jdGlvbiByZXNvbHZlIChmcm9tKSB7XG4gIHZhciBpc0N0b3IgPSB1dGlsLmlzQ29uc3RydWN0b3IoZnJvbSlcbiAgdmFyIGlzU3VwZXJtb2RlbEN0b3IgPSB1dGlsLmlzU3VwZXJtb2RlbENvbnN0cnVjdG9yKGZyb20pXG4gIHZhciBpc0FycmF5ID0gdXRpbC5pc0FycmF5KGZyb20pXG5cbiAgaWYgKGlzQ3RvciB8fCBpc1N1cGVybW9kZWxDdG9yIHx8IGlzQXJyYXkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgX190eXBlOiBmcm9tXG4gICAgfVxuICB9XG5cbiAgdmFyIGlzVmFsdWUgPSAhdXRpbC5pc09iamVjdChmcm9tKVxuICBpZiAoaXNWYWx1ZSkge1xuICAgIHJldHVybiB7XG4gICAgICBfX3ZhbHVlOiBmcm9tXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZyb21cbn1cblxuZnVuY3Rpb24gY3JlYXRlRGVmIChmcm9tKSB7XG4gIGZyb20gPSByZXNvbHZlKGZyb20pXG5cbiAgdmFyIF9fVkFMSURBVE9SUyA9ICdfX3ZhbGlkYXRvcnMnXG4gIHZhciBfX1ZBTFVFID0gJ19fdmFsdWUnXG4gIHZhciBfX1RZUEUgPSAnX190eXBlJ1xuICB2YXIgX19ESVNQTEFZTkFNRSA9ICdfX2Rpc3BsYXlOYW1lJ1xuICB2YXIgX19HRVQgPSAnX19nZXQnXG4gIHZhciBfX1NFVCA9ICdfX3NldCdcbiAgdmFyIF9fRU5VTUVSQUJMRSA9ICdfX2VudW1lcmFibGUnXG4gIHZhciBfX0NPTkZJR1VSQUJMRSA9ICdfX2NvbmZpZ3VyYWJsZSdcbiAgdmFyIF9fV1JJVEFCTEUgPSAnX193cml0YWJsZSdcbiAgdmFyIF9fU1BFQ0lBTF9QUk9QUyA9IFtcbiAgICBfX1ZBTElEQVRPUlMsIF9fVkFMVUUsIF9fVFlQRSwgX19ESVNQTEFZTkFNRSxcbiAgICBfX0dFVCwgX19TRVQsIF9fRU5VTUVSQUJMRSwgX19DT05GSUdVUkFCTEUsIF9fV1JJVEFCTEVcbiAgXVxuXG4gIHZhciBkZWYgPSB7XG4gICAgZnJvbTogZnJvbSxcbiAgICB0eXBlOiBmcm9tW19fVFlQRV0sXG4gICAgdmFsdWU6IGZyb21bX19WQUxVRV0sXG4gICAgdmFsaWRhdG9yczogZnJvbVtfX1ZBTElEQVRPUlNdIHx8IFtdLFxuICAgIGVudW1lcmFibGU6IGZyb21bX19FTlVNRVJBQkxFXSAhPT0gZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiAhIWZyb21bX19DT05GSUdVUkFCTEVdLFxuICAgIHdyaXRhYmxlOiBmcm9tW19fV1JJVEFCTEVdICE9PSBmYWxzZSxcbiAgICBkaXNwbGF5TmFtZTogZnJvbVtfX0RJU1BMQVlOQU1FXSxcbiAgICBnZXR0ZXI6IGZyb21bX19HRVRdLFxuICAgIHNldHRlcjogZnJvbVtfX1NFVF1cbiAgfVxuXG4gIHZhciB0eXBlID0gZGVmLnR5cGVcblxuICAvLyBTaW1wbGUgJ0NvbnN0cnVjdG9yJyBUeXBlXG4gIGlmICh1dGlsLmlzU2ltcGxlQ29uc3RydWN0b3IodHlwZSkpIHtcbiAgICBkZWYuaXNTaW1wbGUgPSB0cnVlXG5cbiAgICBkZWYuY2FzdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHV0aWwuY2FzdCh2YWx1ZSwgdHlwZSlcbiAgICB9XG4gIH0gZWxzZSBpZiAodXRpbC5pc1N1cGVybW9kZWxDb25zdHJ1Y3Rvcih0eXBlKSkge1xuICAgIGRlZi5pc1JlZmVyZW5jZSA9IHRydWVcbiAgfSBlbHNlIGlmIChkZWYudmFsdWUpIHtcbiAgICAvLyBJZiBhIHZhbHVlIGlzIHByZXNlbnQsIHVzZVxuICAgIC8vIHRoYXQgYW5kIHNob3J0LWNpcmN1aXQgdGhlIHJlc3RcbiAgICBkZWYuaXNTaW1wbGUgPSB0cnVlXG4gIH0gZWxzZSB7XG4gICAgLy8gT3RoZXJ3aXNlIGxvb2sgZm9yIG90aGVyIG5vbi1zcGVjaWFsXG4gICAgLy8ga2V5cyBhbmQgYWxzbyBhbnkgaXRlbSBkZWZpbml0aW9uXG4gICAgLy8gaW4gdGhlIGNhc2Ugb2YgQXJyYXlzXG5cbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGZyb20pXG4gICAgdmFyIGNoaWxkS2V5cyA9IGtleXMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gX19TUEVDSUFMX1BST1BTLmluZGV4T2YoaXRlbSkgPT09IC0xXG4gICAgfSlcblxuICAgIGlmIChjaGlsZEtleXMubGVuZ3RoKSB7XG4gICAgICB2YXIgZGVmcyA9IHt9XG4gICAgICB2YXIgcHJvdG9cblxuICAgICAgY2hpbGRLZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZnJvbSwga2V5KVxuICAgICAgICB2YXIgdmFsdWVcblxuICAgICAgICBpZiAoZGVzY3JpcHRvci5nZXQgfHwgZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgICAgICB2YWx1ZSA9IHtcbiAgICAgICAgICAgIF9fZ2V0OiBkZXNjcmlwdG9yLmdldCxcbiAgICAgICAgICAgIF9fc2V0OiBkZXNjcmlwdG9yLnNldFxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IGZyb21ba2V5XVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1dGlsLmlzQ29uc3RydWN0b3IodmFsdWUpICYmICF1dGlsLmlzU3VwZXJtb2RlbENvbnN0cnVjdG9yKHZhbHVlKSAmJiB1dGlsLmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgaWYgKCFwcm90bykge1xuICAgICAgICAgICAgcHJvdG8gPSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgICBwcm90b1trZXldID0gdmFsdWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZzW2tleV0gPSBjcmVhdGVEZWYodmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGRlZi5kZWZzID0gZGVmc1xuICAgICAgZGVmLnByb3RvID0gcHJvdG9cblxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBBcnJheVxuICAgIGlmICh0eXBlID09PSBBcnJheSB8fCB1dGlsLmlzQXJyYXkodHlwZSkpIHtcbiAgICAgIGRlZi5pc0FycmF5ID0gdHJ1ZVxuXG4gICAgICBpZiAodHlwZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRlZi5kZWYgPSBjcmVhdGVEZWYodHlwZVswXSlcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoY2hpbGRLZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZGVmLmlzU2ltcGxlID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGRlZi5jcmVhdGUgPSBjcmVhdGVXcmFwcGVyRmFjdG9yeShkZWYpXG5cbiAgcmV0dXJuIGRlZlxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZURlZlxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHZhciBhcnIgPSBbXVxuXG4gIC8qKlxuICAgKiBQcm94aWVkIGFycmF5IG11dGF0b3JzIG1ldGhvZHNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cbiAgdmFyIHBvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkucHJvdG90eXBlLnBvcC5hcHBseShhcnIpXG5cbiAgICBjYWxsYmFjaygncG9wJywgYXJyLCB7XG4gICAgICB2YWx1ZTogcmVzdWx0XG4gICAgfSlcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuICB2YXIgcHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoYXJyLCBhcmd1bWVudHMpXG5cbiAgICBjYWxsYmFjaygncHVzaCcsIGFyciwge1xuICAgICAgdmFsdWU6IHJlc3VsdFxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbiAgdmFyIHNoaWZ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoYXJyKVxuXG4gICAgY2FsbGJhY2soJ3NoaWZ0JywgYXJyLCB7XG4gICAgICB2YWx1ZTogcmVzdWx0XG4gICAgfSlcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuICB2YXIgc29ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkucHJvdG90eXBlLnNvcnQuYXBwbHkoYXJyLCBhcmd1bWVudHMpXG5cbiAgICBjYWxsYmFjaygnc29ydCcsIGFyciwge1xuICAgICAgdmFsdWU6IHJlc3VsdFxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbiAgdmFyIHVuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KGFyciwgYXJndW1lbnRzKVxuXG4gICAgY2FsbGJhY2soJ3Vuc2hpZnQnLCBhcnIsIHtcbiAgICAgIHZhbHVlOiByZXN1bHRcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG4gIHZhciByZXZlcnNlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBBcnJheS5wcm90b3R5cGUucmV2ZXJzZS5hcHBseShhcnIpXG5cbiAgICBjYWxsYmFjaygncmV2ZXJzZScsIGFyciwge1xuICAgICAgdmFsdWU6IHJlc3VsdFxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbiAgdmFyIHNwbGljZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KGFyciwgYXJndW1lbnRzKVxuXG4gICAgY2FsbGJhY2soJ3NwbGljZScsIGFyciwge1xuICAgICAgdmFsdWU6IHJlc3VsdCxcbiAgICAgIHJlbW92ZWQ6IHJlc3VsdCxcbiAgICAgIGFkZGVkOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpXG4gICAgfSlcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm94eSBhbGwgQXJyYXkucHJvdG90eXBlIG11dGF0b3IgbWV0aG9kcyBvbiB0aGlzIGFycmF5IGluc3RhbmNlXG4gICAqL1xuICBhcnIucG9wID0gYXJyLnBvcCAmJiBwb3BcbiAgYXJyLnB1c2ggPSBhcnIucHVzaCAmJiBwdXNoXG4gIGFyci5zaGlmdCA9IGFyci5zaGlmdCAmJiBzaGlmdFxuICBhcnIudW5zaGlmdCA9IGFyci51bnNoaWZ0ICYmIHVuc2hpZnRcbiAgYXJyLnNvcnQgPSBhcnIuc29ydCAmJiBzb3J0XG4gIGFyci5yZXZlcnNlID0gYXJyLnJldmVyc2UgJiYgcmV2ZXJzZVxuICBhcnIuc3BsaWNlID0gYXJyLnNwbGljZSAmJiBzcGxpY2VcblxuICAvKipcbiAgICogU3BlY2lhbCB1cGRhdGUgZnVuY3Rpb24gc2luY2Ugd2UgY2FuJ3QgZGV0ZWN0XG4gICAqIGFzc2lnbm1lbnQgYnkgaW5kZXggZS5nLiBhcnJbMF0gPSAnc29tZXRoaW5nJ1xuICAgKi9cbiAgYXJyLnVwZGF0ZSA9IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICB2YXIgb2xkVmFsdWUgPSBhcnJbaW5kZXhdXG4gICAgdmFyIG5ld1ZhbHVlID0gYXJyW2luZGV4XSA9IHZhbHVlXG5cbiAgICBjYWxsYmFjaygndXBkYXRlJywgYXJyLCB7XG4gICAgICBpbmRleDogaW5kZXgsXG4gICAgICB2YWx1ZTogbmV3VmFsdWUsXG4gICAgICBvbGRWYWx1ZTogb2xkVmFsdWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIG5ld1ZhbHVlXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBFbWl0dGVyRXZlbnQgKG5hbWUsIHBhdGgsIHRhcmdldCwgZGV0YWlsKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5wYXRoID0gcGF0aFxuICB0aGlzLnRhcmdldCA9IHRhcmdldFxuXG4gIGlmIChkZXRhaWwpIHtcbiAgICB0aGlzLmRldGFpbCA9IGRldGFpbFxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlclxuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlciAob2JqKSB7XG4gIHZhciBjdHggPSBvYmogfHwgdGhpc1xuXG4gIGlmIChvYmopIHtcbiAgICBjdHggPSBtaXhpbihvYmopXG4gICAgcmV0dXJuIGN0eFxuICB9XG59XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbiAob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XVxuICB9XG4gIHJldHVybiBvYmpcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID0gRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgKHRoaXMuX19jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gIGZ1bmN0aW9uIG9uICgpIHtcbiAgICB0aGlzLm9mZihldmVudCwgb24pXG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG5cbiAgb24uZm4gPSBmblxuICB0aGlzLm9uKGV2ZW50LCBvbilcbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID0gRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgLy8gYWxsXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhpcy5fX2NhbGxiYWNrcyA9IHt9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9fY2FsbGJhY2tzW2V2ZW50XVxuICBpZiAoIWNhbGxiYWNrcykge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgZGVsZXRlIHRoaXMuX19jYWxsYmFja3NbZXZlbnRdXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldXG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSlcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fX2NhbGxiYWNrc1tldmVudF1cblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChldmVudCkge1xuICByZXR1cm4gdGhpcy5fX2NhbGxiYWNrc1tldmVudF0gfHwgW11cbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgcmV0dXJuICEhdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aFxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJylcbnZhciBjcmVhdGVNb2RlbFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vcHJvdG8nKVxudmFyIFdyYXBwZXIgPSByZXF1aXJlKCcuL3dyYXBwZXInKVxuXG5mdW5jdGlvbiBjcmVhdGVNb2RlbERlc2NyaXB0b3JzIChkZWYsIHBhcmVudCkge1xuICB2YXIgX18gPSB7fVxuXG4gIHZhciBkZXNjID0ge1xuICAgIF9fOiB7XG4gICAgICB2YWx1ZTogX19cbiAgICB9LFxuICAgIF9fZGVmOiB7XG4gICAgICB2YWx1ZTogZGVmXG4gICAgfSxcbiAgICBfX3BhcmVudDoge1xuICAgICAgdmFsdWU6IHBhcmVudCxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSxcbiAgICBfX2NhbGxiYWNrczoge1xuICAgICAgdmFsdWU6IHt9LFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVzY1xufVxuXG5mdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzIChtb2RlbCkge1xuICB2YXIgZGVmcyA9IG1vZGVsLl9fZGVmLmRlZnNcbiAgZm9yICh2YXIga2V5IGluIGRlZnMpIHtcbiAgICBkZWZpbmVQcm9wZXJ0eShtb2RlbCwga2V5LCBkZWZzW2tleV0pXG4gIH1cbn1cblxuZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkgKG1vZGVsLCBrZXksIGRlZikge1xuICB2YXIgZGVzYyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fZ2V0KGtleSlcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGRlZi5lbnVtZXJhYmxlLFxuICAgIGNvbmZpZ3VyYWJsZTogZGVmLmNvbmZpZ3VyYWJsZVxuICB9XG5cbiAgaWYgKGRlZi53cml0YWJsZSkge1xuICAgIGRlc2Muc2V0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB0aGlzLl9fc2V0Tm90aWZ5Q2hhbmdlKGtleSwgdmFsdWUpXG4gICAgfVxuICB9XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZGVsLCBrZXksIGRlc2MpXG5cbiAgLy8gU2lsZW50bHkgaW5pdGlhbGl6ZSB0aGUgcHJvcGVydHkgd3JhcHBlclxuICBtb2RlbC5fX1trZXldID0gZGVmLmNyZWF0ZShtb2RlbClcbn1cblxuZnVuY3Rpb24gY3JlYXRlV3JhcHBlckZhY3RvcnkgKGRlZikge1xuICB2YXIgd3JhcHBlciwgZGVmYXVsdFZhbHVlLCBhc3NlcnRcblxuICBpZiAoZGVmLmlzU2ltcGxlKSB7XG4gICAgd3JhcHBlciA9IG5ldyBXcmFwcGVyKGRlZi52YWx1ZSwgZGVmLndyaXRhYmxlLCBkZWYudmFsaWRhdG9ycywgZGVmLmdldHRlciwgZGVmLnNldHRlciwgZGVmLmNhc3QsIG51bGwpXG4gIH0gZWxzZSBpZiAoZGVmLmlzUmVmZXJlbmNlKSB7XG4gICAgLy8gSG9sZCBhIHJlZmVyZW5jZSB0byB0aGVcbiAgICAvLyByZWZlcmVyZW5jZWQgdHlwZXMnIGRlZmluaXRpb25cbiAgICB2YXIgcmVmRGVmID0gZGVmLnR5cGUuZGVmXG5cbiAgICBpZiAocmVmRGVmLmlzU2ltcGxlKSB7XG4gICAgICAvLyBJZiB0aGUgcmVmZXJlbmNlZCB0eXBlIGlzIGl0c2VsZiBzaW1wbGUsXG4gICAgICAvLyB3ZSBjYW4gc2V0IGp1c3QgcmV0dXJuIGEgd3JhcHBlciBhbmRcbiAgICAgIC8vIHRoZSBwcm9wZXJ0eSB3aWxsIGdldCBpbml0aWFsaXplZC5cbiAgICAgIHdyYXBwZXIgPSBuZXcgV3JhcHBlcihyZWZEZWYudmFsdWUsIHJlZkRlZi53cml0YWJsZSwgcmVmRGVmLnZhbGlkYXRvcnMsIGRlZi5nZXR0ZXIsIGRlZi5zZXR0ZXIsIHJlZkRlZi5jYXN0LCBudWxsKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB3ZSdyZSBub3QgZGVhbGluZyB3aXRoIGEgc2ltcGxlIHJlZmVyZW5jZSBtb2RlbFxuICAgICAgLy8gd2UgbmVlZCB0byBkZWZpbmUgYW4gYXNzZXJ0aW9uIHRoYXQgdGhlIGluc3RhbmNlXG4gICAgICAvLyBiZWluZyBzZXQgaXMgb2YgdGhlIGNvcnJlY3QgdHlwZS4gV2UgZG8gdGhpcyBiZVxuICAgICAgLy8gY29tcGFyaW5nIHRoZSBkZWZzLlxuXG4gICAgICBhc3NlcnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gY29tcGFyZSB0aGUgZGVmaW50aW9ucyBvZiB0aGUgdmFsdWUgaW5zdGFuY2VcbiAgICAgICAgLy8gYmVpbmcgcGFzc2VkIGFuZCB0aGUgZGVmIHByb3BlcnR5IGF0dGFjaGVkXG4gICAgICAgIC8vIHRvIHRoZSB0eXBlIFN1cGVybW9kZWxDb25zdHJ1Y3Rvci4gQWxsb3cgdGhlXG4gICAgICAgIC8vIHZhbHVlIHRvIGJlIHVuZGVmaW5lZCBvciBudWxsIGFsc28uXG4gICAgICAgIHZhciBpc0NvcnJlY3RUeXBlID0gZmFsc2VcblxuICAgICAgICBpZiAodXRpbC5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICBpc0NvcnJlY3RUeXBlID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzQ29ycmVjdFR5cGUgPSByZWZEZWYgPT09IHZhbHVlLl9fZGVmXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQ29ycmVjdFR5cGUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIHNob3VsZCBiZSBhbiBpbnN0YW5jZSBvZiB0aGUgcmVmZXJlbmNlZCBtb2RlbCwgbnVsbCBvciB1bmRlZmluZWQnKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHdyYXBwZXIgPSBuZXcgV3JhcHBlcihkZWYudmFsdWUsIGRlZi53cml0YWJsZSwgZGVmLnZhbGlkYXRvcnMsIGRlZi5nZXR0ZXIsIGRlZi5zZXR0ZXIsIG51bGwsIGFzc2VydClcbiAgICB9XG4gIH0gZWxzZSBpZiAoZGVmLmlzQXJyYXkpIHtcbiAgICBkZWZhdWx0VmFsdWUgPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAvLyBmb3IgQXJyYXlzLCB3ZSBjcmVhdGUgYSBuZXcgQXJyYXkgYW5kIGVhY2hcbiAgICAgIC8vIHRpbWUsIG1peCB0aGUgbW9kZWwgcHJvcGVydGllcyBpbnRvIGl0XG4gICAgICB2YXIgbW9kZWwgPSBjcmVhdGVNb2RlbFByb3RvdHlwZShkZWYpXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhtb2RlbCwgY3JlYXRlTW9kZWxEZXNjcmlwdG9ycyhkZWYsIHBhcmVudCkpXG4gICAgICBkZWZpbmVQcm9wZXJ0aWVzKG1vZGVsKVxuICAgICAgcmV0dXJuIG1vZGVsXG4gICAgfVxuXG4gICAgYXNzZXJ0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyB0b2RvOiBmdXJ0aGVyIGFycmF5IHR5cGUgdmFsaWRhdGlvblxuICAgICAgaWYgKCF1dGlsLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVmFsdWUgc2hvdWxkIGJlIGFuIGFycmF5JylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3cmFwcGVyID0gbmV3IFdyYXBwZXIoZGVmYXVsdFZhbHVlLCBkZWYud3JpdGFibGUsIGRlZi52YWxpZGF0b3JzLCBkZWYuZ2V0dGVyLCBkZWYuc2V0dGVyLCBudWxsLCBhc3NlcnQpXG4gIH0gZWxzZSB7XG4gICAgLy8gZm9yIE9iamVjdHMsIHdlIGNhbiBjcmVhdGUgYW5kIHJldXNlXG4gICAgLy8gYSBwcm90b3R5cGUgb2JqZWN0LiBXZSB0aGVuIG5lZWQgdG8gb25seVxuICAgIC8vIGRlZmluZSB0aGUgZGVmcyBhbmQgdGhlICdpbnN0YW5jZScgcHJvcGVydGllc1xuICAgIC8vIGUuZy4gX18sIHBhcmVudCBldGMuXG4gICAgdmFyIHByb3RvID0gY3JlYXRlTW9kZWxQcm90b3R5cGUoZGVmKVxuXG4gICAgZGVmYXVsdFZhbHVlID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgdmFyIG1vZGVsID0gT2JqZWN0LmNyZWF0ZShwcm90bywgY3JlYXRlTW9kZWxEZXNjcmlwdG9ycyhkZWYsIHBhcmVudCkpXG4gICAgICBkZWZpbmVQcm9wZXJ0aWVzKG1vZGVsKVxuICAgICAgcmV0dXJuIG1vZGVsXG4gICAgfVxuXG4gICAgYXNzZXJ0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoIXByb3RvLmlzUHJvdG90eXBlT2YodmFsdWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwcm90b3R5cGUnKVxuICAgICAgfVxuICAgIH1cblxuICAgIHdyYXBwZXIgPSBuZXcgV3JhcHBlcihkZWZhdWx0VmFsdWUsIGRlZi53cml0YWJsZSwgZGVmLnZhbGlkYXRvcnMsIGRlZi5nZXR0ZXIsIGRlZi5zZXR0ZXIsIG51bGwsIGFzc2VydClcbiAgfVxuXG4gIHZhciBmYWN0b3J5ID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgIHZhciB3cmFwID0gT2JqZWN0LmNyZWF0ZSh3cmFwcGVyKVxuICAgIC8vIGlmICghd3JhcC5pc0luaXRpYWxpemVkKSB7XG4gICAgd3JhcC5pbml0aWFsaXplKHBhcmVudClcbiAgICAvLyB9XG4gICAgcmV0dXJuIHdyYXBcbiAgfVxuXG4gIC8vIGV4cG9zZSB0aGUgd3JhcHBlciwgdGhpcyBpcyB1c2VkXG4gIC8vIGZvciB2YWxpZGF0aW5nIGFycmF5IGl0ZW1zIGxhdGVyXG4gIGZhY3Rvcnkud3JhcHBlciA9IHdyYXBwZXJcblxuICByZXR1cm4gZmFjdG9yeVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVdyYXBwZXJGYWN0b3J5XG4iLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gbWVyZ2UgKG1vZGVsLCBvYmopIHtcbiAgdmFyIGlzQXJyYXkgPSBtb2RlbC5fX2RlZi5pc0FycmF5XG4gIHZhciBkZWZzID0gbW9kZWwuX19kZWYuZGVmc1xuICB2YXIgZGVmS2V5cywgZGVmLCBrZXksIGksIGlzU2ltcGxlLFxuICAgIGlzU2ltcGxlUmVmZXJlbmNlLCBpc0luaXRpYWxpemVkUmVmZXJlbmNlXG5cbiAgaWYgKGRlZnMpIHtcbiAgICBkZWZLZXlzID0gT2JqZWN0LmtleXMoZGVmcylcbiAgICBmb3IgKGkgPSAwOyBpIDwgZGVmS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gZGVmS2V5c1tpXVxuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGRlZiA9IGRlZnNba2V5XVxuXG4gICAgICAgIGlzU2ltcGxlID0gZGVmLmlzU2ltcGxlXG4gICAgICAgIGlzU2ltcGxlUmVmZXJlbmNlID0gZGVmLmlzUmVmZXJlbmNlICYmIGRlZi50eXBlLmRlZi5pc1NpbXBsZVxuICAgICAgICBpc0luaXRpYWxpemVkUmVmZXJlbmNlID0gZGVmLmlzUmVmZXJlbmNlICYmIG9ialtrZXldICYmIG9ialtrZXldLl9fc3VwZXJtb2RlbFxuXG4gICAgICAgIGlmIChpc1NpbXBsZSB8fCBpc1NpbXBsZVJlZmVyZW5jZSB8fCBpc0luaXRpYWxpemVkUmVmZXJlbmNlKSB7XG4gICAgICAgICAgbW9kZWxba2V5XSA9IG9ialtrZXldXG4gICAgICAgIH0gZWxzZSBpZiAob2JqW2tleV0pIHtcbiAgICAgICAgICBpZiAoZGVmLmlzUmVmZXJlbmNlKSB7XG4gICAgICAgICAgICBtb2RlbFtrZXldID0gZGVmLnR5cGUoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBtZXJnZShtb2RlbFtrZXldLCBvYmpba2V5XSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChpc0FycmF5ICYmIEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gbW9kZWwuY3JlYXRlKClcbiAgICAgIG1vZGVsLnB1c2goaXRlbSAmJiBpdGVtLl9fc3VwZXJtb2RlbCA/IG1lcmdlKGl0ZW0sIG9ialtpXSkgOiBvYmpbaV0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1vZGVsXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2VcbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgRW1pdHRlckV2ZW50ID0gcmVxdWlyZSgnLi9lbWl0dGVyLWV2ZW50JylcbnZhciBWYWxpZGF0aW9uRXJyb3IgPSByZXF1aXJlKCcuL3ZhbGlkYXRpb24tZXJyb3InKVxudmFyIFdyYXBwZXIgPSByZXF1aXJlKCcuL3dyYXBwZXInKVxudmFyIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZScpXG5cbnZhciBkZXNjcmlwdG9ycyA9IHtcbiAgX19zdXBlcm1vZGVsOiB7XG4gICAgdmFsdWU6IHRydWVcbiAgfSxcbiAgX19rZXlzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpXG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMpKSB7XG4gICAgICAgIHZhciBvbWl0ID0gW1xuICAgICAgICAgICdhZGRFdmVudExpc3RlbmVyJywgJ29uJywgJ29uY2UnLCAncmVtb3ZlRXZlbnRMaXN0ZW5lcicsICdyZW1vdmVBbGxMaXN0ZW5lcnMnLFxuICAgICAgICAgICdyZW1vdmVMaXN0ZW5lcicsICdvZmYnLCAnZW1pdCcsICdsaXN0ZW5lcnMnLCAnaGFzTGlzdGVuZXJzJywgJ3BvcCcsICdwdXNoJyxcbiAgICAgICAgICAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1cGRhdGUnLCAndW5zaGlmdCcsICdjcmVhdGUnLCAnX19tZXJnZScsXG4gICAgICAgICAgJ19fc2V0Tm90aWZ5Q2hhbmdlJywgJ19fbm90aWZ5Q2hhbmdlJywgJ19fc2V0JywgJ19fZ2V0JywgJ19fY2hhaW4nLCAnX19yZWxhdGl2ZVBhdGgnXG4gICAgICAgIF1cblxuICAgICAgICBrZXlzID0ga2V5cy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gb21pdC5pbmRleE9mKGl0ZW0pIDwgMFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5c1xuICAgIH1cbiAgfSxcbiAgX19uYW1lOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5fX2lzUm9vdCkge1xuICAgICAgICByZXR1cm4gJydcbiAgICAgIH1cblxuICAgICAgLy8gV29yayBvdXQgdGhlICduYW1lJyBvZiB0aGUgbW9kZWxcbiAgICAgIC8vIExvb2sgdXAgdG8gdGhlIHBhcmVudCBhbmQgbG9vcCB0aHJvdWdoIGl0J3Mga2V5cyxcbiAgICAgIC8vIEFueSB2YWx1ZSBvciBhcnJheSBmb3VuZCB0byBjb250YWluIHRoZSB2YWx1ZSBvZiB0aGlzICh0aGlzIG1vZGVsKVxuICAgICAgLy8gdGhlbiB3ZSByZXR1cm4gdGhlIGtleSBhbmQgaW5kZXggaW4gdGhlIGNhc2Ugd2UgZm91bmQgdGhlIG1vZGVsIGluIGFuIGFycmF5LlxuICAgICAgdmFyIHBhcmVudEtleXMgPSB0aGlzLl9fcGFyZW50Ll9fa2V5c1xuICAgICAgdmFyIHBhcmVudEtleSwgcGFyZW50VmFsdWVcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJlbnRLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHBhcmVudEtleSA9IHBhcmVudEtleXNbaV1cbiAgICAgICAgcGFyZW50VmFsdWUgPSB0aGlzLl9fcGFyZW50W3BhcmVudEtleV1cblxuICAgICAgICBpZiAocGFyZW50VmFsdWUgPT09IHRoaXMpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50S2V5XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIF9fcGF0aDoge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuX19oYXNBbmNlc3RvcnMgJiYgIXRoaXMuX19wYXJlbnQuX19pc1Jvb3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19wYXJlbnQuX19wYXRoICsgJy4nICsgdGhpcy5fX25hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fbmFtZVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgX19pc1Jvb3Q6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAhdGhpcy5fX2hhc0FuY2VzdG9yc1xuICAgIH1cbiAgfSxcbiAgX19jaGlsZHJlbjoge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNoaWxkcmVuID0gW11cblxuICAgICAgdmFyIGtleXMgPSB0aGlzLl9fa2V5c1xuICAgICAgdmFyIGtleSwgdmFsdWVcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGtleSA9IGtleXNbaV1cbiAgICAgICAgdmFsdWUgPSB0aGlzW2tleV1cblxuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUuX19zdXBlcm1vZGVsKSB7XG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2hpbGRyZW5cbiAgICB9XG4gIH0sXG4gIF9fYW5jZXN0b3JzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYW5jZXN0b3JzID0gW11cbiAgICAgIHZhciByID0gdGhpc1xuXG4gICAgICB3aGlsZSAoci5fX3BhcmVudCkge1xuICAgICAgICBhbmNlc3RvcnMucHVzaChyLl9fcGFyZW50KVxuICAgICAgICByID0gci5fX3BhcmVudFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYW5jZXN0b3JzXG4gICAgfVxuICB9LFxuICBfX2Rlc2NlbmRhbnRzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZGVzY2VuZGFudHMgPSBbXVxuXG4gICAgICBmdW5jdGlvbiBjaGVja0FuZEFkZERlc2NlbmRhbnRJZk1vZGVsIChvYmopIHtcbiAgICAgICAgdmFyIGtleXMgPSBvYmouX19rZXlzXG4gICAgICAgIHZhciBrZXksIHZhbHVlXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAga2V5ID0ga2V5c1tpXVxuICAgICAgICAgIHZhbHVlID0gb2JqW2tleV1cblxuICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5fX3N1cGVybW9kZWwpIHtcbiAgICAgICAgICAgIGRlc2NlbmRhbnRzLnB1c2godmFsdWUpXG4gICAgICAgICAgICBjaGVja0FuZEFkZERlc2NlbmRhbnRJZk1vZGVsKHZhbHVlKVxuXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgY2hlY2tBbmRBZGREZXNjZW5kYW50SWZNb2RlbCh0aGlzKVxuXG4gICAgICByZXR1cm4gZGVzY2VuZGFudHNcbiAgICB9XG4gIH0sXG4gIF9faGFzQW5jZXN0b3JzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gISF0aGlzLl9fYW5jZXN0b3JzLmxlbmd0aFxuICAgIH1cbiAgfSxcbiAgX19oYXNEZXNjZW5kYW50czoge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICEhdGhpcy5fX2Rlc2NlbmRhbnRzLmxlbmd0aFxuICAgIH1cbiAgfSxcbiAgZXJyb3JzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZXJyb3JzID0gW11cbiAgICAgIHZhciBkZWYgPSB0aGlzLl9fZGVmXG4gICAgICB2YXIgdmFsaWRhdG9yLCBlcnJvciwgaSwgalxuXG4gICAgICAvLyBSdW4gb3duIHZhbGlkYXRvcnNcbiAgICAgIHZhciBvd24gPSBkZWYudmFsaWRhdG9ycy5zbGljZSgwKVxuICAgICAgZm9yIChpID0gMDsgaSA8IG93bi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YWxpZGF0b3IgPSBvd25baV1cbiAgICAgICAgZXJyb3IgPSB2YWxpZGF0b3IuY2FsbCh0aGlzLCB0aGlzKVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGVycm9ycy5wdXNoKG5ldyBWYWxpZGF0aW9uRXJyb3IodGhpcywgZXJyb3IsIHZhbGlkYXRvcikpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUnVuIHRocm91Z2gga2V5cyBhbmQgZXZhbHVhdGUgdmFsaWRhdG9yc1xuICAgICAgdmFyIGtleXMgPSB0aGlzLl9fa2V5c1xuICAgICAgdmFyIHZhbHVlLCBrZXksIGl0ZW1EZWZcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAga2V5ID0ga2V5c1tpXVxuXG4gICAgICAgIC8vIElmIHdlIGFyZSBhbiBBcnJheSB3aXRoIGFuIGl0ZW0gZGVmaW5pdGlvblxuICAgICAgICAvLyB0aGVuIHdlIGhhdmUgdG8gbG9vayBpbnRvIHRoZSBBcnJheSBmb3Igb3VyIHZhbHVlXG4gICAgICAgIC8vIGFuZCBhbHNvIGdldCBob2xkIG9mIHRoZSB3cmFwcGVyLiBXZSBvbmx5IG5lZWQgdG9cbiAgICAgICAgLy8gZG8gdGhpcyBpZiB0aGUga2V5IGlzIG5vdCBhIHByb3BlcnR5IG9mIHRoZSBhcnJheS5cbiAgICAgICAgLy8gV2UgY2hlY2sgdGhlIGRlZnMgdG8gd29yayB0aGlzIG91dCAoaS5lLiAwLCAxLCAyKS5cbiAgICAgICAgLy8gdG9kbzogVGhpcyBjb3VsZCBiZSBiZXR0ZXIgdG8gY2hlY2sgIU5hTiBvbiB0aGUga2V5P1xuICAgICAgICBpZiAoZGVmLmlzQXJyYXkgJiYgZGVmLmRlZiAmJiAoIWRlZi5kZWZzIHx8ICEoa2V5IGluIGRlZi5kZWZzKSkpIHtcbiAgICAgICAgICAvLyBJZiB3ZSBhcmUgYW4gQXJyYXkgd2l0aCBhIHNpbXBsZSBpdGVtIGRlZmluaXRpb25cbiAgICAgICAgICAvLyBvciBhIHJlZmVyZW5jZSB0byBhIHNpbXBsZSB0eXBlIGRlZmluaXRpb25cbiAgICAgICAgICAvLyBzdWJzdGl0dXRlIHRoZSB2YWx1ZSB3aXRoIHRoZSB3cmFwcGVyIHdlIGdldCBmcm9tIHRoZVxuICAgICAgICAgIC8vIGNyZWF0ZSBmYWN0b3J5IGZ1bmN0aW9uLiBPdGhlcndpc2Ugc2V0IHRoZSB2YWx1ZSB0b1xuICAgICAgICAgIC8vIHRoZSByZWFsIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICAgICAgICBpdGVtRGVmID0gZGVmLmRlZlxuXG4gICAgICAgICAgaWYgKGl0ZW1EZWYuaXNTaW1wbGUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gaXRlbURlZi5jcmVhdGUud3JhcHBlclxuICAgICAgICAgICAgdmFsdWUuc2V0VmFsdWUodGhpc1trZXldKVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbURlZi5pc1JlZmVyZW5jZSAmJiBpdGVtRGVmLnR5cGUuZGVmLmlzU2ltcGxlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGl0ZW1EZWYudHlwZS5kZWYuY3JlYXRlLndyYXBwZXJcbiAgICAgICAgICAgIHZhbHVlLnNldFZhbHVlKHRoaXNba2V5XSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzW2tleV1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU2V0IHRoZSB2YWx1ZSB0byB0aGUgd3JhcHBlZCB2YWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuX19ba2V5XVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHZhbHVlLl9fc3VwZXJtb2RlbCkge1xuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZXJyb3JzLCB2YWx1ZS5lcnJvcnMpXG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFdyYXBwZXIpIHtcbiAgICAgICAgICAgIHZhciB3cmFwcGVyVmFsdWUgPSB2YWx1ZS5nZXRWYWx1ZSh0aGlzKVxuXG4gICAgICAgICAgICBpZiAod3JhcHBlclZhbHVlICYmIHdyYXBwZXJWYWx1ZS5fX3N1cGVybW9kZWwpIHtcbiAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZXJyb3JzLCB3cmFwcGVyVmFsdWUuZXJyb3JzKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFyIHNpbXBsZSA9IHZhbHVlLnZhbGlkYXRvcnNcbiAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNpbXBsZS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRvciA9IHNpbXBsZVtqXVxuICAgICAgICAgICAgICAgIGVycm9yID0gdmFsaWRhdG9yLmNhbGwodGhpcywgd3JhcHBlclZhbHVlLCBrZXkpXG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKG5ldyBWYWxpZGF0aW9uRXJyb3IodGhpcywgZXJyb3IsIHZhbGlkYXRvciwga2V5KSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVycm9yc1xuICAgIH1cbiAgfVxufVxuXG52YXIgcHJvdG8gPSB7XG4gIF9fZ2V0OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX19ba2V5XS5nZXRWYWx1ZSh0aGlzKVxuICB9LFxuICBfX3NldDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICB0aGlzLl9fW2tleV0uc2V0VmFsdWUodmFsdWUsIHRoaXMpXG4gIH0sXG4gIF9fcmVsYXRpdmVQYXRoOiBmdW5jdGlvbiAodG8sIGtleSkge1xuICAgIHZhciByZWxhdGl2ZVBhdGggPSB0aGlzLl9fcGF0aCA/IHRvLnN1YnN0cih0aGlzLl9fcGF0aC5sZW5ndGggKyAxKSA6IHRvXG5cbiAgICBpZiAocmVsYXRpdmVQYXRoKSB7XG4gICAgICByZXR1cm4ga2V5ID8gcmVsYXRpdmVQYXRoICsgJy4nICsga2V5IDogcmVsYXRpdmVQYXRoXG4gICAgfVxuICAgIHJldHVybiBrZXlcbiAgfSxcbiAgX19jaGFpbjogZnVuY3Rpb24gKGZuKSB7XG4gICAgcmV0dXJuIFt0aGlzXS5jb25jYXQodGhpcy5fX2FuY2VzdG9ycykuZm9yRWFjaChmbilcbiAgfSxcbiAgX19tZXJnZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gbWVyZ2UodGhpcywgZGF0YSlcbiAgfSxcbiAgX19ub3RpZnlDaGFuZ2U6IGZ1bmN0aW9uIChrZXksIG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzXG4gICAgdmFyIHRhcmdldFBhdGggPSB0aGlzLl9fcGF0aFxuICAgIHZhciBldmVudE5hbWUgPSAnc2V0J1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgb2xkVmFsdWU6IG9sZFZhbHVlLFxuICAgICAgbmV3VmFsdWU6IG5ld1ZhbHVlXG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KGV2ZW50TmFtZSwgbmV3IEVtaXR0ZXJFdmVudChldmVudE5hbWUsIGtleSwgdGFyZ2V0LCBkYXRhKSlcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIG5ldyBFbWl0dGVyRXZlbnQoZXZlbnROYW1lLCBrZXksIHRhcmdldCwgZGF0YSkpXG4gICAgdGhpcy5lbWl0KCdjaGFuZ2U6JyArIGtleSwgbmV3IEVtaXR0ZXJFdmVudChldmVudE5hbWUsIGtleSwgdGFyZ2V0LCBkYXRhKSlcblxuICAgIHRoaXMuX19hbmNlc3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIHBhdGggPSBpdGVtLl9fcmVsYXRpdmVQYXRoKHRhcmdldFBhdGgsIGtleSlcbiAgICAgIGl0ZW0uZW1pdCgnY2hhbmdlJywgbmV3IEVtaXR0ZXJFdmVudChldmVudE5hbWUsIHBhdGgsIHRhcmdldCwgZGF0YSkpXG4gICAgfSlcbiAgfSxcbiAgX19zZXROb3RpZnlDaGFuZ2U6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5fX2dldChrZXkpXG4gICAgdGhpcy5fX3NldChrZXksIHZhbHVlKVxuICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMuX19nZXQoa2V5KVxuICAgIHRoaXMuX19ub3RpZnlDaGFuZ2Uoa2V5LCBuZXdWYWx1ZSwgb2xkVmFsdWUpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHByb3RvOiBwcm90byxcbiAgZGVzY3JpcHRvcnM6IGRlc2NyaXB0b3JzXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2VtaXR0ZXItb2JqZWN0JylcbnZhciBlbWl0dGVyQXJyYXkgPSByZXF1aXJlKCcuL2VtaXR0ZXItYXJyYXknKVxudmFyIEVtaXR0ZXJFdmVudCA9IHJlcXVpcmUoJy4vZW1pdHRlci1ldmVudCcpXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCcuL3V0aWwnKS5leHRlbmRcbnZhciBtb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKVxudmFyIG1vZGVsUHJvdG8gPSBtb2RlbC5wcm90b1xudmFyIG1vZGVsRGVzY3JpcHRvcnMgPSBtb2RlbC5kZXNjcmlwdG9yc1xuXG52YXIgbW9kZWxQcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG1vZGVsUHJvdG8sIG1vZGVsRGVzY3JpcHRvcnMpXG52YXIgb2JqZWN0UHJvdG90eXBlID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHAgPSBPYmplY3QuY3JlYXRlKG1vZGVsUHJvdG90eXBlKVxuXG4gIGVtaXR0ZXIocClcblxuICByZXR1cm4gcFxufSkoKVxuXG5mdW5jdGlvbiBjcmVhdGVBcnJheVByb3RvdHlwZSAoKSB7XG4gIHZhciBwID0gZW1pdHRlckFycmF5KGZ1bmN0aW9uIChldmVudE5hbWUsIGFyciwgZSkge1xuICAgIGlmIChldmVudE5hbWUgPT09ICd1cGRhdGUnKSB7XG4gICAgICAvKipcbiAgICAgICAqIEZvcndhcmQgdGhlIHNwZWNpYWwgYXJyYXkgdXBkYXRlXG4gICAgICAgKiBldmVudHMgYXMgc3RhbmRhcmQgX19ub3RpZnlDaGFuZ2UgZXZlbnRzXG4gICAgICAgKi9cbiAgICAgIGFyci5fX25vdGlmeUNoYW5nZShlLmluZGV4LCBlLnZhbHVlLCBlLm9sZFZhbHVlKVxuICAgIH0gZWxzZSB7XG4gICAgICAvKipcbiAgICAgICAqIEFsbCBvdGhlciBldmVudHMgZS5nLiBwdXNoLCBzcGxpY2UgYXJlIHJlbGF5ZWRcbiAgICAgICAqL1xuICAgICAgdmFyIHRhcmdldCA9IGFyclxuICAgICAgdmFyIHBhdGggPSBhcnIuX19wYXRoXG4gICAgICB2YXIgZGF0YSA9IGVcbiAgICAgIHZhciBrZXkgPSBlLmluZGV4XG5cbiAgICAgIGFyci5lbWl0KGV2ZW50TmFtZSwgbmV3IEVtaXR0ZXJFdmVudChldmVudE5hbWUsICcnLCB0YXJnZXQsIGRhdGEpKVxuICAgICAgYXJyLmVtaXQoJ2NoYW5nZScsIG5ldyBFbWl0dGVyRXZlbnQoZXZlbnROYW1lLCAnJywgdGFyZ2V0LCBkYXRhKSlcbiAgICAgIGFyci5fX2FuY2VzdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHZhciBuYW1lID0gaXRlbS5fX3JlbGF0aXZlUGF0aChwYXRoLCBrZXkpXG4gICAgICAgIGl0ZW0uZW1pdCgnY2hhbmdlJywgbmV3IEVtaXR0ZXJFdmVudChldmVudE5hbWUsIG5hbWUsIHRhcmdldCwgZGF0YSkpXG4gICAgICB9KVxuXG4gICAgfVxuICB9KVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHAsIG1vZGVsRGVzY3JpcHRvcnMpXG5cbiAgZW1pdHRlcihwKVxuXG4gIGV4dGVuZChwLCBtb2RlbFByb3RvKVxuXG4gIHJldHVybiBwXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdE1vZGVsUHJvdG90eXBlIChwcm90bykge1xuICB2YXIgcCA9IE9iamVjdC5jcmVhdGUob2JqZWN0UHJvdG90eXBlKVxuXG4gIGlmIChwcm90bykge1xuICAgIGV4dGVuZChwLCBwcm90bylcbiAgfVxuXG4gIHJldHVybiBwXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFycmF5TW9kZWxQcm90b3R5cGUgKHByb3RvLCBpdGVtRGVmKSB7XG4gIC8vIFdlIGRvIG5vdCB0byBhdHRlbXB0IHRvIHN1YmNsYXNzIEFycmF5LFxuICAvLyBpbnN0ZWFkIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBlYWNoIHRpbWVcbiAgLy8gYW5kIG1peGluIHRoZSBwcm90byBvYmplY3RcbiAgdmFyIHAgPSBjcmVhdGVBcnJheVByb3RvdHlwZSgpXG5cbiAgaWYgKHByb3RvKSB7XG4gICAgZXh0ZW5kKHAsIHByb3RvKVxuICB9XG5cbiAgaWYgKGl0ZW1EZWYpIHtcbiAgICAvLyBXZSBoYXZlIGEgZGVmaW5pdGlvbiBmb3IgdGhlIGl0ZW1zXG4gICAgLy8gdGhhdCBiZWxvbmcgaW4gdGhpcyBhcnJheS5cblxuICAgIC8vIFVzZSB0aGUgYHdyYXBwZXJgIHByb3RvdHlwZSBwcm9wZXJ0eSBhcyBhXG4gICAgLy8gdmlydHVhbCBXcmFwcGVyIG9iamVjdCB3ZSBjYW4gdXNlXG4gICAgLy8gdmFsaWRhdGUgYWxsIHRoZSBpdGVtcyBpbiB0aGUgYXJyYXkuXG4gICAgdmFyIGFyckl0ZW1XcmFwcGVyID0gaXRlbURlZi5jcmVhdGUud3JhcHBlclxuXG4gICAgLy8gVmFsaWRhdGUgbmV3IG1vZGVscyBieSBvdmVycmlkaW5nIHRoZSBlbWl0dGVyIGFycmF5XG4gICAgLy8gbXV0YXRvcnMgdGhhdCBjYW4gY2F1c2UgbmV3IGl0ZW1zIHRvIGVudGVyIHRoZSBhcnJheS5cbiAgICBvdmVycmlkZUFycmF5QWRkaW5nTXV0YXRvcnMocCwgYXJySXRlbVdyYXBwZXIpXG5cbiAgICAvLyBQcm92aWRlIGEgY29udmVuaWVudCBtb2RlbCBmYWN0b3J5XG4gICAgLy8gZm9yIGNyZWF0aW5nIGFycmF5IGl0ZW0gaW5zdGFuY2VzXG4gICAgcC5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaXRlbURlZi5pc1JlZmVyZW5jZSA/IGl0ZW1EZWYudHlwZSgpIDogaXRlbURlZi5jcmVhdGUoKS5nZXRWYWx1ZSh0aGlzKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwXG59XG5cbmZ1bmN0aW9uIG92ZXJyaWRlQXJyYXlBZGRpbmdNdXRhdG9ycyAoYXJyLCBpdGVtV3JhcHBlcikge1xuICBmdW5jdGlvbiBnZXRBcnJheUFyZ3MgKGl0ZW1zKSB7XG4gICAgdmFyIGFyZ3MgPSBbXVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGl0ZW1XcmFwcGVyLnNldFZhbHVlKGl0ZW1zW2ldLCBhcnIpXG4gICAgICBhcmdzLnB1c2goaXRlbVdyYXBwZXIuZ2V0VmFsdWUoYXJyKSlcbiAgICB9XG4gICAgcmV0dXJuIGFyZ3NcbiAgfVxuXG4gIHZhciBwdXNoID0gYXJyLnB1c2hcbiAgdmFyIHVuc2hpZnQgPSBhcnIudW5zaGlmdFxuICB2YXIgc3BsaWNlID0gYXJyLnNwbGljZVxuICB2YXIgdXBkYXRlID0gYXJyLnVwZGF0ZVxuXG4gIGlmIChwdXNoKSB7XG4gICAgYXJyLnB1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IGdldEFycmF5QXJncyhhcmd1bWVudHMpXG4gICAgICByZXR1cm4gcHVzaC5hcHBseShhcnIsIGFyZ3MpXG4gICAgfVxuICB9XG5cbiAgaWYgKHVuc2hpZnQpIHtcbiAgICBhcnIudW5zaGlmdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gZ2V0QXJyYXlBcmdzKGFyZ3VtZW50cylcbiAgICAgIHJldHVybiB1bnNoaWZ0LmFwcGx5KGFyciwgYXJncylcbiAgICB9XG4gIH1cblxuICBpZiAoc3BsaWNlKSB7XG4gICAgYXJyLnNwbGljZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gZ2V0QXJyYXlBcmdzKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpXG4gICAgICBhcmdzLnVuc2hpZnQoYXJndW1lbnRzWzFdKVxuICAgICAgYXJncy51bnNoaWZ0KGFyZ3VtZW50c1swXSlcbiAgICAgIHJldHVybiBzcGxpY2UuYXBwbHkoYXJyLCBhcmdzKVxuICAgIH1cbiAgfVxuXG4gIGlmICh1cGRhdGUpIHtcbiAgICBhcnIudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBnZXRBcnJheUFyZ3MoW2FyZ3VtZW50c1sxXV0pXG4gICAgICBhcmdzLnVuc2hpZnQoYXJndW1lbnRzWzBdKVxuICAgICAgcmV0dXJuIHVwZGF0ZS5hcHBseShhcnIsIGFyZ3MpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vZGVsUHJvdG90eXBlIChkZWYpIHtcbiAgcmV0dXJuIGRlZi5pc0FycmF5ID8gY3JlYXRlQXJyYXlNb2RlbFByb3RvdHlwZShkZWYucHJvdG8sIGRlZi5kZWYpIDogY3JlYXRlT2JqZWN0TW9kZWxQcm90b3R5cGUoZGVmLnByb3RvKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZU1vZGVsUHJvdG90eXBlXG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSB7fVxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8vIHZhciBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKVxudmFyIGNyZWF0ZURlZiA9IHJlcXVpcmUoJy4vZGVmJylcbnZhciBTdXBlcm1vZGVsID0gcmVxdWlyZSgnLi9zdXBlcm1vZGVsJylcblxuZnVuY3Rpb24gc3VwZXJtb2RlbHMgKHNjaGVtYSwgaW5pdGlhbGl6ZXIpIHtcbiAgdmFyIGRlZiA9IGNyZWF0ZURlZihzY2hlbWEpXG5cbiAgZnVuY3Rpb24gU3VwZXJtb2RlbENvbnN0cnVjdG9yIChkYXRhKSB7XG4gICAgdmFyIG1vZGVsID0gZGVmLmlzU2ltcGxlID8gZGVmLmNyZWF0ZSgpIDogZGVmLmNyZWF0ZSgpLmdldFZhbHVlKHt9KVxuXG4gICAgLy8gQ2FsbCBhbnkgaW5pdGlhbGl6ZXJcbiAgICBpZiAoaW5pdGlhbGl6ZXIpIHtcbiAgICAgIGluaXRpYWxpemVyLmFwcGx5KG1vZGVsLCBhcmd1bWVudHMpXG4gICAgfSBlbHNlIGlmIChkYXRhKSB7XG4gICAgICAvLyBpZiB0aGVyZSdzIG5vIGluaXRpYWxpemVyXG4gICAgICAvLyBidXQgd2UgaGF2ZSBiZWVuIHBhc3NlZCBzb21lXG4gICAgICAvLyBkYXRhLCBtZXJnZSBpdCBpbnRvIHRoZSBtb2RlbC5cbiAgICAgIG1vZGVsLl9fbWVyZ2UoZGF0YSlcbiAgICB9XG4gICAgcmV0dXJuIG1vZGVsXG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN1cGVybW9kZWxDb25zdHJ1Y3RvciwgJ2RlZicsIHtcbiAgICB2YWx1ZTogZGVmIC8vIHRoaXMgaXMgdXNlZCB0byB2YWxpZGF0ZSByZWZlcmVuY2VkIFN1cGVybW9kZWxDb25zdHJ1Y3RvcnNcbiAgfSlcbiAgU3VwZXJtb2RlbENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IFN1cGVybW9kZWwgLy8gdGhpcyBzaGFyZWQgb2JqZWN0IGlzIHVzZWQsIGFzIGEgcHJvdG90eXBlLCB0byBpZGVudGlmeSBTdXBlcm1vZGVsQ29uc3RydWN0b3JzXG4gIFN1cGVybW9kZWxDb25zdHJ1Y3Rvci5jb25zdHJ1Y3RvciA9IFN1cGVybW9kZWxDb25zdHJ1Y3RvclxuICByZXR1cm4gU3VwZXJtb2RlbENvbnN0cnVjdG9yXG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3VwZXJtb2RlbHNcbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgU3VwZXJtb2RlbCA9IHJlcXVpcmUoJy4vc3VwZXJtb2RlbCcpXG5cbmZ1bmN0aW9uIGV4dGVuZCAob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCB0eXBlb2YgYWRkICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBvcmlnaW5cbiAgfVxuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKVxuICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV1cbiAgfVxuICByZXR1cm4gb3JpZ2luXG59XG5cbnZhciB1dGlsID0ge1xuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHlwZU9mOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKClcbiAgfSxcbiAgaXNPYmplY3Q6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnR5cGVPZih2YWx1ZSkgPT09ICdvYmplY3QnXG4gIH0sXG4gIGlzQXJyYXk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKVxuICB9LFxuICBpc1NpbXBsZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgLy8gJ1NpbXBsZScgaGVyZSBtZWFucyBhbnl0aGluZ1xuICAgIC8vIG90aGVyIHRoYW4gYW4gT2JqZWN0IG9yIGFuIEFycmF5XG4gICAgLy8gaS5lLiBudW1iZXIsIHN0cmluZywgZGF0ZSwgYm9vbCwgbnVsbCwgdW5kZWZpbmVkLCByZWdleC4uLlxuICAgIHJldHVybiAhdGhpcy5pc09iamVjdCh2YWx1ZSkgJiYgIXRoaXMuaXNBcnJheSh2YWx1ZSlcbiAgfSxcbiAgaXNGdW5jdGlvbjogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZU9mKHZhbHVlKSA9PT0gJ2Z1bmN0aW9uJ1xuICB9LFxuICBpc0RhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnR5cGVPZih2YWx1ZSkgPT09ICdkYXRlJ1xuICB9LFxuICBpc051bGw6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbFxuICB9LFxuICBpc1VuZGVmaW5lZDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiAodmFsdWUpID09PSAndW5kZWZpbmVkJ1xuICB9LFxuICBpc051bGxPclVuZGVmaW5lZDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNOdWxsKHZhbHVlKSB8fCB0aGlzLmlzVW5kZWZpbmVkKHZhbHVlKVxuICB9LFxuICBjYXN0OiBmdW5jdGlvbiAodmFsdWUsIHR5cGUpIHtcbiAgICBpZiAoIXR5cGUpIHtcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBTdHJpbmc6XG4gICAgICAgIHJldHVybiB1dGlsLmNhc3RTdHJpbmcodmFsdWUpXG4gICAgICBjYXNlIE51bWJlcjpcbiAgICAgICAgcmV0dXJuIHV0aWwuY2FzdE51bWJlcih2YWx1ZSlcbiAgICAgIGNhc2UgQm9vbGVhbjpcbiAgICAgICAgcmV0dXJuIHV0aWwuY2FzdEJvb2xlYW4odmFsdWUpXG4gICAgICBjYXNlIERhdGU6XG4gICAgICAgIHJldHVybiB1dGlsLmNhc3REYXRlKHZhbHVlKVxuICAgICAgY2FzZSBPYmplY3Q6XG4gICAgICBjYXNlIEZ1bmN0aW9uOlxuICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjYXN0JylcbiAgICB9XG4gIH0sXG4gIGNhc3RTdHJpbmc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8IHV0aWwudHlwZU9mKHZhbHVlKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcgJiYgdmFsdWUudG9TdHJpbmcoKVxuICB9LFxuICBjYXN0TnVtYmVyOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIE5hTlxuICAgIH1cbiAgICBpZiAodXRpbC50eXBlT2YodmFsdWUpID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICAgIHJldHVybiBOdW1iZXIodmFsdWUpXG4gIH0sXG4gIGNhc3RCb29sZWFuOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgdmFyIGZhbHNleSA9IFsnMCcsICdmYWxzZScsICdvZmYnLCAnbm8nXVxuICAgIHJldHVybiBmYWxzZXkuaW5kZXhPZih2YWx1ZSkgPT09IC0xXG4gIH0sXG4gIGNhc3REYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB1dGlsLnR5cGVPZih2YWx1ZSkgPT09ICdkYXRlJykge1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICAgIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSlcbiAgfSxcbiAgaXNDb25zdHJ1Y3RvcjogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNTaW1wbGVDb25zdHJ1Y3Rvcih2YWx1ZSkgfHwgW0FycmF5LCBPYmplY3RdLmluZGV4T2YodmFsdWUpID4gLTFcbiAgfSxcbiAgaXNTaW1wbGVDb25zdHJ1Y3RvcjogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIFtTdHJpbmcsIE51bWJlciwgRGF0ZSwgQm9vbGVhbl0uaW5kZXhPZih2YWx1ZSkgPiAtMVxuICB9LFxuICBpc1N1cGVybW9kZWxDb25zdHJ1Y3RvcjogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNGdW5jdGlvbih2YWx1ZSkgJiYgdmFsdWUucHJvdG90eXBlID09PSBTdXBlcm1vZGVsXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1dGlsXG4iLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gVmFsaWRhdGlvbkVycm9yICh0YXJnZXQsIGVycm9yLCB2YWxpZGF0b3IsIGtleSkge1xuICB0aGlzLnRhcmdldCA9IHRhcmdldFxuICB0aGlzLmVycm9yID0gZXJyb3JcbiAgdGhpcy52YWxpZGF0b3IgPSB2YWxpZGF0b3JcblxuICBpZiAoa2V5KSB7XG4gICAgdGhpcy5rZXkgPSBrZXlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZhbGlkYXRpb25FcnJvclxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJylcblxuZnVuY3Rpb24gV3JhcHBlciAoZGVmYXVsdFZhbHVlLCB3cml0YWJsZSwgdmFsaWRhdG9ycywgZ2V0dGVyLCBzZXR0ZXIsIGJlZm9yZVNldCwgYXNzZXJ0KSB7XG4gIHRoaXMudmFsaWRhdG9ycyA9IHZhbGlkYXRvcnNcblxuICB0aGlzLl9kZWZhdWx0VmFsdWUgPSBkZWZhdWx0VmFsdWVcbiAgdGhpcy5fd3JpdGFibGUgPSB3cml0YWJsZVxuICB0aGlzLl9nZXR0ZXIgPSBnZXR0ZXJcbiAgdGhpcy5fc2V0dGVyID0gc2V0dGVyXG4gIHRoaXMuX2JlZm9yZVNldCA9IGJlZm9yZVNldFxuICB0aGlzLl9hc3NlcnQgPSBhc3NlcnRcbiAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2VcblxuICBpZiAoIXV0aWwuaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpKSB7XG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZVxuXG4gICAgaWYgKCF1dGlsLmlzVW5kZWZpbmVkKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gZGVmYXVsdFZhbHVlXG4gICAgfVxuICB9XG59XG5XcmFwcGVyLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICBpZiAodGhpcy5pc0luaXRpYWxpemVkKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB0aGlzLnNldFZhbHVlKHRoaXMuX2RlZmF1bHRWYWx1ZShwYXJlbnQpLCBwYXJlbnQpXG4gIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWVcbn1cbldyYXBwZXIucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gIHJldHVybiB0aGlzLl9nZXR0ZXIgPyB0aGlzLl9nZXR0ZXIuY2FsbChtb2RlbCkgOiB0aGlzLl92YWx1ZVxufVxuV3JhcHBlci5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbiAodmFsdWUsIG1vZGVsKSB7XG4gIGlmICghdGhpcy5fd3JpdGFibGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIGlzIHJlYWRvbmx5JylcbiAgfVxuXG4gIC8vIEhvb2sgdXAgdGhlIHBhcmVudCByZWYgaWYgbmVjZXNzYXJ5XG4gIGlmICh2YWx1ZSAmJiB2YWx1ZS5fX3N1cGVybW9kZWwgJiYgbW9kZWwpIHtcbiAgICBpZiAodmFsdWUuX19wYXJlbnQgIT09IG1vZGVsKSB7XG4gICAgICB2YWx1ZS5fX3BhcmVudCA9IG1vZGVsXG4gICAgfVxuICB9XG5cbiAgdmFyIHZhbFxuICBpZiAodGhpcy5fc2V0dGVyKSB7XG4gICAgdGhpcy5fc2V0dGVyLmNhbGwobW9kZWwsIHZhbHVlKVxuICAgIHZhbCA9IHRoaXMuZ2V0VmFsdWUobW9kZWwpXG4gIH0gZWxzZSB7XG4gICAgdmFsID0gdGhpcy5fYmVmb3JlU2V0ID8gdGhpcy5fYmVmb3JlU2V0KHZhbHVlKSA6IHZhbHVlXG4gIH1cblxuICBpZiAodGhpcy5fYXNzZXJ0KSB7XG4gICAgdGhpcy5fYXNzZXJ0KHZhbClcbiAgfVxuXG4gIHRoaXMuX3ZhbHVlID0gdmFsXG59XG5cbm1vZHVsZS5leHBvcnRzID0gV3JhcHBlclxuIl19
