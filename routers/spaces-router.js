import { Router } from 'express'
import supabase from '../database/supabase.js'
import { checkOrigin } from '../userfunctions/userfunctions.js'

const spacesRouter = Router()

spacesRouter.get('/', async (req, res) => {
  const { data: spaces, error } = await supabase
    .from('space')
    .select('*')
    .order('id', { ascending: false })

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(spaces)
})

spacesRouter.get('/tables', async (req, res) => {
  const check = await checkOrigin(req)
  if (check) return res.status(401).json(check)

  const { data: spaces, error } = await supabase
    .from('space')
    .select('*')
    .order('id', { ascending: true })

  const { data: tables, error2 } = await supabase
    .from('table')
    .select('*')
    .order('id', { ascending: true })

  const spacesAndTables = spaces.map((space) => {
    const tablesFromSpace = tables.filter((table) => table.space_id === space.id)
    return { ...space, tables: tablesFromSpace }
  })

  if (error || error2) res.status(400).json({ error: error.message })
  else res.status(200).json(spacesAndTables)
})

// No se usa por ahora
spacesRouter.get('/:spaceId', async (req, res) => {
  const { spaceId } = req.params
  const { data: tables, error } = await supabase
    .from('table')
    .select('*')
    .eq('space_id', spaceId)

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(tables)
})

export default spacesRouter
