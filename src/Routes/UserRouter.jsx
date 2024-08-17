import React from 'react';
import { Route, Routes } from "react-router-dom";
import UserScreen from '../Admin/Usuario';
import PropTypes from "prop-types"

function UserRouter({ show, jwt }) {
  if (!show) {
    return <h1>Acceso Denegado. No tienes permiso para acceder a esta página.</h1>;
  }

  return (
    <Routes>
      <Route path="/" element={<UserScreen jwt={jwt} />} />
    </Routes>
  );
}

UserRouter.propTypes = {
  show: PropTypes.bool.isRequired,
  jwt: PropTypes.string,
};

export default UserRouter;
