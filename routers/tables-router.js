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
  console.log(req.body)
  const { data: table, error } = await supabase
    .from('table')
    .update({ state: 'busy', people })
    .eq('id', tableId)

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(table)
})

export default tablesRouter
