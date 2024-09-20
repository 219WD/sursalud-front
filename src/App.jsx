import { lazy, Suspense } from 'react'
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavBar from './components/NavBar';
import HomeScreen from './pages/HomeScreen';
import Login from './Auth/Login';
import Register from './Auth/Register';
import UserRouter from "./Routes/UserRouter";
import AdminRouter from "./Routes/AdminRouter";
import ModeratorRouter from "./Routes/ModeratorRouter";
import AccessDenied from './pages/AccessDenied';
import { Toaster } from 'react-hot-toast';
import Preloading from './components/Preloading';
import Footer from './components/Footer'

const App = () => {
  const [jwt, setJwt] = useState(localStorage.getItem('token') || "");
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!jwt);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    if (jwt) {
      try {
        const decodedToken = jwtDecode(jwt);
        console.log('Token decodificado:', decodedToken); // Verificar la estructura del token

        // Extraer el rol del objeto `user` dentro del token decodificado
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
      setRole(null); // Asegurarse de que el rol sea null si no hay token
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

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <NavBar authenticated={!!jwt} isAdmin={isAdmin} changeJwt={changeJwt} />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<Login changeJwt={changeJwt} />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/user/*"
          element={<UserRouter show={role === 'user'} />}
        />
        <Route
          path="/admin/*"
          element={<AdminRouter show={role === 'admin'} jwt={jwt} />}
        />
        <Route
          path="/moderator/*"
          element={<ModeratorRouter show={role === 'moderator'} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
