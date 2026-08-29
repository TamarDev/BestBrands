import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser} from "./store/slices/AuthSlice.js";


import './App.css';
import Nav from './Components/Grid/Nav/Nav.jsx';
import Footer from './Components/Grid/Footer/Footer.jsx';
import Home from './ComponentPages/Home.jsx';

import ScrollToTop from './Components/Scrolltotop.jsx';


import Aboat from './ComponentPages/Aboat.jsx';
import Contact_Us from './ComponentPages/Contact_Us.jsx';
import DetailisOfProduct from './ComponentPages/DetailisOfProduct.jsx';

import Header from './Components/Grid/Header/Header.jsx';

import Payment from './ComponentPages/Payment.jsx';
import PaymentSuccess from './ComponentPages/PaymentSuccess.jsx';
// import PaymentCancel from './ComponentPages/PaymentCancel.jsx';
import ShoppingCart from './ComponentPages/ShoppingCart.jsx';
import AllBrands from './ComponentPages/AllBrands.jsx';
import DinamicBrand from './ComponentPages/DinamicBrand.jsx';
import Register from './ComponentPages/Register.jsx';
import Login from './ComponentPages/Login.jsx';
import Orders from './ComponentPages/Orders.jsx';
import DetailisUser from './ComponentPages/DetailisUser.jsx';

import AdminHome from './AdminComponents/AdminHome.jsx';
import AdminBrands from './AdminComponents/AdminBrands.jsx';
import AdminDashboard from './AdminComponents/AdminDashBoard.jsx';
import AdminCategories from './AdminComponents/AdminCategories.jsx';
import AdminUsers from './AdminComponents/AdminUser.jsx';
import AdminProducts from './AdminComponents/AdminProducts.jsx';
import AdminOrders from './AdminComponents/AdminOrder.jsx';
import AdminMessage from './AdminComponents/AdminMessage.jsx';

import CartDrawer from './Components/CartDrawer/CartDrawer.jsx';
export default function App() {

const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <><BrowserRouter>
      <Header/>
      <Nav />
      <CartDrawer/>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Aboat />} />
        <Route path="/conection" element={<Contact_Us />} />
        <Route path="/connect_us" element={<Contact_Us />} />
        <Route path="/DetailisOfProduct/:id" element={<DetailisOfProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/brands" element={<AllBrands />} />
        <Route path="/brands/:brandName" element={<DinamicBrand />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<DetailisUser />} />

        <Route path="/admin" element={<AdminHome/>}>
          <Route index element={<AdminDashboard />} />
          <Route path="brands" element={<AdminBrands/>}/>
          <Route path="products" element={<AdminProducts/>}/>
          <Route path="orders" element={<AdminOrders/>}/>
          <Route path="users" element={<AdminUsers/>}/>
          <Route path="categories" element={<AdminCategories/>}/> 
          <Route path="messages" element={<AdminMessage/>}/> 
        </Route>

        <Route path="/payment" element={<Payment/>} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        {/* <Route path="/payment/cancel" element={<PaymentCancel />} /> */}
        <Route path="/shoppingCart" element={<ShoppingCart/>} />
      </Routes><Footer />
    </BrowserRouter></>
  );
}

