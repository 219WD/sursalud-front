import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../css/UsuarioScreen.css';

const UsuarioScreen = () => {
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleNavigateHome = () => {
    navigate('/'); // Navega a la ruta /
  };

  return (
    <div className='usuarioScreen'>
      <div className="display">
        <h1>Bienvenido Usuario</h1>
        <p>Pedir permisos a un administrador con su email.</p>
        <button className='btn' onClick={handleNavigateHome}>Pagina Principal</button> {/* Botón que llama a la función */}
      </div>
    </div>
  );
};

export default UsuarioScreen;
