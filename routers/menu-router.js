import { Router } from 'express'
import supabase from '../database/supabase.js'

const menuRouter = Router()

menuRouter.get('/items', async (req, res) => {
  const { data: menuItems, error } = await supabase
    .from('menuItem')
    .select('*')
    .order('id', { ascending: false })

  const { data: menuCategories, error: errorCategories } = await supabase
    .from('menuCategory')
    .select('*')
    .order('id', { ascending: false })

  menuItems.forEach((item) => {
    // return .name instead of .id
    item.category = menuCategories.find((category) => category.id === item.category).name
  })

  if (error || errorCategories) res.status(400).json({ error: error.message })
  else res.status(200).json(menuItems)
})

export default menuRouter
