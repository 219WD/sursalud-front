import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../css/EspecialistaModal.css';
import useNotify from '../Hooks/Toasts';

Modal.setAppElement('#root');

const EspecialistaModal = ({ isOpen, onRequestClose, especialista, onSave, jwt }) => {
    const notify = useNotify();
    const [nombre, setNombre] = useState('');
    const [especialidad, setEspecialidad] = useState('');

    const [pagina, setPagina] = useState(1);

    const sanitizeModel = (obj) => {
        delete obj["_id"];
        delete obj["__v"];
        delete obj["password"];
        return obj;
    };

    useEffect(() => {
        if (!isOpen) {
            // Resetear el estado del componente cuando el modal se cierra
            setNombre('');
            setEspecialidad('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (especialista) {
            console.log("Datos del especialista recibidos:", especialista);
            setNombre(especialista.nombre);
            setEspecialidad(especialista.especialidad);
        }
    }, [especialista]);

    const createEspecialista = async () => {
        try {
            if (!jwt) throw new Error("JWT no proporcionado");

            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                nombre,
                especialidad
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            const response = await fetch("http://localhost:3000/especialista/createEspecialista", requestOptions);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            notify('Especialista creado con éxito');
            console.log('Especialista guardado:', result);
            onSave(); // Llama a la función onSave después de guardar el especialista

        } catch (error) {
            notify('Error al crear el especialista.', 'error')
            console.error('Error al crear especialista:', error);
        }
    };

    const updateEspecialista = async (id) => {
        try {
            if (!jwt) throw new Error("JWT no proporcionado");

            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);
            myHeaders.append("Content-Type", "application/json");

            const rawEspecialista = JSON.stringify({
                nombre,
                especialidad
            });

            const requestOptionsEspecialista = {
                method: "PUT",
                headers: myHeaders,
                body: rawEspecialista,
                redirect: "follow"
            };

            const responseEspecialista = await fetch(`http://localhost:3000/especialista/updateEspecialista/${id}`, requestOptionsEspecialista);

            if (!responseEspecialista.ok) {
                const errorText = await responseEspecialista.text();
                throw new Error(`Error ${responseEspecialista.status}: ${errorText}`);
            }

            const result = await responseEspecialista.json();
            console.log('Especialista actualizado:', result);
            notify('Especialista editado con éxito');
            onSave(); // Llama a la función onSave después de actualizar el especialista

        } catch (error) {
            notify('Error al editar especialista', 'error');
            console.error('Error al editar especialista:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (especialista && especialista._id) {
            console.log("Actualizando especialista con ID:", especialista._id);
            await updateEspecialista(especialista._id);
        } else {
            console.log("Creando nuevo especialista");
            await createEspecialista();
        }
        onRequestClose(); // Cierra el modal después de guardar o actualizar
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Especialista Modal">
            <h2 className="modal-titulo">{especialista ? 'Editar Especialista' : 'Agregar Especialista'}</h2>

            {pagina === 1 && (
                <form className="especialista-formulario" onSubmit={handleSubmit}>
                    <label>
                        Nombre:
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </label>
                    <label>
                        Especialidad:
                        <input type="text" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} required />
                    </label>
                    <div className="especialista-boton-container">
                        <button type="submit" className="especialista-btn-principal">Guardar</button>
                        <button type="button" className="especialista-btn-secundario" onClick={onRequestClose}>Cancelar</button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default EspecialistaModal;
