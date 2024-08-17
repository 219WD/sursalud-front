import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ModeratorScreen from '../Admin/Moderador';
import PropTypes from 'prop-types';

function ModeratorRouter({ show, jwt }) {
  if (!show) {
    return <h1>Acceso Denegado. No tienes permiso para acceder a esta página.</h1>;
  }

  return (
    <Routes>
      <Route path="/" element={<ModeratorScreen jwt={jwt} />} />
    </Routes>
  );
}

ModeratorRouter.propTypes = {
  show: PropTypes.bool.isRequired,
  jwt: PropTypes.string,
};

export default ModeratorRouter;
