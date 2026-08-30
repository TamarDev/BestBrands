import express from 'express'
import { AuthMiddleware,CheckRole} from '../Controllers/Auth.controller.js'
import {
  getAllProduct,
  getProductById,
  addProduct,
  UpdateProduct,
  deleteProduct,
  getProductsByBrand
} from '../Controllers/Product.controller.js'
import upload from '../multer.js'

const ProductRouter = express.Router()

ProductRouter.get('/', getAllProduct)
ProductRouter.get('/GetByBrand/:name', getProductsByBrand)

ProductRouter.get('/GetById/:id', getProductById)


ProductRouter.use(AuthMiddleware,CheckRole("admin"));

ProductRouter.post('/Add',upload.single("image"), addProduct)
ProductRouter.put('/Update/:id', upload.single("image"), UpdateProduct)
ProductRouter.delete('/Delete/:id', deleteProduct)

export default ProductRouter

