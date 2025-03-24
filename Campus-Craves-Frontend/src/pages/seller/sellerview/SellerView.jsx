import React from 'react'
import { Routes, Route, Link } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import ProductsView from './ProductsView';
import OrdersView from '../OrdersView';
import CategoriesView from '../CategoriesView';
import OwnerProfile from '../SellerProfile';
import './SellerView.css'

const SellerView = () => {
  return (
    <div className='w-full' style={{display:"grid", gridTemplateColumns:"1fr 4fr"}}>
      <div className="sidebar gap-5 w-full">
        <h2 className='text-white mt-4'>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Campus Craves
        </Link>
        </h2>
        <Link to="/admin/ordersview" className='sellerview-button'>Orders</Link>
        <Link to="/admin/categoriesview" className='sellerview-button'>Categories & Products</Link>
        <Link to="/admin/ownerprofile" className='sellerview-button'>Profile</Link>
      </div>
      <div>
      <Routes>
        <Route path="/" element={<Navigate to="productsview" />} />
        <Route path="productsview" element={<ProductsView />} />
        <Route path="productsview/:categoryId" element={<ProductsView />} />
        <Route path="ordersview" element={<OrdersView />} />
        <Route path="categoriesview" element={<CategoriesView />} />
        <Route path="ownerprofile" element={<OwnerProfile />} />
      </Routes>
      </div>
    </div>
  )
}

export default SellerView;

