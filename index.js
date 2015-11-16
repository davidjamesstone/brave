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
