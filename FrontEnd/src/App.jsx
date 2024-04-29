import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/loginPage';
import HomePageAdmin from './pages/admin/HomePageAdmin';
import HomePageCustomer from './pages/customer/HomePageCustomer';
import ProductManager from './pages/admin/ProductManger';
import ProtectedRoute from './ProtectedRoute';
import ProductDetailsPage from './pages/customer/ProductDetailsPage';
import OrderListPage from './pages/customer/OrderListPage';
import CategoryProducts from './pages/customer/CategoryProducts';
import OrderNotificationsPage from './pages/admin/OrderNotificationsPage';
import SalesHistoryPage from './pages/admin/SalesHistoryPage'; // Corrección aquí
import ResponsiveImage from './pages/customer/components/ResponsiveImage';
import SearchPage from './pages/customer/SearchPage';
import { PageStyleProvider } from './context/PageStyleContext';

import './App.scss'; // Importa tus estilos SCSS aquí


function App() {
  return (
    <PageStyleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/homePageAdmin" element={<ProtectedRoute adminRoute={true}><HomePageAdmin /></ProtectedRoute>} />
          <Route path="/homePageCustomer" element={<ProtectedRoute><HomePageCustomer /></ProtectedRoute>} />
          <Route path="/ProductManager" element={<ProtectedRoute adminRoute={true}><ProductManager /></ProtectedRoute>} />
          <Route path="/productDetails/:productId" element={<ProtectedRoute><ProductDetailsPage /></ProtectedRoute>} />
          <Route path="/historial" element={<ProtectedRoute adminRoute={true}><SalesHistoryPage/></ProtectedRoute>} />
          <Route path="/orderList" element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} />
          <Route path="/category/:category" element={<ProtectedRoute><CategoryProducts /></ProtectedRoute>} />
          <Route path="/orderNotifications" element={<ProtectedRoute adminRoute={true}><OrderNotificationsPage /></ProtectedRoute>    } />
          <Route path="/respinsiveImage" element={<ProtectedRoute adminRoute={true}><ResponsiveImage/></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage/></ProtectedRoute>} />

        </Routes>
      </Router>
      </PageStyleProvider>
  );
}


export default App;
