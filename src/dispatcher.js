import { defonce } from 'ud';
import events from 'events';
let EE = events.EventEmitter

const dispatcher = defonce(module, function () { return new EE()}, 'dispatcher')

export default dispatcher;
