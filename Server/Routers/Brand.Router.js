import express from 'express'
import { AuthMiddleware,CheckRole} from '../Controllers/Auth.controller.js'
import {getAllBrands,addBrand,UpdateBrand,getBrandById,deleteBrand, getBrandByName} from '../Controllers/Brands.controlller.js'
import upload from "../multer.js";
const BrandRouter=express.Router()

BrandRouter.get('/',getAllBrands);

BrandRouter.get('/GetById/:id',getBrandById);

BrandRouter.get('/GetByName/:name',getBrandByName);

BrandRouter.use(AuthMiddleware,CheckRole("admin"));

BrandRouter.post('/Add',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'imagePage', maxCount: 1 }]),addBrand);

BrandRouter.put('/Update/:id',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'imagePage', maxCount: 1 }]),UpdateBrand);

BrandRouter.delete('/Delete/:id',deleteBrand);

export default BrandRouter