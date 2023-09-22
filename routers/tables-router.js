import { Router } from 'express'
import supabase from '../database/supabase.js'
import { io } from '../index.js'
import { checkUser } from '../middleware/userfunctions.js'
const tablesRouter = Router()

tablesRouter.get('/', async (req, res) => {
  const { data: tables, error } = await supabase
    .from('table')
    .select('*')

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(tables)
})

tablesRouter.put('/open/:tableId', checkUser, async (req, res) => {
  const { tableId } = req.params
  const { people } = req.body
  const { data: table, error } = await supabase
    .from('table')
    .update({ state: 'busy', people })
    .eq('id', tableId)

  const { userError } = await supabase.auth.signOut()

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(table)

  io.emit('updateSpaces', { success: !(error), error: error?.message })
})

tablesRouter.put('/pay/:tableId', checkUser, async (req, res) => {
  const { tableId } = req.params
  const { data: table, error } = await supabase
    .from('table')
    .update({ state: 'pay' })
    .eq('id', tableId)

  if (error) res.status(400).json({ error: error.message })

  const { data: orders, error2 } = await supabase
    .from('order')
    .update({ finished: true })
    .eq('table_id', tableId)

  const { userError } = await supabase.auth.signOut()

  if (error2) res.status(400).json({ error: error2.message })
  else res.status(200).json({ table, orders })

  io.emit('updateSpaces', { success: !(error || error2), error: error?.message || error2?.message })
})

tablesRouter.put('/free/:tableId', checkUser, async (req, res) => {
  const { tableId } = req.params
  const { data: table, error } = await supabase
    .from('table')
    .update({ state: 'free' })
    .eq('id', tableId)
    .eq('state', 'pay')

  const { userError } = await supabase.auth.signOut()

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(table)

  io.emit('updateSpaces', { success: !(error), error: error?.message })
})

// Todas las ordenes, incluso las terminadas
tablesRouter.get('/orders/:tableId', checkUser, async (req, res) => {
  const { tableId } = req.params
  const { data: orders, error } = await supabase
    .from('order')
    .select('*')
    .eq('table_id', tableId)

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(orders)
})

export default tablesRouter
