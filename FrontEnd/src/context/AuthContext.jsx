import React, { createContext, useContext, useState, useEffect } from 'react';


//poner informacion de autenticacion del usuario, como el token de acceso
const AuthContext = createContext();

//atajo para abrir la  caja de informacion de autenticacion del usuario
export const useAuth = () => useContext(AuthContext);


//creamos componente para conectar la caja de informacion de autenticacion del usuario a toda la aplicacion
//aqui definimos funciones de inicio de sesion y cerrar sesion.
export const AuthProvider = ({ children }) => {


    const [authToken, setAuthToken] = useState(() => {
        // aqui puedo  escribir y borrar token de acceso y mirar si hay token guardado
        const token = localStorage.getItem('authToken');
        return token ? token : null;
    });

    // Este efecto se ejecuta al montar el componente y verifica si el usuario ya está logueado
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token && !authToken) {
            setAuthToken(token);
            // Decodifica el token y extrae el nickname
            const decoded = jwtDecode(token);
            console.log("Nickname en el contexto de autenticación:", decoded.nickname);
        }
    }, [authToken]);

    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('authToken', token); // Guarda el token en localStorage para persistencia
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken'); // Elimina el token de localStorage
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
