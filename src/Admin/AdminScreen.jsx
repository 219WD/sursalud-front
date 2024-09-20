// AdminScreen.jsx
import React, { useState, useEffect } from 'react';
import '../css/AdminScreen.css';
import { 
  findAllPaciente, 
  findAllEspecialista, 
  findAllTurnos, 
  deletePacienteDef, 
  deleteEspecialistaDef, 
  deleteTurnoDef 
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
