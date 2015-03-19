express = require 'express'
path = require 'path'
app = express()
server = require('http').Server(app);
bodyParser = require 'body-parser'
logger = require 'express-logger'
# express config
publicDir = "#{__dirname}/dist"
app.use(express.static(publicDir))
app.use(bodyParser.json())
# debug logger
app.use(logger({path: './logs/logfile.txt'}))
# config
port = 3000

#
# HTTP routes
#
app.get('/', (req, res) ->
	res.sendFile(
		path.join(publicDir, 'index.html')))

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
