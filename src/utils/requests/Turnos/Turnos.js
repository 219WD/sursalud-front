// utils/requests/turnos.js

const API_URL_TURNOS = 'http://localhost:3000/turnos';
const API_URL_PACIENTES = 'http://localhost:3000/pacientes';
const API_URL_ESPECIALISTAS = 'http://localhost:3000/especialistas';

// Helper function to perform fetch requests
const fetchRequest = async (url, jwt, options = {}) => {
  if (!jwt) throw new Error("JWT no proporcionado");

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + jwt);

  const requestOptions = {
    headers: myHeaders,
    redirect: "follow",
    ...options,
  };

  try {
    const response = await fetch(url, requestOptions);

    if (response.status >= 400) {
      alert(`Error: ${response.statusText}`);
      return null;
    }

    const result = await response.json();
    return result.data || result; // Ajusta según el formato real de la respuesta
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

// GET Paciente por ID
export const getPacienteById = async (pacienteId, jwt) => {
  return await fetchRequest(`${API_URL_PACIENTES}/findPacienteById/${pacienteId}`, jwt);
};

// POST para crear un Turno
export const createTurno = async (turnoData, jwt) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(turnoData),
  };

  return await fetchRequest(`${API_URL_TURNOS}/createTurno`, jwt, options);
};

// GET Especialistas
export const getEspecialistas = async (jwt) => {
  return await fetchRequest(`${API_URL_ESPECIALISTAS}/findAllEspecialistas`, jwt);
};
