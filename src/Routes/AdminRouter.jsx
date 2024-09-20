import { lazy, Suspense } from 'react'
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import Preloading from '../components/Preloading';

const AdminScreenLazy = lazy(() => import('../Admin/AdminScreen'))
const PacientesLazy = lazy(() => import('../pages/PacienteList'))
const EspecialistasLazy = lazy(() => import('../pages/MedicosList'))
const TurnosLazy = lazy(() => import('../pages/TurnoTable'))
const AnalyticsLazy = lazy(() => import('../pages/Analytics'))
const SalaDeEsperaLazy = lazy(() => import('../pages/SalaDeEspera'))


function AdminRouter({ show, jwt }) {
  if (!show) {
    return <h1>Acceso Denegado. No tienes permiso para acceder a esta página.</h1>;
  }

  return (
    <Routes>
      <Route path='/' element={
        <Suspense fallback={
          <div><Preloading /></div>
        }>
          <AdminScreenLazy jwt={jwt} />
        </Suspense>
      } />
      <Route path='/pacientes' element={
        <Suspense fallback={
          <div><Preloading /></div>
        }>
          <PacientesLazy jwt={jwt} />
        </Suspense>
      } />
      <Route path='/especialistas' element={
        <Suspense fallback={
          <div><Preloading /></div>
        }>
          <EspecialistasLazy jwt={jwt} />
        </Suspense>
      } />
      <Route path='/turnos' element={
        <Suspense fallback={
          <div><Preloading /></div>
        }>
          <TurnosLazy jwt={jwt} />
        </Suspense>
      } />
      <Route path='/analytics' element={
        <Suspense fallback={
          <div><Preloading /></div>
        }>
          <AnalyticsLazy jwt={jwt} />
        </Suspense>
      } />
      <Route path='/salaDeEpera' element={
        <Suspense fallback={
          <div><Preloading /></div>
        }>
          <SalaDeEsperaLazy jwt={jwt} />
        </Suspense>
      } />
    </Routes>
  );
}

AdminRouter.propTypes = {
  show: PropTypes.bool.isRequired,
  jwt: PropTypes.string,
};

export default AdminRouter;
