import React, { useState, useEffect, useCallback } from "react";
import { EditIcon, TrashIcon, PlusIcon } from "../Hooks/IconsFa";
import "../css/MedicosList.css";
import EspecialistaModal from "../components/EspecialistaModal.jsx";
import TurnoModal from "../components/TurnoModal.jsx";
import useNotify from "../Hooks/Toasts";
import {
  findAllEspecialista,
  handleDeleteEspecialista,
} from "../utils/requests/get/A.js";

const MedicosList = ({ jwt }) => {
  const notify = useNotify();
  const [especialistas, setEspecialistas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEspecialista, setSelectedEspecialista] = useState(null);

  useEffect(() => {
    loadEspecialistas();
  }, []);

  const loadEspecialistas = useCallback(async () => {
    try {
      const data = await findAllEspecialista(jwt);
      if (data) {
        setEspecialistas(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      }
    } catch (error) {
      console.log("Error al cargar los especialistas:", error);
      notify("Ocurrio un error al cargar los especialistas.", "error");
    }
  }, [jwt, notify]);

  const handleDelete = async (id) => {
    try {
      await handleDeleteEspecialista(id, jwt);
      notify("Especialista eliminado con éxito");
      loadEspecialistas();
    } catch (error) {
      console.error("Error al eliminar especialista:", error);
      notify("Ocurrió un error al eliminar el especialista.", "error");
    }
  };

  const toggleInactiveView = () => {
    setShowInactive(!showInactive);
  };

  // Filtrar especialistas según el estado de inactivos/activos
  const filteredEspecialista = especialistas.filter((especialista) =>
    showInactive ? !especialista.activo : especialista.activo
  );

  // Filtrar especialistas según la búsqueda
  const displayedEspecialista = filteredEspecialista.filter((especialista) =>
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
    console.log("Especialista guardado:", updatedEspecialista);
    await loadEspecialistas(); // Actualiza la lista de especialistas
    closeModal();
  };

  const handleEditEspecialista = (especialista) => {
    // Abre el modal para editar el especialista seleccionado
    openModal(especialista);
  };

  return (
    <div className="especialistasContainer">
      <div className="display">
        <div className="searchButtons">
          <h1>Especialistas</h1>
          <input
            type="text"
            placeholder="Buscar especialista"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn add" onClick={() => openModal()}>
            <PlusIcon /> Agregar Especialista
          </button>
          <button className="btn inactive" onClick={toggleInactiveView}>
            {showInactive ? "Mostrar Activos" : "Mostrar Inactivos"}
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
                <tr key={especialista._id} className="trFlex">
                  <td data-label="Nombre">{especialista.nombre}</td>
                  <td data-label="Especialidad">{especialista.especialidad}</td>
                  <td className="btns">
                    <button
                      className="btn edit"
                      onClick={() => handleEditEspecialista(especialista)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="btn delete"
                      onClick={() => handleDelete(especialista._id)}
                    >
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
          <button onClick={() => setEspecialistas(especialistas)}>
            Ver más
          </button>
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
