// support live reloading ?
var dev = true;
// deps
var ud = require('ud')
var el = document.querySelector('#app')
function declare (fn, store) {
  var ml = require('main-loop')
  var vd = require('virtual-dom')
  var l = ml(store, fn, vd)
  el.appendChild(l.target)
  return l
}

// here's a simple model of the program
// 
//    view = F(state)
//
// the view is a pure function of the state
// 
// but...users can do stuff in the view
// which can affect the application state.
// so, we give the view a way to communicate to the state 
// - a Dispatcher.
// 
//    view = F(state, dispatcher)
//
// the view can emit events over this dispatcher
// and, some Actions listen to these events
// and mutate `state` based on what they hear,
// and what they do in response to what they hear
//
//    view = F(state, dispatcher)
//    actions(dispatcher, state)
//
// now, whenever `actions` wants to signal 
// that it's time for the view to update,
// it emits an 'update' event over dispatcher
//
// thats it!
// data flows in a circle,
//
//    view ----> actions
//      ^          |
//      |          |
//    state <-------
//
// we can livecode `view.js` and `actions.js`.
// `store.js` represents the initial application state, and
// we can't live code that. changes to `store.js` 
// take effect on refresh.
//
// do you see why?
//
// the `state` is just `store` at some point in time
// we can't live-code the state. instead,
// we modify the rules by which the state updates
// when we change `action.js` and `view.js`
//
// happy live-coding!
// nick


// `dispatcher` is an app-wide event emitter 
// it is "defonce"d, meaning it persists over reloads
var EE = require('events').EventEmitter
var dispatcher = ud.defonce(module, 
                            () => new EE(), 
                            'dispatcher')

// global app state is also defonced
var store = ud.defonce(module, 
                       require('./store.js'), 
                       'store')

// view fn - emits dispatcher events
var render = require('./view.js')
// actions - consume dispatcher events
var actions = require('./actions.js')
// a function to run on reload
function reload () {
	// delete old view
	el.innerHTML = ''
	// remove all old listeners on the dispatcher
	dispatcher.removeAllListeners()
}
// a function to run on setup
function setup () {
	if (dev)     // if we're devloping
		reload()   // reload
	// make a `loop` with `render` fn 
  // and `store` as initial state
  // view items will emit events over `dispatcher`
	var loop = declare(render(dispatcher), store)
	// `actions` will react to events on `dispatcher`
  // and mutate `store`, triggering `loop` to update
	actions(dispatcher, store) 
  dispatcher.on('update', loop.update)
}

// TODO onready
setup()
