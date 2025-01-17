import { lazy, Suspense } from "react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import Preloading from "../components/Preloading";
import AccessDenied from "../pages/AccessDenied";

const AdminScreenLazy = lazy(() => import("../Admin/AdminScreen"));
const PacientesLazy = lazy(() => import("../pages/PacienteList"));
const EspecialistasLazy = lazy(() => import("../pages/MedicosList"));
const TurnosLazy = lazy(() => import("../pages/TurnoTable"));
const AnalyticsLazy = lazy(() => import("../pages/Analytics"));
const SalaDeEsperaLazy = lazy(() => import("../pages/SalaDeEspera"));

function AdminRouter({ show, jwt }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          show ? (
            <Suspense
              fallback={
                <div>
                  <Preloading />
                </div>
              }
            >
              <AdminScreenLazy jwt={jwt} />
            </Suspense>
          ) : (
            <AccessDenied />
          )
        }
      />
      <Route
        path="/pacientes"
        element={
          show ? (
            <Suspense
              fallback={
                <div>
                  <Preloading />
                </div>
              }
            >
              <PacientesLazy jwt={jwt} />
            </Suspense>
          ) : (
            <AccessDenied />
          )
        }
      />
      <Route
        path="/especialistas"
        element={
          show ? (
            <Suspense
              fallback={
                <div>
                  <Preloading />
                </div>
              }
            >
              <EspecialistasLazy jwt={jwt} />
            </Suspense>
          ) : (
            <AccessDenied />
          )
        }
      />
      <Route
        path="/turnos"
        element={
          show ? (
            <Suspense
              fallback={
                <div>
                  <Preloading />
                </div>
              }
            >
              <TurnosLazy jwt={jwt} />
            </Suspense>
          ) : (
            <AccessDenied />
          )
        }
      />
      <Route
        path="/analytics"
        element={
          show ? (
            <Suspense
              fallback={
                <div>
                  <Preloading />
                </div>
              }
            >
              <AnalyticsLazy jwt={jwt} />
            </Suspense>
          ) : (
            <AccessDenied />
          )
        }
      />
      <Route
        path="/salaDeEpera"
        element={
          show ? (
            <Suspense
              fallback={
                <div>
                  <Preloading />
                </div>
              }
            >
              <SalaDeEsperaLazy jwt={jwt} />
            </Suspense>
          ) : (
            <AccessDenied />
          )
        }
      />
    </Routes>
  );
}

AdminRouter.propTypes = {
  show: PropTypes.bool.isRequired,
  jwt: PropTypes.string,
};

export default AdminRouter;
