import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../css/PacienteModal.css';
import useNotify from '../Hooks/Toasts';
import { 
    createAntecedente, 
    createPaciente, 
    findAntecedenteById, 
    updateAntecedente, 
    updatePaciente 
} from '../utils/requests/post/Post';
import { validateForm } from '../Hooks/formValidator';

Modal.setAppElement('#root');

const PacienteModal = ({ isOpen, onRequestClose, paciente, onSave, jwt }) => {
    const notify = useNotify();
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [edad, setEdad] = useState('');
    const [sexo, setSexo] = useState('');
    const [errors, setErrors] = useState({});

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

    const sanitizeModel = (obj) => {
        const sanitized = { ...obj };
        delete sanitized["_id"];
        delete sanitized["__v"];
        delete sanitized["password"];
        return sanitized;
    }

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
            setErrors({});
            setPagina(1);
        }
    }, [isOpen]);

    useEffect(() => {
        if (paciente) {
            setNombre(paciente.nombre);
            setDni(paciente.dni);
            setDomicilio(paciente.domicilio);
            setTelefono(paciente.telefono);
            setFechaNacimiento(formatDateForInput(paciente.fechaNacimiento));
            setEdad(paciente.edad);
            setSexo(paciente.sexo);
            findAntecedenteById(paciente.antecedentes, jwt)
                .then((data) => setAntecedentes(sanitizeModel(data)))
                .catch((error) => console.error('Error al obtener antecedentes:', error));
        }
    }, [paciente, jwt]);

    const handleAntecedentesChange = (e) => {
        const { name, value } = e.target;
        setAntecedentes(prevState => ({
            ...prevState,
            [name]: value === 'true' 
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        const formValues = { nombre, dni, domicilio, telefono, fechaNacimiento, edad, sexo };
        const newErrors = validateForm(formValues);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setPagina(2);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formValues = { nombre, dni, domicilio, telefono, fechaNacimiento, edad, sexo };
        const newErrors = validateForm(formValues);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            setPagina(1);
            return;
        }

        try {
            if (paciente && paciente._id) {
                await updatePaciente(paciente._id, { nombre, dni, domicilio, telefono, fechaNacimiento, edad, sexo, antecedentes: paciente.antecedentes }, jwt);
                await updateAntecedente(paciente.antecedentes, antecedentes, jwt);
            } else {
                const antecedentesId = await createAntecedente(antecedentes, jwt);
                await createPaciente({ nombre, dni, domicilio, telefono, fechaNacimiento, edad, sexo, antecedentes: antecedentesId }, jwt);
            }
            notify('Paciente guardado con éxito');
            onSave();
            onRequestClose();
        } catch (error) {
            notify('Error al guardar el paciente', 'error');
            console.error('Error en el manejo del formulario:', error);
        }
    };

    const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Formato yyyy-MM-dd
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Paciente Modal" className="pacienteCU-modal">
            <h2 className="modal-titulo">{paciente ? 'Editar Paciente' : 'Agregar Paciente'}</h2>

            {pagina === 1 && (
                <form className="paciente-formulario" onSubmit={handleNext}>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className={errors.nombre ? 'input-error' : ''}
                            required
                        />
                        {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                    </label>
                    <label>
                        DNI:
                        <input
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            className={errors.dni ? 'input-error' : ''}
                            required
                        />
                        {errors.dni && <span className="error-text">{errors.dni}</span>}
                    </label>
                    <label>
                        Domicilio:
                        <input
                            type="text"
                            value={domicilio}
                            onChange={(e) => setDomicilio(e.target.value)}
                            className={errors.domicilio ? 'input-error' : ''}
                            required
                        />
                        {errors.domicilio && <span className="error-text">{errors.domicilio}</span>}
                    </label>
                    <label>
                        Teléfono:
                        <input
                            type="text"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className={errors.telefono ? 'input-error' : ''}
                            required
                        />
                        {errors.telefono && <span className="error-text">{errors.telefono}</span>}
                    </label>
                    <label>
                        Fecha de Nacimiento:
                        <input
                            type="date"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            className={errors.fechaNacimiento ? 'input-error' : ''}
                            required
                        />
                        {errors.fechaNacimiento && <span className="error-text">{errors.fechaNacimiento}</span>}
                    </label>
                    <label>
                        Edad:
                        <input
                            type="number"
                            value={edad}
                            onChange={(e) => setEdad(e.target.value)}
                            className={errors.edad ? 'input-error' : ''}
                            required
                        />
                        {errors.edad && <span className="error-text">{errors.edad}</span>}
                    </label>
                    <label>
                        Sexo:
                        <select 
                            value={sexo} 
                            onChange={(e) => setSexo(e.target.value)} 
                            className={errors.sexo ? 'input-error' : ''} 
                            required
                        >
                            <option value="">Seleccionar...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                        {errors.sexo && <span className="error-text">{errors.sexo}</span>}
                    </label>
                    <div className="paciente-boton-container">
                        <button type="submit" className="paciente-btn-principal">Siguiente</button>
                        <button type="button" className="paciente-btn-secundario" onClick={onRequestClose}>Cancelar</button>
                    </div>
                </form>
            )}
            {pagina === 2 && (
                <form className="paciente-formulario" onSubmit={handleSubmit}>
                    <h3>Antecedentes</h3>
                    {Object.keys(antecedentes).map((key) => (
                        <label key={key} className='antecedentes'>
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                            <div className="radio-group">
                                <input
                                    type="radio"
                                    name={key}
                                    value={true}
                                    checked={antecedentes[key] === true}
                                    onChange={handleAntecedentesChange}
                                />
                                <label className='antecedentes'>Sí</label>
                                <input
                                    type="radio"
                                    name={key}
                                    value={false}
                                    checked={antecedentes[key] === false}
                                    onChange={handleAntecedentesChange}
                                />
                                <label className='antecedentes'>No</label>
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
