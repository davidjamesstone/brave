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
