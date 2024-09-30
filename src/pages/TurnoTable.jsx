// import React, { useState, useEffect } from 'react';
// import '../css/TurnoList.css';
// import { EditIcon, TrashIcon, UserClockIcon } from '../Hooks/IconsFa';
// import TurnoModal from './TurnoModal';
// import TurnoComponent from './TurnoComponent';
// import useNotify from '../Hooks/Toasts';
// import { findAllEspecialista, findAllPaciente, findAllTurnos, searchTurnos, toggleTurnoStatus, handleSalaDeEspera } from '../utils/requests/get/A'

// const TurnoTable = ({ jwt }) => {
//   const notify = useNotify();
//   const [turnos, setTurnos] = useState([]);
//   const [especialistas, setEspecialistas] = useState([]);
//   const [pacientes, setPacientes] = useState([]);
//   const [selectedPaciente, setSelectedPaciente] = useState(null); // Inicializa correctamente
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedTurno, setSelectedTurno] = useState(null);
//   const [isTurnoOpen, setIsTurnoOpen] = useState(false);
//   const [selectedTurnoId, setSelectedTurnoId] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showInactive, setShowInactive] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchTurnos();
//       await fetchEspecialistas();
//       await fetchPacientes();
//     };

//     fetchData();
//   }, [showInactive]);


//   useEffect(() => {
//     if (searchQuery !== '') {
//       fetchTurnos(searchQuery);
//     } else {
//       fetchTurnos(); // Cargar todos los turnos si no hay búsqueda
//     }
//   }, [searchQuery]);

//   const fetchTurnos = async (query = '') => {
//     try {
//       const result = query ? await searchTurnos(`?query=${query}`, jwt) : await findAllTurnos(jwt);
//       const sortedTurnos = (result || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
//       setTurnos(sortedTurnos);
//     } catch (error) {
//       console.error("Error al obtener los turnos:", error);
//       notify('Error al obtener los turnos.', 'error');
//     }
//   };

//   const fetchEspecialistas = async () => {
//     try {
//       const result = await findAllEspecialista(jwt);
//       setEspecialistas(result);
//     } catch (error) {
//       console.error("Error al obtener los especialistas:", error);
//       notify('Error al obtener los especialistas.', 'error');
//     }
//   };

//   const fetchPacientes = async () => {
//     try {
//       const result = await findAllPaciente(jwt);
//       setPacientes(result);
//     } catch (error) {
//       console.error("Error al obtener los pacientes:", error);
//       notify('Error al obtener los pacientes.', 'error');
//     }
//   };

//   const handleDeleteTurno = async (id) => {
//     const myHeaders = new Headers();
//     myHeaders.append("Authorization", "Bearer " + jwt);

//     const requestOptions = {
//       method: "PATCH", // PATCH para desactivar
//       headers: myHeaders,
//       redirect: "follow",
//     };

//     try {
//       const response = await fetch(`http://localhost:3000/turnos/${id}/toggle-status-activo`, requestOptions);

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Error: ${response.status} - ${errorText}`);
//       }

//       console.log("Turno eliminado con éxito");
//       notify('Turno eliminado con éxito.');
//       fetchTurnos(); // Actualiza la lista de turnos
//     } catch (error) {
//       console.error("Error al eliminar el turno:", error);
//       notify('Error al eliminar el turno.', 'error');
//     }
//   };


//   const handleSalaDeEspera = async (id) => {
//     const myHeaders = new Headers();
//     myHeaders.append("Authorization", "Bearer " + jwt);

//     const requestOptions = {
//       method: "PATCH", // PATCH para desactivar
//       headers: myHeaders,
//       redirect: "follow",
//     };

//     try {
//       const response = await fetch(`http://localhost:3000/turnos/${id}/toggle-status`, requestOptions);

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Error: ${response.status} - ${errorText}`);
//       }

//       console.log("Subido a la sala de espera");
//       notify('Subido a la sala de espera');
//       fetchTurnos(); // Actualiza la lista de turnos
//     } catch (error) {
//       console.error("Error al subir a la sala de espera", error);
//       notify('Error al subir a la sala de espera.', 'error');
//     }
//   };

//   // Filtrar turnos según el estado de activos/inactivos
//   const filteredTurnos = turnos.filter((turno) =>
//     showInactive ? !turno.activo : turno.activo
//   );

//   const toggleInactiveView = () => {
//     setShowInactive(!showInactive);
//   };

//   const handleEditClick = (turno) => {
//     setSelectedTurno(turno);
//     setSelectedPaciente(turno.paciente); // Asigna el paciente del turno seleccionado
//     setIsModalOpen(true);
//   };

//   const handleSave = async () => {
//     await fetchTurnos(); // Recargar los turnos después de guardar
//     setIsModalOpen(false);
//   };


//   const handleViewTurno = (id) => {
//     setSelectedTurnoId(id);
//     setIsTurnoOpen(true);
//   };

//   const handleCloseTurno = () => {
//     setIsTurnoOpen(false);
//     setSelectedTurnoId(null);
//   };

//   return (
//     <div className="turnosContainer">
//       <div className="display">
//         <div className="searchButtons">
//           <h1>Historial Turnos</h1>
//           <input
//             type="text"
//             placeholder="Buscar Turno"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button className="btn inactive" onClick={toggleInactiveView}>
//             {showInactive ? 'Mostrar Activos' : 'Mostrar Inactivos'}
//           </button>
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th>Paciente</th>
//               <th>Fecha</th>
//               <th>Especialista</th>
//               <th>Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTurnos.length > 0 ? (
//               filteredTurnos.map((turno) => (
//                 <tr key={turno._id}>
//                   <td>{turno.paciente?.nombre || 'Paciente no disponible'}</td>
//                   <td>{new Date(turno.fecha).toLocaleDateString()}</td>
//                   <td>{turno?.especialista?.nombre || 'Especialista no disponible'}</td>
//                   <td className="btns">
//                     <button className="btn edit" onClick={() => handleEditClick(turno)}>
//                       <EditIcon />
//                     </button>
//                     <button className="btn delete" onClick={() => handleDeleteTurno(turno._id)}>
//                       <TrashIcon />
//                     </button>
//                     <button className="btn ver" onClick={() => handleViewTurno(turno._id)}>Ver</button>
//                     <button className="btn espera" onClick={() => handleSalaDeEspera(turno._id)}>
//                       <UserClockIcon />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4">No se encontraron turnos.</td>
//               </tr>
//             )}
//           </tbody>

//         </table>
//       </div>
//       <TurnoModal
//         isOpen={isModalOpen}
//         onRequestClose={() => setIsModalOpen(false)}
//         pacienteId={selectedPaciente?._id} // Asegúrate de que selectedPaciente se asigne correctamente
//         turno={selectedTurno}
//         onSave={handleSave}
//         jwt={jwt}
//       />
//       <TurnoComponent
//         isOpen={isTurnoOpen}
//         onClose={handleCloseTurno}
//         turnoId={selectedTurnoId}
//         jwt={jwt}
//       />
//     </div>
//   );
// };

// export default TurnoTable;

import React, { useState, useEffect } from 'react';
import '../css/TurnoList.css';
import { EditIcon, TrashIcon, UserClockIcon } from '../Hooks/IconsFa';
import TurnoModal from '../components/TurnoModal';
import TurnoComponent from '../components/TurnoComponent';
import useNotify from '../Hooks/Toasts';
import {findAllEspecialista, findAllPaciente, toggleTurnoStatus, handleSalaDeEspera} from '../utils/requests/get/A'
import { API_URL } from '../utils/Initials/ApiUrl';

const TurnoTable = ({ jwt }) => {
  const notify = useNotify();
  const [turnos, setTurnos] = useState([]);
  const [especialistas, setEspecialistas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null); // Inicializa correctamente
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [isTurnoOpen, setIsTurnoOpen] = useState(false);
  const [selectedTurnoId, setSelectedTurnoId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchTurnos();
      await fetchEspecialistas();
      await fetchPacientes();
    };

    fetchData();
  }, [showInactive]);


  // Fetch turnos when the searchQuery changes
  useEffect(() => {
    if (searchQuery !== '') {
      fetchTurnos(searchQuery);
    } else {
      fetchTurnos(); // Fetch all turnos if searchQuery is empty
    }
  }, [searchQuery]);

  const fetchTurnos = async (query = '') => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwt);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const url = query
        ? `${API_URL}/turnos/search?query=${query}`
        : `${API_URL}/turnos/findAllTurnos`;

      const response = await fetch(url, requestOptions);

      if (response.status >= 400) throw new Error("Error al obtener los turnos");

      const result = await response.json();
      const sortedTurnos = (result.data || result).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setTurnos(sortedTurnos);
    } catch (error) {
      console.error("Error al obtener los turnos:", error);
    }
  };

  const fetchEspecialistas = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwt);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(`${API_URL}/especialista/getEspecialistas`, requestOptions);

      if (response.status >= 400) throw new Error("Error al obtener los especialistas");

      const result = await response.json();
      setEspecialistas(result.data || result);
    } catch (error) {
      console.error("Error al obtener los especialistas:", error);
    }
  };

  const fetchPacientes = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwt);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(`${API_URL}/pacientes/findAllPaciente`, requestOptions);

      if (response.status >= 400) throw new Error("Error al obtener los pacientes");

      const result = await response.json();
      setPacientes(result.data || result);
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
    }
  };


  const handleDeleteTurno = async (id) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwt);

    const requestOptions = {
      method: "PATCH", // PATCH para desactivar
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(`${API_URL}/turnos/${id}/toggle-status-activo`, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      console.log("Turno eliminado con éxito");
      notify('Turno eliminado con éxito.');
      fetchTurnos(); // Actualiza la lista de turnos
    } catch (error) {
      console.error("Error al eliminar el turno:", error);
      notify('Error al eliminar el turno.', 'error');
    }
  };


  const handleSalaDeEspera = async (id) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwt);

    const requestOptions = {
      method: "PATCH", // PATCH para desactivar
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(`${API_URL}/turnos/${id}/toggle-status`, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      console.log("Subido a la sala de espera");
      notify('Subido a la sala de espera');
      fetchTurnos(); // Actualiza la lista de turnos
    } catch (error) {
      console.error("Error al subir a la sala de espera", error);
      notify('Error al subir a la sala de espera.', 'error');    }
  };

  // Filtrar turnos según el estado de activos/inactivos
  const filteredTurnos = turnos.filter((turno) =>
    showInactive ? !turno.activo : turno.activo
  );

  const toggleInactiveView = () => {
    setShowInactive(!showInactive);
  };

  const handleEditClick = (turno) => {
    setSelectedTurno(turno);
    setSelectedPaciente(turno.paciente); // Asigna el paciente del turno seleccionado
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await fetchTurnos(); // Recargar los turnos después de guardar
    setIsModalOpen(false);
  };


  const handleViewTurno = (id) => {
    setSelectedTurnoId(id);
    setIsTurnoOpen(true);
  };

  const handleCloseTurno = () => {
    setIsTurnoOpen(false);
    setSelectedTurnoId(null);
  };

  return (
    <div className="turnosContainer">
      <div className="display">
        <div className="searchButtons">
          <h1>Historial Turnos</h1>
          <input
            type="text"
            placeholder="Buscar Turno"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn inactive" onClick={toggleInactiveView}>
            {showInactive ? 'Mostrar Activos' : 'Mostrar Inactivos'}
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Especialista</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTurnos.length > 0 ? (
              filteredTurnos.map((turno) => (
                <tr key={turno._id}>
                  <td data-label="Nombre">{turno.paciente?.nombre || 'Paciente no disponible'}</td>
                  <td data-label="Turno">{new Date(turno.fecha).toLocaleDateString()}</td>
                  <td data-label="Esp.">{turno?.especialista?.nombre || 'Especialista no disponible'}</td>
                  <td className="btns">
                    <button className="btn edit" onClick={() => handleEditClick(turno)}>
                    <EditIcon />
                    </button>
                    <button className="btn delete" onClick={() => handleDeleteTurno(turno._id)}>
                    <TrashIcon />
                    </button>
                    <button className="btn ver" onClick={() => handleViewTurno(turno._id)}>Ver</button>
                    <button className="btn espera" onClick={() => handleSalaDeEspera(turno._id)}>
                    <UserClockIcon />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No se encontraron turnos.</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
      <TurnoModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        pacienteId={selectedPaciente?._id} // Asegúrate de que selectedPaciente se asigne correctamente
        turno={selectedTurno}
        onSave={handleSave}
        jwt={jwt}
      />
      <TurnoComponent
        isOpen={isTurnoOpen}
        onClose={handleCloseTurno}
        turnoId={selectedTurnoId}
        jwt={jwt}
      />
    </div>
  );
};

export default TurnoTable;