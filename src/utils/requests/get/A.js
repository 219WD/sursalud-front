// utils/requests/get.js

const API_URL_PACIENTES = 'http://localhost:3000/pacientes';
const API_URL_ANTECEDENTES = 'http://localhost:3000/antecedentes';

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
    return result.data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

// GET Pacientes
export const findAllPaciente = async (jwt) => {
  return await fetchRequest(`${API_URL_PACIENTES}/findAllPaciente`, jwt);
};

// GET Antecedentes
export const findAllAntecedentes = async (jwt) => {
  return await fetchRequest(`${API_URL_ANTECEDENTES}/findAllAntecedentes`, jwt);
};

// GET Antecedente por id
export const findAntecedenteById = async (id, jwt) => {
  return await fetchRequest(`${API_URL_ANTECEDENTES}/findAntecedenteById/${id}`, jwt);
};

// Function to sanitize models
export function sanitizeModel(obj) {
  delete obj["_id"];
  delete obj["__v"];
  delete obj["password"];
  return obj;
}
