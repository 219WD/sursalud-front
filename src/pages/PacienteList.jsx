import React, { useState, useEffect, useCallback } from 'react';
import { EditIcon, TrashIcon, PlusIcon } from '../Hooks/IconsFa';
import '../css/PacienteList.css';
import PacienteModal from '../components/PacienteModal';
import TurnoModal from '../components/TurnoModal';
import { useAuth } from '../context/AuthContext';
import PacienteComponent from '../components/PacienteOnlyRead';
import useNotify from '../Hooks/Toasts';
import { findAllPaciente, handleDeletePaciente } from '../utils/requests/get/A';

const PacienteTable = () => {
  const notify = useNotify();
  const [pacientes, setPacientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { token: jwt } = useAuth();
  const [showInactive, setShowInactive] = useState(false);
  const [modalState, setModalState] = useState({ type: null, isOpen: false, selectedPaciente: null });
  const [showAllPacientes, setShowAllPacientes] = useState(false);

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = useCallback(async () => {
    try {
      const data = await findAllPaciente(jwt);
      if (data) {
        setPacientes(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      console.error("Error al cargar los pacientes:", error);
      notify('Ocurrió un error al cargar los pacientes.', 'error');
    }
  }, [jwt, notify]);

  const handleDelete = async (id) => {
    try {
      await handleDeletePaciente(id, jwt);
      notify('Paciente eliminado con éxito');
      loadPacientes();
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      notify('Ocurrió un error al eliminar el paciente.', 'error');
    }
  };

  const toggleInactiveView = () => setShowInactive((prev) => !prev);

  const filteredPacientes = pacientes.filter((paciente) =>
    (showInactive ? !paciente.activo : paciente.activo) &&
    (paciente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paciente.dni.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pacientesToDisplay = showAllPacientes ? filteredPacientes : filteredPacientes.slice(0, 10);

  const handleModalToggle = (type = null, paciente = null) => {
    setModalState({ type, isOpen: !!type, selectedPaciente: paciente });
  };

  const handleSave = async (updatedPaciente) => {
    await loadPacientes();
    handleModalToggle();
  };

  const handleActionClick = (type, pacienteId) => {
    const paciente = pacientes.find((p) => p._id === pacienteId);
    handleModalToggle(type, paciente);
  };

  const toggleShowAllPacientes = () => {
    setShowAllPacientes(prevState => !prevState);
  };

  return (
    <div className="pacientesContainer">
      <div className="display">
        <div className="searchButtons">
          <h1>Pacientes</h1>
          <input
            type="text"
            placeholder="Buscar paciente"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn add" onClick={() => handleModalToggle('paciente')}>
            <PlusIcon /> Agregar Paciente
          </button>
          <button className="btn inactive" onClick={toggleInactiveView}>
            {showInactive ? 'Mostrar Activos' : 'Mostrar Inactivos'}
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientesToDisplay.length > 0 ? (
              pacientesToDisplay.map((paciente) => (
                <tr key={paciente._id} className="trFlex">
                  <td>{paciente.nombre}</td>
                  <td>{paciente.dni}</td>
                  <td className="btns">
                    <button
                      className="btn edit"
                      onClick={() => handleActionClick('edit', paciente._id)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="btn delete"
                      onClick={() => handleDelete(paciente._id)}
                    >
                      <TrashIcon />
                    </button>
                    <button
                      className="btn ver"
                      onClick={() => handleActionClick('view', paciente._id)}
                    >
                      Ver
                    </button>
                    <button
                      className="btn add"
                      onClick={() => handleActionClick('turno', paciente._id)}
                    >
                      <PlusIcon /> Turno
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No se encontraron pacientes.</td>
              </tr>
            )}
          </tbody>
        </table>
        {filteredPacientes.length > 10 && (
          <button 
          className='btn'
          onClick={toggleShowAllPacientes}
          >
            {showAllPacientes ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      {/* Modals */}
      {modalState.type === 'paciente' && (
        <PacienteModal
          isOpen={modalState.isOpen}
          onRequestClose={() => handleModalToggle()}
          paciente={modalState.selectedPaciente}
          onSave={handleSave}
          jwt={jwt}
        />
      )}

      {modalState.type === 'edit' && (
        <PacienteModal
          isOpen={modalState.isOpen}
          onRequestClose={() => handleModalToggle()}
          paciente={modalState.selectedPaciente}
          onSave={handleSave}
          jwt={jwt}
        />
      )}

      {modalState.type === 'turno' && (
        <TurnoModal
          isOpen={modalState.isOpen}
          onRequestClose={() => handleModalToggle()}
          paciente={modalState.selectedPaciente}
          onSave={handleSave}
          jwt={jwt}
          pacienteId={modalState.selectedPaciente?._id}
        />
      )}

      {modalState.type === 'view' && (
        <PacienteComponent
          isOpen={modalState.isOpen}
          onClose={() => handleModalToggle()}
          pacienteId={modalState.selectedPaciente?._id}
          jwt={jwt}
        />
      )}
    </div>
  );
};

export default PacienteTable;