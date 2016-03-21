import _ from 'lodash';
import { defonce } from 'ud';
import mainLoop from 'main-loop';
import virtualDom from 'virtual-dom';

import dispatcher from './dispatcher.js';
import render from './render.js';

// support live reloading ?
const DEVELOPMENT_MODE = true;

// hyperlog stuff
import swarmlog from 'swarmlog';
import level from 'level-browserify';
import chloride from 'chloride/browser';

import boardKeys from '../keys.json';
import boardName from '../name.json'

const appDB = level(`./${boardKeys.id}-appDB`);
const BOARD_NAME = boardName.boardName;
const swarmlogDB = level(`./${boardKeys.id}-swarmlog`);

const log = swarmlog({
  keys: boardKeys,
  sodium: chloride,
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
    keys: boardKeys,
    boardName: BOARD_NAME,
    pseudonym: null, 
  }
}

// defonced global app state
const appState = defonce(module, initialState, 'appState');

function message (to, msg, from) {
  return {
    message: msg,
    replyTo: to ? to : null,
    pseudonym: from
  }
}

function setup_actions (appState) {
  dispatcher.on('swarmlog-data', function (d) {
    // add received message to our webapp state
    appState.messages.push(d)
    dispatcher.emit('update', appState)
  })

  dispatcher.on('textbox-value', function (messageID, msg) {
    appState.inputs[messageID] = msg
    dispatcher.emit('update', appState)
  })
  
  dispatcher.on('send-message', function (replyTo, msg) {
    // add message to the hyperlog
    const sm = message(replyTo, msg, appState.pseudonym)
    appState.hyperlog.append(sm)
    // empty the input box
    dispatcher.emit('edit-input', replyTo, '')
    dispatcher.emit('update', appState)
  })

  dispatcher.on('change-pseudonym', (p) => {
    appState.pseudonym = p
    appDB.put('pseudonym', p)
    dispatcher.emit('update', appState)
  })

  dispatcher.on('edit-input', (mKey, v) => {
    appState.inputs[mKey] = v
    dispatcher.emit('update', appState)
  })
}

const el = document.querySelector('#app');
function setupVirtualDOM(renderFn, appState) {
  const loop = mainLoop(appState, renderFn, virtualDom);
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
  appState.messages = []
}

function setup () {
  if (DEVELOPMENT_MODE) reload() // if in development mode, reset the app

  // make a `domUpdateLoop` and `appState` as initial state
  // view items will emit events over `dispatcher`
  var domUpdateLoop = setupVirtualDOM(render, appState)

  // `actions` will react to events on `dispatcher`
  // and mutate `appState`, triggering `domUpdateLoop` to update
  setup_actions(appState) 
  dispatcher.on('update', domUpdateLoop.update) // 

  appDB.get('pseudonym', (err, p) => {
    if (p) dispatcher.emit('change-pseudonym', p)
  })
}

// TODO onready
setup()

export default render;
