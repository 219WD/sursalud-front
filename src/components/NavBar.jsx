import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavBar.css';
import PropTypes from 'prop-types';
import logo from '../assets/Sin título-2.png'

const NavBar = ({ authenticated, changeJwt }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    changeJwt(null); // Actualiza el JWT en el estado del componente padre
    navigate('/'); // Redirige a la página principal
  };

  return (
    <div className='navBar'>
      <Link to="/" className="logo"><img src={logo} alt="" /></Link>
      <div className="loginBtn" onClick={authenticated ? handleLogoutClick : handleLoginClick}>
        {authenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
      </div>
    </div>
  );
}

NavBar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  changeJwt: PropTypes.func.isRequired
};

export default NavBar;
