import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomeScreen from './pages/HomeScreen';
import Login from './Auth/Login';
import Register from './Auth/Register';
import UserRouter from "./Routes/UserRouter";
import AdminRouter from "./Routes/AdminRouter";
import ModeratorRouter from "./Routes/ModeratorRouter";
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer'
import NotFound from './components/NotFound';
import { useAuth } from './Hooks/useAuth';

const App = () => {
  const { jwt, role, changeJwt } = useAuth();
  const isAdmin = role === 'admin';

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
          element={<AdminRouter show={isAdmin} jwt={jwt} />}
        />
        <Route
          path="/moderator/*"
          element={<ModeratorRouter show={role === 'moderator'} />}
        />

        {/* Si ninguna ruta coincide, mostrar la página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
