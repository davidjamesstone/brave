# brave
Tiny web application library

Super simple library that helps with building websites.

Features:
- Backbone-like component definitions
- jQuery-like like event delegation
- Angular-like scopes and controllers
- Easy element referencing in controllers

So, what does it do?

- Allows you to define DOM components using javascript
- DOM scopes for components that can be isolated or can `inherit` from their parent
- Component level event delegation like jQuery `live`
- Elements can be aliased onto their scope to avoid document.getElementById calls

That's enough to start building quite some interesting applications. `brave`s main aim is to application structure by defining web component behaviors allowing you to take control of the DOM.

No two-way binding, or automatic DOM updates are done, how you do this is down to you. There are plenty to options available if you want to use another library alongside or it can just be done the old fashioned way with `event`s. Manually handling DOM updates and managing state yourself can be a chore but there can be lots of benefits over using frameworks in the long run. Building strong models that represent the data on the front end, using a tool like `brave` to organize and build your controllers/scopes can yield a nice clean code base that's easy to reason about.

`brave` is not a template library. How you generate HTML is down to you ([resigify](https://github.com/davidjamesstone/resigify) is used in the [Examples](examples)). `brave` works by querying the DOM to look for attributes that match components you have registered. During this query it initializes any components it finds and attaches the behaviors such as events. If a component itself renders some more DOM while initializing, its' new children will then also be processed.

Whilst this processing happens a scope chain of controllers is being built. This is a simple JS prototype chain and works in a similar fashion to AngularJS directives in that a components scope can be either isolated or `inherit` from their parent scope.

If you haven't used Angular before or any of this doesn't make sense don't worry, there's no steep learning curve.

`brave` works well with both client and server generated HTML, has barely no learning curve and plays well with any other javascript libraries and template engines.

`npm install brave --save`

`var Brave = require('brave')`

If you aren't using `browserify` simply include `dist/brave.js` in a `script` tag and it will export `window.Brave`

## Components
An object representing the component. Along with any other custom properties and functions, it can have the following properties:

### `on`
Object map of events.

```js
{
  on: {
    'click': function (e) {},
    'click:ul li a': function (e) {},
    'submit:form': function (e) {},
    'change:input': function (e) {},
  }
}
```

### `initialize` [function]
A function that will be called when the component is being initialized.

### `template` [function|string]
A HTML string or function that returns a HTML string.
The function will be passed the current `data`. The innerHTML of the element will be set and then `scan`ed.

### `isolate` [boolean(false)]
A Components' scopes' prototype will inherit from its' parent by default. Set this to `true` and the scope will be isolated.

## register
Used to register a component or components.

`Brave.register('name', componentObject)`
`Brave.register(componentsObject)`

E.g.

```js
Brave.register({
  mywidget: {
    on: {
      'click': function (e) {}
    }
  }
})
```

## scan
Query the DOM for components and initializes them.

`Brave.scan(el, [data])`

Elements are queried for attributes names matching component name.
The value of the attribute can make a reference `data`. E.g.

```html
<div mywidget="foo"></div>
```

```js
var data = {
  foo: {
    bar: 1,
    baz: 2
  }
}

Brave.scan(document.body, data)
```

## Aliases
DOM elements can be projected onto their scope by giving them an `as` attribute

```html
<div mywidget="foo">
  <input as="searchEl" type="text">
  <button as="searchButton" type="button">OK</button>
</div>
```

## Example

See the [Examples](examples)

```js

Brave.register({
  app: {
    initialize: function (e) { console.log('App initialize') },
    on: {
      'loggedin': function (e) {
        // CustomEvent
        console.log('User logged in')
      }
    }
  }
})

var data = {
  foo: {
    bar: 1,
    baz: 2
  }
}

Brave.scan(document.body, data)
```

```html
<div app="foo">
  <input as="searchText" type="search">
  <button as="searchButton" type="button">OK</button>
</div>
```

## Notes
A similar technique was used by Paul Irish who coined the name [DOM based routing](http://www.paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/)
