// utils/requests/patch/Patch.js
const API_URL_PACIENTES = 'http://localhost:3000/pacientes';
import { findAllPaciente } from '../get/A';

// Función para manejar la eliminación (toggle status) de un paciente
export const handleDelete = async (id, jwt, fetchPacientes) => {
  if (!jwt) {
    alert("JWT no proporcionado");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${jwt}`);

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${API_URL_PACIENTES}/${id}/toggle-status`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    console.log("Paciente eliminado con éxito");
    fetchPacientes(); // Llama a la función pasada como argumento para actualizar la lista de pacientes
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
  }
};

// Función para manejar el ingreso de un paciente a la sala de espera
export const handleSalaDeEspera = async (id, jwt, fetchTurnos) => {
  if (!jwt) {
    alert("JWT no proporcionado");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${jwt}`);

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`http://localhost:3000/turnos/${id}/toggle-status`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    console.log("Subido a la sala de espera");
    fetchTurnos(); // Llama a la función pasada como argumento para actualizar los turnos
  } catch (error) {
    console.error("Error al subir a la sala de espera:", error);
    alert("Ocurrió un error al subir a sala de espera. Verifica la consola para más detalles.");
  }
};
