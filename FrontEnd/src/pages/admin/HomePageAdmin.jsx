// src/pages/admin/HomePageAdmin.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaBell, FaHistory } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import styles from './HomePageAdmin.module.scss';

function HomePageAdmin() {
    return (
        <div className={styles['admin-dashboard']}>
            <Navbar />
            <h1 className={styles['dashboard-title']}>Admin Dashboard</h1>
            <div className={styles['links-container']}>
                <Link className={styles['link']} to="/productManager">
                    <FaBoxOpen className={styles['icon']} />
                    <span>Manage Products</span>
                </Link>
                <Link className={styles['link']} to="/orderNotifications">
                    <FaBell className={styles['icon']} />
                    <span>Ver Notificaciones de Pedidos</span>
                </Link>
                <Link className={styles['link']} to="/historial">
                    <FaHistory className={styles['icon']} />
                    <span>Ver Historial de pedidos</span>
                </Link>
            </div>
        </div>
    );
}

export default HomePageAdmin;
