import fs  from 'fs'
import debug from 'debug'

const logerror = debug('tetris:error') , loginfo = debug('tetris:info')

const initApp = (app, params, cb) => {
		const {host, port} = params
		const handler = (req, res) => {
				const file = '/../../index.html'
				fs.readFile(__dirname + file, (err, data) => {
						if (err) {
								console.log(err)
								res.writeHead(500)
								return res.end('Error loading index.html')
						}
						res.writeHead(200)
						res.end(data)
				})
		}

		app.on('request', handler)

		app.listen({host, port}, () =>{
				console.log(`tetris listen on ${params.url}`)
				cb()
		})
}

const initEngine = io => {
		io.on('connection', function(socket){
				console.log("Socket connected: " + socket.id)
				socket.on('action', (msg) => {
						if (msg === 'start') {
							sockett.emit('info', 'start not implem .. ');
						}
						else {
							socket.emit('info', 'action not handled');
						}
				})
				socket.on('disconnect', function(){
					console.log("Socket disconnected: " + socket.id)
				});
		})
}

const create = (params) => {
		const promise = new Promise( (resolve, reject) => {
				const app = require('http').createServer()
				initApp(app, params, () => {
						const io = require('socket.io')(app)
						const stop = (cb) => {
								io.close()
								app.close( () => {
										app.unref()
								})
								console.log(`Engine stopped.`)
								cb()
						}

						initEngine(io)

						resolve({stop})
				})
		})
		return promise
}

create({host: "127.0.0.1", port: "3000", url: "/"})
		.then(() => { console.log(('tetris up'))} )
