// support live reloading ?
var dev = true;
// deps
var _ = require('lodash')
var ud = require('ud')
var makeLog = require('./makeLog')
var el = document.querySelector('#app')
function declare (fn, store) {
  var ml = require('main-loop')
  var vd = require('virtual-dom')
  var l = ml(store, fn, vd)
  el.appendChild(l.target)
  return l
}
var dispatcher = require('./dispatcher.js')



// data structures

function initialState () {
  return {
  	messages: [],
    hyperlog: makeLog(dispatcher),
  }
}

function message (to, msg) {
	return {
		message: msg,
		replyTo: to ? to : null,
	}
}



// defonced state
// global app state is also defonced
var store = ud.defonce(module, initialState, 'store')



// actions
function actions (store) {
  dispatcher.on('swarmlog-data', function (d) {
    console.log('swarmlog-data', d)
  	// add received message to our webapp state
  	store.messages.push(d)
    dispatcher.emit('update', store)
  })

  dispatcher.on('textbox-value', function (messageID, msg) {
    store.inputs[messageID] = msg
    dispatcher.emit('update', store)
  })
  
  dispatcher.on('send-message', function (replyTo, msg) {
  	// add message to the hyperlog
    var sm = message(replyTo, msg, store.pseudonym)
  	store.hyperlog.append(sm)
    dispatcher.emit('update', store)
  })
  
}



// setup
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
  var loop = declare(require('./render.js'), store)
  // `actions` will react to events on `dispatcher`
  // and mutate `store`, triggering `loop` to update
  actions(store) 
  dispatcher.on('update', loop.update)
}

// TODO onready
setup()
