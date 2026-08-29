import express from 'express'
import { AuthMiddleware,CheckRole} from '../Controllers/Auth.controller.js'
import {getAllMessages,addMessage,deleteMessage,updateMessageStatus,markMessageAsRead} from '../Controllers/Message.controller.js'

const MessageRouter=express.Router()

MessageRouter.post('/Add',AuthMiddleware,addMessage);

MessageRouter.use(AuthMiddleware,CheckRole("admin"));

MessageRouter.get('/',getAllMessages);

MessageRouter.delete('/Delete/:id',deleteMessage);

MessageRouter.put('/UpdateStatus/:id',updateMessageStatus);

MessageRouter.put('/MarkAsRead/:id',markMessageAsRead);


export default MessageRouter