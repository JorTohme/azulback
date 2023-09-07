import { Router } from 'express'
import supabase from '../database/supabase.js'

const ordersRouter = Router()

ordersRouter.get('/today', async (req, res) => {
  const { data: todayOrders, error } = await supabase
    .from('order')
    .select('*')
    // get order from the last 12 hours and finished: false
    .gte('created_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString())
    .eq('finished', false)
    .order('created_at', { ascending: false })

  // get items from the order
  const { data: orderItem, error2 } = await supabase
    .from('orderItem')
    .select('*')
    .in('order_id', todayOrders.map((order) => order.id))

  // get menu items from the order items
  const { data: menuItems, error3 } = await supabase
    .from('menuItem')
    .select('*')
    .in('id', orderItem.map((item) => item.item_id))

  // add menu items to the order items
  const orderItemsWithMenuItems = orderItem.map((item) => {
    const menuItem = menuItems.find((menuItem) => menuItem.id === item.item_id)
    return { ...item, menuItem }
  })

  // add order items to the orders
  const todayOrdersWithOrderItems = todayOrders.map((order) => {
    const orderItems = orderItemsWithMenuItems.filter((item) => item.order_id === order.id)
    return { ...order, orderItems }
  })

  if (error || error2 || error3) res.status(400).json({ error: error.message })
  else res.status(200).json(todayOrdersWithOrderItems)
})

ordersRouter.post('/', async (req, res) => {
  const { data } = req.body
  // create table order
  const { data: tableOrder, error } = await supabase
    .from('order')
    .insert({ waiter_name: data.waiterName, table_id: data.tableNumber })
    .single()
    .select()

  // create order items
  const orderItems = data.orderItems.map((item) => {
    return {
      order_id: tableOrder.id,
      item_id: item.id,
      note: item.note,
      quantity: item.quantity
    }
  })

  const { data: orderItemsData, error2 } = await supabase
    .from('orderItem')
    .insert(orderItems)

  if (error || error2) res.status(400).json({ error: error.message })
  else res.status(200).json({ order: tableOrder, orderItems: orderItemsData })
})

ordersRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const { data, error } = await supabase
    .from('order')
    .update({ status })
    .eq('id', id)
    .single()

  if (error) res.status(400).json({ error: error.message })
  else res.status(200).json(data)
})

export default ordersRouter
