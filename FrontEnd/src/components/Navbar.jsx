import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {jwtDecode} from 'jwt-decode'; // Asegúrate de que la importación de jwtDecode sea correcta
import styles from './Navbar.module.scss';
import { FaBars} from 'react-icons/fa'; // Importando el icono de menú y otros íconos
const Navbar = () => {
    const { authToken, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // Estado para manejar la visibilidad del menú
    let nickname = '';
    let roles = [];
    const handleToggle = () => {
        setIsOpen(!isOpen); // Cambia el estado del menú
    };
    if (authToken) {
        try {
            const decoded = jwtDecode(authToken);
            nickname = decoded.nickname;
            roles = decoded.roles; // Asumiendo que los roles están en el token
        } catch (error) {
            console.error("Error decoding the token:", error);
        }
    }

    const handleLogout = () => {
        sessionStorage.clear(); // Esto limpiará todo el sessionStorage incluyendo `orderList`
        logout(); // Tu función para manejar el proceso de logout
        navigate('/'); // Redirige al usuario a la página de inicio o de login
    };

    const goToOrderList = () => {
        navigate('/orderList');
    };

    const goToProductManger = () => {
        navigate('/productManager');
    };

    const goToNotificationPage = () => {
        navigate('/orderNotifications');
    };

    const goToSalesHistory = () => {
        navigate('/historial'); // Asegúrate de que esta ruta coincida con la definida en tu Router
    };

    const goToSearchPage = () => {
        navigate('/search');
    };

    // Método para navegar a la página de inicio basado en el rol del usuario
    const navigateToHomePage = () => {
        if (roles.includes('ROLE_ADMIN')) {
            navigate('/homePageAdmin');
        } else {
            navigate('/homePageCustomer');
        }
    };

    const navigateToSearchProducts = () => {
        navigate('/search');
    };
    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContent}>
            <div className={styles.welcomeMessage}>{`Bienvenido, ${nickname} :)`}</div>

            <button onClick={handleToggle} className={styles.burgerMenu}>
                    <FaBars /> {/* Icono de menú tipo "hamburger" */}
                </button>
                
                <div className={`${styles.navMenu} ${isOpen ? styles.showMenu : ''}`}>
                <button onClick={navigateToHomePage} className={styles.navButton}>Inicio</button>
    
                {/* Botones para el rol de usuario */}
                {roles.includes('ROLE_USER') && !roles.includes('ROLE_ADMIN') && (
                    <>
                        <button onClick={goToSearchPage} className={styles.navButton}>Buscar Productos</button>
                        <button onClick={goToOrderList} className={styles.navButton}>Lista de Pedidos</button>
                    </>
                )}
    
                {/* Botones para el rol de administrador */}
                {roles.includes('ROLE_ADMIN') && (
                    <>
                        <button onClick={goToSalesHistory} className={`${styles.navButton} ${styles.adminButton}`}>Historial de Ventas</button>
                        <button onClick={goToProductManger} className={`${styles.navButton} ${styles.adminButton}`}>Adm Productos</button>
                        <button onClick={goToNotificationPage} className={`${styles.navButton} ${styles.adminButton}`}>Notificaciones</button>
                    </>
                )}
                
                <button onClick={handleLogout} className={styles.navButton}>Cerrar Sesión</button>
            </div>
            </div>
        </nav>
    );
    
                }    

export default Navbar;
