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

export default tablesRouter
