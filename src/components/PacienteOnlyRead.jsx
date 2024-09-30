import React, { useState, useEffect, useCallback } from 'react';
import '../css/PacienteComponent.css'; // Asegúrate de tener los estilos necesarios
import { Xmark } from '../Hooks/IconsFa';
import { findAntecedenteById, findPacienteById, sanitizeModel } from '../utils/requests/get/A';

const PacienteComponent = ({ isOpen, onClose, pacienteId, jwt }) => {
  const [paciente, setPaciente] = useState(null);
  const [antecedentes, setAntecedentes] = useState({});

  const fetchPacienteData = useCallback(async (id) => {
    try {
      const pacienteData = await findPacienteById(id, jwt);
      setPaciente(pacienteData);

      // Si el paciente tiene antecedentes, los busca.
      if (pacienteData && pacienteData.antecedentes && pacienteData.antecedentes._id) {
        const antecedenteData = await findAntecedenteById(pacienteData.antecedentes._id, jwt);
        setAntecedentes(sanitizeModel(antecedenteData));
      }      
    } catch (error) {
      console.error('Error al obtener los datos del paciente:', error);
    }
  }, [jwt]);

  useEffect(() => {
    if (pacienteId) {
      fetchPacienteData(pacienteId);
    }
  }, [pacienteId, fetchPacienteData]);

  const handleCloseModal = () => {
    onClose();
  };

  if (!isOpen) return null;

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Verifica si el paciente tiene antecedentes médicos
  const tieneAntecedentes =
    paciente && paciente.antecedentes && Object.values(paciente.antecedentes).some((value) => value === true);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={handleCloseModal}>
          <Xmark />
        </button>
        {paciente && (
          <div className="paciente-info">
            <div className="info-section">
              <h3>Datos del Paciente</h3>
              <p>
                <strong>Nombre:</strong> {paciente.nombre}
              </p>
              <p>
                <strong>DNI:</strong> {paciente.dni}
              </p>
              <p>
                <strong>Domicilio:</strong> {paciente.domicilio}
              </p>
              <p>
                <strong>Teléfono:</strong> {paciente.telefono}
              </p>
              <p>
                <strong>Fecha de Nacimiento:</strong> {formatDateForInput(paciente.fechaNacimiento)}
              </p>
              <p>
                <strong>Edad:</strong> {paciente.edad}
              </p>
              <p>
                <strong>Sexo:</strong> {paciente.sexo}
              </p>
              <p>
                <strong>Medicamentos:</strong> {paciente.medicamentos}
              </p>
            </div>
            <div className="info-section">
              <h3>Antecedentes</h3>
              {tieneAntecedentes ? (
                Object.keys(paciente.antecedentes).map(
                  (key) =>
                    paciente.antecedentes[key] === true && (
                      <p key={key}>
                        <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> Sí
                      </p>
                    )
                )
              ) : (
                <p>El paciente no tiene antecedentes médicos.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PacienteComponent;