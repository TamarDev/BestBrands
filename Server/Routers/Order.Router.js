import express from 'express'
import { AuthMiddleware,CheckRole} from '../Controllers/Auth.controller.js'
import {
  getAllOrder,
  getOrderById,
  getOrderByUser,
  addOrder,
  UpdateOrder,
  deleteOrder
} from '../Controllers/Orders.controller.js'

const OrderRouter = express.Router()

OrderRouter.post('/Add',AuthMiddleware,CheckRole("user"), addOrder)
OrderRouter.get('/MyOrders', AuthMiddleware, CheckRole("user"), getOrderByUser);

OrderRouter.use(AuthMiddleware,CheckRole("admin"));

OrderRouter.get('/', getAllOrder)
OrderRouter.get('/GetById/:id', getOrderById)
OrderRouter.put('/Update/:id', UpdateOrder)
OrderRouter.delete('/Delete/:id', deleteOrder)

export default OrderRouter