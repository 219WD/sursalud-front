import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../css/PacienteModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faHome, faPhone, faCalendarAlt, faBirthdayCake, faGenderless } from '@fortawesome/free-solid-svg-icons';


Modal.setAppElement('#root');

const PacienteModal = ({ isOpen, onRequestClose, paciente, onSave, jwt }) => {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [edad, setEdad] = useState('');
    const [sexo, setSexo] = useState('');

    const [pagina, setPagina] = useState(1);

    const [antecedentes, setAntecedentes] = useState({
        afeccionCardiaca: false,
        alteracionCoagulacion: false,
        diabetes: false,
        hipertension: false,
        epilepsia: false,
        insufRenal: false,
        hepatitis: false,
        insufHepatica: false,
        alergia: false,
        asma: false,
        otros: false,
    });

    useEffect(() => {
        if (paciente) {
            console.log("Datos del paciente recibidos:", paciente);
            console.log("Datos de antecedentes antes de setear:", paciente.antecedentes);
            setNombre(paciente.nombre);
            setDni(paciente.dni);
            setDomicilio(paciente.domicilio);
            setTelefono(paciente.telefono);
            setFechaNacimiento(formatDateForInput(paciente.fechaNacimiento));
            setEdad(paciente.edad);
            setSexo(paciente.sexo);
            setAntecedentes({
                afeccionCardiaca: antecedentes.afeccionCardiaca || false,
                alteracionCoagulacion: antecedentes.alteracionCoagulacion || false,
                diabetes: antecedentes.diabetes || false,
                hipertension: antecedentes.hipertension || false,
                epilepsia: antecedentes.epilepsia || false,
                insufRenal: antecedentes.insufRenal || false,
                hepatitis: antecedentes.hepatitis || false,
                insufHepatica: antecedentes.insufHepatica || false,
                alergia: antecedentes.alergia || false,
                asma: antecedentes.asma || false,
                otros: antecedentes.otros || false,
            })
        }
    }, [paciente]);


    useEffect(() => {
        if (!isOpen) {
            // Resetear el estado del componente cuando el modal se cierra
            setNombre('');
            setDni('');
            setDomicilio('');
            setTelefono('');
            setFechaNacimiento('');
            setEdad('');
            setSexo('');
            setAntecedentes({
                afeccionCardiaca: false,
                alteracionCoagulacion: false,
                diabetes: false,
                hipertension: false,
                epilepsia: false,
                insufRenal: false,
                hepatitis: false,
                insufHepatica: false,
                alergia: false,
                asma: false,
                otros: false,
            });
        }
    }, [isOpen]);

    const handleAntecedentesChange = (e) => {
        const { name, value } = e.target;
        setAntecedentes(prevState => ({
            ...prevState,
            [name]: value === 'true' // Convertir el valor a booleano directamente
        }));
    };

    const createAntecedente = async () => {
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
                redirect: "follow"
            };

            const response = await fetch("http://localhost:3000/antecedentes/createAntecedente", requestOptions);

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

    const createPaciente = async () => {
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

            const response = await fetch("http://localhost:3000/pacientes/createPaciente", requestOptions);

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

    const updateAntecedente = async (id) => {
        try {
            if (!jwt) throw new Error("JWT no proporcionado");
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                afeccionCardiaca: antecedentes.afeccionCardiaca,
                alteracionCoagulacion: antecedentes.alteracionCoagulacion,
                diabetes: antecedentes.diabetes,
                hipertension: antecedentes.hipertension,
                epilepsia: antecedentes.epilepsia,
                insufRenal: antecedentes.insufRenal,
                hepatitis: antecedentes.hepatitis,
                insufHepatica: antecedentes.insufHepatica,
                alergia: antecedentes.alergia,
                asma: antecedentes.asma,
                otros: antecedentes.otros
            });

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            const responseAntecedente = await fetch(`http://localhost:3000/antecedentes/updateAntecedenteById/${paciente.antecedentes}`, requestOptions);
            const result = await responseAntecedente.json()
            console.log(result)
        } catch (error) {
            console.error('Error al editar antecedente:', error);
        }
    }

    const updatePaciente = async (id) => {
        try {
            if (!jwt) throw new Error("JWT no proporcionado");
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + jwt);
            myHeaders.append("Content-Type", "application/json");
            

            const rawPaciente = JSON.stringify({
                nombre,
                dni,
                domicilio,
                telefono,
                fechaNacimiento,
                edad,
                sexo,
                antecedentes: paciente.antecedentes
            });

            const requestOptionsPaciente = {
                method: "PUT",
                headers: myHeaders,
                body: rawPaciente,
                redirect: "follow"
            };

            const responsePaciente = await fetch(`http://localhost:3000/pacientes/updatePacienteById/${id}`, requestOptionsPaciente);
            const result = await responsePaciente.json()
            console.log(result)
        } catch (error) {
            console.error('Error al editar paciente:', error);
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (paciente && paciente._id) {
            console.log("Actualizando paciente con ID:", paciente._id);
            // Actualizar paciente existente
            await updatePaciente(paciente._id); // Pasa solo el ID del paciente
            await updateAntecedente(paciente.antecedentes)
        } else {
            console.log("Creando nuevo paciente");
            // Crear nuevo paciente
            await createPaciente();
        }
        onSave(); // Llama a la función onSave después de guardar el paciente
        onRequestClose(); // Cierra el modal después de guardar
    };



    const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Formato yyyy-MM-dd
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Paciente Modal">
            <h2 className="modal-titulo">{paciente ? 'Editar Paciente' : 'Agregar Paciente'}</h2>

            {pagina === 1 && (
                <form className="paciente-formulario" onSubmit={(e) => { e.preventDefault(); setPagina(2); }}>
                    <label>
                        Nombre:
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </label>
                    <label>
                        DNI:
                        <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} required />
                    </label>
                    <label>
                        Domicilio:
                        <input type="text" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} required />
                    </label>
                    <label>
                        Teléfono:
                        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                    </label>
                    <label>
                        Fecha de Nacimiento:
                        <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
                    </label>
                    <label>
                        Edad:
                        <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} required />
                    </label>
                    <label>
                        Sexo:
                        <select value={sexo} onChange={(e) => setSexo(e.target.value)} required>
                            <option value="">Seleccionar...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </label>
                    <div className="paciente-boton-container">
                        <button type="button" className="paciente-btn-principal" onClick={() => setPagina(2)}>Siguiente</button>
                        <button type="button" className="paciente-btn-secundario" onClick={onRequestClose}>Cancelar</button>
                    </div>
                </form>
            )}
            {pagina === 2 && (
                <form className="paciente-formulario" onSubmit={handleSubmit}>
                    <h3>Antecedentes</h3>
                    {Object.keys(antecedentes).map((key) => (
                        <label key={key}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                            <div className="radio-group">
                                <input
                                    type="radio"
                                    name={key}
                                    value={true}
                                    checked={antecedentes[key] === true}
                                    onChange={handleAntecedentesChange}
                                />
                                Sí
                                <input
                                    type="radio"
                                    name={key}
                                    value={false}
                                    checked={antecedentes[key] === false}
                                    onChange={handleAntecedentesChange}
                                />
                                No
                            </div>
                        </label>
                    ))}
                    <div className="paciente-boton-container">
                        <button type="button" className="paciente-btn-secundario" onClick={() => setPagina(1)}>Anterior</button>
                        <button type="submit" className="paciente-btn-principal">Guardar</button>
                        <button type="button" className="paciente-btn-secundario" onClick={onRequestClose}>Cancelar</button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default PacienteModal; 