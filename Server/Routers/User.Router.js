import express from 'express'
import { AuthMiddleware,CheckRole} from '../Controllers/Auth.controller.js'
import {getAllUsers,UpdateUsers,deleteUsers,getUsersById} from '../Controllers/Users.controller.js'//,addUsers,

const UsersRouter=express.Router()

UsersRouter.put('/Update/:id', AuthMiddleware, UpdateUsers)
UsersRouter.patch('/Update/:id', AuthMiddleware, UpdateUsers)

UsersRouter.use(AuthMiddleware, CheckRole("admin"));

UsersRouter.get('/', getAllUsers);
UsersRouter.get('/GetById/:id', getUsersById)
UsersRouter.delete('/Delete/:id', deleteUsers)

export default UsersRouter