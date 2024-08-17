const API_URL_PACIENTES = 'http://localhost:3000/pacientes';
const API_URL_ANTECEDENTES = 'http://localhost:3000/antecedentes';

// GET
export const findAllPaciente = async () => {
    try {
        if (!jwt) throw new Error("JWT no proporcionado");

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + jwt);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await fetch(`${API_URL_PACIENTES}/findAllPaciente`, requestOptions);

        if (response.status >= 400) return alert("No se pudieron obtener los pacientes");

        const result = await response.json();
        setPacientes(result.data); // Asegúrate de que setPacientes está definido
    } catch (error) {
        console.error("Error al obtener los pacientes:", error);
    }
};

// PATCH
export const handleDelete = async (id) => {
    try {
        if (!jwt) throw new Error("JWT no proporcionado");

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + jwt);

        const requestOptions = {
            method: "PATCH", // PATCH para desactivar
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await fetch(`${API_URL_PACIENTES}/${id}/toggle-status`, requestOptions);

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

// POST
export const createPaciente = async (jwt, antecedentesId) => {
    try {
        if (!jwt) throw new Error("JWT no proporcionado");

        // Crear antecedentes primero y obtener el ID
        const antecedentesId = await createAntecedente();

        // Verifica si antecedentesId es válido
        if (!antecedentesId) throw new Error("Error al crear antecedentes");

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + jwt);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            nombre,
            dni,
            domicilio,
            telefono,
            fechaNacimiento,
            edad,
            sexo,
            antecedentes: antecedentesId // Asegúrate de que este campo es el ID del antecedente
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const response = await fetch(`${API_URL_PACIENTES}/createPaciente`, requestOptions);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('Paciente guardado:', result);
        onSave(); // Llama a la función onSave después de guardar el paciente

    } catch (error) {
        console.error('Error al crear paciente:', error);
    }
};

// GET
export const findAllAntecedentes = async () => {
    try {
        if (!jwt) throw new Error("JWT no proporcionado");

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + jwt);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await fetch(`${API_URL_ANTECEDENTES}/findAllAntecedentes`, requestOptions);

        if (response.status >= 400) return alert("No se pudieron obtener los antecedentes");

        const result = await response.json();
        setAntecedentes(result.data); // Asegúrate de que setAntecedentes está definido
    } catch (error) {
        console.error("Error al obtener los antecedentes:", error);
    }
};

// POST
export const createAntecedente = async (jwt, antecedentes) => {
    try {
        if (!jwt) throw new Error("JWT no proporcionado");

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + jwt);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(antecedentes); // Asegúrate de que antecedentes está definido

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const response = await fetch(`${API_URL_ANTECEDENTES}/createAntecedente`, requestOptions);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('Antecedentes guardados:', result);

        return result.data._id; // Devuelve el ID del antecedente

    } catch (error) {
        console.error('Error al crear antecedentes:', error);
        return null; // Indica un error al crear antecedentes
    }
};

// PUT
export const updateAntecedenteById = async () => {
    try {
        if (!jwt) throw new Error("JWT no proporcionado");

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + jwt);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            afeccionCardiaca,
            alteracionCoagulacion,
            diabetes,
            hipertension,
            epilepsia,
            insufRenal,
            hepatitis,
            insufHepatica,
            alergia,
            asma,
            otros
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const responseAntecedente = await fetch(`${API_URL_ANTECEDENTES}/updateAntecedenteById/${paciente.antecedentes}`, requestOptions);

        const result = await responseAntecedente.json(); // Corregir aquí el uso de responseAntecedente
        console.log('Antecedente actualizado:', result);

    } catch (error) {
        console.error("Error al actualizar antecedente:", error);
    }
};