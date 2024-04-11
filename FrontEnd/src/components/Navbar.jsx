import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {jwtDecode} from 'jwt-decode'; // Asegúrate de que la importación de jwtDecode sea correcta
import "./Navbar.css";

const Navbar = () => {
    const { authToken, logout } = useAuth();
    const navigate = useNavigate();
    let nickname = '';
    let roles = [];

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
        logout();
        navigate('/');
    };

    const goToOrderList = () => {
        navigate('/orderList');
    };

    const goToSalesHistory = () => {
        navigate('/historial'); // Asegúrate de que esta ruta coincida con la definida en tu Router
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
        <nav className="navbar">
            <div className="navbar-content">
                <div>{`Bienvenido, ${nickname} :)`}</div>
                <button onClick={navigateToHomePage} className="nav-button">Inicio</button>
                <button onClick={navigateToSearchProducts} className="nav-button">Buscar Productos</button>
                <button onClick={goToOrderList} className="nav-button">Lista de Pedidos</button>
                {/* Solo muestra el botón de Historial de Ventas si el usuario es administrador */}
                {roles.includes('ROLE_ADMIN') && (
                    <button onClick={goToSalesHistory} className="nav-button">Historial de Ventas</button>
                )}
                <button onClick={handleLogout} className="nav-button">Cerrar Sesión</button>
            </div>
        </nav>
    );
};

export default Navbar;
