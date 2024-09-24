import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomeScreen.css';



const HomeScreen = () => {
  const [patientCount, setPatientCount] = useState(0); 
  const [turnosHoy, setTurnosHoy] = useState(0);
  const [medicosCount, setMedicosCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Función para obtener la cantidad de pacientes
    const fetchPatientCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/pacientes/count');
        const data = await response.json();
        setPatientCount(data.count);
      } catch (error) {
        console.error('Error al obtener la cantidad de pacientes:', error);
      }
    };

    // Función para obtener la cantidad de turnos de hoy
    const fetchTurnosHoy = async () => {
      try {
        const response = await fetch('http://localhost:3000/turnos/today');
        const data = await response.json();
        setTurnosHoy(data.turnosHoy);
      } catch (error) {
        console.error('Error al obtener la cantidad de turnos de hoy:', error);
      }
    };

    // Función para obtener la cantidad de medicos de hoy
    const fetchMedicos = async () => {
      try {
        const response = await fetch('http://localhost:3000/especialista/count');
        const data = await response.json();
        setMedicosCount(data.count);
      } catch (error) {
        console.error('Error al obtener la cantidad de especialistas de hoy:', error);
      }
    };

    fetchPatientCount();
    fetchTurnosHoy();
    fetchMedicos();
  }, []);

  return (
    <div className='homeScreen'>
      <div className="display">
        <div className="cardStats">
          <div className="statCard">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor"
              width="5rem"
              height="5rem">
              <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" />
            </svg>
            <h2>Total Pacientes</h2>
            <h3>{patientCount}</h3>
          </div>

          <div className="statCard">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"
              width="5rem"
              height="5rem">
              <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l80 0 0 56-80 0 0-56zm0 104l80 0 0 64-80 0 0-64zm128 0l96 0 0 64-96 0 0-64zm144 0l80 0 0 64-80 0 0-64zm80-48l-80 0 0-56 80 0 0 56zm0 160l0 40c0 8.8-7.2 16-16 16l-64 0 0-56 80 0zm-128 0l0 56-96 0 0-56 96 0zm-144 0l0 56-64 0c-8.8 0-16-7.2-16-16l0-40 80 0zM272 248l-96 0 0-56 96 0 0 56z" />
            </svg>
            <h2>Turnos Hoy</h2>
            <h3>{turnosHoy}</h3> 
          </div>

          <div className="statCard">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"
              width="5rem"
              height="5rem">
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1l0 50.8c27.6 7.1 48 32.2 48 62l0 40c0 8.8-7.2 16-16 16l-16 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l0-24c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 24c8.8 0 16 7.2 16 16s-7.2 16-16 16l-16 0c-8.8 0-16-7.2-16-16l0-40c0-29.8 20.4-54.9 48-62l0-57.1c-6-.6-12.1-.9-18.3-.9l-91.4 0c-6.2 0-12.3 .3-18.3 .9l0 65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7l0-59.1zM144 448a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
            </svg>
            <h2>Medicos de Turno</h2>
            <h3>{medicosCount}</h3> 
          </div>
        </div>

        <div className="botonera">
          <button onClick={() => navigate('/admin/pacientes')}>Pacientes</button>
          <button onClick={() => navigate('/admin/especialistas')}>Especialistas</button>
          <button onClick={() => navigate('/admin')}>Administrador</button>
          <button onClick={() => navigate('/admin/turnos')}>Turnos</button>
          <button onClick={() => navigate('/admin/salaDeEpera')}>Sala de Espera</button>
          <button onClick={() => navigate('/admin/analytics')}>Analíticas</button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
