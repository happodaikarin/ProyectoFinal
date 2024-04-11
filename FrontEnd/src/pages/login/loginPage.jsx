import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Asegúrate de tener este archivo CSS para estilos
import { useAuth } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode';
import { FaUser, FaUserShield } from 'react-icons/fa';


function LoginPage() {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // Asume que useAuth proporciona una función 'login'

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
  
              // Verifica los roles para decidir si sincronizar con el servicio de interacciones
              if (!decodedToken.roles.includes('ROLE_ADMIN')) {
                  await synchronizeWithInteractionsService(decodedToken); // Ajusta según tu implementación
              }
  
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
  
    const synchronizeWithInteractionsService = async (decodedToken) => {
      const userId = decodedToken.sub; // Usa 'sub' o el campo correcto que representa el ID del usuario
      const nickname = decodedToken.nickname;
      
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: userId, nickname }),
      };
      
      try {
        const response = await fetch('http://localhost:3030/usuarios/sincronizar', requestOptions);
        if (!response.ok) {
          throw new Error('Failed to synchronize with interacciones service');
        }
        console.log("Synchronization with interacciones service successful");
      } catch (error) {
        console.error("Error during synchronization with interacciones service:", error);
      }
    };
    
  

    return (
      
        <div className="form-container">
            <h1>Login</h1>
            <div className="button-container">
                <button onClick={() => setShowAdminLogin(false)}><FaUser /> Cliente</button>
                <button onClick={() => setShowAdminLogin(true)}><FaUserShield /> Admin</button>
            </div>
            <form onSubmit={handleLogin}>
                <label>
                    Nickname:
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                </label>
                {showAdminLogin && (
                    <label>
                        Contraseña:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                )}
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
}

export default LoginPage;
