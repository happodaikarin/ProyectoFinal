// src/pages/admin/HomePageAdmin.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import styles from './HomePageAdmin.module.scss';
function HomePageAdmin() {
    return (
        <div className={styles['admin-dashboard']}>
            <Navbar />
            <h1 className={styles['dashboard-title']}>Admin Dashboard</h1>
            <div className={styles['links-container']}>
                <Link className={styles['link']} to="/productManager">Manage Products</Link>
                <br />
                <Link className={styles['link']} to="/orderNotifications">Ver Notificaciones de Pedidos</Link>
                <br />
                <Link className={styles['link']} to="/historial">Ver Historial de pedidos</Link>
            </div>
        </div>
    );
}

export default HomePageAdmin;
