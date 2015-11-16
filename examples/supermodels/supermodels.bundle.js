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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9zdXBlcm1vZGVscy9fY29udGFjdHVzLmh0bWwiLCJleGFtcGxlcy9zdXBlcm1vZGVscy9fZXJyb3JzLmh0bWwiLCJleGFtcGxlcy9zdXBlcm1vZGVscy9pbmRleC5qcyIsImluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1kZWxlZ2F0ZS9saWIvZGVsZWdhdGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWRlbGVnYXRlL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9nZXQtb2JqZWN0LXBhdGgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvbGliL2RlZi5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcm1vZGVscy5qcy9saWIvZW1pdHRlci1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcm1vZGVscy5qcy9saWIvZW1pdHRlci1ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcm1vZGVscy5qcy9saWIvZW1pdHRlci1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvbGliL2ZhY3RvcnkuanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvbGliL21lcmdlLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVybW9kZWxzLmpzL2xpYi9tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcm1vZGVscy5qcy9saWIvcHJvdG8uanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvbGliL3N1cGVybW9kZWwuanMiLCJub2RlX21vZHVsZXMvc3VwZXJtb2RlbHMuanMvbGliL3N1cGVybW9kZWxzLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVybW9kZWxzLmpzL2xpYi91dGlsLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVybW9kZWxzLmpzL2xpYi92YWxpZGF0aW9uLWVycm9yLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVybW9kZWxzLmpzL2xpYi93cmFwcGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhbm9ueW1vdXMob2JqXG4vKiovKSB7XG52YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTt3aXRoKG9iail7cC5wdXNoKCc8Zm9ybSBhcz1cImZvcm1cIj4gICA8ZGl2IGVycm9ycz4gICA8L2Rpdj4gICA8bGFiZWwgaWQ9XCJuYW1lXCI+PHNwYW4gY2xhc3M9XCJsYWJlbC10ZXh0XCI+TmFtZTogPC9zcGFuPjxpbnB1dCBuYW1lPVwibmFtZVwiIHZhbHVlPVwiJywgZGF0YS5uYW1lICwnXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgcmVxdWlyZWQ+PHNwYW4gY2xhc3M9XCJpbmRpY2F0b3JcIj4qPC9zcGFuPjwvbGFiZWw+ICAgPGxhYmVsIGlkPVwiZW1haWxcIj48c3BhbiBjbGFzcz1cImxhYmVsLXRleHRcIj5FbWFpbDogPC9zcGFuPjxpbnB1dCBuYW1lPVwiZW1haWxcIiB2YWx1ZT1cIicsIGRhdGEuZW1haWwgLCdcIiBwbGFjZWhvbGRlcj1cIkVtYWlsXCIgcmVxdWlyZWQ+PHNwYW4gY2xhc3M9XCJpbmRpY2F0b3JcIj4qPC9zcGFuPjwvbGFiZWw+ICAgPGxhYmVsIGlkPVwicXVlc3Rpb25cIj48c3BhbiBjbGFzcz1cImxhYmVsLXRleHRcIj5RdWVzdGlvbjogPC9zcGFuPjxpbnB1dCBuYW1lPVwicXVlc3Rpb25cIiB2YWx1ZT1cIicsIGRhdGEucXVlc3Rpb24gLCdcIiBwbGFjZWhvbGRlcj1cIlF1ZXN0aW9uXCIgcmVxdWlyZWQ+PHNwYW4gY2xhc3M9XCJpbmRpY2F0b3JcIj4qPC9zcGFuPjwvbGFiZWw+ICAgPGxhYmVsIGlkPVwibGluZTFcIj48c3BhbiBjbGFzcz1cImxhYmVsLXRleHRcIj5MaW5lIDE6IDwvc3Bhbj48aW5wdXQgbmFtZT1cImxpbmUxXCIgdmFsdWU9XCInLCBkYXRhLmxpbmUxICwnXCIgcGxhY2Vob2xkZXI9XCJMaW5lMVwiIHJlcXVpcmVkPjxzcGFuIGNsYXNzPVwiaW5kaWNhdG9yXCI+Kjwvc3Bhbj48L2xhYmVsPiAgIDxsYWJlbCBpZD1cImxpbmUyXCI+PHNwYW4gY2xhc3M9XCJsYWJlbC10ZXh0XCI+TGluZSAyOiA8L3NwYW4+PGlucHV0IG5hbWU9XCJsaW5lMlwiIHZhbHVlPVwiJywgZGF0YS5saW5lMiAsJ1wiIHBsYWNlaG9sZGVyPVwiTGluZTJcIiByZXF1aXJlZD48c3BhbiBjbGFzcz1cImluZGljYXRvclwiPio8L3NwYW4+PC9sYWJlbD4gICA8bGFiZWwgaWQ9XCJwb3N0Y29kZVwiPjxzcGFuIGNsYXNzPVwibGFiZWwtdGV4dFwiPlBvc3Rjb2RlOiA8L3NwYW4+PGlucHV0IG5hbWU9XCJwb3N0Y29kZVwiIHZhbHVlPVwiJywgZGF0YS5wb3N0Y29kZSAsJ1wiIHBsYWNlaG9sZGVyPVwiUG9zdGNvZGVcIiByZXF1aXJlZD48c3BhbiBjbGFzcz1cImluZGljYXRvclwiPio8L3NwYW4+PC9sYWJlbD4gICA8bGFiZWwgaWQ9XCJuYW1lXCI+PHNwYW4gY2xhc3M9XCJsYWJlbC10ZXh0XCI+RnVsbCBBZGRyZXNzOiA8L3NwYW4+PGFkZHJlc3MgYWRkcmVzcz48L2FkZHJlc3M+PC9sYWJlbD4gICA8YnV0dG9uIGFzPVwic2VuZEJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIiAnLCBkYXRhLmVycm9ycy5sZW5ndGggPyAnZGlzYWJsZWQnIDogJycgLCc+U2VuZDwvYnV0dG9uPiA8L2Zvcm0+ICcpO31yZXR1cm4gcC5qb2luKCcnKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhbm9ueW1vdXMob2JqXG4vKiovKSB7XG52YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTt3aXRoKG9iail7cC5wdXNoKCc8dWwgc3R5bGU9XCJkaXNwbGF5OiAnLCBvYmoubGVuZ3RoID8gJycgOiAnbm9uZScgLCdcIj4gICAnKTsgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpKyspIHsgcC5wdXNoKCcgICAgIDxsaT48YSBocmVmPVwiIycsIG9ialtpXS5rZXkgLCdcIj4nLCBvYmpbaV0uZXJyb3IgLCc8L2E+PC9saT4gICAnKTsgfSBwLnB1c2goJyA8L3VsPiAnKTt9cmV0dXJuIHAuam9pbignJyk7XG59OyIsInZhciBEb20gPSByZXF1aXJlKCcuLi8uLicpXG52YXIgc3VwZXJtb2RlbHMgPSByZXF1aXJlKCdzdXBlcm1vZGVscy5qcycpXG5cbnZhciBmaWVsZCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiB7XG4gICAgX190eXBlOiBTdHJpbmcsXG4gICAgX192YWxpZGF0b3JzOiBbZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIHZhbCA/ICcnIDogKG5hbWUgKyAnIGlzIHJlcXVpcmVkJylcbiAgICB9XVxuICB9XG59XG5cbnZhciBDb250YWN0VXMgPSBzdXBlcm1vZGVscyh7XG4gIG5hbWU6IGZpZWxkKCdOYW1lJyksXG4gIHF1ZXN0aW9uOiBmaWVsZCgnUXVlc3Rpb24nKSxcbiAgZW1haWw6IGZpZWxkKCdFbWFpbCcpLFxuICBsaW5lMTogZmllbGQoJ0xpbmUgMScpLFxuICBsaW5lMjogZmllbGQoJ0xpbmUgMicpLFxuICBwb3N0Y29kZTogZmllbGQoJ1Bvc3Rjb2RlJyksXG4gIGdldCBmdWxsQWRkcmVzcyAoKSB7XG4gICAgcmV0dXJuICh0aGlzLmxpbmUxIHx8ICcnKSArICcgJyArICh0aGlzLmxpbmUyIHx8ICcnKSArICcgJyArICh0aGlzLnBvc3Rjb2RlIHx8ICcnKVxuICB9XG59KVxuXG5Eb20ucmVnaXN0ZXIoe1xuICAnY29udGFjdC11cyc6IHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnaW5pdGlhbGl6ZScpXG4gICAgfSxcbiAgICBvbjoge1xuICAgICAgJ2NoYW5nZTpmb3JtIGlucHV0JzogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGVsID0gZS50YXJnZXRcbiAgICAgICAgdGhpcy5kYXRhW2VsLm5hbWVdID0gZWwudmFsdWVcbiAgICAgICAgdGhpcy5zZXRCdXR0b25TdGF0ZSgpXG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRCdXR0b25TdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZW5kQnV0dG9uLmRpc2FibGVkID0gISF0aGlzLmRhdGEuZXJyb3JzLmxlbmd0aFxuICAgIH0sXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vX2NvbnRhY3R1cy5odG1sJylcbiAgfSxcbiAgJ2FkZHJlc3MnOiB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICB0aGlzLmRhdGEub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5fXy5yZW5kZXIoKVxuICAgICAgfSlcbiAgICB9LFxuICAgIHRlbXBsYXRlOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgIHJldHVybiBtb2RlbC5kYXRhLmZ1bGxBZGRyZXNzXG4gICAgfVxuICB9LFxuICAnZXJyb3JzJzoge1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgdGhpcy5kYXRhLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBzZWxmLl9fLnJlbmRlcigpXG4gICAgICB9KVxuICAgIH0sXG4gICAgdGVtcGxhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlcnJvcnMgPSB0aGlzLmRhdGEuZXJyb3JzXG4gICAgICByZXR1cm4gcmVxdWlyZSgnLi9fZXJyb3JzLmh0bWwnKShlcnJvcnMpXG4gICAgfVxuICB9XG59KVxuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbW9kZWwgPSB7XG4gICAgY29udGFjdFVzOiBuZXcgQ29udGFjdFVzKClcbiAgfVxuICBEb20uc2Nhbihkb2N1bWVudC5ib2R5LCBtb2RlbClcbn1cbiIsInZhciBnZXQgPSByZXF1aXJlKCdnZXQtb2JqZWN0LXBhdGgnKVxudmFyIERlbGVnYXRlID0gcmVxdWlyZSgnZG9tLWRlbGVnYXRlJykuRGVsZWdhdGVcblxuZnVuY3Rpb24gUmVnaXN0ZXIgKCkge31cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlZ2lzdGVyLnByb3RvdHlwZSwge1xuICBzZWxlY3Rvcjoge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0aGlzKVxuICAgICAgcmV0dXJuIGtleXMubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuICdbJyArIGtleSArICddJ1xuICAgICAgfSkuam9pbignLCAnKVxuICAgIH1cbiAgfSxcbiAga2V5czoge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMpXG4gICAgfVxuICB9XG59KVxuXG52YXIgcmVnaXN0ZXIgPSBuZXcgUmVnaXN0ZXIoKVxuXG5mdW5jdGlvbiBjcmVhdGVDb250ZXh0IChlbCwgZGF0YSwgY29tcG9uZW50LCBwYXJlbnQpIHtcbiAgdmFyIGN0eCA9IE9iamVjdC5jcmVhdGUoY29tcG9uZW50Lmlzb2xhdGUgPyB7fSA6IHBhcmVudCB8fCB7fSlcblxuICB2YXIgaW5mbyA9IE9iamVjdC5jcmVhdGUoe30sIHtcbiAgICBlbDoge1xuICAgICAgdmFsdWU6IGVsXG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICB2YWx1ZTogZGF0YVxuICAgIH0sXG4gICAgY29tcG9uZW50OiB7XG4gICAgICB2YWx1ZTogY29tcG9uZW50XG4gICAgfVxuICB9KVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGN0eCwge1xuICAgIF9fOiB7XG4gICAgICB2YWx1ZTogaW5mb1xuICAgIH1cbiAgfSlcblxuICBjdHguZGF0YSA9IGRhdGFcblxuICByZXR1cm4gY3R4XG59XG5cbnZhciBpZ25vcmUgPSBbJ29uJywgJ3RlbXBsYXRlJywgJ2luaXRpYWxpemUnLCAnaXNvbGF0ZSddXG5mdW5jdGlvbiBleHRlbmQgKG9iaikge1xuICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHZhciBkZXNjcmlwdG9yLCBwcm9wXG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgZm9yIChwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3ApICYmIGlnbm9yZS5pbmRleE9mKHByb3ApID09PSAtMSkge1xuICAgICAgICAgIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgcHJvcClcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjcmlwdG9yKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KVxuICByZXR1cm4gb2JqXG59XG5mdW5jdGlvbiBnZXRFbGVtZW50Q29tcG9uZW50IChlbCkge1xuICB2YXIgcmVnaXN0ZXJLZXlzID0gcmVnaXN0ZXIua2V5c1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWR4ID0gcmVnaXN0ZXJLZXlzLmluZGV4T2YoZWwuYXR0cmlidXRlc1tpXS5uYW1lKVxuICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiByZWdpc3RlcktleXNbaWR4XSxcbiAgICAgICAgY29tcG9uZW50OiByZWdpc3RlcltyZWdpc3RlcktleXNbaWR4XV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudERlbGVnYXRlIChlbCwgY3R4LCBjb21wb25lbnQpIHtcbiAgdmFyIGRlbCA9IG5ldyBEZWxlZ2F0ZShlbClcblxuICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJzXG4gIHZhciBwcm94eSA9IGZ1bmN0aW9uIChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgICAgZm4uY2FsbChjdHgsIGUpXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgZXZlbnQgaW4gY29tcG9uZW50Lm9uKSB7XG4gICAgaWYgKGNvbXBvbmVudC5vbi5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcbiAgICAgIHZhciBjb2xvbmlkeCA9IGV2ZW50LmluZGV4T2YoJzonKVxuICAgICAgdmFyIG5hbWUsIHNlbGVjdG9yXG4gICAgICBpZiAoY29sb25pZHggPT09IC0xKSB7XG4gICAgICAgIG5hbWUgPSBldmVudFxuICAgICAgICBkZWwub24obmFtZSwgcHJveHkoY29tcG9uZW50Lm9uW2V2ZW50XSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuYW1lID0gZXZlbnQuc3Vic3RyKDAsIGNvbG9uaWR4KVxuICAgICAgICBzZWxlY3RvciA9IGV2ZW50LnN1YnN0cihjb2xvbmlkeCArIDEpXG4gICAgICAgIGRlbC5vbihuYW1lLCBzZWxlY3RvciwgcHJveHkoY29tcG9uZW50Lm9uW2V2ZW50XSkpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlbFxufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50RGF0YSAoZWwsIGNvbXBvbmVudE5hbWUsIHBhcmVudCkge1xuICB2YXIgYXR0ciA9IGVsLmdldEF0dHJpYnV0ZShjb21wb25lbnROYW1lKVxuICByZXR1cm4gYXR0ciAmJiBnZXQocGFyZW50LCBhdHRyKVxufVxuXG5mdW5jdGlvbiByZWdpc3RlckNvbXBvbmVudCAobmFtZSwgb2JqKSB7XG4gIGlmICh0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xuICAgICAgaWYgKG5hbWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICByZWdpc3RlcltrZXldID0gbmFtZVtrZXldXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlZ2lzdGVyW25hbWVdID0gb2JqXG4gIH1cbn1cblxuLyoqXG4qIENvbnZlcnQgYSBOb2RlTGlzdCBpbnRvIGFuIEFycmF5XG4qIEBtZXRob2Qgbm9kZUxpc3RUb0FycmF5XG4qIEBwYXJhbSBOb2RlTGlzdCBub2RlTGlzdFxuKiBAcmV0dXJuIG5vZGVBcnJheVxuKi9cbmZ1bmN0aW9uIG5vZGVMaXN0VG9BcnJheSAobm9kZUxpc3QpIHtcbiAgdmFyIG5vZGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBub2RlQXJyYXkucHVzaChub2RlTGlzdFtpXSlcbiAgfVxuICByZXR1cm4gbm9kZUFycmF5XG59XG5cbmZ1bmN0aW9uIGdldE1hdGNoaW5nRWxlbWVudHMgKGVsLCBjaGlsZHJlbk9ubHkpIHtcbiAgdmFyIHNlbGVjdG9yID0gRG9tLl9yZWdpc3Rlci5zZWxlY3RvclxuICB2YXIgbWF0Y2hlcyA9IG5vZGVMaXN0VG9BcnJheShlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcblxuICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgIHZhciBjb21wb25lbnQgPSBnZXRFbGVtZW50Q29tcG9uZW50KGVsKVxuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgbWF0Y2hlcy51bnNoaWZ0KGVsKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXRjaGVzXG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnREZXB0aCAoZWwsIHBhcmVudCkge1xuICB2YXIgZGVwdGggPSAwXG4gIHdoaWxlIChlbC5wYXJlbnROb2RlICYmIGVsICE9PSBwYXJlbnQpIHtcbiAgICBkZXB0aCsrXG4gICAgZWwgPSBlbC5wYXJlbnROb2RlXG4gIH1cbiAgcmV0dXJuIGRlcHRoXG59XG5cbmZ1bmN0aW9uIGZpbmRQYXJlbnRDb250ZXh0IChlbCwgY29udGV4dHMpIHtcbiAgZG8ge1xuICAgIGVsID0gZWwucGFyZW50Tm9kZVxuICAgIGlmIChlbCkge1xuICAgICAgZm9yICh2YXIgaSA9IGNvbnRleHRzLmxlbmd0aCAtIDE7IGkgPiAtMSA7IGktLSkge1xuICAgICAgICBpZiAoY29udGV4dHNbaV0uY3R4Ll9fLmVsID09PSBlbCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0c1tpXS5jdHhcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSB3aGlsZSAoZWwpXG59XG5cbmZ1bmN0aW9uIHNldEh0bWwgKGVsLCBjb21wb25lbnQsIGN0eCkge1xuICB2YXIgaHRtbCA9ICh0eXBlb2YgY29tcG9uZW50LnRlbXBsYXRlID09PSAnZnVuY3Rpb24nKVxuICAgID8gY29tcG9uZW50LnRlbXBsYXRlLmNhbGwoY3R4LCBjdHgpXG4gICAgOiBjb21wb25lbnQudGVtcGxhdGVcblxuICBlbC5pbm5lckhUTUwgPSBodG1sXG59XG5cbmZ1bmN0aW9uIHJlbmRlcmVyIChjdXJyRWwsIGNvbXBvbmVudCwgY3R4KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZG9udFNjYW4pIHtcbiAgICBzZXRIdG1sKGN1cnJFbCwgY29tcG9uZW50LCBjdHgpXG4gICAgaWYgKCFkb250U2Nhbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyRWwuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgRG9tLnNjYW4oY3VyckVsLmNoaWxkcmVuW2ldLCBjdHguZGF0YSwgY3R4KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplciAoY29tcG9uZW50LCBjdHgsIGVsLCBkYXRhKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgY29tcG9uZW50LmluaXRpYWxpemUuY2FsbChjdHgsIGVsLCBkYXRhKVxuICB9XG59XG5cbmZ1bmN0aW9uIHNjYW4gKGVsLCBkYXRhLCBwYXJlbnQpIHtcbiAgdmFyIG1hdGNoZXMgPSBnZXRNYXRjaGluZ0VsZW1lbnRzKGVsKVxuICB2YXIgY29udGV4dHMgPSBbXVxuICB2YXIgaW5pdGlhbGl6ZXJzID0gW11cbiAgdmFyIGN1cnJFbFxuXG4gIHdoaWxlIChtYXRjaGVzLmxlbmd0aCkge1xuICAgIGN1cnJFbCA9IG1hdGNoZXMuc2hpZnQoKVxuICAgIHZhciByZWYgPSBnZXRFbGVtZW50Q29tcG9uZW50KGN1cnJFbClcbiAgICB2YXIgY29tcG9uZW50ID0gcmVmLmNvbXBvbmVudFxuICAgIHZhciBkZXB0aCA9IGdldEVsZW1lbnREZXB0aChjdXJyRWwsIGVsKVxuICAgIHZhciBwYXJlbnRDb250ZXh0ID0gZmluZFBhcmVudENvbnRleHQoY3VyckVsLCBjb250ZXh0cykgfHwgcGFyZW50XG4gICAgdmFyIHBhcmVudERhdGEgPSBwYXJlbnRDb250ZXh0ID8gcGFyZW50Q29udGV4dC5kYXRhIDogZGF0YVxuICAgIHZhciBlbERhdGEgPSBnZXRFbGVtZW50RGF0YShjdXJyRWwsIHJlZi5rZXksIHBhcmVudERhdGEpIHx8IHBhcmVudERhdGFcbiAgICB2YXIgY3R4ID0gY3JlYXRlQ29udGV4dChjdXJyRWwsIGVsRGF0YSwgY29tcG9uZW50LCBwYXJlbnRDb250ZXh0KVxuICAgIHZhciBkZWwgPSBjcmVhdGVFbGVtZW50RGVsZWdhdGUoY3VyckVsLCBjdHgsIGNvbXBvbmVudClcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdHguX18sICdkZWwnLCB7IHZhbHVlOiBkZWwgfSlcblxuICAgIGV4dGVuZChjdHgsIGNvbXBvbmVudClcblxuICAgIGNvbnRleHRzLnB1c2goeyBkZXB0aDogZGVwdGgsIGN0eDogY3R4IH0pXG5cbiAgICBpZiAoY29tcG9uZW50LmluaXRpYWxpemUpIHtcbiAgICAgIGluaXRpYWxpemVycy5wdXNoKGluaXRpYWxpemVyKGNvbXBvbmVudCwgY3R4LCBjdXJyRWwsIGVsRGF0YSkpXG4gICAgfVxuXG4gICAgaWYgKGNvbXBvbmVudC50ZW1wbGF0ZSkge1xuICAgICAgdmFyIHJlbmRlciA9IHJlbmRlcmVyKGN1cnJFbCwgY29tcG9uZW50LCBjdHgpXG4gICAgICByZW5kZXIodHJ1ZSlcbiAgICAgIHZhciBjaGlsZHJlbiA9IGdldE1hdGNoaW5nRWxlbWVudHMoY3VyckVsLCB0cnVlKVxuICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseShtYXRjaGVzLCBjaGlsZHJlbilcbiAgICAgIH1cbiAgICAgIGN0eC5fXy5yZW5kZXIgPSByZW5kZXJcbiAgICB9XG4gIH1cblxuICB2YXIgaSwgalxuICBmb3IgKGkgPSBjb250ZXh0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBhbGlhc0NvbnRleHQgPSBjb250ZXh0c1tpXS5jdHhcbiAgICB2YXIgYWxpYXNFbCA9IGFsaWFzQ29udGV4dC5fXy5lbFxuICAgIHZhciBhbGlhc2VzID0gYWxpYXNFbC5xdWVyeVNlbGVjdG9yQWxsKCdbYXNdOm5vdChbYXM9XCJcIl0pJylcbiAgICBmb3IgKGogPSAwOyBqIDwgYWxpYXNlcy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIGF0dHIgPSBhbGlhc2VzW2pdLmdldEF0dHJpYnV0ZSgnYXMnKVxuICAgICAgYWxpYXNDb250ZXh0W2F0dHJdID0gYWxpYXNlc1tqXVxuICAgICAgYWxpYXNlc1tqXS5yZW1vdmVBdHRyaWJ1dGUoJ2FzJylcbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgaW5pdGlhbGl6ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgaW5pdGlhbGl6ZXJzW2ldKClcbiAgfVxufVxuXG52YXIgRG9tID0gT2JqZWN0LmNyZWF0ZSh7fSwge1xuICBfcmVnaXN0ZXI6IHsgdmFsdWU6IHJlZ2lzdGVyIH0sXG4gIHJlZ2lzdGVyOiB7IHZhbHVlOiByZWdpc3RlckNvbXBvbmVudCB9LFxuICBzY2FuOiB7IHZhbHVlOiBzY2FuIH1cbn0pXG5cbm1vZHVsZS5leHBvcnRzID0gRG9tXG4iLCIvKmpzaGludCBicm93c2VyOnRydWUsIG5vZGU6dHJ1ZSovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBEZWxlZ2F0ZTtcblxuLyoqXG4gKiBET00gZXZlbnQgZGVsZWdhdG9yXG4gKlxuICogVGhlIGRlbGVnYXRvciB3aWxsIGxpc3RlblxuICogZm9yIGV2ZW50cyB0aGF0IGJ1YmJsZSB1cFxuICogdG8gdGhlIHJvb3Qgbm9kZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7Tm9kZXxzdHJpbmd9IFtyb290XSBUaGUgcm9vdCBub2RlIG9yIGEgc2VsZWN0b3Igc3RyaW5nIG1hdGNoaW5nIHRoZSByb290IG5vZGVcbiAqL1xuZnVuY3Rpb24gRGVsZWdhdGUocm9vdCkge1xuXG4gIC8qKlxuICAgKiBNYWludGFpbiBhIG1hcCBvZiBsaXN0ZW5lclxuICAgKiBsaXN0cywga2V5ZWQgYnkgZXZlbnQgbmFtZS5cbiAgICpcbiAgICogQHR5cGUgT2JqZWN0XG4gICAqL1xuICB0aGlzLmxpc3RlbmVyTWFwID0gW3t9LCB7fV07XG4gIGlmIChyb290KSB7XG4gICAgdGhpcy5yb290KHJvb3QpO1xuICB9XG5cbiAgLyoqIEB0eXBlIGZ1bmN0aW9uKCkgKi9cbiAgdGhpcy5oYW5kbGUgPSBEZWxlZ2F0ZS5wcm90b3R5cGUuaGFuZGxlLmJpbmQodGhpcyk7XG59XG5cbi8qKlxuICogU3RhcnQgbGlzdGVuaW5nIGZvciBldmVudHNcbiAqIG9uIHRoZSBwcm92aWRlZCBET00gZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge05vZGV8c3RyaW5nfSBbcm9vdF0gVGhlIHJvb3Qgbm9kZSBvciBhIHNlbGVjdG9yIHN0cmluZyBtYXRjaGluZyB0aGUgcm9vdCBub2RlXG4gKiBAcmV0dXJucyB7RGVsZWdhdGV9IFRoaXMgbWV0aG9kIGlzIGNoYWluYWJsZVxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUucm9vdCA9IGZ1bmN0aW9uKHJvb3QpIHtcbiAgdmFyIGxpc3RlbmVyTWFwID0gdGhpcy5saXN0ZW5lck1hcDtcbiAgdmFyIGV2ZW50VHlwZTtcblxuICAvLyBSZW1vdmUgbWFzdGVyIGV2ZW50IGxpc3RlbmVyc1xuICBpZiAodGhpcy5yb290RWxlbWVudCkge1xuICAgIGZvciAoZXZlbnRUeXBlIGluIGxpc3RlbmVyTWFwWzFdKSB7XG4gICAgICBpZiAobGlzdGVuZXJNYXBbMV0uaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSkge1xuICAgICAgICB0aGlzLnJvb3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoZXZlbnRUeXBlIGluIGxpc3RlbmVyTWFwWzBdKSB7XG4gICAgICBpZiAobGlzdGVuZXJNYXBbMF0uaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSkge1xuICAgICAgICB0aGlzLnJvb3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIElmIG5vIHJvb3Qgb3Igcm9vdCBpcyBub3RcbiAgLy8gYSBkb20gbm9kZSwgdGhlbiByZW1vdmUgaW50ZXJuYWxcbiAgLy8gcm9vdCByZWZlcmVuY2UgYW5kIGV4aXQgaGVyZVxuICBpZiAoIXJvb3QgfHwgIXJvb3QuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLnJvb3RFbGVtZW50KSB7XG4gICAgICBkZWxldGUgdGhpcy5yb290RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJvb3Qgbm9kZSBhdCB3aGljaFxuICAgKiBsaXN0ZW5lcnMgYXJlIGF0dGFjaGVkLlxuICAgKlxuICAgKiBAdHlwZSBOb2RlXG4gICAqL1xuICB0aGlzLnJvb3RFbGVtZW50ID0gcm9vdDtcblxuICAvLyBTZXQgdXAgbWFzdGVyIGV2ZW50IGxpc3RlbmVyc1xuICBmb3IgKGV2ZW50VHlwZSBpbiBsaXN0ZW5lck1hcFsxXSkge1xuICAgIGlmIChsaXN0ZW5lck1hcFsxXS5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKSB7XG4gICAgICB0aGlzLnJvb3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIGZvciAoZXZlbnRUeXBlIGluIGxpc3RlbmVyTWFwWzBdKSB7XG4gICAgaWYgKGxpc3RlbmVyTWFwWzBdLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpIHtcbiAgICAgIHRoaXMucm9vdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIHRoaXMuaGFuZGxlLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGVcbiAqIEByZXR1cm5zIGJvb2xlYW5cbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLmNhcHR1cmVGb3JUeXBlID0gZnVuY3Rpb24oZXZlbnRUeXBlKSB7XG4gIHJldHVybiBbJ2JsdXInLCAnZXJyb3InLCAnZm9jdXMnLCAnbG9hZCcsICdyZXNpemUnLCAnc2Nyb2xsJ10uaW5kZXhPZihldmVudFR5cGUpICE9PSAtMTtcbn07XG5cbi8qKlxuICogQXR0YWNoIGEgaGFuZGxlciB0byBvbmVcbiAqIGV2ZW50IGZvciBhbGwgZWxlbWVudHNcbiAqIHRoYXQgbWF0Y2ggdGhlIHNlbGVjdG9yLFxuICogbm93IG9yIGluIHRoZSBmdXR1cmVcbiAqXG4gKiBUaGUgaGFuZGxlciBmdW5jdGlvbiByZWNlaXZlc1xuICogdGhyZWUgYXJndW1lbnRzOiB0aGUgRE9NIGV2ZW50XG4gKiBvYmplY3QsIHRoZSBub2RlIHRoYXQgbWF0Y2hlZFxuICogdGhlIHNlbGVjdG9yIHdoaWxlIHRoZSBldmVudFxuICogd2FzIGJ1YmJsaW5nIGFuZCBhIHJlZmVyZW5jZVxuICogdG8gaXRzZWxmLiBXaXRoaW4gdGhlIGhhbmRsZXIsXG4gKiAndGhpcycgaXMgZXF1YWwgdG8gdGhlIHNlY29uZFxuICogYXJndW1lbnQuXG4gKlxuICogVGhlIG5vZGUgdGhhdCBhY3R1YWxseSByZWNlaXZlZFxuICogdGhlIGV2ZW50IGNhbiBiZSBhY2Nlc3NlZCB2aWFcbiAqICdldmVudC50YXJnZXQnLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgTGlzdGVuIGZvciB0aGVzZSBldmVudHNcbiAqIEBwYXJhbSB7c3RyaW5nfHVuZGVmaW5lZH0gc2VsZWN0b3IgT25seSBoYW5kbGUgZXZlbnRzIG9uIGVsZW1lbnRzIG1hdGNoaW5nIHRoaXMgc2VsZWN0b3IsIGlmIHVuZGVmaW5lZCBtYXRjaCByb290IGVsZW1lbnRcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gaGFuZGxlciBIYW5kbGVyIGZ1bmN0aW9uIC0gZXZlbnQgZGF0YSBwYXNzZWQgaGVyZSB3aWxsIGJlIGluIGV2ZW50LmRhdGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBbZXZlbnREYXRhXSBEYXRhIHRvIHBhc3MgaW4gZXZlbnQuZGF0YVxuICogQHJldHVybnMge0RlbGVnYXRlfSBUaGlzIG1ldGhvZCBpcyBjaGFpbmFibGVcbiAqL1xuRGVsZWdhdGUucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBzZWxlY3RvciwgaGFuZGxlciwgdXNlQ2FwdHVyZSkge1xuICB2YXIgcm9vdCwgbGlzdGVuZXJNYXAsIG1hdGNoZXIsIG1hdGNoZXJQYXJhbTtcblxuICBpZiAoIWV2ZW50VHlwZSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgZXZlbnQgdHlwZTogJyArIGV2ZW50VHlwZSk7XG4gIH1cblxuICAvLyBoYW5kbGVyIGNhbiBiZSBwYXNzZWQgYXNcbiAgLy8gdGhlIHNlY29uZCBvciB0aGlyZCBhcmd1bWVudFxuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdXNlQ2FwdHVyZSA9IGhhbmRsZXI7XG4gICAgaGFuZGxlciA9IHNlbGVjdG9yO1xuICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgfVxuXG4gIC8vIEZhbGxiYWNrIHRvIHNlbnNpYmxlIGRlZmF1bHRzXG4gIC8vIGlmIHVzZUNhcHR1cmUgbm90IHNldFxuICBpZiAodXNlQ2FwdHVyZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdXNlQ2FwdHVyZSA9IHRoaXMuY2FwdHVyZUZvclR5cGUoZXZlbnRUeXBlKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0hhbmRsZXIgbXVzdCBiZSBhIHR5cGUgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIHJvb3QgPSB0aGlzLnJvb3RFbGVtZW50O1xuICBsaXN0ZW5lck1hcCA9IHRoaXMubGlzdGVuZXJNYXBbdXNlQ2FwdHVyZSA/IDEgOiAwXTtcblxuICAvLyBBZGQgbWFzdGVyIGhhbmRsZXIgZm9yIHR5cGUgaWYgbm90IGNyZWF0ZWQgeWV0XG4gIGlmICghbGlzdGVuZXJNYXBbZXZlbnRUeXBlXSkge1xuICAgIGlmIChyb290KSB7XG4gICAgICByb290LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgdXNlQ2FwdHVyZSk7XG4gICAgfVxuICAgIGxpc3RlbmVyTWFwW2V2ZW50VHlwZV0gPSBbXTtcbiAgfVxuXG4gIGlmICghc2VsZWN0b3IpIHtcbiAgICBtYXRjaGVyUGFyYW0gPSBudWxsO1xuXG4gICAgLy8gQ09NUExFWCAtIG1hdGNoZXNSb290IG5lZWRzIHRvIGhhdmUgYWNjZXNzIHRvXG4gICAgLy8gdGhpcy5yb290RWxlbWVudCwgc28gYmluZCB0aGUgZnVuY3Rpb24gdG8gdGhpcy5cbiAgICBtYXRjaGVyID0gbWF0Y2hlc1Jvb3QuYmluZCh0aGlzKTtcblxuICAvLyBDb21waWxlIGEgbWF0Y2hlciBmb3IgdGhlIGdpdmVuIHNlbGVjdG9yXG4gIH0gZWxzZSBpZiAoL15bYS16XSskL2kudGVzdChzZWxlY3RvcikpIHtcbiAgICBtYXRjaGVyUGFyYW0gPSBzZWxlY3RvcjtcbiAgICBtYXRjaGVyID0gbWF0Y2hlc1RhZztcbiAgfSBlbHNlIGlmICgvXiNbYS16MC05XFwtX10rJC9pLnRlc3Qoc2VsZWN0b3IpKSB7XG4gICAgbWF0Y2hlclBhcmFtID0gc2VsZWN0b3Iuc2xpY2UoMSk7XG4gICAgbWF0Y2hlciA9IG1hdGNoZXNJZDtcbiAgfSBlbHNlIHtcbiAgICBtYXRjaGVyUGFyYW0gPSBzZWxlY3RvcjtcbiAgICBtYXRjaGVyID0gbWF0Y2hlcztcbiAgfVxuXG4gIC8vIEFkZCB0byB0aGUgbGlzdCBvZiBsaXN0ZW5lcnNcbiAgbGlzdGVuZXJNYXBbZXZlbnRUeXBlXS5wdXNoKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICBtYXRjaGVyOiBtYXRjaGVyLFxuICAgIG1hdGNoZXJQYXJhbTogbWF0Y2hlclBhcmFtXG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gZXZlbnQgaGFuZGxlclxuICogZm9yIGVsZW1lbnRzIHRoYXQgbWF0Y2hcbiAqIHRoZSBzZWxlY3RvciwgZm9yZXZlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbZXZlbnRUeXBlXSBSZW1vdmUgaGFuZGxlcnMgZm9yIGV2ZW50cyBtYXRjaGluZyB0aGlzIHR5cGUsIGNvbnNpZGVyaW5nIHRoZSBvdGhlciBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge3N0cmluZ30gW3NlbGVjdG9yXSBJZiB0aGlzIHBhcmFtZXRlciBpcyBvbWl0dGVkLCBvbmx5IGhhbmRsZXJzIHdoaWNoIG1hdGNoIHRoZSBvdGhlciB0d28gd2lsbCBiZSByZW1vdmVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCl9IFtoYW5kbGVyXSBJZiB0aGlzIHBhcmFtZXRlciBpcyBvbWl0dGVkLCBvbmx5IGhhbmRsZXJzIHdoaWNoIG1hdGNoIHRoZSBwcmV2aW91cyB0d28gd2lsbCBiZSByZW1vdmVkXG4gKiBAcmV0dXJucyB7RGVsZWdhdGV9IFRoaXMgbWV0aG9kIGlzIGNoYWluYWJsZVxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBzZWxlY3RvciwgaGFuZGxlciwgdXNlQ2FwdHVyZSkge1xuICB2YXIgaSwgbGlzdGVuZXIsIGxpc3RlbmVyTWFwLCBsaXN0ZW5lckxpc3QsIHNpbmdsZUV2ZW50VHlwZTtcblxuICAvLyBIYW5kbGVyIGNhbiBiZSBwYXNzZWQgYXNcbiAgLy8gdGhlIHNlY29uZCBvciB0aGlyZCBhcmd1bWVudFxuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdXNlQ2FwdHVyZSA9IGhhbmRsZXI7XG4gICAgaGFuZGxlciA9IHNlbGVjdG9yO1xuICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgfVxuXG4gIC8vIElmIHVzZUNhcHR1cmUgbm90IHNldCwgcmVtb3ZlXG4gIC8vIGFsbCBldmVudCBsaXN0ZW5lcnNcbiAgaWYgKHVzZUNhcHR1cmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMub2ZmKGV2ZW50VHlwZSwgc2VsZWN0b3IsIGhhbmRsZXIsIHRydWUpO1xuICAgIHRoaXMub2ZmKGV2ZW50VHlwZSwgc2VsZWN0b3IsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVyTWFwID0gdGhpcy5saXN0ZW5lck1hcFt1c2VDYXB0dXJlID8gMSA6IDBdO1xuICBpZiAoIWV2ZW50VHlwZSkge1xuICAgIGZvciAoc2luZ2xlRXZlbnRUeXBlIGluIGxpc3RlbmVyTWFwKSB7XG4gICAgICBpZiAobGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkoc2luZ2xlRXZlbnRUeXBlKSkge1xuICAgICAgICB0aGlzLm9mZihzaW5nbGVFdmVudFR5cGUsIHNlbGVjdG9yLCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVyTGlzdCA9IGxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG4gIGlmICghbGlzdGVuZXJMaXN0IHx8ICFsaXN0ZW5lckxpc3QubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBSZW1vdmUgb25seSBwYXJhbWV0ZXIgbWF0Y2hlc1xuICAvLyBpZiBzcGVjaWZpZWRcbiAgZm9yIChpID0gbGlzdGVuZXJMaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGlzdGVuZXIgPSBsaXN0ZW5lckxpc3RbaV07XG5cbiAgICBpZiAoKCFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gbGlzdGVuZXIuc2VsZWN0b3IpICYmICghaGFuZGxlciB8fCBoYW5kbGVyID09PSBsaXN0ZW5lci5oYW5kbGVyKSkge1xuICAgICAgbGlzdGVuZXJMaXN0LnNwbGljZShpLCAxKTtcbiAgICB9XG4gIH1cblxuICAvLyBBbGwgbGlzdGVuZXJzIHJlbW92ZWRcbiAgaWYgKCFsaXN0ZW5lckxpc3QubGVuZ3RoKSB7XG4gICAgZGVsZXRlIGxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG5cbiAgICAvLyBSZW1vdmUgdGhlIG1haW4gaGFuZGxlclxuICAgIGlmICh0aGlzLnJvb3RFbGVtZW50KSB7XG4gICAgICB0aGlzLnJvb3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB0aGlzLmhhbmRsZSwgdXNlQ2FwdHVyZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogSGFuZGxlIGFuIGFyYml0cmFyeSBldmVudC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUuaGFuZGxlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgdmFyIGksIGwsIHR5cGUgPSBldmVudC50eXBlLCByb290LCBwaGFzZSwgbGlzdGVuZXIsIHJldHVybmVkLCBsaXN0ZW5lckxpc3QgPSBbXSwgdGFyZ2V0LCAvKiogQGNvbnN0ICovIEVWRU5USUdOT1JFID0gJ2Z0TGFic0RlbGVnYXRlSWdub3JlJztcblxuICBpZiAoZXZlbnRbRVZFTlRJR05PUkVdID09PSB0cnVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXG4gIC8vIEhhcmRjb2RlIHZhbHVlIG9mIE5vZGUuVEVYVF9OT0RFXG4gIC8vIGFzIG5vdCBkZWZpbmVkIGluIElFOFxuICBpZiAodGFyZ2V0Lm5vZGVUeXBlID09PSAzKSB7XG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gIH1cblxuICByb290ID0gdGhpcy5yb290RWxlbWVudDtcblxuICBwaGFzZSA9IGV2ZW50LmV2ZW50UGhhc2UgfHwgKCBldmVudC50YXJnZXQgIT09IGV2ZW50LmN1cnJlbnRUYXJnZXQgPyAzIDogMiApO1xuICBcbiAgc3dpdGNoIChwaGFzZSkge1xuICAgIGNhc2UgMTogLy9FdmVudC5DQVBUVVJJTkdfUEhBU0U6XG4gICAgICBsaXN0ZW5lckxpc3QgPSB0aGlzLmxpc3RlbmVyTWFwWzFdW3R5cGVdO1xuICAgIGJyZWFrO1xuICAgIGNhc2UgMjogLy9FdmVudC5BVF9UQVJHRVQ6XG4gICAgICBpZiAodGhpcy5saXN0ZW5lck1hcFswXSAmJiB0aGlzLmxpc3RlbmVyTWFwWzBdW3R5cGVdKSBsaXN0ZW5lckxpc3QgPSBsaXN0ZW5lckxpc3QuY29uY2F0KHRoaXMubGlzdGVuZXJNYXBbMF1bdHlwZV0pO1xuICAgICAgaWYgKHRoaXMubGlzdGVuZXJNYXBbMV0gJiYgdGhpcy5saXN0ZW5lck1hcFsxXVt0eXBlXSkgbGlzdGVuZXJMaXN0ID0gbGlzdGVuZXJMaXN0LmNvbmNhdCh0aGlzLmxpc3RlbmVyTWFwWzFdW3R5cGVdKTtcbiAgICBicmVhaztcbiAgICBjYXNlIDM6IC8vRXZlbnQuQlVCQkxJTkdfUEhBU0U6XG4gICAgICBsaXN0ZW5lckxpc3QgPSB0aGlzLmxpc3RlbmVyTWFwWzBdW3R5cGVdO1xuICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gTmVlZCB0byBjb250aW51b3VzbHkgY2hlY2tcbiAgLy8gdGhhdCB0aGUgc3BlY2lmaWMgbGlzdCBpc1xuICAvLyBzdGlsbCBwb3B1bGF0ZWQgaW4gY2FzZSBvbmVcbiAgLy8gb2YgdGhlIGNhbGxiYWNrcyBhY3R1YWxseVxuICAvLyBjYXVzZXMgdGhlIGxpc3QgdG8gYmUgZGVzdHJveWVkLlxuICBsID0gbGlzdGVuZXJMaXN0Lmxlbmd0aDtcbiAgd2hpbGUgKHRhcmdldCAmJiBsKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lckxpc3RbaV07XG5cbiAgICAgIC8vIEJhaWwgZnJvbSB0aGlzIGxvb3AgaWZcbiAgICAgIC8vIHRoZSBsZW5ndGggY2hhbmdlZCBhbmRcbiAgICAgIC8vIG5vIG1vcmUgbGlzdGVuZXJzIGFyZVxuICAgICAgLy8gZGVmaW5lZCBiZXR3ZWVuIGkgYW5kIGwuXG4gICAgICBpZiAoIWxpc3RlbmVyKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBmb3IgbWF0Y2ggYW5kIGZpcmVcbiAgICAgIC8vIHRoZSBldmVudCBpZiB0aGVyZSdzIG9uZVxuICAgICAgLy9cbiAgICAgIC8vIFRPRE86TUNHOjIwMTIwMTE3OiBOZWVkIGEgd2F5XG4gICAgICAvLyB0byBjaGVjayBpZiBldmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25cbiAgICAgIC8vIHdhcyBjYWxsZWQuIElmIHNvLCBicmVhayBib3RoIGxvb3BzLlxuICAgICAgaWYgKGxpc3RlbmVyLm1hdGNoZXIuY2FsbCh0YXJnZXQsIGxpc3RlbmVyLm1hdGNoZXJQYXJhbSwgdGFyZ2V0KSkge1xuICAgICAgICByZXR1cm5lZCA9IHRoaXMuZmlyZShldmVudCwgdGFyZ2V0LCBsaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIC8vIFN0b3AgcHJvcGFnYXRpb24gdG8gc3Vic2VxdWVudFxuICAgICAgLy8gY2FsbGJhY2tzIGlmIHRoZSBjYWxsYmFjayByZXR1cm5lZFxuICAgICAgLy8gZmFsc2VcbiAgICAgIGlmIChyZXR1cm5lZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgZXZlbnRbRVZFTlRJR05PUkVdID0gdHJ1ZTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE86TUNHOjIwMTIwMTE3OiBOZWVkIGEgd2F5IHRvXG4gICAgLy8gY2hlY2sgaWYgZXZlbnQjc3RvcFByb3BhZ2F0aW9uXG4gICAgLy8gd2FzIGNhbGxlZC4gSWYgc28sIGJyZWFrIGxvb3BpbmdcbiAgICAvLyB0aHJvdWdoIHRoZSBET00uIFN0b3AgaWYgdGhlXG4gICAgLy8gZGVsZWdhdGlvbiByb290IGhhcyBiZWVuIHJlYWNoZWRcbiAgICBpZiAodGFyZ2V0ID09PSByb290KSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBsID0gbGlzdGVuZXJMaXN0Lmxlbmd0aDtcbiAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgfVxufTtcblxuLyoqXG4gKiBGaXJlIGEgbGlzdGVuZXIgb24gYSB0YXJnZXQuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge09iamVjdH0gbGlzdGVuZXJcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5EZWxlZ2F0ZS5wcm90b3R5cGUuZmlyZSA9IGZ1bmN0aW9uKGV2ZW50LCB0YXJnZXQsIGxpc3RlbmVyKSB7XG4gIHJldHVybiBsaXN0ZW5lci5oYW5kbGVyLmNhbGwodGFyZ2V0LCBldmVudCwgdGFyZ2V0KTtcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBlbGVtZW50XG4gKiBtYXRjaGVzIGEgZ2VuZXJpYyBzZWxlY3Rvci5cbiAqXG4gKiBAdHlwZSBmdW5jdGlvbigpXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgQSBDU1Mgc2VsZWN0b3JcbiAqL1xudmFyIG1hdGNoZXMgPSAoZnVuY3Rpb24oZWwpIHtcbiAgaWYgKCFlbCkgcmV0dXJuO1xuICB2YXIgcCA9IGVsLnByb3RvdHlwZTtcbiAgcmV0dXJuIChwLm1hdGNoZXMgfHwgcC5tYXRjaGVzU2VsZWN0b3IgfHwgcC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgcC5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgcC5tc01hdGNoZXNTZWxlY3RvciB8fCBwLm9NYXRjaGVzU2VsZWN0b3IpO1xufShFbGVtZW50KSk7XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBlbGVtZW50XG4gKiBtYXRjaGVzIGEgdGFnIHNlbGVjdG9yLlxuICpcbiAqIFRhZ3MgYXJlIE5PVCBjYXNlLXNlbnNpdGl2ZSxcbiAqIGV4Y2VwdCBpbiBYTUwgKGFuZCBYTUwtYmFzZWRcbiAqIGxhbmd1YWdlcyBzdWNoIGFzIFhIVE1MKS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnTmFtZSBUaGUgdGFnIG5hbWUgdG8gdGVzdCBhZ2FpbnN0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdGVzdCB3aXRoXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNUYWcodGFnTmFtZSwgZWxlbWVudCkge1xuICByZXR1cm4gdGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIGVsZW1lbnRcbiAqIG1hdGNoZXMgdGhlIHJvb3QuXG4gKlxuICogQHBhcmFtIHs/U3RyaW5nfSBzZWxlY3RvciBJbiB0aGlzIGNhc2UgdGhpcyBpcyBhbHdheXMgcGFzc2VkIHRocm91Z2ggYXMgbnVsbCBhbmQgbm90IHVzZWRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byB0ZXN0IHdpdGhcbiAqIEByZXR1cm5zIGJvb2xlYW5cbiAqL1xuZnVuY3Rpb24gbWF0Y2hlc1Jvb3Qoc2VsZWN0b3IsIGVsZW1lbnQpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUqL1xuICBpZiAodGhpcy5yb290RWxlbWVudCA9PT0gd2luZG93KSByZXR1cm4gZWxlbWVudCA9PT0gZG9jdW1lbnQ7XG4gIHJldHVybiB0aGlzLnJvb3RFbGVtZW50ID09PSBlbGVtZW50O1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIElEIG9mXG4gKiB0aGUgZWxlbWVudCBpbiAndGhpcydcbiAqIG1hdGNoZXMgdGhlIGdpdmVuIElELlxuICpcbiAqIElEcyBhcmUgY2FzZS1zZW5zaXRpdmUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCB0byB0ZXN0IGFnYWluc3RcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byB0ZXN0IHdpdGhcbiAqIEByZXR1cm5zIGJvb2xlYW5cbiAqL1xuZnVuY3Rpb24gbWF0Y2hlc0lkKGlkLCBlbGVtZW50KSB7XG4gIHJldHVybiBpZCA9PT0gZWxlbWVudC5pZDtcbn1cblxuLyoqXG4gKiBTaG9ydCBoYW5kIGZvciBvZmYoKVxuICogYW5kIHJvb3QoKSwgaWUgYm90aFxuICogd2l0aCBubyBwYXJhbWV0ZXJzXG4gKlxuICogQHJldHVybiB2b2lkXG4gKi9cbkRlbGVnYXRlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub2ZmKCk7XG4gIHRoaXMucm9vdCgpO1xufTtcbiIsIi8qanNoaW50IGJyb3dzZXI6dHJ1ZSwgbm9kZTp0cnVlKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwcmVzZXJ2ZSBDcmVhdGUgYW5kIG1hbmFnZSBhIERPTSBldmVudCBkZWxlZ2F0b3IuXG4gKlxuICogQHZlcnNpb24gMC4zLjBcbiAqIEBjb2RpbmdzdGFuZGFyZCBmdGxhYnMtanN2MlxuICogQGNvcHlyaWdodCBUaGUgRmluYW5jaWFsIFRpbWVzIExpbWl0ZWQgW0FsbCBSaWdodHMgUmVzZXJ2ZWRdXG4gKiBAbGljZW5zZSBNSVQgTGljZW5zZSAoc2VlIExJQ0VOU0UudHh0KVxuICovXG52YXIgRGVsZWdhdGUgPSByZXF1aXJlKCcuL2RlbGVnYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocm9vdCkge1xuICByZXR1cm4gbmV3IERlbGVnYXRlKHJvb3QpO1xufTtcblxubW9kdWxlLmV4cG9ydHMuRGVsZWdhdGUgPSBEZWxlZ2F0ZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZ2V0O1xuXG5mdW5jdGlvbiBnZXQgKGNvbnRleHQsIHBhdGgpIHtcbiAgaWYgKHBhdGguaW5kZXhPZignLicpID09IC0xICYmIHBhdGguaW5kZXhPZignWycpID09IC0xKSB7XG4gICAgcmV0dXJuIGNvbnRleHRbcGF0aF07XG4gIH1cblxuICB2YXIgY3J1bWJzID0gcGF0aC5zcGxpdCgvXFwufFxcW3xcXF0vZyk7XG4gIHZhciBpID0gLTE7XG4gIHZhciBsZW4gPSBjcnVtYnMubGVuZ3RoO1xuICB2YXIgcmVzdWx0O1xuXG4gIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICBpZiAoaSA9PSAwKSByZXN1bHQgPSBjb250ZXh0O1xuICAgIGlmICghY3J1bWJzW2ldKSBjb250aW51ZTtcbiAgICBpZiAocmVzdWx0ID09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgcmVzdWx0ID0gcmVzdWx0W2NydW1ic1tpXV07XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9zdXBlcm1vZGVscycpO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJylcbnZhciBjcmVhdGVXcmFwcGVyRmFjdG9yeSA9IHJlcXVpcmUoJy4vZmFjdG9yeScpXG5cbmZ1bmN0aW9uIHJlc29sdmUgKGZyb20pIHtcbiAgdmFyIGlzQ3RvciA9IHV0aWwuaXNDb25zdHJ1Y3Rvcihmcm9tKVxuICB2YXIgaXNTdXBlcm1vZGVsQ3RvciA9IHV0aWwuaXNTdXBlcm1vZGVsQ29uc3RydWN0b3IoZnJvbSlcbiAgdmFyIGlzQXJyYXkgPSB1dGlsLmlzQXJyYXkoZnJvbSlcblxuICBpZiAoaXNDdG9yIHx8IGlzU3VwZXJtb2RlbEN0b3IgfHwgaXNBcnJheSkge1xuICAgIHJldHVybiB7XG4gICAgICBfX3R5cGU6IGZyb21cbiAgICB9XG4gIH1cblxuICB2YXIgaXNWYWx1ZSA9ICF1dGlsLmlzT2JqZWN0KGZyb20pXG4gIGlmIChpc1ZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIF9fdmFsdWU6IGZyb21cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnJvbVxufVxuXG5mdW5jdGlvbiBjcmVhdGVEZWYgKGZyb20pIHtcbiAgZnJvbSA9IHJlc29sdmUoZnJvbSlcblxuICB2YXIgX19WQUxJREFUT1JTID0gJ19fdmFsaWRhdG9ycydcbiAgdmFyIF9fVkFMVUUgPSAnX192YWx1ZSdcbiAgdmFyIF9fVFlQRSA9ICdfX3R5cGUnXG4gIHZhciBfX0RJU1BMQVlOQU1FID0gJ19fZGlzcGxheU5hbWUnXG4gIHZhciBfX0dFVCA9ICdfX2dldCdcbiAgdmFyIF9fU0VUID0gJ19fc2V0J1xuICB2YXIgX19FTlVNRVJBQkxFID0gJ19fZW51bWVyYWJsZSdcbiAgdmFyIF9fQ09ORklHVVJBQkxFID0gJ19fY29uZmlndXJhYmxlJ1xuICB2YXIgX19XUklUQUJMRSA9ICdfX3dyaXRhYmxlJ1xuICB2YXIgX19TUEVDSUFMX1BST1BTID0gW1xuICAgIF9fVkFMSURBVE9SUywgX19WQUxVRSwgX19UWVBFLCBfX0RJU1BMQVlOQU1FLFxuICAgIF9fR0VULCBfX1NFVCwgX19FTlVNRVJBQkxFLCBfX0NPTkZJR1VSQUJMRSwgX19XUklUQUJMRVxuICBdXG5cbiAgdmFyIGRlZiA9IHtcbiAgICBmcm9tOiBmcm9tLFxuICAgIHR5cGU6IGZyb21bX19UWVBFXSxcbiAgICB2YWx1ZTogZnJvbVtfX1ZBTFVFXSxcbiAgICB2YWxpZGF0b3JzOiBmcm9tW19fVkFMSURBVE9SU10gfHwgW10sXG4gICAgZW51bWVyYWJsZTogZnJvbVtfX0VOVU1FUkFCTEVdICE9PSBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6ICEhZnJvbVtfX0NPTkZJR1VSQUJMRV0sXG4gICAgd3JpdGFibGU6IGZyb21bX19XUklUQUJMRV0gIT09IGZhbHNlLFxuICAgIGRpc3BsYXlOYW1lOiBmcm9tW19fRElTUExBWU5BTUVdLFxuICAgIGdldHRlcjogZnJvbVtfX0dFVF0sXG4gICAgc2V0dGVyOiBmcm9tW19fU0VUXVxuICB9XG5cbiAgdmFyIHR5cGUgPSBkZWYudHlwZVxuXG4gIC8vIFNpbXBsZSAnQ29uc3RydWN0b3InIFR5cGVcbiAgaWYgKHV0aWwuaXNTaW1wbGVDb25zdHJ1Y3Rvcih0eXBlKSkge1xuICAgIGRlZi5pc1NpbXBsZSA9IHRydWVcblxuICAgIGRlZi5jYXN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdXRpbC5jYXN0KHZhbHVlLCB0eXBlKVxuICAgIH1cbiAgfSBlbHNlIGlmICh1dGlsLmlzU3VwZXJtb2RlbENvbnN0cnVjdG9yKHR5cGUpKSB7XG4gICAgZGVmLmlzUmVmZXJlbmNlID0gdHJ1ZVxuICB9IGVsc2UgaWYgKGRlZi52YWx1ZSkge1xuICAgIC8vIElmIGEgdmFsdWUgaXMgcHJlc2VudCwgdXNlXG4gICAgLy8gdGhhdCBhbmQgc2hvcnQtY2lyY3VpdCB0aGUgcmVzdFxuICAgIGRlZi5pc1NpbXBsZSA9IHRydWVcbiAgfSBlbHNlIHtcbiAgICAvLyBPdGhlcndpc2UgbG9vayBmb3Igb3RoZXIgbm9uLXNwZWNpYWxcbiAgICAvLyBrZXlzIGFuZCBhbHNvIGFueSBpdGVtIGRlZmluaXRpb25cbiAgICAvLyBpbiB0aGUgY2FzZSBvZiBBcnJheXNcblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZnJvbSlcbiAgICB2YXIgY2hpbGRLZXlzID0ga2V5cy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBfX1NQRUNJQUxfUFJPUFMuaW5kZXhPZihpdGVtKSA9PT0gLTFcbiAgICB9KVxuXG4gICAgaWYgKGNoaWxkS2V5cy5sZW5ndGgpIHtcbiAgICAgIHZhciBkZWZzID0ge31cbiAgICAgIHZhciBwcm90b1xuXG4gICAgICBjaGlsZEtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihmcm9tLCBrZXkpXG4gICAgICAgIHZhciB2YWx1ZVxuXG4gICAgICAgIGlmIChkZXNjcmlwdG9yLmdldCB8fCBkZXNjcmlwdG9yLnNldCkge1xuICAgICAgICAgIHZhbHVlID0ge1xuICAgICAgICAgICAgX19nZXQ6IGRlc2NyaXB0b3IuZ2V0LFxuICAgICAgICAgICAgX19zZXQ6IGRlc2NyaXB0b3Iuc2V0XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gZnJvbVtrZXldXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXV0aWwuaXNDb25zdHJ1Y3Rvcih2YWx1ZSkgJiYgIXV0aWwuaXNTdXBlcm1vZGVsQ29uc3RydWN0b3IodmFsdWUpICYmIHV0aWwuaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgICBpZiAoIXByb3RvKSB7XG4gICAgICAgICAgICBwcm90byA9IHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIHByb3RvW2tleV0gPSB2YWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlZnNba2V5XSA9IGNyZWF0ZURlZih2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgZGVmLmRlZnMgPSBkZWZzXG4gICAgICBkZWYucHJvdG8gPSBwcm90b1xuXG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIEFycmF5XG4gICAgaWYgKHR5cGUgPT09IEFycmF5IHx8IHV0aWwuaXNBcnJheSh0eXBlKSkge1xuICAgICAgZGVmLmlzQXJyYXkgPSB0cnVlXG5cbiAgICAgIGlmICh0eXBlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGVmLmRlZiA9IGNyZWF0ZURlZih0eXBlWzBdKVxuICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChjaGlsZEtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBkZWYuaXNTaW1wbGUgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgZGVmLmNyZWF0ZSA9IGNyZWF0ZVdyYXBwZXJGYWN0b3J5KGRlZilcblxuICByZXR1cm4gZGVmXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRGVmXG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdmFyIGFyciA9IFtdXG5cbiAgLyoqXG4gICAqIFByb3hpZWQgYXJyYXkgbXV0YXRvcnMgbWV0aG9kc1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuICB2YXIgcG9wID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBBcnJheS5wcm90b3R5cGUucG9wLmFwcGx5KGFycilcblxuICAgIGNhbGxiYWNrKCdwb3AnLCBhcnIsIHtcbiAgICAgIHZhbHVlOiByZXN1bHRcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG4gIHZhciBwdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShhcnIsIGFyZ3VtZW50cylcblxuICAgIGNhbGxiYWNrKCdwdXNoJywgYXJyLCB7XG4gICAgICB2YWx1ZTogcmVzdWx0XG4gICAgfSlcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuICB2YXIgc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseShhcnIpXG5cbiAgICBjYWxsYmFjaygnc2hpZnQnLCBhcnIsIHtcbiAgICAgIHZhbHVlOiByZXN1bHRcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG4gIHZhciBzb3J0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBBcnJheS5wcm90b3R5cGUuc29ydC5hcHBseShhcnIsIGFyZ3VtZW50cylcblxuICAgIGNhbGxiYWNrKCdzb3J0JywgYXJyLCB7XG4gICAgICB2YWx1ZTogcmVzdWx0XG4gICAgfSlcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuICB2YXIgdW5zaGlmdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoYXJyLCBhcmd1bWVudHMpXG5cbiAgICBjYWxsYmFjaygndW5zaGlmdCcsIGFyciwge1xuICAgICAgdmFsdWU6IHJlc3VsdFxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbiAgdmFyIHJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IEFycmF5LnByb3RvdHlwZS5yZXZlcnNlLmFwcGx5KGFycilcblxuICAgIGNhbGxiYWNrKCdyZXZlcnNlJywgYXJyLCB7XG4gICAgICB2YWx1ZTogcmVzdWx0XG4gICAgfSlcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuICB2YXIgc3BsaWNlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkoYXJyLCBhcmd1bWVudHMpXG5cbiAgICBjYWxsYmFjaygnc3BsaWNlJywgYXJyLCB7XG4gICAgICB2YWx1ZTogcmVzdWx0LFxuICAgICAgcmVtb3ZlZDogcmVzdWx0LFxuICAgICAgYWRkZWQ6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMilcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgLyoqXG4gICAqIFByb3h5IGFsbCBBcnJheS5wcm90b3R5cGUgbXV0YXRvciBtZXRob2RzIG9uIHRoaXMgYXJyYXkgaW5zdGFuY2VcbiAgICovXG4gIGFyci5wb3AgPSBhcnIucG9wICYmIHBvcFxuICBhcnIucHVzaCA9IGFyci5wdXNoICYmIHB1c2hcbiAgYXJyLnNoaWZ0ID0gYXJyLnNoaWZ0ICYmIHNoaWZ0XG4gIGFyci51bnNoaWZ0ID0gYXJyLnVuc2hpZnQgJiYgdW5zaGlmdFxuICBhcnIuc29ydCA9IGFyci5zb3J0ICYmIHNvcnRcbiAgYXJyLnJldmVyc2UgPSBhcnIucmV2ZXJzZSAmJiByZXZlcnNlXG4gIGFyci5zcGxpY2UgPSBhcnIuc3BsaWNlICYmIHNwbGljZVxuXG4gIC8qKlxuICAgKiBTcGVjaWFsIHVwZGF0ZSBmdW5jdGlvbiBzaW5jZSB3ZSBjYW4ndCBkZXRlY3RcbiAgICogYXNzaWdubWVudCBieSBpbmRleCBlLmcuIGFyclswXSA9ICdzb21ldGhpbmcnXG4gICAqL1xuICBhcnIudXBkYXRlID0gZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgIHZhciBvbGRWYWx1ZSA9IGFycltpbmRleF1cbiAgICB2YXIgbmV3VmFsdWUgPSBhcnJbaW5kZXhdID0gdmFsdWVcblxuICAgIGNhbGxiYWNrKCd1cGRhdGUnLCBhcnIsIHtcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIHZhbHVlOiBuZXdWYWx1ZSxcbiAgICAgIG9sZFZhbHVlOiBvbGRWYWx1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gbmV3VmFsdWVcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEVtaXR0ZXJFdmVudCAobmFtZSwgcGF0aCwgdGFyZ2V0LCBkZXRhaWwpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLnBhdGggPSBwYXRoXG4gIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG5cbiAgaWYgKGRldGFpbCkge1xuICAgIHRoaXMuZGV0YWlsID0gZGV0YWlsXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyXG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyIChvYmopIHtcbiAgdmFyIGN0eCA9IG9iaiB8fCB0aGlzXG5cbiAgaWYgKG9iaikge1xuICAgIGN0eCA9IG1peGluKG9iailcbiAgICByZXR1cm4gY3R4XG4gIH1cbn1cblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluIChvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldXG4gIH1cbiAgcmV0dXJuIG9ialxufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPSBFbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAodGhpcy5fX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbilcbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgZnVuY3Rpb24gb24gKCkge1xuICAgIHRoaXMub2ZmKGV2ZW50LCBvbilcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cblxuICBvbi5mbiA9IGZuXG4gIHRoaXMub24oZXZlbnQsIG9uKVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAvLyBhbGxcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLl9fY2FsbGJhY2tzID0ge31cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX19jYWxsYmFja3NbZXZlbnRdXG4gIGlmICghY2FsbGJhY2tzKSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBkZWxldGUgdGhpcy5fX2NhbGxiYWNrc1tldmVudF1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV1cbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9fY2FsbGJhY2tzW2V2ZW50XVxuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMClcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHJldHVybiB0aGlzLl9fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXVxufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uIChldmVudCkge1xuICByZXR1cm4gISF0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKVxudmFyIGNyZWF0ZU1vZGVsUHJvdG90eXBlID0gcmVxdWlyZSgnLi9wcm90bycpXG52YXIgV3JhcHBlciA9IHJlcXVpcmUoJy4vd3JhcHBlcicpXG5cbmZ1bmN0aW9uIGNyZWF0ZU1vZGVsRGVzY3JpcHRvcnMgKGRlZiwgcGFyZW50KSB7XG4gIHZhciBfXyA9IHt9XG5cbiAgdmFyIGRlc2MgPSB7XG4gICAgX186IHtcbiAgICAgIHZhbHVlOiBfX1xuICAgIH0sXG4gICAgX19kZWY6IHtcbiAgICAgIHZhbHVlOiBkZWZcbiAgICB9LFxuICAgIF9fcGFyZW50OiB7XG4gICAgICB2YWx1ZTogcGFyZW50LFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9LFxuICAgIF9fY2FsbGJhY2tzOiB7XG4gICAgICB2YWx1ZToge30sXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZXNjXG59XG5cbmZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMgKG1vZGVsKSB7XG4gIHZhciBkZWZzID0gbW9kZWwuX19kZWYuZGVmc1xuICBmb3IgKHZhciBrZXkgaW4gZGVmcykge1xuICAgIGRlZmluZVByb3BlcnR5KG1vZGVsLCBrZXksIGRlZnNba2V5XSlcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eSAobW9kZWwsIGtleSwgZGVmKSB7XG4gIHZhciBkZXNjID0ge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19nZXQoa2V5KVxuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZGVmLmVudW1lcmFibGUsXG4gICAgY29uZmlndXJhYmxlOiBkZWYuY29uZmlndXJhYmxlXG4gIH1cblxuICBpZiAoZGVmLndyaXRhYmxlKSB7XG4gICAgZGVzYy5zZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHRoaXMuX19zZXROb3RpZnlDaGFuZ2Uoa2V5LCB2YWx1ZSlcbiAgICB9XG4gIH1cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kZWwsIGtleSwgZGVzYylcblxuICAvLyBTaWxlbnRseSBpbml0aWFsaXplIHRoZSBwcm9wZXJ0eSB3cmFwcGVyXG4gIG1vZGVsLl9fW2tleV0gPSBkZWYuY3JlYXRlKG1vZGVsKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVXcmFwcGVyRmFjdG9yeSAoZGVmKSB7XG4gIHZhciB3cmFwcGVyLCBkZWZhdWx0VmFsdWUsIGFzc2VydFxuXG4gIGlmIChkZWYuaXNTaW1wbGUpIHtcbiAgICB3cmFwcGVyID0gbmV3IFdyYXBwZXIoZGVmLnZhbHVlLCBkZWYud3JpdGFibGUsIGRlZi52YWxpZGF0b3JzLCBkZWYuZ2V0dGVyLCBkZWYuc2V0dGVyLCBkZWYuY2FzdCwgbnVsbClcbiAgfSBlbHNlIGlmIChkZWYuaXNSZWZlcmVuY2UpIHtcbiAgICAvLyBIb2xkIGEgcmVmZXJlbmNlIHRvIHRoZVxuICAgIC8vIHJlZmVyZXJlbmNlZCB0eXBlcycgZGVmaW5pdGlvblxuICAgIHZhciByZWZEZWYgPSBkZWYudHlwZS5kZWZcblxuICAgIGlmIChyZWZEZWYuaXNTaW1wbGUpIHtcbiAgICAgIC8vIElmIHRoZSByZWZlcmVuY2VkIHR5cGUgaXMgaXRzZWxmIHNpbXBsZSxcbiAgICAgIC8vIHdlIGNhbiBzZXQganVzdCByZXR1cm4gYSB3cmFwcGVyIGFuZFxuICAgICAgLy8gdGhlIHByb3BlcnR5IHdpbGwgZ2V0IGluaXRpYWxpemVkLlxuICAgICAgd3JhcHBlciA9IG5ldyBXcmFwcGVyKHJlZkRlZi52YWx1ZSwgcmVmRGVmLndyaXRhYmxlLCByZWZEZWYudmFsaWRhdG9ycywgZGVmLmdldHRlciwgZGVmLnNldHRlciwgcmVmRGVmLmNhc3QsIG51bGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHdlJ3JlIG5vdCBkZWFsaW5nIHdpdGggYSBzaW1wbGUgcmVmZXJlbmNlIG1vZGVsXG4gICAgICAvLyB3ZSBuZWVkIHRvIGRlZmluZSBhbiBhc3NlcnRpb24gdGhhdCB0aGUgaW5zdGFuY2VcbiAgICAgIC8vIGJlaW5nIHNldCBpcyBvZiB0aGUgY29ycmVjdCB0eXBlLiBXZSBkbyB0aGlzIGJlXG4gICAgICAvLyBjb21wYXJpbmcgdGhlIGRlZnMuXG5cbiAgICAgIGFzc2VydCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBjb21wYXJlIHRoZSBkZWZpbnRpb25zIG9mIHRoZSB2YWx1ZSBpbnN0YW5jZVxuICAgICAgICAvLyBiZWluZyBwYXNzZWQgYW5kIHRoZSBkZWYgcHJvcGVydHkgYXR0YWNoZWRcbiAgICAgICAgLy8gdG8gdGhlIHR5cGUgU3VwZXJtb2RlbENvbnN0cnVjdG9yLiBBbGxvdyB0aGVcbiAgICAgICAgLy8gdmFsdWUgdG8gYmUgdW5kZWZpbmVkIG9yIG51bGwgYWxzby5cbiAgICAgICAgdmFyIGlzQ29ycmVjdFR5cGUgPSBmYWxzZVxuXG4gICAgICAgIGlmICh1dGlsLmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgIGlzQ29ycmVjdFR5cGUgPSB0cnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNDb3JyZWN0VHlwZSA9IHJlZkRlZiA9PT0gdmFsdWUuX19kZWZcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNDb3JyZWN0VHlwZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVmFsdWUgc2hvdWxkIGJlIGFuIGluc3RhbmNlIG9mIHRoZSByZWZlcmVuY2VkIG1vZGVsLCBudWxsIG9yIHVuZGVmaW5lZCcpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgd3JhcHBlciA9IG5ldyBXcmFwcGVyKGRlZi52YWx1ZSwgZGVmLndyaXRhYmxlLCBkZWYudmFsaWRhdG9ycywgZGVmLmdldHRlciwgZGVmLnNldHRlciwgbnVsbCwgYXNzZXJ0KVxuICAgIH1cbiAgfSBlbHNlIGlmIChkZWYuaXNBcnJheSkge1xuICAgIGRlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgIC8vIGZvciBBcnJheXMsIHdlIGNyZWF0ZSBhIG5ldyBBcnJheSBhbmQgZWFjaFxuICAgICAgLy8gdGltZSwgbWl4IHRoZSBtb2RlbCBwcm9wZXJ0aWVzIGludG8gaXRcbiAgICAgIHZhciBtb2RlbCA9IGNyZWF0ZU1vZGVsUHJvdG90eXBlKGRlZilcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG1vZGVsLCBjcmVhdGVNb2RlbERlc2NyaXB0b3JzKGRlZiwgcGFyZW50KSlcbiAgICAgIGRlZmluZVByb3BlcnRpZXMobW9kZWwpXG4gICAgICByZXR1cm4gbW9kZWxcbiAgICB9XG5cbiAgICBhc3NlcnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIHRvZG86IGZ1cnRoZXIgYXJyYXkgdHlwZSB2YWxpZGF0aW9uXG4gICAgICBpZiAoIXV0aWwuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBzaG91bGQgYmUgYW4gYXJyYXknKVxuICAgICAgfVxuICAgIH1cblxuICAgIHdyYXBwZXIgPSBuZXcgV3JhcHBlcihkZWZhdWx0VmFsdWUsIGRlZi53cml0YWJsZSwgZGVmLnZhbGlkYXRvcnMsIGRlZi5nZXR0ZXIsIGRlZi5zZXR0ZXIsIG51bGwsIGFzc2VydClcbiAgfSBlbHNlIHtcbiAgICAvLyBmb3IgT2JqZWN0cywgd2UgY2FuIGNyZWF0ZSBhbmQgcmV1c2VcbiAgICAvLyBhIHByb3RvdHlwZSBvYmplY3QuIFdlIHRoZW4gbmVlZCB0byBvbmx5XG4gICAgLy8gZGVmaW5lIHRoZSBkZWZzIGFuZCB0aGUgJ2luc3RhbmNlJyBwcm9wZXJ0aWVzXG4gICAgLy8gZS5nLiBfXywgcGFyZW50IGV0Yy5cbiAgICB2YXIgcHJvdG8gPSBjcmVhdGVNb2RlbFByb3RvdHlwZShkZWYpXG5cbiAgICBkZWZhdWx0VmFsdWUgPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICB2YXIgbW9kZWwgPSBPYmplY3QuY3JlYXRlKHByb3RvLCBjcmVhdGVNb2RlbERlc2NyaXB0b3JzKGRlZiwgcGFyZW50KSlcbiAgICAgIGRlZmluZVByb3BlcnRpZXMobW9kZWwpXG4gICAgICByZXR1cm4gbW9kZWxcbiAgICB9XG5cbiAgICBhc3NlcnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmICghcHJvdG8uaXNQcm90b3R5cGVPZih2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHByb3RvdHlwZScpXG4gICAgICB9XG4gICAgfVxuXG4gICAgd3JhcHBlciA9IG5ldyBXcmFwcGVyKGRlZmF1bHRWYWx1ZSwgZGVmLndyaXRhYmxlLCBkZWYudmFsaWRhdG9ycywgZGVmLmdldHRlciwgZGVmLnNldHRlciwgbnVsbCwgYXNzZXJ0KVxuICB9XG5cbiAgdmFyIGZhY3RvcnkgPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgdmFyIHdyYXAgPSBPYmplY3QuY3JlYXRlKHdyYXBwZXIpXG4gICAgLy8gaWYgKCF3cmFwLmlzSW5pdGlhbGl6ZWQpIHtcbiAgICB3cmFwLmluaXRpYWxpemUocGFyZW50KVxuICAgIC8vIH1cbiAgICByZXR1cm4gd3JhcFxuICB9XG5cbiAgLy8gZXhwb3NlIHRoZSB3cmFwcGVyLCB0aGlzIGlzIHVzZWRcbiAgLy8gZm9yIHZhbGlkYXRpbmcgYXJyYXkgaXRlbXMgbGF0ZXJcbiAgZmFjdG9yeS53cmFwcGVyID0gd3JhcHBlclxuXG4gIHJldHVybiBmYWN0b3J5XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlV3JhcHBlckZhY3RvcnlcbiIsIid1c2Ugc3RyaWN0J1xuXG5mdW5jdGlvbiBtZXJnZSAobW9kZWwsIG9iaikge1xuICB2YXIgaXNBcnJheSA9IG1vZGVsLl9fZGVmLmlzQXJyYXlcbiAgdmFyIGRlZnMgPSBtb2RlbC5fX2RlZi5kZWZzXG4gIHZhciBkZWZLZXlzLCBkZWYsIGtleSwgaSwgaXNTaW1wbGUsXG4gICAgaXNTaW1wbGVSZWZlcmVuY2UsIGlzSW5pdGlhbGl6ZWRSZWZlcmVuY2VcblxuICBpZiAoZGVmcykge1xuICAgIGRlZktleXMgPSBPYmplY3Qua2V5cyhkZWZzKVxuICAgIGZvciAoaSA9IDA7IGkgPCBkZWZLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBkZWZLZXlzW2ldXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgZGVmID0gZGVmc1trZXldXG5cbiAgICAgICAgaXNTaW1wbGUgPSBkZWYuaXNTaW1wbGVcbiAgICAgICAgaXNTaW1wbGVSZWZlcmVuY2UgPSBkZWYuaXNSZWZlcmVuY2UgJiYgZGVmLnR5cGUuZGVmLmlzU2ltcGxlXG4gICAgICAgIGlzSW5pdGlhbGl6ZWRSZWZlcmVuY2UgPSBkZWYuaXNSZWZlcmVuY2UgJiYgb2JqW2tleV0gJiYgb2JqW2tleV0uX19zdXBlcm1vZGVsXG5cbiAgICAgICAgaWYgKGlzU2ltcGxlIHx8IGlzU2ltcGxlUmVmZXJlbmNlIHx8IGlzSW5pdGlhbGl6ZWRSZWZlcmVuY2UpIHtcbiAgICAgICAgICBtb2RlbFtrZXldID0gb2JqW2tleV1cbiAgICAgICAgfSBlbHNlIGlmIChvYmpba2V5XSkge1xuICAgICAgICAgIGlmIChkZWYuaXNSZWZlcmVuY2UpIHtcbiAgICAgICAgICAgIG1vZGVsW2tleV0gPSBkZWYudHlwZSgpXG4gICAgICAgICAgfVxuICAgICAgICAgIG1lcmdlKG1vZGVsW2tleV0sIG9ialtrZXldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGlzQXJyYXkgJiYgQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGl0ZW0gPSBtb2RlbC5jcmVhdGUoKVxuICAgICAgbW9kZWwucHVzaChpdGVtICYmIGl0ZW0uX19zdXBlcm1vZGVsID8gbWVyZ2UoaXRlbSwgb2JqW2ldKSA6IG9ialtpXSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbW9kZWxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBFbWl0dGVyRXZlbnQgPSByZXF1aXJlKCcuL2VtaXR0ZXItZXZlbnQnKVxudmFyIFZhbGlkYXRpb25FcnJvciA9IHJlcXVpcmUoJy4vdmFsaWRhdGlvbi1lcnJvcicpXG52YXIgV3JhcHBlciA9IHJlcXVpcmUoJy4vd3JhcHBlcicpXG52YXIgbWVyZ2UgPSByZXF1aXJlKCcuL21lcmdlJylcblxudmFyIGRlc2NyaXB0b3JzID0ge1xuICBfX3N1cGVybW9kZWw6IHtcbiAgICB2YWx1ZTogdHJ1ZVxuICB9LFxuICBfX2tleXM6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcylcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcykpIHtcbiAgICAgICAgdmFyIG9taXQgPSBbXG4gICAgICAgICAgJ2FkZEV2ZW50TGlzdGVuZXInLCAnb24nLCAnb25jZScsICdyZW1vdmVFdmVudExpc3RlbmVyJywgJ3JlbW92ZUFsbExpc3RlbmVycycsXG4gICAgICAgICAgJ3JlbW92ZUxpc3RlbmVyJywgJ29mZicsICdlbWl0JywgJ2xpc3RlbmVycycsICdoYXNMaXN0ZW5lcnMnLCAncG9wJywgJ3B1c2gnLFxuICAgICAgICAgICdyZXZlcnNlJywgJ3NoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJywgJ3VwZGF0ZScsICd1bnNoaWZ0JywgJ2NyZWF0ZScsICdfX21lcmdlJyxcbiAgICAgICAgICAnX19zZXROb3RpZnlDaGFuZ2UnLCAnX19ub3RpZnlDaGFuZ2UnLCAnX19zZXQnLCAnX19nZXQnLCAnX19jaGFpbicsICdfX3JlbGF0aXZlUGF0aCdcbiAgICAgICAgXVxuXG4gICAgICAgIGtleXMgPSBrZXlzLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiBvbWl0LmluZGV4T2YoaXRlbSkgPCAwXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZXlzXG4gICAgfVxuICB9LFxuICBfX25hbWU6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLl9faXNSb290KSB7XG4gICAgICAgIHJldHVybiAnJ1xuICAgICAgfVxuXG4gICAgICAvLyBXb3JrIG91dCB0aGUgJ25hbWUnIG9mIHRoZSBtb2RlbFxuICAgICAgLy8gTG9vayB1cCB0byB0aGUgcGFyZW50IGFuZCBsb29wIHRocm91Z2ggaXQncyBrZXlzLFxuICAgICAgLy8gQW55IHZhbHVlIG9yIGFycmF5IGZvdW5kIHRvIGNvbnRhaW4gdGhlIHZhbHVlIG9mIHRoaXMgKHRoaXMgbW9kZWwpXG4gICAgICAvLyB0aGVuIHdlIHJldHVybiB0aGUga2V5IGFuZCBpbmRleCBpbiB0aGUgY2FzZSB3ZSBmb3VuZCB0aGUgbW9kZWwgaW4gYW4gYXJyYXkuXG4gICAgICB2YXIgcGFyZW50S2V5cyA9IHRoaXMuX19wYXJlbnQuX19rZXlzXG4gICAgICB2YXIgcGFyZW50S2V5LCBwYXJlbnRWYWx1ZVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmVudEtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcGFyZW50S2V5ID0gcGFyZW50S2V5c1tpXVxuICAgICAgICBwYXJlbnRWYWx1ZSA9IHRoaXMuX19wYXJlbnRbcGFyZW50S2V5XVxuXG4gICAgICAgIGlmIChwYXJlbnRWYWx1ZSA9PT0gdGhpcykge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRLZXlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgX19wYXRoOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5fX2hhc0FuY2VzdG9ycyAmJiAhdGhpcy5fX3BhcmVudC5fX2lzUm9vdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3BhcmVudC5fX3BhdGggKyAnLicgKyB0aGlzLl9fbmFtZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19uYW1lXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBfX2lzUm9vdDoge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICF0aGlzLl9faGFzQW5jZXN0b3JzXG4gICAgfVxuICB9LFxuICBfX2NoaWxkcmVuOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2hpbGRyZW4gPSBbXVxuXG4gICAgICB2YXIga2V5cyA9IHRoaXMuX19rZXlzXG4gICAgICB2YXIga2V5LCB2YWx1ZVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAga2V5ID0ga2V5c1tpXVxuICAgICAgICB2YWx1ZSA9IHRoaXNba2V5XVxuXG4gICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5fX3N1cGVybW9kZWwpIHtcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKHZhbHVlKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjaGlsZHJlblxuICAgIH1cbiAgfSxcbiAgX19hbmNlc3RvcnM6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhbmNlc3RvcnMgPSBbXVxuICAgICAgdmFyIHIgPSB0aGlzXG5cbiAgICAgIHdoaWxlIChyLl9fcGFyZW50KSB7XG4gICAgICAgIGFuY2VzdG9ycy5wdXNoKHIuX19wYXJlbnQpXG4gICAgICAgIHIgPSByLl9fcGFyZW50XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhbmNlc3RvcnNcbiAgICB9XG4gIH0sXG4gIF9fZGVzY2VuZGFudHM6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkZXNjZW5kYW50cyA9IFtdXG5cbiAgICAgIGZ1bmN0aW9uIGNoZWNrQW5kQWRkRGVzY2VuZGFudElmTW9kZWwgKG9iaikge1xuICAgICAgICB2YXIga2V5cyA9IG9iai5fX2tleXNcbiAgICAgICAgdmFyIGtleSwgdmFsdWVcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBrZXkgPSBrZXlzW2ldXG4gICAgICAgICAgdmFsdWUgPSBvYmpba2V5XVxuXG4gICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLl9fc3VwZXJtb2RlbCkge1xuICAgICAgICAgICAgZGVzY2VuZGFudHMucHVzaCh2YWx1ZSlcbiAgICAgICAgICAgIGNoZWNrQW5kQWRkRGVzY2VuZGFudElmTW9kZWwodmFsdWUpXG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICBjaGVja0FuZEFkZERlc2NlbmRhbnRJZk1vZGVsKHRoaXMpXG5cbiAgICAgIHJldHVybiBkZXNjZW5kYW50c1xuICAgIH1cbiAgfSxcbiAgX19oYXNBbmNlc3RvcnM6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAhIXRoaXMuX19hbmNlc3RvcnMubGVuZ3RoXG4gICAgfVxuICB9LFxuICBfX2hhc0Rlc2NlbmRhbnRzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gISF0aGlzLl9fZGVzY2VuZGFudHMubGVuZ3RoXG4gICAgfVxuICB9LFxuICBlcnJvcnM6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlcnJvcnMgPSBbXVxuICAgICAgdmFyIGRlZiA9IHRoaXMuX19kZWZcbiAgICAgIHZhciB2YWxpZGF0b3IsIGVycm9yLCBpLCBqXG5cbiAgICAgIC8vIFJ1biBvd24gdmFsaWRhdG9yc1xuICAgICAgdmFyIG93biA9IGRlZi52YWxpZGF0b3JzLnNsaWNlKDApXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgb3duLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbGlkYXRvciA9IG93bltpXVxuICAgICAgICBlcnJvciA9IHZhbGlkYXRvci5jYWxsKHRoaXMsIHRoaXMpXG5cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgZXJyb3JzLnB1c2gobmV3IFZhbGlkYXRpb25FcnJvcih0aGlzLCBlcnJvciwgdmFsaWRhdG9yKSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBSdW4gdGhyb3VnaCBrZXlzIGFuZCBldmFsdWF0ZSB2YWxpZGF0b3JzXG4gICAgICB2YXIga2V5cyA9IHRoaXMuX19rZXlzXG4gICAgICB2YXIgdmFsdWUsIGtleSwgaXRlbURlZlxuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBrZXkgPSBrZXlzW2ldXG5cbiAgICAgICAgLy8gSWYgd2UgYXJlIGFuIEFycmF5IHdpdGggYW4gaXRlbSBkZWZpbml0aW9uXG4gICAgICAgIC8vIHRoZW4gd2UgaGF2ZSB0byBsb29rIGludG8gdGhlIEFycmF5IGZvciBvdXIgdmFsdWVcbiAgICAgICAgLy8gYW5kIGFsc28gZ2V0IGhvbGQgb2YgdGhlIHdyYXBwZXIuIFdlIG9ubHkgbmVlZCB0b1xuICAgICAgICAvLyBkbyB0aGlzIGlmIHRoZSBrZXkgaXMgbm90IGEgcHJvcGVydHkgb2YgdGhlIGFycmF5LlxuICAgICAgICAvLyBXZSBjaGVjayB0aGUgZGVmcyB0byB3b3JrIHRoaXMgb3V0IChpLmUuIDAsIDEsIDIpLlxuICAgICAgICAvLyB0b2RvOiBUaGlzIGNvdWxkIGJlIGJldHRlciB0byBjaGVjayAhTmFOIG9uIHRoZSBrZXk/XG4gICAgICAgIGlmIChkZWYuaXNBcnJheSAmJiBkZWYuZGVmICYmICghZGVmLmRlZnMgfHwgIShrZXkgaW4gZGVmLmRlZnMpKSkge1xuICAgICAgICAgIC8vIElmIHdlIGFyZSBhbiBBcnJheSB3aXRoIGEgc2ltcGxlIGl0ZW0gZGVmaW5pdGlvblxuICAgICAgICAgIC8vIG9yIGEgcmVmZXJlbmNlIHRvIGEgc2ltcGxlIHR5cGUgZGVmaW5pdGlvblxuICAgICAgICAgIC8vIHN1YnN0aXR1dGUgdGhlIHZhbHVlIHdpdGggdGhlIHdyYXBwZXIgd2UgZ2V0IGZyb20gdGhlXG4gICAgICAgICAgLy8gY3JlYXRlIGZhY3RvcnkgZnVuY3Rpb24uIE90aGVyd2lzZSBzZXQgdGhlIHZhbHVlIHRvXG4gICAgICAgICAgLy8gdGhlIHJlYWwgdmFsdWUgb2YgdGhlIHByb3BlcnR5LlxuICAgICAgICAgIGl0ZW1EZWYgPSBkZWYuZGVmXG5cbiAgICAgICAgICBpZiAoaXRlbURlZi5pc1NpbXBsZSkge1xuICAgICAgICAgICAgdmFsdWUgPSBpdGVtRGVmLmNyZWF0ZS53cmFwcGVyXG4gICAgICAgICAgICB2YWx1ZS5zZXRWYWx1ZSh0aGlzW2tleV0pXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtRGVmLmlzUmVmZXJlbmNlICYmIGl0ZW1EZWYudHlwZS5kZWYuaXNTaW1wbGUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gaXRlbURlZi50eXBlLmRlZi5jcmVhdGUud3JhcHBlclxuICAgICAgICAgICAgdmFsdWUuc2V0VmFsdWUodGhpc1trZXldKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXNba2V5XVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTZXQgdGhlIHZhbHVlIHRvIHRoZSB3cmFwcGVkIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eVxuICAgICAgICAgIHZhbHVlID0gdGhpcy5fX1trZXldXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICBpZiAodmFsdWUuX19zdXBlcm1vZGVsKSB7XG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShlcnJvcnMsIHZhbHVlLmVycm9ycylcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgV3JhcHBlcikge1xuICAgICAgICAgICAgdmFyIHdyYXBwZXJWYWx1ZSA9IHZhbHVlLmdldFZhbHVlKHRoaXMpXG5cbiAgICAgICAgICAgIGlmICh3cmFwcGVyVmFsdWUgJiYgd3JhcHBlclZhbHVlLl9fc3VwZXJtb2RlbCkge1xuICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShlcnJvcnMsIHdyYXBwZXJWYWx1ZS5lcnJvcnMpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgc2ltcGxlID0gdmFsdWUudmFsaWRhdG9yc1xuICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgc2ltcGxlLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yID0gc2ltcGxlW2pdXG4gICAgICAgICAgICAgICAgZXJyb3IgPSB2YWxpZGF0b3IuY2FsbCh0aGlzLCB3cmFwcGVyVmFsdWUsIGtleSlcblxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2gobmV3IFZhbGlkYXRpb25FcnJvcih0aGlzLCBlcnJvciwgdmFsaWRhdG9yLCBrZXkpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZXJyb3JzXG4gICAgfVxuICB9XG59XG5cbnZhciBwcm90byA9IHtcbiAgX19nZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5fX1trZXldLmdldFZhbHVlKHRoaXMpXG4gIH0sXG4gIF9fc2V0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHRoaXMuX19ba2V5XS5zZXRWYWx1ZSh2YWx1ZSwgdGhpcylcbiAgfSxcbiAgX19yZWxhdGl2ZVBhdGg6IGZ1bmN0aW9uICh0bywga2V5KSB7XG4gICAgdmFyIHJlbGF0aXZlUGF0aCA9IHRoaXMuX19wYXRoID8gdG8uc3Vic3RyKHRoaXMuX19wYXRoLmxlbmd0aCArIDEpIDogdG9cblxuICAgIGlmIChyZWxhdGl2ZVBhdGgpIHtcbiAgICAgIHJldHVybiBrZXkgPyByZWxhdGl2ZVBhdGggKyAnLicgKyBrZXkgOiByZWxhdGl2ZVBhdGhcbiAgICB9XG4gICAgcmV0dXJuIGtleVxuICB9LFxuICBfX2NoYWluOiBmdW5jdGlvbiAoZm4pIHtcbiAgICByZXR1cm4gW3RoaXNdLmNvbmNhdCh0aGlzLl9fYW5jZXN0b3JzKS5mb3JFYWNoKGZuKVxuICB9LFxuICBfX21lcmdlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiBtZXJnZSh0aGlzLCBkYXRhKVxuICB9LFxuICBfX25vdGlmeUNoYW5nZTogZnVuY3Rpb24gKGtleSwgbmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXNcbiAgICB2YXIgdGFyZ2V0UGF0aCA9IHRoaXMuX19wYXRoXG4gICAgdmFyIGV2ZW50TmFtZSA9ICdzZXQnXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBvbGRWYWx1ZTogb2xkVmFsdWUsXG4gICAgICBuZXdWYWx1ZTogbmV3VmFsdWVcbiAgICB9XG5cbiAgICB0aGlzLmVtaXQoZXZlbnROYW1lLCBuZXcgRW1pdHRlckV2ZW50KGV2ZW50TmFtZSwga2V5LCB0YXJnZXQsIGRhdGEpKVxuICAgIHRoaXMuZW1pdCgnY2hhbmdlJywgbmV3IEVtaXR0ZXJFdmVudChldmVudE5hbWUsIGtleSwgdGFyZ2V0LCBkYXRhKSlcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZTonICsga2V5LCBuZXcgRW1pdHRlckV2ZW50KGV2ZW50TmFtZSwga2V5LCB0YXJnZXQsIGRhdGEpKVxuXG4gICAgdGhpcy5fX2FuY2VzdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgcGF0aCA9IGl0ZW0uX19yZWxhdGl2ZVBhdGgodGFyZ2V0UGF0aCwga2V5KVxuICAgICAgaXRlbS5lbWl0KCdjaGFuZ2UnLCBuZXcgRW1pdHRlckV2ZW50KGV2ZW50TmFtZSwgcGF0aCwgdGFyZ2V0LCBkYXRhKSlcbiAgICB9KVxuICB9LFxuICBfX3NldE5vdGlmeUNoYW5nZTogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLl9fZ2V0KGtleSlcbiAgICB0aGlzLl9fc2V0KGtleSwgdmFsdWUpXG4gICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5fX2dldChrZXkpXG4gICAgdGhpcy5fX25vdGlmeUNoYW5nZShrZXksIG5ld1ZhbHVlLCBvbGRWYWx1ZSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHJvdG86IHByb3RvLFxuICBkZXNjcmlwdG9yczogZGVzY3JpcHRvcnNcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlci1vYmplY3QnKVxudmFyIGVtaXR0ZXJBcnJheSA9IHJlcXVpcmUoJy4vZW1pdHRlci1hcnJheScpXG52YXIgRW1pdHRlckV2ZW50ID0gcmVxdWlyZSgnLi9lbWl0dGVyLWV2ZW50JylcblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vdXRpbCcpLmV4dGVuZFxudmFyIG1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpXG52YXIgbW9kZWxQcm90byA9IG1vZGVsLnByb3RvXG52YXIgbW9kZWxEZXNjcmlwdG9ycyA9IG1vZGVsLmRlc2NyaXB0b3JzXG5cbnZhciBtb2RlbFByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobW9kZWxQcm90bywgbW9kZWxEZXNjcmlwdG9ycylcbnZhciBvYmplY3RQcm90b3R5cGUgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgcCA9IE9iamVjdC5jcmVhdGUobW9kZWxQcm90b3R5cGUpXG5cbiAgZW1pdHRlcihwKVxuXG4gIHJldHVybiBwXG59KSgpXG5cbmZ1bmN0aW9uIGNyZWF0ZUFycmF5UHJvdG90eXBlICgpIHtcbiAgdmFyIHAgPSBlbWl0dGVyQXJyYXkoZnVuY3Rpb24gKGV2ZW50TmFtZSwgYXJyLCBlKSB7XG4gICAgaWYgKGV2ZW50TmFtZSA9PT0gJ3VwZGF0ZScpIHtcbiAgICAgIC8qKlxuICAgICAgICogRm9yd2FyZCB0aGUgc3BlY2lhbCBhcnJheSB1cGRhdGVcbiAgICAgICAqIGV2ZW50cyBhcyBzdGFuZGFyZCBfX25vdGlmeUNoYW5nZSBldmVudHNcbiAgICAgICAqL1xuICAgICAgYXJyLl9fbm90aWZ5Q2hhbmdlKGUuaW5kZXgsIGUudmFsdWUsIGUub2xkVmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8qKlxuICAgICAgICogQWxsIG90aGVyIGV2ZW50cyBlLmcuIHB1c2gsIHNwbGljZSBhcmUgcmVsYXllZFxuICAgICAgICovXG4gICAgICB2YXIgdGFyZ2V0ID0gYXJyXG4gICAgICB2YXIgcGF0aCA9IGFyci5fX3BhdGhcbiAgICAgIHZhciBkYXRhID0gZVxuICAgICAgdmFyIGtleSA9IGUuaW5kZXhcblxuICAgICAgYXJyLmVtaXQoZXZlbnROYW1lLCBuZXcgRW1pdHRlckV2ZW50KGV2ZW50TmFtZSwgJycsIHRhcmdldCwgZGF0YSkpXG4gICAgICBhcnIuZW1pdCgnY2hhbmdlJywgbmV3IEVtaXR0ZXJFdmVudChldmVudE5hbWUsICcnLCB0YXJnZXQsIGRhdGEpKVxuICAgICAgYXJyLl9fYW5jZXN0b3JzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgdmFyIG5hbWUgPSBpdGVtLl9fcmVsYXRpdmVQYXRoKHBhdGgsIGtleSlcbiAgICAgICAgaXRlbS5lbWl0KCdjaGFuZ2UnLCBuZXcgRW1pdHRlckV2ZW50KGV2ZW50TmFtZSwgbmFtZSwgdGFyZ2V0LCBkYXRhKSlcbiAgICAgIH0pXG5cbiAgICB9XG4gIH0pXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMocCwgbW9kZWxEZXNjcmlwdG9ycylcblxuICBlbWl0dGVyKHApXG5cbiAgZXh0ZW5kKHAsIG1vZGVsUHJvdG8pXG5cbiAgcmV0dXJuIHBcbn1cblxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0TW9kZWxQcm90b3R5cGUgKHByb3RvKSB7XG4gIHZhciBwID0gT2JqZWN0LmNyZWF0ZShvYmplY3RQcm90b3R5cGUpXG5cbiAgaWYgKHByb3RvKSB7XG4gICAgZXh0ZW5kKHAsIHByb3RvKVxuICB9XG5cbiAgcmV0dXJuIHBcbn1cblxuZnVuY3Rpb24gY3JlYXRlQXJyYXlNb2RlbFByb3RvdHlwZSAocHJvdG8sIGl0ZW1EZWYpIHtcbiAgLy8gV2UgZG8gbm90IHRvIGF0dGVtcHQgdG8gc3ViY2xhc3MgQXJyYXksXG4gIC8vIGluc3RlYWQgY3JlYXRlIGEgbmV3IGluc3RhbmNlIGVhY2ggdGltZVxuICAvLyBhbmQgbWl4aW4gdGhlIHByb3RvIG9iamVjdFxuICB2YXIgcCA9IGNyZWF0ZUFycmF5UHJvdG90eXBlKClcblxuICBpZiAocHJvdG8pIHtcbiAgICBleHRlbmQocCwgcHJvdG8pXG4gIH1cblxuICBpZiAoaXRlbURlZikge1xuICAgIC8vIFdlIGhhdmUgYSBkZWZpbml0aW9uIGZvciB0aGUgaXRlbXNcbiAgICAvLyB0aGF0IGJlbG9uZyBpbiB0aGlzIGFycmF5LlxuXG4gICAgLy8gVXNlIHRoZSBgd3JhcHBlcmAgcHJvdG90eXBlIHByb3BlcnR5IGFzIGFcbiAgICAvLyB2aXJ0dWFsIFdyYXBwZXIgb2JqZWN0IHdlIGNhbiB1c2VcbiAgICAvLyB2YWxpZGF0ZSBhbGwgdGhlIGl0ZW1zIGluIHRoZSBhcnJheS5cbiAgICB2YXIgYXJySXRlbVdyYXBwZXIgPSBpdGVtRGVmLmNyZWF0ZS53cmFwcGVyXG5cbiAgICAvLyBWYWxpZGF0ZSBuZXcgbW9kZWxzIGJ5IG92ZXJyaWRpbmcgdGhlIGVtaXR0ZXIgYXJyYXlcbiAgICAvLyBtdXRhdG9ycyB0aGF0IGNhbiBjYXVzZSBuZXcgaXRlbXMgdG8gZW50ZXIgdGhlIGFycmF5LlxuICAgIG92ZXJyaWRlQXJyYXlBZGRpbmdNdXRhdG9ycyhwLCBhcnJJdGVtV3JhcHBlcilcblxuICAgIC8vIFByb3ZpZGUgYSBjb252ZW5pZW50IG1vZGVsIGZhY3RvcnlcbiAgICAvLyBmb3IgY3JlYXRpbmcgYXJyYXkgaXRlbSBpbnN0YW5jZXNcbiAgICBwLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpdGVtRGVmLmlzUmVmZXJlbmNlID8gaXRlbURlZi50eXBlKCkgOiBpdGVtRGVmLmNyZWF0ZSgpLmdldFZhbHVlKHRoaXMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBcbn1cblxuZnVuY3Rpb24gb3ZlcnJpZGVBcnJheUFkZGluZ011dGF0b3JzIChhcnIsIGl0ZW1XcmFwcGVyKSB7XG4gIGZ1bmN0aW9uIGdldEFycmF5QXJncyAoaXRlbXMpIHtcbiAgICB2YXIgYXJncyA9IFtdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgaXRlbVdyYXBwZXIuc2V0VmFsdWUoaXRlbXNbaV0sIGFycilcbiAgICAgIGFyZ3MucHVzaChpdGVtV3JhcHBlci5nZXRWYWx1ZShhcnIpKVxuICAgIH1cbiAgICByZXR1cm4gYXJnc1xuICB9XG5cbiAgdmFyIHB1c2ggPSBhcnIucHVzaFxuICB2YXIgdW5zaGlmdCA9IGFyci51bnNoaWZ0XG4gIHZhciBzcGxpY2UgPSBhcnIuc3BsaWNlXG4gIHZhciB1cGRhdGUgPSBhcnIudXBkYXRlXG5cbiAgaWYgKHB1c2gpIHtcbiAgICBhcnIucHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gZ2V0QXJyYXlBcmdzKGFyZ3VtZW50cylcbiAgICAgIHJldHVybiBwdXNoLmFwcGx5KGFyciwgYXJncylcbiAgICB9XG4gIH1cblxuICBpZiAodW5zaGlmdCkge1xuICAgIGFyci51bnNoaWZ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBnZXRBcnJheUFyZ3MoYXJndW1lbnRzKVxuICAgICAgcmV0dXJuIHVuc2hpZnQuYXBwbHkoYXJyLCBhcmdzKVxuICAgIH1cbiAgfVxuXG4gIGlmIChzcGxpY2UpIHtcbiAgICBhcnIuc3BsaWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBnZXRBcnJheUFyZ3MoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSlcbiAgICAgIGFyZ3MudW5zaGlmdChhcmd1bWVudHNbMV0pXG4gICAgICBhcmdzLnVuc2hpZnQoYXJndW1lbnRzWzBdKVxuICAgICAgcmV0dXJuIHNwbGljZS5hcHBseShhcnIsIGFyZ3MpXG4gICAgfVxuICB9XG5cbiAgaWYgKHVwZGF0ZSkge1xuICAgIGFyci51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IGdldEFycmF5QXJncyhbYXJndW1lbnRzWzFdXSlcbiAgICAgIGFyZ3MudW5zaGlmdChhcmd1bWVudHNbMF0pXG4gICAgICByZXR1cm4gdXBkYXRlLmFwcGx5KGFyciwgYXJncylcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9kZWxQcm90b3R5cGUgKGRlZikge1xuICByZXR1cm4gZGVmLmlzQXJyYXkgPyBjcmVhdGVBcnJheU1vZGVsUHJvdG90eXBlKGRlZi5wcm90bywgZGVmLmRlZikgOiBjcmVhdGVPYmplY3RNb2RlbFByb3RvdHlwZShkZWYucHJvdG8pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTW9kZWxQcm90b3R5cGVcbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt9XG4iLCIndXNlIHN0cmljdCdcblxuLy8gdmFyIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZScpXG52YXIgY3JlYXRlRGVmID0gcmVxdWlyZSgnLi9kZWYnKVxudmFyIFN1cGVybW9kZWwgPSByZXF1aXJlKCcuL3N1cGVybW9kZWwnKVxuXG5mdW5jdGlvbiBzdXBlcm1vZGVscyAoc2NoZW1hLCBpbml0aWFsaXplcikge1xuICB2YXIgZGVmID0gY3JlYXRlRGVmKHNjaGVtYSlcblxuICBmdW5jdGlvbiBTdXBlcm1vZGVsQ29uc3RydWN0b3IgKGRhdGEpIHtcbiAgICB2YXIgbW9kZWwgPSBkZWYuaXNTaW1wbGUgPyBkZWYuY3JlYXRlKCkgOiBkZWYuY3JlYXRlKCkuZ2V0VmFsdWUoe30pXG5cbiAgICAvLyBDYWxsIGFueSBpbml0aWFsaXplclxuICAgIGlmIChpbml0aWFsaXplcikge1xuICAgICAgaW5pdGlhbGl6ZXIuYXBwbHkobW9kZWwsIGFyZ3VtZW50cylcbiAgICB9IGVsc2UgaWYgKGRhdGEpIHtcbiAgICAgIC8vIGlmIHRoZXJlJ3Mgbm8gaW5pdGlhbGl6ZXJcbiAgICAgIC8vIGJ1dCB3ZSBoYXZlIGJlZW4gcGFzc2VkIHNvbWVcbiAgICAgIC8vIGRhdGEsIG1lcmdlIGl0IGludG8gdGhlIG1vZGVsLlxuICAgICAgbW9kZWwuX19tZXJnZShkYXRhKVxuICAgIH1cbiAgICByZXR1cm4gbW9kZWxcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3VwZXJtb2RlbENvbnN0cnVjdG9yLCAnZGVmJywge1xuICAgIHZhbHVlOiBkZWYgLy8gdGhpcyBpcyB1c2VkIHRvIHZhbGlkYXRlIHJlZmVyZW5jZWQgU3VwZXJtb2RlbENvbnN0cnVjdG9yc1xuICB9KVxuICBTdXBlcm1vZGVsQ29uc3RydWN0b3IucHJvdG90eXBlID0gU3VwZXJtb2RlbCAvLyB0aGlzIHNoYXJlZCBvYmplY3QgaXMgdXNlZCwgYXMgYSBwcm90b3R5cGUsIHRvIGlkZW50aWZ5IFN1cGVybW9kZWxDb25zdHJ1Y3RvcnNcbiAgU3VwZXJtb2RlbENvbnN0cnVjdG9yLmNvbnN0cnVjdG9yID0gU3VwZXJtb2RlbENvbnN0cnVjdG9yXG4gIHJldHVybiBTdXBlcm1vZGVsQ29uc3RydWN0b3Jcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdXBlcm1vZGVsc1xuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBTdXBlcm1vZGVsID0gcmVxdWlyZSgnLi9zdXBlcm1vZGVsJylcblxuZnVuY3Rpb24gZXh0ZW5kIChvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8IHR5cGVvZiBhZGQgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG9yaWdpblxuICB9XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpXG4gIHZhciBpID0ga2V5cy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXVxuICB9XG4gIHJldHVybiBvcmlnaW5cbn1cblxudmFyIHV0aWwgPSB7XG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0eXBlT2Y6IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKVxuICB9LFxuICBpc09iamVjdDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZU9mKHZhbHVlKSA9PT0gJ29iamVjdCdcbiAgfSxcbiAgaXNBcnJheTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpXG4gIH0sXG4gIGlzU2ltcGxlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvLyAnU2ltcGxlJyBoZXJlIG1lYW5zIGFueXRoaW5nXG4gICAgLy8gb3RoZXIgdGhhbiBhbiBPYmplY3Qgb3IgYW4gQXJyYXlcbiAgICAvLyBpLmUuIG51bWJlciwgc3RyaW5nLCBkYXRlLCBib29sLCBudWxsLCB1bmRlZmluZWQsIHJlZ2V4Li4uXG4gICAgcmV0dXJuICF0aGlzLmlzT2JqZWN0KHZhbHVlKSAmJiAhdGhpcy5pc0FycmF5KHZhbHVlKVxuICB9LFxuICBpc0Z1bmN0aW9uOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlT2YodmFsdWUpID09PSAnZnVuY3Rpb24nXG4gIH0sXG4gIGlzRGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZU9mKHZhbHVlKSA9PT0gJ2RhdGUnXG4gIH0sXG4gIGlzTnVsbDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsXG4gIH0sXG4gIGlzVW5kZWZpbmVkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mICh2YWx1ZSkgPT09ICd1bmRlZmluZWQnXG4gIH0sXG4gIGlzTnVsbE9yVW5kZWZpbmVkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5pc051bGwodmFsdWUpIHx8IHRoaXMuaXNVbmRlZmluZWQodmFsdWUpXG4gIH0sXG4gIGNhc3Q6IGZ1bmN0aW9uICh2YWx1ZSwgdHlwZSkge1xuICAgIGlmICghdHlwZSkge1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFN0cmluZzpcbiAgICAgICAgcmV0dXJuIHV0aWwuY2FzdFN0cmluZyh2YWx1ZSlcbiAgICAgIGNhc2UgTnVtYmVyOlxuICAgICAgICByZXR1cm4gdXRpbC5jYXN0TnVtYmVyKHZhbHVlKVxuICAgICAgY2FzZSBCb29sZWFuOlxuICAgICAgICByZXR1cm4gdXRpbC5jYXN0Qm9vbGVhbih2YWx1ZSlcbiAgICAgIGNhc2UgRGF0ZTpcbiAgICAgICAgcmV0dXJuIHV0aWwuY2FzdERhdGUodmFsdWUpXG4gICAgICBjYXNlIE9iamVjdDpcbiAgICAgIGNhc2UgRnVuY3Rpb246XG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNhc3QnKVxuICAgIH1cbiAgfSxcbiAgY2FzdFN0cmluZzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgfHwgdXRpbC50eXBlT2YodmFsdWUpID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZyAmJiB2YWx1ZS50b1N0cmluZygpXG4gIH0sXG4gIGNhc3ROdW1iZXI6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gTmFOXG4gICAgfVxuICAgIGlmICh1dGlsLnR5cGVPZih2YWx1ZSkgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSlcbiAgfSxcbiAgY2FzdEJvb2xlYW46IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB2YXIgZmFsc2V5ID0gWycwJywgJ2ZhbHNlJywgJ29mZicsICdubyddXG4gICAgcmV0dXJuIGZhbHNleS5pbmRleE9mKHZhbHVlKSA9PT0gLTFcbiAgfSxcbiAgY2FzdERhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8IHV0aWwudHlwZU9mKHZhbHVlKSA9PT0gJ2RhdGUnKSB7XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKVxuICB9LFxuICBpc0NvbnN0cnVjdG9yOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5pc1NpbXBsZUNvbnN0cnVjdG9yKHZhbHVlKSB8fCBbQXJyYXksIE9iamVjdF0uaW5kZXhPZih2YWx1ZSkgPiAtMVxuICB9LFxuICBpc1NpbXBsZUNvbnN0cnVjdG9yOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gW1N0cmluZywgTnVtYmVyLCBEYXRlLCBCb29sZWFuXS5pbmRleE9mKHZhbHVlKSA+IC0xXG4gIH0sXG4gIGlzU3VwZXJtb2RlbENvbnN0cnVjdG9yOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5pc0Z1bmN0aW9uKHZhbHVlKSAmJiB2YWx1ZS5wcm90b3R5cGUgPT09IFN1cGVybW9kZWxcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxcbiIsIid1c2Ugc3RyaWN0J1xuXG5mdW5jdGlvbiBWYWxpZGF0aW9uRXJyb3IgKHRhcmdldCwgZXJyb3IsIHZhbGlkYXRvciwga2V5KSB7XG4gIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG4gIHRoaXMuZXJyb3IgPSBlcnJvclxuICB0aGlzLnZhbGlkYXRvciA9IHZhbGlkYXRvclxuXG4gIGlmIChrZXkpIHtcbiAgICB0aGlzLmtleSA9IGtleVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVmFsaWRhdGlvbkVycm9yXG4iLCIndXNlIHN0cmljdCdcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKVxuXG5mdW5jdGlvbiBXcmFwcGVyIChkZWZhdWx0VmFsdWUsIHdyaXRhYmxlLCB2YWxpZGF0b3JzLCBnZXR0ZXIsIHNldHRlciwgYmVmb3JlU2V0LCBhc3NlcnQpIHtcbiAgdGhpcy52YWxpZGF0b3JzID0gdmFsaWRhdG9yc1xuXG4gIHRoaXMuX2RlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZVxuICB0aGlzLl93cml0YWJsZSA9IHdyaXRhYmxlXG4gIHRoaXMuX2dldHRlciA9IGdldHRlclxuICB0aGlzLl9zZXR0ZXIgPSBzZXR0ZXJcbiAgdGhpcy5fYmVmb3JlU2V0ID0gYmVmb3JlU2V0XG4gIHRoaXMuX2Fzc2VydCA9IGFzc2VydFxuICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG4gIGlmICghdXRpbC5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlXG5cbiAgICBpZiAoIXV0aWwuaXNVbmRlZmluZWQoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgdGhpcy5fdmFsdWUgPSBkZWZhdWx0VmFsdWVcbiAgICB9XG4gIH1cbn1cbldyYXBwZXIucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHRoaXMuc2V0VmFsdWUodGhpcy5fZGVmYXVsdFZhbHVlKHBhcmVudCksIHBhcmVudClcbiAgdGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZVxufVxuV3JhcHBlci5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgcmV0dXJuIHRoaXMuX2dldHRlciA/IHRoaXMuX2dldHRlci5jYWxsKG1vZGVsKSA6IHRoaXMuX3ZhbHVlXG59XG5XcmFwcGVyLnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSwgbW9kZWwpIHtcbiAgaWYgKCF0aGlzLl93cml0YWJsZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVmFsdWUgaXMgcmVhZG9ubHknKVxuICB9XG5cbiAgLy8gSG9vayB1cCB0aGUgcGFyZW50IHJlZiBpZiBuZWNlc3NhcnlcbiAgaWYgKHZhbHVlICYmIHZhbHVlLl9fc3VwZXJtb2RlbCAmJiBtb2RlbCkge1xuICAgIGlmICh2YWx1ZS5fX3BhcmVudCAhPT0gbW9kZWwpIHtcbiAgICAgIHZhbHVlLl9fcGFyZW50ID0gbW9kZWxcbiAgICB9XG4gIH1cblxuICB2YXIgdmFsXG4gIGlmICh0aGlzLl9zZXR0ZXIpIHtcbiAgICB0aGlzLl9zZXR0ZXIuY2FsbChtb2RlbCwgdmFsdWUpXG4gICAgdmFsID0gdGhpcy5nZXRWYWx1ZShtb2RlbClcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSB0aGlzLl9iZWZvcmVTZXQgPyB0aGlzLl9iZWZvcmVTZXQodmFsdWUpIDogdmFsdWVcbiAgfVxuXG4gIGlmICh0aGlzLl9hc3NlcnQpIHtcbiAgICB0aGlzLl9hc3NlcnQodmFsKVxuICB9XG5cbiAgdGhpcy5fdmFsdWUgPSB2YWxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXcmFwcGVyXG4iXX0=
