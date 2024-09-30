import { useState, useEffect } from 'react';
import { findAllTurnos } from '../utils/requests/get/A';

const useTurnos = (jwt) => {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTurnos = async () => {
        setLoading(true);
        try {
            const data = await findAllTurnos(jwt);
            setTurnos(data);
        } catch (err) {
            setError(err.message || 'Error al obtener los turnos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jwt) {
            fetchTurnos();
        }
    }, [jwt]);

    return { turnos, loading, error, refetch: fetchTurnos };
};

export default useTurnos;