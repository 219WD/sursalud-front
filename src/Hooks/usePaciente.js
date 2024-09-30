// src/hooks/usePaciente.js
import { useState, useEffect } from 'react';
import { findPacienteById } from '../utils/requests/get/A';

const usePaciente = (id, jwt) => {
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPaciente = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await findPacienteById(id, jwt);
            setPaciente(data);
        } catch (err) {
            setError(err.message || 'Error al obtener el paciente');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && jwt) {
            fetchPaciente();
        }
    }, [id, jwt]);

    return { paciente, loading, error };
};

export default usePaciente;
