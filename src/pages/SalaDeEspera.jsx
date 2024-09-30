import React, { useEffect, useState } from 'react';
import useNotify from '../Hooks/Toasts';
import '../css/SalaDeEspera.css';
import { API_URL } from '../utils/Initials/ApiUrl';
import { findAllTurnos, findPacienteById, findAntecedenteById, updateTurno, handleSalaDeEspera } from '../utils/requests/get/A'


const SalaDeEspera = ({ jwt }) => {
    const notify = useNotify();
    const [turnos, setTurnos] = useState([]);
    const [paciente, setPaciente] = useState(null);
    const [antecedentes, setAntecedentes] = useState({});
    const [turnosPaciente, setTurnosPaciente] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
    const [precio, setPrecio] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            await fetchTurnos();
        };

        fetchData();
    }, []);

    const fetchTurnos = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            const response = await fetch(`${API_URL}/turnos/findAllTurnos`, requestOptions);

            if (response.status >= 400) throw new Error("Error al obtener los turnos");

            const result = await response.json();
            setTurnos(result.data || result);
        } catch (error) {
            console.error("Error al obtener los turnos:", error);
        }
    };

    const fetchPacienteData = async (id) => {
        try {
            if (!jwt) throw new Error("JWT no proporcionado");

            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);

            const response = await fetch(`${API_URL}/pacientes/findPacienteById/${id}`, {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            });

            if (!response.ok) throw new Error("No se pudo obtener al paciente");

            const result = await response.json();
            setPaciente(result.data);

            // Filtrar y ordenar los turnos del paciente por fecha
            const turnosFiltrados = turnos.filter(turno => turno.paciente._id === id);
            setTurnosPaciente(turnosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));

            // Verificar si existen antecedentes y obtener su ID
            if (result.data.antecedentes) {
                console.log(result.data.antecedentes);
                if (result.data.antecedentes.id) {
                    await findAntecedenteById(result.data.antecedentes.id);
                }
            }
        } catch (error) {
            console.error("Error al obtener al paciente:", error);
        }
    };

    const findAntecedenteById = async (id) => {
        try {
            if (!jwt) throw new Error("JWT no proporcionado");

            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);

            const response = await fetch(`${API_URL}/antecedentes/findAntecedenteById/${id}`, {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            });

            if (response.status >= 400) throw new Error("No se pudieron obtener los antecedentes");

            const result = await response.json();
            setAntecedentes(sanitizeModel(result.data));
        } catch (error) {
            console.error("Error al obtener los antecedentes:", error);
        }
    };

    const sanitizeModel = (obj) => {
        delete obj["_id"];
        delete obj["__v"];
        delete obj["password"];
        return obj;
    };

    const toggleTurno = async (id) => {
        console.log(`Turno con ID ${id} ha sido abierto`);
        await fetchPacienteData(id);
    };

    const handleDescripcionChange = (e) => {
        setDescripcion(e.target.value);
    };

    const handleSalaDeEspera = async (id) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + jwt);
    
        const requestOptions = {
            method: "PATCH",
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
            fetchTurnos(); // Actualiza la lista de turnos
        } catch (error) {
            console.error("Error al subir a sala de espera", error);
            notify('Error al cerrar el turno.', 'error');
        }
    };
    

    const handleCerrarTurno = async () => {
        if (!turnoSeleccionado || !turnoSeleccionado._id) return;
    
        try {
            // Cambia el estado del turno usando handleSalaDeEspera
            await handleSalaDeEspera(turnoSeleccionado._id);
    
            // Espera un poco para asegurarte de que el estado se haya actualizado
            await new Promise(resolve => setTimeout(resolve, 500));
    
            // Luego realiza la actualización del turno con la descripción y el estado actualizado
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + jwt);
    
            const body = JSON.stringify({
                descripcion,
                turno: false, // Asegúrate de que esto esté incluido
                paciente: turnoSeleccionado.paciente._id,
                precio,
            });
    
            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body,
                redirect: "follow",
            };
    
            const response = await fetch(`${API_URL}/turnos/updateTurnoById/${turnoSeleccionado._id}`, requestOptions);
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al actualizar el turno: ${errorText}`);
            }
            notify('Turno finalizado y guardado.');
            // Refrescar los turnos y limpiar la selección
            await fetchTurnos();
            setTurnoSeleccionado(null);
            setDescripcion('');
        } catch (error) {
            notify('Error al cerrar el turno.', 'error');
            console.error("Error al cerrar el turno:", error);
        }
    };
    
    

    const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    return (
        <div className="salaDeEsperaContainer">
            <div className="toasts">
                {turnos.filter(turno => turno.turno === true).map((turno, index) => (
                    <div key={turno._id} className="toast">
                        <div className="toast-header">
                            <strong className="mr-auto">{index + 1}: {turno.paciente.nombre}</strong><br />
                            <strong className="mr-auto">Especialista {index + 1}: {turno.especialista.nombre}</strong>
                            <button
                                onClick={() => {
                                    toggleTurno(turno.paciente._id);
                                    setTurnoSeleccionado(turno);
                                    setDescripcion(turno.descripcion || '');
                                }}
                                className="btn-espera"
                            >
                                Abrir Consulta
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="display PacientesInfo">
                <h2>Información de Pacientes</h2>
                {paciente ? (
                    <div className="paciente-informacion">
                        <div className="informacion-section">
                            <p><strong>Nombre:</strong> {paciente.nombre}</p>
                            <p><strong>DNI:</strong> {paciente.dni}</p>
                            <p><strong>Domicilio:</strong> {paciente.domicilio}</p>
                            <p><strong>Teléfono:</strong> {paciente.telefono}</p>
                            <p><strong>Fecha de Nacimiento:</strong> {formatDateForInput(paciente.fechaNacimiento)}</p>
                            <p><strong>Edad:</strong> {paciente.edad}</p>
                            <p><strong>Sexo:</strong> {paciente.sexo}</p>
                            <p><strong>Medicamentos:</strong> {paciente.medicamentos}</p>
                        </div>
                        <div className="informacion-section-antecedentes">
                            <h3>Antecedentes</h3>
                            {antecedentes && Object.keys(paciente.antecedentes).length > 0 ? (
                                Object.keys(paciente.antecedentes).map((key) => (
                                    paciente.antecedentes[key] === true && (
                                        <p key={key}>
                                            <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> Sí
                                        </p>
                                    )
                                ))
                            ) : (
                                <p>El paciente no tiene antecedentes médicos.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Seleccione un turno para ver la información del paciente.</p>
                )}
            </div>
            <div className="display HistorialDeVisitas">
                <h2>Historial de Turnos</h2>
                {turnosPaciente.length > 0 ? (
                    <ul>
                        {turnosPaciente.map((turno) => (
                            <li key={turno._id}>
                                <p><strong>Fecha:</strong> {formatDateForInput(turno.fecha)}</p>
                                <p><strong>Especialista:</strong> {turno.especialista.nombre}</p>
                                <p><strong>Motivo:</strong> {turno.descripcion}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay turnos previos para este paciente.</p>
                )}
            </div>
            <div className="display FinalizarTurno">
                <h2>Finalizar Turno</h2>
                {turnoSeleccionado ? (
                    <div className="formulario-finalizar">
                        <label>Descripción del Turno:</label>
                        <textarea
                            value={descripcion}
                            onChange={handleDescripcionChange}
                            rows="4"
                            placeholder="Ingrese la descripción del turno"
                        />
                    <label>
                        Precio:
                        <input
                            type="text"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            required
                        />
                    </label>
                        <button onClick={handleCerrarTurno} className="btn add turno">
                            Cerrar Turno
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default SalaDeEspera;


// SalaDeEspera.jsx
// import React, { useEffect, useState } from 'react';
// import useNotify from '../Hooks/Toasts';
// import '../css/SalaDeEspera.css';
// import {
//   findAllTurnos,
//   findPacienteById,
//   findAntecedenteById,
//   updateTurno,
//   handleSalaDeEspera
// } from '../utils/requests/get/A';

// const SalaDeEspera = ({ jwt }) => {
//   const notify = useNotify();
//   const [turnos, setTurnos] = useState([]);
//   const [paciente, setPaciente] = useState(null);
//   const [antecedentes, setAntecedentes] = useState({});
//   const [turnosPaciente, setTurnosPaciente] = useState([]);
//   const [descripcion, setDescripcion] = useState('');
//   const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
//   const [precio, setPrecio] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchTurnos();
//     };
//     fetchData();
//   }, []);

//   // Obtener todos los turnos
//   const fetchTurnos = async () => {
//     try {
//       const turnosData = await findAllTurnos(jwt);
//       setTurnos(turnosData);
//     } catch (error) {
//       console.error("Error al obtener los turnos:", error);
//       notify('Error al obtener los turnos.', 'error');
//     }
//   };

//   // Obtener datos del paciente por ID
//   const fetchPacienteData = async (pacienteId) => {
//     try {
//       const pacienteData = await findPacienteById(pacienteId, jwt);
//       setPaciente(pacienteData);

//       // Filtrar y ordenar los turnos del paciente por fecha
//       const turnosFiltrados = turnos.filter(turno => turno.paciente._id === pacienteId);
//       setTurnosPaciente(turnosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));

//       // Verificar si existen antecedentes
//       if (pacienteData?.antecedentes?.id) {
//         await fetchAntecedente(pacienteData.antecedentes.id);
//       }
//     } catch (error) {
//       console.error("Error al obtener al paciente:", error);
//       notify('Error al obtener la información del paciente.', 'error');
//     }
//   };

//   // Obtener antecedentes por ID
//   const fetchAntecedente = async (id) => {
//     try {
//       const antecedentesData = await findAntecedenteById(id, jwt);
//       setAntecedentes(sanitizeModel(antecedentesData));
//     } catch (error) {
//       console.error("Error al obtener los antecedentes:", error);
//       notify('Error al obtener los antecedentes.', 'error');
//     }
//   };

//   // Sanitizar el modelo eliminando campos sensibles
//   const sanitizeModel = (obj) => {
//     const sanitizedObj = { ...obj };
//     delete sanitizedObj["_id"];
//     delete sanitizedObj["__v"];
//     delete sanitizedObj["password"];
//     return sanitizedObj;
//   };

//   // Manejar la apertura de un turno
//   const toggleTurno = async (turnoId) => {
//     const turno = turnos.find(t => t._id === turnoId);
//     if (turno) {
//       console.log(`Turno con ID ${turnoId} ha sido abierto`);
//       setTurnoSeleccionado(turno);
//       setDescripcion(turno.descripcion || '');
//       await fetchPacienteData(turno.paciente._id); // Pasar el ID del paciente
//     }
//   };

//   // Manejar cambios en la descripción
//   const handleDescripcionChange = (e) => {
//     setDescripcion(e.target.value);
//   };

//   // Manejar el cambio de estado a sala de espera usando la función importada
//   const handleSalaDeEsperaToggle = async (id) => {
//     try {
//       await handleSalaDeEspera(id, jwt);
//       console.log("Turno movido a sala de espera");
//       notify('Turno movido a sala de espera.', 'success');
//       fetchTurnos(); // Actualiza la lista de turnos
//     } catch (error) {
//       console.error("Error al mover el turno a sala de espera:", error);
//       notify('Error al mover el turno a sala de espera.', 'error');
//     }
//   };

//   // Manejar el cierre de un turno
//   const handleCerrarTurno = async () => {
//     if (!turnoSeleccionado || !turnoSeleccionado._id) return;

//     // Validar campos
//     if (!descripcion.trim()) {
//       notify('La descripción es obligatoria.', 'error');
//       return;
//     }

//     if (isNaN(precio) || precio <= 0) {
//       notify('El precio debe ser un número válido mayor que 0.', 'error');
//       return;
//     }

//     try {
//       // Cambia el estado del turno usando handleSalaDeEsperaToggle
//       await handleSalaDeEsperaToggle(turnoSeleccionado._id);

//       // Pausa para asegurar que el estado se haya actualizado
//       await new Promise(resolve => setTimeout(resolve, 500));

//       // Construir el objeto actualizado con todos los campos requeridos
//       const updatedTurno = {
//         descripcion,
//         turno: false, // Cerrar el turno
//         paciente: turnoSeleccionado.paciente._id,
//         precio: parseFloat(precio), // Asegurarse de que sea un número
//       };

//       // Actualizar el turno usando la función importada
//       await updateTurno(turnoSeleccionado._id, updatedTurno, jwt);
//       notify('Turno cerrado exitosamente y guardado.', 'success');

//       // Refrescar los turnos y limpiar la selección
//       await fetchTurnos();
//       setTurnoSeleccionado(null);
//       setDescripcion('');
//       setPrecio('');
//     } catch (error) {
//       console.error("Error al cerrar el turno:", error);
//       notify('Error al cerrar el turno.', 'error');
//     }
//   };

//   // Formatear la fecha para el input
//   const formatDateForInput = (date) => {
//     if (!date) return '';
//     const d = new Date(date);
//     return d.toISOString().split('T')[0];
//   };

//   return (
//     <div className="salaDeEsperaContainer">
//       <div className="toasts">
//         {turnos.filter(turno => turno.turno === true).map((turno, index) => (
//           <div key={turno._id} className="toast">
//             <div className="toast-header">
//               <strong className="mr-auto">{index + 1}: {turno.paciente.nombre}</strong><br />
//               <strong className="mr-auto">Especialista {index + 1}: {turno.especialista.nombre}</strong>
//               <button
//                 onClick={() => {
//                   toggleTurno(turno._id); // Asegúrate de pasar el ID del turno
//                   setTurnoSeleccionado(turno);
//                   setDescripcion(turno.descripcion || '');
//                 }}
//                 className="btn-espera"
//               >
//                 Abrir Consulta
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="display PacientesInfo">
//         <h2>Información de Pacientes</h2>
//         {paciente ? (
//           <div className="paciente-informacion">
//             <div className="informacion-section">
//               <p><strong>Nombre:</strong> {paciente.nombre}</p>
//               <p><strong>DNI:</strong> {paciente.dni}</p>
//               <p><strong>Domicilio:</strong> {paciente.domicilio}</p>
//               <p><strong>Teléfono:</strong> {paciente.telefono}</p>
//               <p><strong>Fecha de Nacimiento:</strong> {formatDateForInput(paciente.fechaNacimiento)}</p>
//               <p><strong>Edad:</strong> {paciente.edad}</p>
//               <p><strong>Sexo:</strong> {paciente.sexo}</p>
//               <p><strong>Medicamentos:</strong> {paciente.medicamentos}</p>
//             </div>
//             <div className="informacion-section-antecedentes">
//               <h3>Antecedentes</h3>
//               {antecedentes && Object.keys(antecedentes).length > 0 ? (
//                 Object.keys(antecedentes).map((key) => (
//                   antecedentes[key] === true && (
//                     <p key={key}>
//                       <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> Sí
//                     </p>
//                   )
//                 ))
//               ) : (
//                 <p>El paciente no tiene antecedentes médicos.</p>
//               )}
//             </div>
//           </div>
//         ) : (
//           <p>Seleccione un turno para ver la información del paciente.</p>
//         )}
//       </div>

//       <div className="display HistorialDeVisitas">
//         <h2>Historial de Turnos</h2>
//         {turnosPaciente.length > 0 ? (
//           <ul>
//             {turnosPaciente.map((turno) => (
//               <li key={turno._id}>
//                 <p><strong>Fecha:</strong> {formatDateForInput(turno.fecha)}</p>
//                 <p><strong>Especialista:</strong> {turno.especialista.nombre}</p>
//                 <p><strong>Motivo:</strong> {turno.descripcion}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No hay turnos previos para este paciente.</p>
//         )}
//       </div>

//       <div className="display FinalizarTurno">
//         <h2>Finalizar Turno</h2>
//         {turnoSeleccionado ? (
//           <div className="formulario-finalizar">
//             <label>Descripción del Turno:</label>
//             <textarea
//               value={descripcion}
//               onChange={handleDescripcionChange}
//               rows="4"
//               placeholder="Ingrese la descripción del turno"
//             />
//             <label>
//               Precio:
//               <input
//                 type="text"
//                 value={precio}
//                 onChange={(e) => setPrecio(e.target.value)}
//                 required
//               />
//             </label>
//             <button onClick={handleCerrarTurno} className="btn add turno">
//               Cerrar Turno
//             </button>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default SalaDeEspera;
