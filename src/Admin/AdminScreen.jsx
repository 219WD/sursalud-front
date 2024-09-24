// AdminScreen.jsx
import React, { useState, useEffect } from 'react';
import '../css/AdminScreen.css';
import {
  findAllPaciente,
  findAllEspecialista,
  findAllTurnos,
  deletePacienteDef,
  deleteEspecialistaDef,
  deleteTurnoDef,
  findAllUsers,
  upgradeUserRole,
  deleteUserDef
} from '../utils/requests/get/A';
import useNotify from '../Hooks/Toasts';

const AdminScreen = ({ jwt }) => {
  const [data, setData] = useState([]); // Para almacenar la lista actual (pacientes, especialistas, turnos)
  const [tableType, setTableType] = useState(''); // Controla qué tabla se muestra
  const notify = useNotify(); // Hook para notificaciones

  useEffect(() => {
    // Cuando se cambia el tipo de tabla, hace la petición correspondiente
    if (tableType === 'pacientes') loadPacientes();
    else if (tableType === 'especialistas') loadEspecialistas();
    else if (tableType === 'turnos') loadTurnos();
    else if (tableType === 'usuarios') loadUsuarios();
  }, [tableType]);

  // Carga de pacientes
  const loadPacientes = async () => {
    try {
      const result = await findAllPaciente(jwt);
      setData(result);
    } catch (error) {
      console.error('Error al obtener los pacientes:', error);
      notify('Error al obtener los pacientes', 'error');
    }
  };

  // Carga de especialistas
  const loadEspecialistas = async () => {
    try {
      const result = await findAllEspecialista(jwt);
      setData(result);
    } catch (error) {
      console.error('Error al obtener los especialistas:', error);
      notify('Error al obtener los especialistas', 'error');
    }
  };

  // Carga de turnos
  const loadTurnos = async () => {
    try {
      const result = await findAllTurnos(jwt);
      setData(result);
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
      notify('Error al obtener los turnos', 'error');
    }
  };

  // Carga de usuarios
  const loadUsuarios = async () => {
    try {
      const result = await findAllUsers(jwt);
      setData(result);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      notify('Error al obtener los usuarios', 'error');
    }
  };

  // Eliminar paciente con confirmación
  const handleDeletePaciente = async (id) => {
    const confirmed = window.confirm('¿Está seguro que desea eliminar este paciente?');
    if (!confirmed) return;

    try {
      const result = await deletePacienteDef(id, jwt);
      notify('Paciente eliminado con éxito', 'success');
      loadPacientes(); // Actualiza la lista de pacientes
    } catch (error) {
      notify('Error al eliminar el paciente', 'error');
    }
  };

  // Eliminar especialista con confirmación
  const handleDeleteEspecialista = async (id) => {
    const confirmed = window.confirm('¿Está seguro que desea eliminar este especialista?');
    if (!confirmed) return;

    try {
      const result = await deleteEspecialistaDef(id, jwt);
      notify('Especialista eliminado con éxito', 'success');
      loadEspecialistas(); // Actualiza la lista de especialistas
    } catch (error) {
      notify('Error al eliminar el especialista', 'error');
    }
  };

  // Eliminar turno con confirmación
  const handleDeleteTurno = async (id) => {
    const confirmed = window.confirm('¿Está seguro que desea eliminar este turno?');
    if (!confirmed) return;

    try {
      const result = await deleteTurnoDef(id, jwt);
      notify('Turno eliminado con éxito', 'success');
      loadTurnos(); // Actualiza la lista de turnos
    } catch (error) {
      notify('Error al eliminar el turno', 'error');
    }
  };

  // Eliminar usuario con confirmación
  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm('¿Está seguro que desea eliminar este usuario?');
    if (!confirmed) return;

    try {
      const result = await deleteUserDef(id, jwt);
      notify('Usuario eliminado con éxito', 'success');
      loadUsuarios(); // Actualiza la lista de usuarios
    } catch (error) {
      notify('Error al eliminar el usuario', 'error');
    }
  };

  // Función para promover a moderador
  const handlePromoteModerator = async (userId) => {
    const confirmed = window.confirm('¿Está seguro que desea promover a este usuario a moderador?');
    if (!confirmed) return;

    try {
      const result = await upgradeUserRole(userId, jwt);
      if (result) {
        notify('Usuario promovido a moderador con éxito', 'success');
        loadUsuarios(); // Actualiza la lista de usuarios
      }
    } catch (error) {
      notify('Error al promover al usuario', 'error');
      console.error('Error al promover al usuario:', error);
    }
  };

  return (
    <div className="adminScreenContainer">
      <div className="display">
        <h1>Hola Administrador</h1>
        <p>
          Es recomendable no utilizar las funciones para eliminar definitivamente tanto pacientes como turnos o especialistas. Utilizar únicamente en casos de emergencia.
        </p>
        <div className="btns-container-delete">
          <button className="btn delete" onClick={() => setTableType('pacientes')}>
            Eliminar paciente
          </button>
          <button className="btn delete" onClick={() => setTableType('especialistas')}>
            Eliminar profesional
          </button>
          <button className="btn delete" onClick={() => setTableType('turnos')}>
            Eliminar turno
          </button>
          <button className="btn promote" onClick={() => setTableType('usuarios')}>
            Promover a Moderador
          </button>
        </div>
      </div>
      <div className="tablaRenderizable">
        <h2>Lista de {tableType}</h2>
        {tableType && data.length > 0 ? (
          <table>
            <thead>
              <tr>
                {tableType === 'pacientes' && (
                  <>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Acciones</th>
                  </>
                )}
                {tableType === 'especialistas' && (
                  <>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                    <th>Acciones</th>
                  </>
                )}
                {tableType === 'turnos' && (
                  <>
                    <th>Paciente</th>
                    <th>Fecha</th>
                    <th>Especialista</th>
                    <th>Acciones</th>
                  </>
                )}
                {tableType === 'usuarios' && (
                  <>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  {tableType === 'pacientes' && (
                    <>
                      <td>{item.nombre}</td>
                      <td>{item.edad}</td>
                      <td>
                        <button className="btn delete" onClick={() => handleDeletePaciente(item._id)}>Eliminar</button>
                      </td>
                    </>
                  )}
                  {tableType === 'especialistas' && (
                    <>
                      <td>{item.nombre}</td>
                      <td>{item.especialidad}</td>
                      <td>
                        <button className="btn delete" onClick={() => handleDeleteEspecialista(item._id)}>Eliminar</button>
                      </td>
                    </>
                  )}
                  {tableType === 'turnos' && (
                    <>
                      <td>{item.paciente?.nombre || 'Paciente no disponible'}</td>
                      <td>{new Date(item.fecha).toLocaleDateString()}</td>
                      <td>{item.especialista?.nombre || 'Especialista no disponible'}</td>
                      <td>
                        <button className="btn delete" onClick={() => handleDeleteTurno(item._id)}>Eliminar</button>
                      </td>
                    </>
                  )}
                  {tableType === 'usuarios' && (
                    <>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>
                        <div className="actions-container">
                          {item.role !== 'admin' && item.role !== 'moderator' && (
                            <button
                              className="btn promote"
                              onClick={() => handlePromoteModerator(item._id)}
                            >
                              Promover
                            </button>
                          )}
                          {item.role !== 'admin' && (
                            <button
                              className="btn delete"
                              onClick={() => handleDeleteUser(item._id)}
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron datos para mostrar. Seleccione qué desea eliminar.</p>
        )}
      </div>
    </div>
  );
};

export default AdminScreen;
