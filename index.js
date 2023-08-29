import 'dotenv/config'
import express from 'express'
import cors from 'cors'

// Routers
import spacesRouter from './routers/spaces-router.js'
import tablesRouter from './routers/tables-router.js'
import ordersRouter from './routers/orders-router.js'
import menuRouter from './routers/menu-router.js'

const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('menu', menuRouter)
app.use('/orders', ordersRouter)
app.use('/tables', tablesRouter)
app.use('/spaces', spacesRouter)

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
