import React, { useState, useEffect } from 'react';
import { Xmark } from '../Hooks/IconsFa';
import Modal from 'react-modal';
import '../css/TurnoComponent.css';
import { API_URL } from '../utils/Initials/ApiUrl';

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

            const response = await fetch(`${API_URL}/turnos/findATurnoById/${id}`, {
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

    // Función para sumar 3 horas
    const sumarTresHoras = (fechaOriginal) => {
        const fecha = new Date(fechaOriginal);
        fecha.setHours(fecha.getHours() + 3); // Sumar 3 horas
        return fecha;
    };

    const handleCloseModal = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Detalles del Turno"
            overlayClassName="TurnoModal__Overlay"
            className="turnoR-modal"
        >
            <button className="close-btn" onClick={handleCloseModal}>
                <Xmark />
            </button>
            {turno && (
                <div className="turno-info">
                    <h3>Detalles del Turno</h3>
                    <p>
                        <strong>Fecha y Hora:</strong>
                        {turno.fecha && sumarTresHoras(turno.fecha).toLocaleString('es-ES', {
                            timeZone: 'America/Argentina/Buenos_Aires', // Zona horaria correcta
                            dateStyle: 'short',
                            timeStyle: 'short',
                        })}
                    </p>
                    <p><strong>Paciente:</strong> {turno.paciente.nombre}</p>
                    <p><strong>Doctor:</strong> {turno.especialista.nombre}</p>
                    <p><strong>Descripción:</strong> {turno.descripcion}</p>
                    <p><strong>Precio:</strong> {turno.precio}</p>
                </div>
            )}
        </Modal>
    );
};

export default TurnoComponent;
