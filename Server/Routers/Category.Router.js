import express from 'express'
import { AuthMiddleware,CheckRole} from '../Controllers/Auth.controller.js'
import {getAllCategory,getCategoryById,addCategory,UpdateCategory,deleteCategory} from '../Controllers/Category.controller.js'

const CategoryRouter=express.Router()

CategoryRouter.get('/',getAllCategory);

CategoryRouter.get('/GetById/:id',getCategoryById);

CategoryRouter.use(AuthMiddleware,CheckRole("admin"));

CategoryRouter.post('/Add',addCategory);

CategoryRouter.put('/Update/:id',UpdateCategory);

CategoryRouter.delete('/Delete/:id',deleteCategory);


export default CategoryRouter