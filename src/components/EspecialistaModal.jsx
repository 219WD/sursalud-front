import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../css/EspecialistaModal.css';
import useNotify from '../Hooks/Toasts';
import { createEspecialista, updateEspecialista } from '../utils/requests/get/A'

Modal.setAppElement('#root');

const EspecialistaModal = ({ isOpen, onRequestClose, especialista, onSave, jwt }) => {
    const notify = useNotify();
    const [nombre, setNombre] = useState('');
    const [especialidad, setEspecialidad] = useState('');

    const [pagina, setPagina] = useState(1);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (especialista && especialista._id) {
            await updateEspecialista(especialista._id, { nombre, especialidad }, jwt);
          } else {
            await createEspecialista({ nombre, especialidad }, jwt);
          }
          notify('Especialista guardado con éxito');
          onSave();
          onRequestClose();
        } catch (error) {
          notify('Error al guardar el especialista', 'error');
          console.error('Error en el manejo del formulario:', error);
        }
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
