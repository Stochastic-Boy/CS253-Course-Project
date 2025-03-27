import React from 'react';
import { Routes, Route, Link, Navigate, useParams } from "react-router-dom";
import './SellerView.css';
import ProductsView from './ProductsView';
import OrdersView from './OrdersView';
import CategoriesView from './CategoriesView';
import SellerProfile from './SellerProfile';
import { logout } from '../../reduxfeatures/userSlice';
import { useDispatch } from 'react-redux';

const SellerView = () => {
  const { sellerId } = useParams(); // Extract sellerId from URL
  const dispatch = useDispatch();

  return (
    <div className='w-full h-screen' style={{ display: "grid", gridTemplateColumns: "300px 1fr" }}>
      <div className="sidebar gap-5 w-full">
        <h2 className='text-white mt-4'>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Campus Craves
          </Link>
        </h2>
        <Link to={`/seller/${sellerId}/ordersview`} className='sellerview-button'>Orders</Link>
        <Link to={`/seller/${sellerId}/categoriesview`} className='sellerview-button'>Catalog</Link>
        <Link to={`/seller/${sellerId}/sellerprofile`} className='sellerview-button'>Profile</Link>
        <Link to={`/`} onClick={()=>dispatch(logout())} className='sellerview-button logout-seller'>Logout</Link>

      </div>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to={`ordersview`} />} />
          <Route path="ordersview" element={<OrdersView />} />
          <Route path="categoriesview" element={<CategoriesView />} />
          <Route path="productsview/:categoryId" element={<ProductsView />} />
          <Route path="sellerprofile" element={<SellerProfile />} />
        </Routes>
      </div>
    </div>
  );
}

export default SellerView;