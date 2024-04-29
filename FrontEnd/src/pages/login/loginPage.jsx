import React, { useState, useEffect } from 'react';  // Asegúrate de incluir useEffect aquí
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { FaUser, FaUserShield } from 'react-icons/fa';
import { usePageStyle } from '../../context/PageStyleContext';

function LoginPage() {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // Asume que useAuth proporciona una función 'login'

    const { setPageStyle } = usePageStyle();

    useEffect(() => {
        setPageStyle('loginPage'); // Aplicar estilos de login
        return () => setPageStyle('default'); // Revertir al desmontar
    }, [setPageStyle]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = showAdminLogin ? { nickname, password } : { nickname };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        };
    
        try {
            const response = await fetch('http://localhost:8080/auth/login', requestOptions);
            if (response.ok) {
                const data = await response.json();
                const token = data.token; // Asume que la respuesta del servidor incluye el token aquí
                login(token); // Función para manejar el estado del login, ajusta según tu implementación
                const decodedToken = jwtDecode(token); // Asegúrate de que jwtDecode esté correctamente importado y usado
    
                // Redirección basada en roles
                if (decodedToken.roles.includes('ROLE_ADMIN')) {
                    navigate('/homePageAdmin');
                } else {
                    navigate('/homePageCustomer');
                }
            } else {
                alert("Error logging in. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error logging in", error);
            alert("Error logging in. Please check your network connection and try again.");
        }
    };
    return (
        <div className={styles.loginFormContainer}>
            <h1 className={styles.loginTitle}>Login</h1>
            <div className={styles.loginButtonContainer}>
                <button className={styles.clientButton} onClick={() => setShowAdminLogin(false)}>
                    <FaUser /> Cliente
                </button>
                <button className={styles.adminButton} onClick={() => setShowAdminLogin(true)}>
                    <FaUserShield /> Admin
                </button>
            </div>
            <form className={styles.loginForm} onSubmit={handleLogin}>
                <label className={styles.inputLabel}>
                    Nickname:
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required className={styles.loginInput} />
                </label>
                {showAdminLogin && (
                    <label className={styles.inputLabel}>
                        Contraseña:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.loginInput} />
                    </label>
                )}
                <button type="submit" className={styles.loginSubmitButton}>Ingresar</button>
            </form>
        </div>
    );
    
}

export default LoginPage;
