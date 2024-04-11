// src/pages/admin/HomePageAdmin.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './HomePageAdmin.css'

function HomePageAdmin() {
    return (
        <div>
            <Navbar />
            <h1>Admin Dashboard</h1>
            <Link to="/productManager">Manage Products</Link>
            <br />
            <Link to="/orderNotifications">Ver Notificaciones de Pedidos</Link> {/* Añade este enlace */}
            <br />
            <Link to="/historial">Ver Historial de pedidos</Link>
        </div>
    );
}

export default HomePageAdmin;
