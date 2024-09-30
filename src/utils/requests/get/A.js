import { API_URL } from '../../Initials/ApiUrl'
const PACIENTES = '/pacientes';
const ANTECEDENTES = '/antecedentes';
const ESPECIALISTAS = '/especialista';
const TURNOS = '/turnos';
const USERS = '/users';

// Helper function to perform fetch requests
const fetchRequest = async (url, jwt, options = {}) => {
  if (!jwt) throw new Error("JWT no proporcionado");

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + jwt);

  if (options.body) {
      myHeaders.append("Content-Type", "application/json");
  }

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
      // console.log("Resultado de la API:", result); 

      // Retornar el resultado completo si no tiene campo "data"
      return result.data || result; 
  } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
  }
};

// GET 
export const findAllPaciente = async (jwt) => {
  return await fetchRequest(`${API_URL}${PACIENTES}/findAllPaciente`, jwt);
};

export const findAllAntecedentes = async (jwt) => {
  return await fetchRequest(`${API_URL}${ANTECEDENTES}/findAllAntecedentes`, jwt);
};

export const findAllEspecialista = async (jwt) => {
  return await fetchRequest(`${API_URL}${ESPECIALISTAS}/getEspecialistas`, jwt);
};

export const findAllTurnos = async (jwt) => {
  return await fetchRequest(`${API_URL}${TURNOS}/findAllTurnos`, jwt);
};


// GET BY ID
export const findAntecedenteById = async (id, jwt) => {
  return await fetchRequest(`${API_URL}${ANTECEDENTES}/findAntecedenteById/${id}`, jwt);
};

export const findPacienteById = async (id, jwt) => {
  return await fetchRequest(`${API_URL}${PACIENTES}/findPacienteById/${id}`, jwt);
};

// Función para buscar turnos con query
export const searchTurnos = async (query, jwt) => {
  return await fetchRequest(`${API_URL}${TURNOS}/search${query}`, jwt);
};

// POST
export const createAntecedente = async (antecedente, jwt) => {
  return await fetchRequest(`${API_URL}${ANTECEDENTES}/createAntecedente`, jwt, {
    method: 'POST',
    body: JSON.stringify(antecedente)
  });
};

export const createPaciente = async (paciente, jwt) => {
  return await fetchRequest(`${API_URL}${PACIENTES}/createPaciente`, jwt, {
    method: 'POST',
    body: JSON.stringify(paciente)
  });
};

export const createEspecialista = async (especialista, jwt) => {
  return await fetchRequest(`${API_URL}${ESPECIALISTAS}/createEspecialista`, jwt, {
    method: 'POST',
    body: JSON.stringify(especialista)
  });
};

// PUT
export const updatePaciente = async (id, paciente, jwt) => {
  return await fetchRequest(`${API_URL}${PACIENTES}/updatePacienteById/${id}`, jwt, {
    method: 'PUT',
    body: JSON.stringify(paciente)
  });
};

export const updateAntecedente = async (id, antecedente, jwt) => {
  return await fetchRequest(`${API_URL}${ANTECEDENTES}/updateAntecedenteById/${id}`, jwt, {
    method: 'PUT',
    body: JSON.stringify(antecedente)
  });
};

export const updateEspecialista = async (id, especialista, jwt) => {
  return await fetchRequest(`${API_URL}${ESPECIALISTAS}/updateEspecialista/${id}`, jwt, {
    method: 'PUT',
    body: JSON.stringify(especialista)
  });
};

export const updateTurno = async (id, turno, jwt) => {
  return await fetchRequest(`${API_URL}${TURNOS}/updateTurnoById/${id}`, jwt, {
    method: 'PUT',
    body: JSON.stringify(turno)
  });
};

// PATCH (Toggles)
export const handleDeletePaciente = async (id, jwt) => {
  return await fetchRequest(`${API_URL}${PACIENTES}/${id}/toggle-status/`, jwt, {
    method: 'PATCH'
  }); // Dar de Baja/Alta
};

export const handleDeleteEspecialista = async (id, jwt) => {
  return await fetchRequest(`${API_URL}${ESPECIALISTAS}/${id}/toggle-status/`, jwt, {
    method: 'PATCH'
  }); 
};

export const handleSalaDeEspera = async (id, jwt) => {
  return await fetchRequest(`${API_URL}${PACIENTES}/${id}/toggle-status-activo`, jwt, {
    method: 'PATCH'
  }); // Sala de espera
};

export const toggleTurnoStatus = async (id, jwt) => {
  return await fetchRequest(`${API_URL}${TURNOS}/${id}/toggle-status`, jwt, {
    method: 'PATCH' // Delete turno
  });
};

// DELETE DEFINITIVO
export const deletePacienteDef = async (id, jwt) => {
  return await fetchRequest(`${API_URL}${PACIENTES}/deletePacienteById/${id}`, jwt, {
    method: 'DELETE'
  }); 
};

export const deleteEspecialistaDef = async (id, jwt) => {
  return await fetchRequest(`${API_URL}${ESPECIALISTAS}/deleteEspecialista/${id}`, jwt, {
    method: 'DELETE'
  }); 
};

export const deleteTurnoDef = async (id, jwt) => {
  return await fetchRequest(`${API_URL}${TURNOS}/deleteTurnoById/${id}`, jwt, {
    method: 'DELETE' 
  });
};

// Function to sanitize models
export function sanitizeModel(obj) {
  delete obj["_id"];
  delete obj["__v"];
  delete obj["password"];
  return obj;
}

// GET ALL USERS
export const findAllUsers = async (jwt) => {
  return await fetchRequest(`${API_URL}${USERS}/findAllUsers`, jwt);
};

// PUT UPGRADE USER ROLE
export const upgradeUserRole = async (userId, jwt) => {
  return await fetchRequest(`${API_URL}${USERS}/upgradeRole/${userId}`, jwt, {
    method: 'PUT',
  });
};

// DELETE DEFINITIVO USUARIO
export const deleteUserDef = async (id, jwt) => {
  return await fetchRequest(`${API_URL}${USERS}/deleteUser/${id}`, jwt, {
    method: 'DELETE'
  }); 
};