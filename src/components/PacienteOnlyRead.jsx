// import React, { useState, useEffect } from 'react';
// import '../css/PacienteComponent.css'; // Asegúrate de tener los estilos necesarios
// import { Xmark } from '../Hooks/IconsFa';

// const PacienteComponent = ({ isOpen, onClose, pacienteId, jwt }) => {
//     const [paciente, setPaciente] = useState(null);
//     const [antecedentes, setAntecedentes] = useState({});

//     useEffect(() => {
//         if (pacienteId) {
//             fetchPacienteData(pacienteId);
//         }
//     }, [pacienteId]);

//     useEffect(() => {
//         if (paciente && paciente.antecedentes) {
//             findAntecedenteById(paciente.antecedentes);
//         }
//     }, [antecedentes]); // Llama a findAntecedenteById solo cuando paciente cambia

//     const sanitizeModel = (obj) => {
//         delete obj["_id"];
//         delete obj["__v"];
//         delete obj["password"];
//         return obj;
//     };

//     const fetchPacienteData = async (id) => {
//         try {
//             if (!jwt) throw new Error("JWT no proporcionado");

//             const myHeaders = new Headers();
//             myHeaders.append("Authorization", "Bearer " + jwt);

//             const response = await fetch(`http://localhost:3000/pacientes/findPacienteById/${id}`, {
//                 method: "GET",
//                 headers: myHeaders,
//                 redirect: "follow",
//             });

//             if (!response.ok) throw new Error("No se pudo obtener al paciente");

//             const result = await response.json();
//             setPaciente(result.data);
//         } catch (error) {
//             console.error("Error al obtener al paciente:", error);
//         }
//     };

//     const findAntecedenteById = async (id) => {
//         try {
//             if (!jwt) throw new Error("JWT no proporcionado");

//             const myHeaders = new Headers();
//             myHeaders.append("Authorization", "Bearer " + jwt);

//             const requestOptions = {
//                 method: "GET",
//                 headers: myHeaders,
//                 redirect: "follow"
//             };

//             const response = await fetch(`http://localhost:3000/antecedentes/findAntecedenteById/${id}`, requestOptions);

//             if (response.status >= 400) return alert("No se pudieron obtener los antecedentes");

//             const result = await response.json();
//             setAntecedentes(sanitizeModel(result.data));
//             console.log(result);
//         } catch (error) {
//             console.error("Error al obtener los antecedentes:", error);
//         }
//     };

//     const handleCloseModal = () => {
//         onClose();
//     };

//     if (!isOpen) return null;

//     const formatDateForInput = (date) => {
//         if (!date) return '';
//         const d = new Date(date);
//         return d.toISOString().split('T')[0];
//     };

//     // Verifica si el paciente tiene antecedentes médicos
//     const tieneAntecedentes = paciente && paciente.antecedentes && Object.values(paciente.antecedentes).some(value => value === true);


//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <button className="close-btn" onClick={handleCloseModal}>
//                     <Xmark />
//                 </button>
//                 {paciente && (
//                     <div className="paciente-info">
//                         <div className="info-section">
//                             <h3>Datos del Paciente</h3>
//                             <p><strong>Nombre:</strong> {paciente.nombre}</p>
//                             <p><strong>DNI:</strong> {paciente.dni}</p>
//                             <p><strong>Domicilio:</strong> {paciente.domicilio}</p>
//                             <p><strong>Teléfono:</strong> {paciente.telefono}</p>
//                             <p><strong>Fecha de Nacimiento:</strong> {formatDateForInput(paciente.fechaNacimiento)}</p>
//                             <p><strong>Edad:</strong> {paciente.edad}</p>
//                             <p><strong>Sexo:</strong> {paciente.sexo}</p>
//                         </div>
//                         <div className="info-section">
//                             <h3>Antecedentes</h3>
//                             {tieneAntecedentes ? (
//                                 Object.keys(paciente.antecedentes).map((key) => (
//                                     paciente.antecedentes[key] === true && (
//                                         <p key={key}>
//                                             <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> Sí
//                                         </p>
//                                     )
//                                 ))
//                             ) : (
//                                 <p>El paciente no tiene antecedentes médicos.</p>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PacienteComponent;

import React, { useState, useEffect, useCallback } from 'react';
import '../css/PacienteComponent.css'; // Asegúrate de tener los estilos necesarios
import { Xmark } from '../Hooks/IconsFa';
import { findAntecedenteById, findPacienteById } from '../utils/requests/post/Post';

const PacienteComponent = ({ isOpen, onClose, pacienteId, jwt }) => {
  const [paciente, setPaciente] = useState(null);
  const [antecedentes, setAntecedentes] = useState({});

  const sanitizeModel = (obj) => {
    const { _id, __v, password, ...rest } = obj;
    return rest;
  };

  const fetchPacienteData = useCallback(async (id) => {
    try {
      const pacienteData = await findPacienteById(id, jwt);
      setPaciente(pacienteData);

      // Si el paciente tiene antecedentes, los busca.
      if (pacienteData && pacienteData.antecedentes) {
        const antecedenteData = await findAntecedenteById(pacienteData.antecedentes, jwt);
        setAntecedentes(sanitizeModel(antecedenteData));
      }
    } catch (error) {
      console.error('Error al obtener los datos del paciente:', error);
    }
  }, [jwt]);

  useEffect(() => {
    if (pacienteId) {
      fetchPacienteData(pacienteId);
    }
  }, [pacienteId, fetchPacienteData]);

  const handleCloseModal = () => {
    onClose();
  };

  if (!isOpen) return null;

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Verifica si el paciente tiene antecedentes médicos
  const tieneAntecedentes =
    paciente && paciente.antecedentes && Object.values(paciente.antecedentes).some((value) => value === true);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={handleCloseModal}>
          <Xmark />
        </button>
        {paciente && (
          <div className="paciente-info">
            <div className="info-section">
              <h3>Datos del Paciente</h3>
              <p>
                <strong>Nombre:</strong> {paciente.nombre}
              </p>
              <p>
                <strong>DNI:</strong> {paciente.dni}
              </p>
              <p>
                <strong>Domicilio:</strong> {paciente.domicilio}
              </p>
              <p>
                <strong>Teléfono:</strong> {paciente.telefono}
              </p>
              <p>
                <strong>Fecha de Nacimiento:</strong> {formatDateForInput(paciente.fechaNacimiento)}
              </p>
              <p>
                <strong>Edad:</strong> {paciente.edad}
              </p>
              <p>
                <strong>Sexo:</strong> {paciente.sexo}
              </p>
            </div>
            <div className="info-section">
              <h3>Antecedentes</h3>
              {tieneAntecedentes ? (
                Object.keys(paciente.antecedentes).map(
                  (key) =>
                    paciente.antecedentes[key] === true && (
                      <p key={key}>
                        <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> Sí
                      </p>
                    )
                )
              ) : (
                <p>El paciente no tiene antecedentes médicos.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PacienteComponent;