import { Router } from 'express'
import supabase from '../database/supabase.js'

const menuRouter = Router()

menuRouter.get('/items', async (req, res) => {
  const { data: menuItems, error } = await supabase
    .from('menuItem')
    .select('*')
    .order('id', { ascending: false })

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(menuItems)
})

export default menuRouter
