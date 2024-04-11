// useUser.js
import { useAuth } from '../context/AuthContext';
import {jwtDecode} from 'jwt-decode';

export function useUser() {
    const { authToken } = useAuth();
    const user = authToken ? jwtDecode(authToken) : null;
    console.log(user);
    return user;
}
