express = require 'express'
path = require 'path'
app = express()
server = require('http').Server(app);
bodyParser = require 'body-parser'
logger = require 'express-logger'
fs = require 'fs'

#
# express config
#
port = 3000
publicDir = "#{__dirname}/dist"
app.use(express.static(publicDir))
app.use(bodyParser.json())
# debug logger
app.use(logger({path: './logs/logfile.txt'}))

read = (file) ->
    fs.createReadStream(path.join(publicDir, file))

#
# HTTP routes
#
app.get('/', (req, res) -> read('index.html').pipe(res))

app.post('/json', (req, res) ->
	console.log 'json!!', req.body
	res.json({
		message: 'thanks'
	}))

#
# run server
#
server.listen(port)
console.log 'server listening on ' + port
