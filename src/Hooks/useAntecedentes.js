// src/hooks/useAntecedentes.js
import { useState, useEffect } from 'react';
import { findAntecedenteById, sanitizeModel } from '../utils/requests/get/A';

const useAntecedentes = (id, jwt) => {
    const [antecedentes, setAntecedentes] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAntecedentes = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await findAntecedenteById(id, jwt);
            setAntecedentes(sanitizeModel(data));
        } catch (err) {
            setError(err.message || 'Error al obtener los antecedentes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && jwt) {
            fetchAntecedentes();
        }
    }, [id, jwt]);

    return { antecedentes, loading, error };
};

export default useAntecedentes;
