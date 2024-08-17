import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminScreen from '../Admin/AdminScreen';
import PropTypes from 'prop-types';
import PacienteList from '../components/PacienteList';

function AdminRouter({ show, jwt }) {
  if (!show) {
    return <h1>Acceso Denegado. No tienes permiso para acceder a esta página.</h1>;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminScreen jwt={jwt} />} />
      <Route path='/pacientes' element={<PacienteList jwt={jwt} />} />
    </Routes>
  );
}

AdminRouter.propTypes = {
  show: PropTypes.bool.isRequired,
  jwt: PropTypes.string,
};

export default AdminRouter;
