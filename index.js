var el = document.querySelector('#app')
function declare (fn, store) {
  var ml = require('main-loop')
  var l = ml(store, fn, require('virtual-dom'))
  el.appendChild(l.target)
  return l
}
var ud = require('ud')
var udK = require('ud-kefir')

var EE = require('events').EventEmitter
var dispatcher = ud.defonce(module, () => new EE(), 'dispatcher')

// data structures

var store = ud.defonce(module, function () { 
	return {
		n: 0 
	}
}, 'store')

// view logic
var render = require('./view.js')
var renderS = udK(module, render, 'render fns')

var actions = require('./actions.js')
var actionS = udK(module, actions, 'actions fns')

// make the loop, for the first time
var loop = declare(render(dispatcher), store)

// whenever there's a new render fn
renderS.onValue(r => {
	// delete old view
	el.innerHTML = ''
  // make a new loop
	loop = declare(r(dispatcher), store)
})

actionS.onValue(a => {
	dispatcher.removeAllListeners()
	a(dispatcher, store, loop) 
})


// TODO slightly clearer taredown() and setup() syntax
