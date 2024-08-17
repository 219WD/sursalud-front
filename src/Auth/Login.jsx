import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/Login.css';

const Login = ({ changeJwt }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    };

    fetch("http://localhost:3000/login", requestOptions) 
      .then(response => response.json())
      .then(result => {
        if (result.token) {
          changeJwt(result.token);
          const decodedToken = jwtDecode(result.token);
          const userRole = decodedToken.user.role;

          if (userRole === 'admin') {
            navigate('/admin');
          } else if (userRole === 'moderator') {
            navigate('/moderator');
          } else if (userRole === 'user') {
            navigate('/user');
          } else {
            navigate('/');
          }
        } else {
          console.error('Login failed:', result.message);
        }
      })
      .catch(error => console.error('Error al conectar con el servidor:', error));
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="loginContainer">
      <div className="login">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Iniciar Sesión</button>
          <p>No tienes una cuenta? <button className='btnLink' type="button" onClick={handleRegisterClick}>Regístrate</button></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
