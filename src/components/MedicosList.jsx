import React, { useState, useEffect } from 'react';
import { EditIcon, TrashIcon, PlusIcon } from '../Hooks/IconsFa';
import '../css/MedicosList.css'; // Considera cambiar el nombre del archivo CSS si es específico de especialistas
import EspecialistaModal from './EspecialistaModal.jsx'; // Asegúrate de adaptar o crear este componente
import TurnoModal from './TurnoModal.jsx';
import { useAuth } from '../context/AuthContext';
import useNotify from '../Hooks/Toasts';


const MedicosList = () => {
    const notify = useNotify();
    const [especialistas, setEspecialistas] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { token: jwt } = useAuth();
    const [showInactive, setShowInactive] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEspecialista, setSelectedEspecialista] = useState(null);

    useEffect(() => {
        getEspecialistas();
    }, [showInactive]);

    const getEspecialistas = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + jwt);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch(`http://localhost:3000/especialista/getEspecialistas`, requestOptions);

            if (response.status >= 400) return alert("No se pudieron obtener los especialistas");

            const result = await response.json();
            setEspecialistas(result);
        } catch (error) {
            console.error("Error al obtener los especialistas:", error);
        }
    };

    const handleDelete = async (id) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + jwt);

        const requestOptions = {
            method: "PATCH", // PATCH para desactivar
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch(`http://localhost:3000/especialista/${id}/toggle-status`, requestOptions);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            console.log("Especialista eliminado con éxito");
            notify('Especialista eliminado con éxito');
            getEspecialistas(); // Actualiza la lista de especialistas
        } catch (error) {
            notify('Ocurrió un error al eliminar el especialista.', 'error');
            console.error("Error al eliminar especialista:", error);
        }
    };

    const toggleInactiveView = () => {
        setShowInactive(!showInactive);
    };

    // Filtrar especialistas según el estado de inactivos/activos
    const filteredEspecialista = especialistas.filter(especialista => showInactive ? !especialista.activo : especialista.activo);

    // Filtrar especialistas según la búsqueda
    const displayedEspecialista = filteredEspecialista.filter(especialista =>
        especialista.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (especialista = null) => {
        setSelectedEspecialista(especialista);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEspecialista(null);
    };

    const handleSaveEspecialista = async (updatedEspecialista) => {
        console.log('Especialista guardado:', updatedEspecialista);
        await getEspecialistas(); // Actualiza la lista de especialistas
        closeModal();
    };

    const handleEditEspecialista = (especialista) => {
        // Abre el modal para editar el especialista seleccionado
        openModal(especialista);
    };

    return (
        <div className='especialistasContainer'>
            <div className="display">
                <div className='searchButtons'>
                    <h1>Especialistas</h1>
                    <input
                        type="text"
                        placeholder="Buscar especialista"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className='btn add' onClick={() => openModal()}>
                        <PlusIcon /> Agregar Especialista
                    </button>
                    <button className='btn inactive' onClick={toggleInactiveView}>
                        {showInactive ? 'Mostrar Activos' : 'Mostrar Inactivos'}
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Especialidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedEspecialista.length > 0 ? (
                            displayedEspecialista.slice(0, 10).map((especialista) => (
                                <tr key={especialista._id} className='trFlex'>
                                    <td>{especialista.nombre}</td>
                                    <td>{especialista.especialidad}</td>
                                    <td className='btns'>
                                        <button className='btn edit' onClick={() => handleEditEspecialista(especialista)}>
                                            <EditIcon />
                                        </button>
                                        <button className='btn delete' onClick={() => handleDelete(especialista._id)}>
                                            <TrashIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No se encontraron especialistas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {displayedEspecialista.length > 10 && (
                    <button onClick={() => setEspecialistas(especialistas)}>Ver más</button>
                )}
            </div>
            <EspecialistaModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                especialista={selectedEspecialista}
                onSave={handleSaveEspecialista}
                jwt={jwt}
            />

            <TurnoModal
                especialista={selectedEspecialista}
                onSave={handleSaveEspecialista}
                jwt={jwt}
            />
        </div>
    );
};

export default MedicosList;
