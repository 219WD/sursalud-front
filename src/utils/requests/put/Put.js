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