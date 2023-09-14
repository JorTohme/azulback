import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
// Routers
import spacesRouter from './routers/spaces-router.js'
import tablesRouter from './routers/tables-router.js'
import ordersRouter from './routers/orders-router.js'
import menuRouter from './routers/menu-router.js'
import userRouter from './routers/user-router.js'

// Socket
import { Server } from 'socket.io'
import { createServer } from 'node:http'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.use(cors())
app.use(bodyParser.json())

io.on('connection', (socket) => {
  console.log('a user connected')
})

io.on('disconnect', () => {
  console.log('user disconnected')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/menu', menuRouter)
app.use('/orders', ordersRouter)
app.use('/tables', tablesRouter)
app.use('/spaces', spacesRouter)
app.use('/user', userRouter)

server.listen(3000, () => {
  console.log('Server is listening on port 3000')
})

export { io }
