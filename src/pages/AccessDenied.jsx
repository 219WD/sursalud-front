import React from 'react';
import '../css/AccessDenied.css'
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleNavigateHome = () => {
    navigate('/'); // Navega a la ruta /
  };
  return (
    <div className='accessDenied'>
      <div className="display">
        <h1>Acceso Denegado</h1>
        <p>No tienes permiso para acceder a esta página.</p>
        <button className='btn' onClick={handleNavigateHome}>Pagina Principal</button>
      </div>
    </div>
  );
};

export default AccessDenied;
