var h = require('virtual-dom/h')
var EE = require('events').EventEmitter
var dispatcher = new EE()
function declare (fn, store) {
  var ml = require('main-loop')
  var l = ml(store, fn, require('virtual-dom'))
  document.querySelector('#app').appendChild(l.target)
  return l
}


// data structures

var store = {
  n: 0
}


// view logic

function render (state) {

  return h('div', [
    h('h1', `clicked ${state.n} times`),
    h('button', { onclick: handleClick }, 'click me!')
  ])

  function handleClick (ev) {
    dispatcher.emit('button-click', ev)
  }
}


// actions

var loop = declare(render, store)

dispatcher.on('button-click', (ev) => {
  store.n = store.n+1 
  loop.update(store)
})
