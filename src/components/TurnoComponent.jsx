import React, { useState, useEffect } from 'react';
import { Xmark } from '../Hooks/IconsFa';
import Modal from 'react-modal';

const TurnoComponent = ({ isOpen, onClose, turnoId, jwt }) => {
    const [turno, setTurno] = useState(null);
    Modal.setAppElement('#root');

    useEffect(() => {
        if (turnoId) {
            fetchTurnoData(turnoId);
        }
    }, [turnoId]);

    const fetchTurnoData = async (id) => {
        try {
            if (!jwt) throw new Error("JWT no proporcionado");

            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);

            const response = await fetch(`http://localhost:3000/turnos/findATurnoById/${id}`, {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            });

            if (!response.ok) throw new Error("No se pudo obtener el turno");

            const result = await response.json();
            setTurno(result.data);
        } catch (error) {
            console.error("Error al obtener el turno:", error);
        }
    };

    const handleCloseModal = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={handleCloseModal}>
                    <Xmark />
                </button>
                {turno && (
                    <div className="turno-info">
                        <h3>Detalles del Turno</h3>
                        <p>
                            <strong>Fecha y Hora:</strong> {new Date(turno.fecha).toLocaleString('es-ES', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                            })}
                        </p>
                        <p><strong>Paciente:</strong> {turno.paciente.nombre}</p>
                        <p><strong>Doctor:</strong> {turno.especialista.nombre}</p>
                        <p><strong>Descripción:</strong> {turno.descripcion}</p>
                    </div>

                )}
            </div>
        </div>
    );
};

export default TurnoComponent;

// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import { Xmark } from '../Hooks/IconsFa';
// import '../css/TurnoModal.css'; // Reutilizando los estilos del modal

// Modal.setAppElement('#root');

// const TurnoComponent = ({ isOpen, onRequestClose, turnoId, jwt }) => {
//     const [turno, setTurno] = useState(null);

//     useEffect(() => {
//         if (isOpen && turnoId) {
//             fetchTurnoData(turnoId);
//         }
//     }, [isOpen, turnoId]);

//     const fetchTurnoData = async (id) => {
//         try {
//             if (!jwt) throw new Error("JWT no proporcionado");

//             const myHeaders = new Headers();
//             myHeaders.append("Authorization", "Bearer " + jwt);

//             const response = await fetch(`http://localhost:3000/turnos/findATurnoById/${id}`, {
//                 method: "GET",
//                 headers: myHeaders,
//                 redirect: "follow",
//             });

//             if (!response.ok) throw new Error("No se pudo obtener el turno");

//             const result = await response.json();
//             setTurno(result.data);
//         } catch (error) {
//             console.error("Error al obtener el turno:", error);
//         }
//     };

//     const formatFechaHora = (fechaHora) => {
//         if (!fechaHora) return '';

//         const fecha = new Date(fechaHora);
//         const dia = String(fecha.getDate()).padStart(2, '0');
//         const mes = String(fecha.getMonth() + 1).padStart(2, '0');
//         const año = fecha.getFullYear().toString().slice(-2);
//         const horas = String(fecha.getHours()).padStart(2, '0');
//         const minutos = String(fecha.getMinutes()).padStart(2, '0');

//         return `${dia}-${mes}-${año} ${horas}:${minutos}`;
//     };

//     return (
//         <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Detalles del Turno">
//             <div className="modal-header">
//                 <h2>Detalles del Turno</h2>
//                 <button className="close-btn" onClick={onRequestClose}>
//                     <Xmark />
//                 </button>
//             </div>

//             {turno ? (
//                 <div className="modal-body">
//                     <p><strong>Fecha y Hora:</strong> {formatFechaHora(turno.fecha)}</p>
//                     <p><strong>Paciente:</strong> {turno.paciente.nombre}</p>
//                     <p><strong>Doctor:</strong> {turno.especialista.nombre}</p>
//                     <p><strong>Descripción:</strong> {turno.descripcion}</p>
//                 </div>
//             ) : (
//                 <p>Cargando datos del turno...</p>
//             )}

//             <div className="modal-footer">
//                 <button className="turno-btn-secundario" onClick={onRequestClose}>Cerrar</button>
//             </div>
//         </Modal>
//     );
// };

// export default TurnoComponent;
