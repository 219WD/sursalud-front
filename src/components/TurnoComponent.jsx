import React, { useState, useEffect } from 'react';
import { Xmark } from '../Hooks/IconsFa';

const TurnoComponent = ({ isOpen, onClose, turnoId, jwt }) => {
    const [turno, setTurno] = useState(null);

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
