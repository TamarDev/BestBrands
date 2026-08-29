import express from 'express'
import { AuthMiddleware, CheckRole } from '../Controllers/Auth.controller.js'
import {
  getAllShoppingCart,
  getShoppingCartById,
  deleteShoppingCart,
  getMyCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
} from '../Controllers/ShoppingCart.controller.js'

const ShoppingCartRouter = express.Router()

ShoppingCartRouter.use(AuthMiddleware)

ShoppingCartRouter.get('/', CheckRole('admin'), getAllShoppingCart)
ShoppingCartRouter.get('/GetById/:id', CheckRole('admin'), getShoppingCartById)
ShoppingCartRouter.delete('/Delete/:id', CheckRole('admin'), deleteShoppingCart)

ShoppingCartRouter.get('/get', CheckRole('user'), getMyCart)
ShoppingCartRouter.post('/addItem', CheckRole('user'), addItemToCart)
ShoppingCartRouter.put('/updateItem', CheckRole('user'), updateItemQuantity)
ShoppingCartRouter.delete('/removeItem', CheckRole('user'), removeItemFromCart)
ShoppingCartRouter.delete('/clear', CheckRole('user'), clearCart)

export default ShoppingCartRouter