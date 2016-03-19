// deps
import {_} from 'lodash';

// support live reloading ?
const DEVELOPMENT_MODE = true;
const el = document.querySelector('#app');


// hyperlog stuff
var swarmlog = require('swarmlog');
var level = require('level-browserify');
var keys = require('../keys.json');

var appDB = level(`./${keys['id']}-appDB`);

const BOARD_NAME = require('../name.json').boardName;
var swarmlogDB = level(`./${keys['id']}-swarmlog`);

var log = swarmlog({
  keys: keys,
  sodium: require('chloride/browser'),
  db: swarmlogDB,
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
    boardName: BOARD_NAME,
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

// defonced global app state
var appState = ud.defonce(module, initialState, 'appState')


function setupVirtualDOM(renderFn, appState) {
  var mainLoop = require('main-loop')
  var virtualDom = require('virtual-dom')
  var loop = ml(appState, renderFn, virtualDom)
  el.appendChild(loop.target)
  return loop
}

// reset the app on reload
function reload () {
  // delete old view
  el.innerHTML = ''
  // remove all old listeners on the dispatcher
  dispatcher.removeAllListeners()
  // delete all messages 
  // TODO why is this needed, when it wasn't before?
  store.messages = []
}

function setup () {
  if (dev)     // if we're devloping
    reload()   // reload

  // make a `domUpdateLoop` and `store` as initial state
  // view items will emit events over `dispatcher`
  var domUpdateLoop = setupVirtualDOM(render, store)

  // `actions` will react to events on `dispatcher`
  // and mutate `store`, triggering `loop` to update
  actions.setup_actions(store) 
  dispatcher.on('update', domUpdateLoop.update)
  db.get('pseudonym', (err, p) => {
    if (p) dispatcher.emit('change-pseudonym', p)
  })
}

// TODO onready
setup()

module.exports = {
  render
}
