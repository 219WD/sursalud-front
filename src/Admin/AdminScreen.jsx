// AdminScreen.jsx
import React, { useState, useEffect } from 'react';
import '../css/AdminScreen.css';

const AdminScreen = ({ jwt }) => {
  const [data, setData] = useState([]); // Para almacenar la lista actual (pacientes, especialistas, turnos)
  const [tableType, setTableType] = useState(''); // Controla qué tabla se muestra

  useEffect(() => {
    // Cuando se cambia el tipo de tabla, hace la petición correspondiente
    if (tableType === 'pacientes') fetchPacientes();
    else if (tableType === 'especialistas') fetchEspecialistas();
    else if (tableType === 'turnos') fetchTurnos();
  }, [tableType]);

  // Fetch de pacientes
  const fetchPacientes = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer ' + jwt);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch('http://localhost:3000/pacientes/findAllPaciente', requestOptions);
      if (response.status >= 400) throw new Error('Error al obtener los pacientes');

      const result = await response.json();
      setData(result.data || result);
    } catch (error) {
      console.error('Error al obtener los pacientes:', error);
    }
  };

  // Fetch de especialistas
  const fetchEspecialistas = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer ' + jwt);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch('http://localhost:3000/especialista/getEspecialistas', requestOptions);
      if (response.status >= 400) throw new Error('Error al obtener los especialistas');

      const result = await response.json();
      setData(result.data || result);
    } catch (error) {
      console.error('Error al obtener los especialistas:', error);
    }
  };

  // Fetch de turnos
  const fetchTurnos = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer ' + jwt);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch('http://localhost:3000/turnos/findAllTurnos', requestOptions);
      if (response.status >= 400) throw new Error('Error al obtener los turnos');

      const result = await response.json();
      setData(result.data || result);
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
    }
  };

    // Fetch DELETE turno
    const fetchDeleteTurno = async (id) => {
      try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + jwt);
  
        const requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow',
        };
  
        const response = await fetch(`http://localhost:3000/turnos/deleteTurnoById/${id}`, requestOptions);
        if (response.status >= 400) throw new Error('Error al eliminar el turno');
  
        const result = await response.json();
        alert(result.message); // Mostrar mensaje de confirmación
        fetchTurnos(); // Actualiza la lista de turnos después de eliminar
      } catch (error) {
        console.error('Error al eliminar el turno:', error);
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
                        <button className="btn delete">Eliminar</button>
                      </td>
                    </>
                  )}
                  {tableType === 'especialistas' && (
                    <>
                      <td>{item.nombre}</td>
                      <td>{item.especialidad}</td>
                      <td>
                        <button className="btn delete">Eliminar</button>
                      </td>
                    </>
                  )}
                  {tableType === 'turnos' && (
                    <>
                      <td>{item.paciente?.nombre || 'Paciente no disponible'}</td>
                      <td>{new Date(item.fecha).toLocaleDateString()}</td>
                      <td>{item.especialista?.nombre || 'Especialista no disponible'}</td>
                      <td>
                        <button className="btn delete">Eliminar</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron datos para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default AdminScreen;
