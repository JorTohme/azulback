import { Router } from 'express'
import supabase from '../database/supabase.js'

const tablesRouter = Router()

tablesRouter.get('/', async (req, res) => {
  const { data: tables, error } = await supabase
    .from('table')
    .select('*')

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(tables)
})

tablesRouter.put('/open/:tableId', async (req, res) => {
  const { tableId } = req.params
  const { people } = req.body
  const { data: table, error } = await supabase
    .from('table')
    .update({ state: 'busy', people })
    .eq('id', tableId)

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(table)
})

tablesRouter.put('/pay/:tableId', async (req, res) => {
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

  if (error2) res.status(400).json({ error: error2.message })
  else res.status(200).json({ table, orders })
})

tablesRouter.put('/free/:tableId', async (req, res) => {
  const { tableId } = req.params
  const { data: table, error } = await supabase
    .from('table')
    .update({ state: 'free' })
    .eq('id', tableId)
    .eq('state', 'pay')

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(table)
})

tablesRouter.get('/orders/:tableId', async (req, res) => {
  const { tableId } = req.params
  const { data: orders, error } = await supabase
    .from('order')
    .select('*')
    .eq('table_id', tableId)

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(orders)
})

export default tablesRouter
