// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../utils/Initials/ApiUrl'

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      password: password
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${API_URL}/signup`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if (result.message === 'Signup successful') {
          navigate('/login'); // Redirigir a login después del registro
        } else {
          console.error('Error en el registro:', result.message);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="registerContainer">
      <div className="register">
        <form onSubmit={handleSubmit}>
          <h2>Registro</h2>
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
            autoComplete="passcurrent-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Registro</button>
          <p>Ya tienes una cuenta? <button className='btnLink' type="button" onClick={handleLoginClick}>Iniciar Sesion</button></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
