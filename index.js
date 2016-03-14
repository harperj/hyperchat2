// support live reloading ?
var dev = true;
// deps
var _ = require('lodash')
var ud = require('ud')
var el = document.querySelector('#app')
function declare (fn, store) {
  var ml = require('main-loop')
  var vd = require('virtual-dom')
  var l = ml(store, fn, vd)
  el.appendChild(l.target)
  return l
}
var dispatcher = require('./dispatcher.js')

// hyperlog stuff
var swarmlog = require('swarmlog')
var level = require('level-browserify')
var keys = require('./keys.json')

var log = swarmlog({
  keys: keys,
  sodium: require('chloride/browser'),
  db: level(`./${keys['id']}`),
  valueEncoding: 'json',
  hubs: [ 'https://signalhub.mafintosh.com' ]
})

// any new data from the hyperlog
log.createReadStream({ live: true })
   .on('data', data => 
     // is dispatched as 'swarmlog-data'
     dispatcher.emit('swarmlog-data', data))


// data structures

function initialState () {
  return {
  	messages: [],
    inputs: {
      null: ''
    },
    hyperlog: log,
    keys: keys,
    boardName: require('./name.json').boardName,
    pseudonym: null, 
  }
}

function message (to, msg, from) {
	return {
		message: msg,
		replyTo: to ? to : null,
    pseudonym: from
	}
}



// defonced state
// global app state is also defonced
var store = ud.defonce(module, initialState, 'store')



// actions
function actions (store) {
  dispatcher.on('swarmlog-data', function (d) {
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
    // empty the input box
    dispatcher.emit('edit-input', replyTo, '')
    dispatcher.emit('update', store)
  })

  dispatcher.on('change-pseudonym', (p) => {
    store.pseudonym = p
    dispatcher.emit('update', store)
  })

  dispatcher.on('edit-input', (mKey, v) => {
    store.inputs[mKey] = v
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
  // delete all messages 
  // TODO why is this needed, when it wasn't before?
  store.messages = []
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
