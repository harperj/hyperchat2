// support live reloading ?
var dev = true;
// setup dom rendering
var el = document.querySelector('#app')
function declare (fn, store) {
  var ml = require('main-loop')
  var l = ml(store, fn, require('virtual-dom'))
  el.appendChild(l.target)
  return l
}
// for defoncing state
var ud = require('ud')
// `dispatcher` is an app-wide event emitter 
// it is "defonce"d, meaning it persists over reloads
var EE = require('events').EventEmitter
var dispatcher = ud.defonce(module, () => new EE(), 'dispatcher')



// data structures
// global app state is also defonced
var store = ud.defonce(module, function () { 
	return {
		n: 0 
	}
}, 'store')

// view fn - emits dispatcher events
var render = require('./view.js')
// actions - consume dispatcher events
var actions = require('./actions.js')

// we run this on code reload
function reload () {
	// delete old view
	el.innerHTML = ''
	// remove all old listeners on the dispatcher
	dispatcher.removeAllListeners()
}

// we run this on start
function setup () {
	if (dev)
		reload()
	// make a new loop
	var loop = declare(render(dispatcher), store)
	// set up all our new listeners
	actions(dispatcher, store, loop) 
}

// TODO onready
setup()
