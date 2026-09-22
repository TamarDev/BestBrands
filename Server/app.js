import "dotenv/config";

import express from 'express'
import mongoose from 'mongoose'

// Security configuration.
import cors from "cors"

import { MONGO_URI } from './config.js'

import CategoryRouter from './Routers/Category.Router.js';
import BrandRouter from './Routers/Brand.Router.js';
import OrderRouter from './Routers/Order.Router.js';
import ProductRouter from './Routers/Product.Router.js';
import UserRouter from './Routers/User.Router.js';
import ShoppingCartRouter from './Routers/ShoppingCart.Router.js';
import AuthRouter from './Routers/Auth.Router.js';
import MessageRouter from "./Routers/Message.Router.js";




// Create the server.
const app=express()

// Define the function that confirms the server is running.
app.get("/", (req, res) => {
    res.send("BestBrands Server is Running!");
});


app.use(cors())

app.use(express.json());



app.use('/Auth',AuthRouter);
app.use('/Category',CategoryRouter);
app.use('/Brands',BrandRouter);
app.use('/Orders',OrderRouter);
app.use('/Product',ProductRouter);
app.use('/ShoppingCart',ShoppingCartRouter);
app.use('/User',UserRouter);
app.use("/Message", MessageRouter);

// Connect to MongoDB.
const connectDB = async () => {
    await mongoose.connect(MONGO_URI)
    console.log("DB:", mongoose.connection.name);
    console.log("connect DB")
}




connectDB().then(() => {
    app.listen(process.env.PORT || 1234, () => {
    console.log(`app running on port ${process.env.PORT || 1234}`)
})
}).catch(err => {
    console.error("error connecting to DB", err);
    process.exit(1);
})

