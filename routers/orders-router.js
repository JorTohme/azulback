import { Router } from 'express'
import supabase from '../database/supabase.js'

const ordersRouter = Router()

ordersRouter.get('/today', async (req, res) => {
  const { data: todayOrders, error } = await supabase
    .from('order')
    .select('*')
    // .eq('created_at', new Date().toISOString().slice(0, 10))

  // get items from the order
  const { data: orderItem, error2 } = await supabase
    .from('orderItem')
    .select('*')
    .in('order_id', todayOrders.map((order) => order.id))

  // get menu items from the order items
  const { data: menuItems, error3 } = await supabase
    .from('menuItem')
    .select('*')
    .in('id', orderItem.map((item) => item.menu_item_id))

  // add menu items to the order items
  const orderItemsWithMenuItems = orderItem.map((item) => {
    const menuItem = menuItems.find((menuItem) => menuItem.id === item.menu_item_id)
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

export default ordersRouter
