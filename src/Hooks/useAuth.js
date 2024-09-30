import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

export const useAuth = () => {
  const [jwt, setJwt] = useState(localStorage.getItem('token') || "");
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!jwt);

  useEffect(() => {
    if (jwt) {
      try {
        const decodedToken = jwtDecode(jwt);
        const userRole = decodedToken.user && decodedToken.user.role;

        if (userRole) {
          setRole(userRole);
        } else {
          console.error('El token no contiene un rol válido');
          setRole(null);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        localStorage.removeItem('token');
        setRole(null);
        setIsAuthenticated(false);
      }
    } else {
      setRole(null);
      setIsAuthenticated(false);
    }
  }, [jwt]);

  const changeJwt = (value) => {
    if (value) {
      setJwt(value);
      localStorage.setItem('token', value);
      setIsAuthenticated(true);
    } else {
      setJwt("");
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  return { jwt, role, isAuthenticated, changeJwt };
};
