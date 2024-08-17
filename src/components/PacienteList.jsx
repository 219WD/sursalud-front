import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faUserClock } from '@fortawesome/free-solid-svg-icons';
import '../css/PacienteList.css';
import PacienteModal from './PacienteModal';
import { useAuth } from '../context/AuthContext';

const PacienteTable = () => {
  const [pacientes, setPacientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { token: jwt } = useAuth(); 
  const [showInactive, setShowInactive] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  useEffect(() => {
    findAllPaciente();
  }, [showInactive]);

  const findAllPaciente = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwt);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    try {
      const response = await fetch(`http://localhost:3000/pacientes/findAllPaciente`, requestOptions);

      if (response.status >= 400) return alert("No se pudieron obtener los pacientes");

      const result = await response.json();
      setPacientes(result.data);
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
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
      const response = await fetch(`http://localhost:3000/pacientes/${id}/toggle-status`, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      console.log("Paciente eliminado con éxito");
      findAllPaciente(); // Actualiza la lista de pacientes
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      alert("Ocurrió un error al eliminar el paciente. Verifica la consola para más detalles.");
    }
  };

  const toggleInactiveView = () => {
    setShowInactive(!showInactive);
  };

  // Filtrar pacientes según el estado de inactivos/activos
  const filteredPacientes = pacientes.filter(paciente => showInactive ? !paciente.activo : paciente.activo);

  // Filtrar pacientes según la búsqueda
  const displayedPacientes = filteredPacientes.filter(paciente =>
    paciente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paciente.dni.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (paciente = null) => {
    setSelectedPaciente(paciente);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPaciente(null);
  };

  const handleSavePaciente = async (updatedPaciente) => {
    // Aquí puedes implementar la lógica para guardar el paciente
    console.log('Paciente guardado:', updatedPaciente);
    await findAllPaciente(); // Actualiza la lista de pacientes
    closeModal();
  };

  const handleEditPaciente = (paciente) => {
    // Abre el modal para editar el paciente seleccionado
    openModal(paciente);
  };
  

  return (
    <div className='pacientesContainer'>
      <div className="display">
        <div className='searchButtons'>
          <h1>Pacientes</h1>
          <input
            type="text"
            placeholder="Buscar paciente"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className='btn add' onClick={() => openModal()}>
            <FontAwesomeIcon icon={faPlus} /> Agregar Paciente
          </button>
          <button className='btn inactive' onClick={toggleInactiveView}>
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
            {displayedPacientes.length > 0 ? (
              displayedPacientes.slice(0, 10).map((paciente) => (
                <tr key={paciente._id} className='trFlex'>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.dni}</td>
                  <td className='btns'>
                    <button className='btn edit' onClick={() => handleEditPaciente(paciente)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className='btn delete' onClick={() => handleDelete(paciente._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className='btn ver' onClick={() => handleActivateTurno(paciente._id)}> Ver
                    </button>
                    <button className='btn espera' onClick={() => handleActivateTurno(paciente._id)}>
                      <FontAwesomeIcon icon={faUserClock} />
                    </button>
                    <button className='btn add' onClick={() => handleAddTurno(paciente._id)}>
                      <FontAwesomeIcon icon={faPlus} />Turno
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
        {displayedPacientes.length > 10 && (
          <button onClick={() => setPacientes(pacientes)}>Ver más</button>
        )}
      </div>
      <PacienteModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        paciente={selectedPaciente}
        onSave={handleSavePaciente}
        jwt={jwt}
      />
    </div>
  );
};

export default PacienteTable;
