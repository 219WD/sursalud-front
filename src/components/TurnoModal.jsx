import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../css/TurnoModal.css';

import useNotify from '../Hooks/Toasts';


Modal.setAppElement('#root');

const TurnoModal = ({ isOpen, onRequestClose, turno, onSave, jwt, pacienteId }) => {
    const notify = useNotify();
    const [turnoActivo, setTurnoActivo] = useState(true);
    const [paciente, setPaciente] = useState(null);
    const [fechaTurno, setFechaTurno] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [especialistaId, setEspecialistaId] = useState('');
    const [especialistas, setEspecialistas] = useState([]);
    const [pagina, setPagina] = useState(1);

    useEffect(() => {
        if (!isOpen) {
            // Resetear el estado del componente cuando el modal se cierra
            setPaciente(null);
            setFechaTurno('');
            setDescripcion('');
            setEspecialistaId('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (turno) {
            setTurnoActivo(turno.turno);
            setPaciente(turno.paciente || null);
            setFechaTurno(turno.fecha ? new Date(turno.fecha).toISOString().slice(0, 16) : ''); 
            setDescripcion(turno.descripcion);
            setEspecialistaId(turno.especialista ? turno.especialista._id : ''); 
        }
    }, [turno]);
    

    useEffect(() => {
        if (isOpen) {
            getEspecialistas(); // Obtener la lista de especialistas cuando se abre el modal
            getPacienteById(); // Obtener el paciente por ID
        }
    }, [isOpen]);

    const getPacienteById = async () => {
        try {
            if (!pacienteId) {
                console.warn("pacienteId no está definido");
                return;
            }

            if (!jwt) throw new Error("JWT no proporcionado");

            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            const response = await fetch(`http://localhost:3000/pacientes/findPacienteById/${pacienteId}`, requestOptions);

            if (response.status >= 400) return alert("No se pudo obtener el paciente");

            const result = await response.json();
            setPaciente(result.data || result); // Ajusta según el formato real de la respuesta
        } catch (error) {
            console.error("Error al obtener el paciente:", error);
        }
    };


    const createTurno = async () => {
        try {
            if (!jwt) throw new Error("JWT no proporcionado");

            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                turno: turnoActivo,
                paciente: pacienteId, // Usamos pacienteId aquí
                fecha: fechaTurno,
                descripcion,
                especialista: especialistaId,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            const response = await fetch("http://localhost:3000/turnos/createTurno", requestOptions);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            notify('Turno agendado con éxito');
            console.log('Turno guardado:', result);
            onSave();

        } catch (error) {
            notify('Error al agendar turno.', 'error')
            console.error('Error al crear turno:', error);
        }
    };

    const getEspecialistas = async () => {
        try {
            if (!jwt) throw new Error("JWT no proporcionado");

            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            const response = await fetch(`http://localhost:3000/especialista/getEspecialistas`, requestOptions);

            if (response.status >= 400) return alert("No se pudieron obtener los especialistas");

            const result = await response.json();
            setEspecialistas(result.data || result); // Ajusta según el formato real de la respuesta
        } catch (error) {
            console.error("Error al obtener los especialistas:", error);
        }
    };

    const updateTurnoById = async (id) => {
        try {
            if (!jwt) throw new Error("JWT no proporcionado");
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);
            myHeaders.append("Content-Type", "application/json");

            const rawTurno = JSON.stringify({
                turno: turnoActivo,
                paciente: pacienteId, // Usamos pacienteId aquí también
                fecha: fechaTurno,
                descripcion,
                especialista: especialistaId,
            });

            const requestOptionsTurno = {
                method: "PUT",
                headers: myHeaders,
                body: rawTurno,
                redirect: "follow",
            };

            const responseTurno = await fetch(`http://localhost:3000/turnos/updateTurnoById/${id}`, requestOptionsTurno);
            const result = await responseTurno.json();
            notify('Turno editado con éxito');
            console.log(result);
        } catch (error) {
            notify('Error al editar turno.', 'error')
            console.error('Error al editar turno:', error);
        }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (turno && turno._id) {
      console.log("Actualizando turno con ID:", turno._id);
      await updateTurnoById(turno._id);
    } else {
      console.log("Creando nuevo turno");
      await createTurno();
    }
    onSave();
    onRequestClose();
  };

    const formatFechaHora = (fechaHora) => {
        if (!fechaHora) return '';

        const fecha = new Date(fechaHora);

        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
        const año = fecha.getFullYear().toString().slice(-2); // Obtener los últimos dos dígitos del año

        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');

        return `${dia}-${mes}-${año} ${horas}:${minutos}`;
    };


    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Turno Modal">
            <h2 className="modal-titulo">{turno ? 'Editar Turno' : 'Agregar Turno'}</h2>

            {pagina === 1 && (
                <form className="turno-formulario" onSubmit={(e) => { e.preventDefault(); setPagina(2); }}>
                    <label>
                        Paciente:
                        <h2 className='nombrePaciente'>{paciente ? paciente.nombre : 'Nombre del paciente no disponible'}</h2>
                    </label>

                    <label>
                        Fecha del Turno:
                        <input
                            type="datetime-local"
                            value={fechaTurno}
                            onChange={(e) => setFechaTurno(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Descripción:
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Descripción del turno"
                            required
                        />
                    </label>
                    <label>
                        Especialista:
                        <select
                            value={especialistaId}
                            onChange={(e) => setEspecialistaId(e.target.value)}
                            required
                        >
                            <option value="">Selecciona un especialista</option>
                            {especialistas.length > 0 && especialistas.map((especialista) => (
                                <option key={especialista._id} value={especialista._id}>
                                    {especialista.especialidad} - {especialista.nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="turno-boton-container">
                        <button type="submit" className="turno-btn-principal">Siguiente</button>
                        <button type="button" className="turno-btn-secundario" onClick={onRequestClose}>Cancelar</button>
                    </div>
                </form>
            )}

            {pagina === 2 && (
                <div className="turno-resumen">
                    <h3>Resumen del Turno</h3>
                    <p><strong>Paciente:</strong> {paciente ? paciente.nombre : 'Nombre del paciente no disponible'}</p>
                    <p><strong>Fecha del Turno:</strong> {formatFechaHora(fechaTurno)}</p>
                    <p><strong>Descripción:</strong> {descripcion}</p>
                    <p><strong>Especialista:</strong> {especialistaId ? especialistas.find(e => e._id === especialistaId).nombre : 'Especialista no seleccionado'}</p>

                    <div className="turno-boton-container">
                        <button type="button" className="turno-btn-principal" onClick={handleSubmit}>
                            {turno ? 'Guardar Cambios' : 'Crear Turno'}
                        </button>
                        <button type="button" className="turno-btn-secundario" onClick={() => setPagina(1)}>Volver</button>
                        <button type="button" className="turno-btn-secundario" onClick={onRequestClose}>Cancelar</button>
                    </div>
                </div>
            )}

        </Modal>
    );
};

export default TurnoModal;
