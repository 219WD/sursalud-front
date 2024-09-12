const API_URL = "http://localhost:3000"; // Puedes ajustar esto según tu configuración

const createAntecedente = async (antecedentes, jwt) => {
  try {
    if (!jwt) throw new Error("JWT no proporcionado");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwt);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(antecedentes);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(`${API_URL}/antecedentes/createAntecedente`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result.data._id; // Devuelve el ID del antecedente
  } catch (error) {
    console.error("Error al crear antecedentes:", error);
    return null; // Indica un error al crear antecedentes
  }
};

const createPaciente = async (pacienteData, jwt) => {
  try {
    if (!jwt) throw new Error("JWT no proporcionado");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwt);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(pacienteData);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(`${API_URL}/pacientes/createPaciente`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al crear paciente:", error);
    throw error;
  }
};

const findAntecedenteById = async (id, jwt) => {
  try {
    if (!jwt) throw new Error("JWT no proporcionado");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwt);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(`${API_URL}/antecedentes/findAntecedenteById/${id}`, requestOptions);

    if (!response.ok) {
      throw new Error("No se pudieron obtener los antecedentes");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error al obtener los antecedentes:", error);
    throw error;
  }
};

const updateAntecedente = async (id, antecedentes, jwt) => {
  try {
    if (!jwt) throw new Error("JWT no proporcionado");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwt);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(antecedentes);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(`${API_URL}/antecedentes/updateAntecedenteById/${id}`, requestOptions);

    if (!response.ok) {
      throw new Error("Error al actualizar antecedentes");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al editar antecedente:", error);
    throw error;
  }
};

const findPacienteById = async (id, jwt) => {
  try {
    if (!jwt) throw new Error("JWT no proporcionado");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwt);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(`${API_URL}/pacientes/findPacienteById/${id}`, requestOptions);

    if (!response.ok) {
      throw new Error("No se pudo obtener al paciente");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error al obtener al paciente:", error);
    throw error;
  }
};

const updatePaciente = async (id, pacienteData, jwt) => {
  try {
    if (!jwt) throw new Error("JWT no proporcionado");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwt);
    myHeaders.append("Content-Type", "application/json");

    const rawPaciente = JSON.stringify(pacienteData);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: rawPaciente,
      redirect: "follow",
    };

    const response = await fetch(`${API_URL}/pacientes/updatePacienteById/${id}`, requestOptions);

    if (!response.ok) {
      throw new Error("Error al actualizar paciente");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al editar paciente:", error);
    throw error;
  }
};

export { createAntecedente, createPaciente, findAntecedenteById, updateAntecedente, findPacienteById, updatePaciente };
