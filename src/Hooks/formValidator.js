export const validateForm = ({ nombre, dni, domicilio, telefono, fechaNacimiento, edad, sexo }) => {
    const newErrors = {};
    
    // Validar nombre (requerido)
    if (!nombre.trim()) {
        newErrors.nombre = 'El nombre es obligatorio';
    }
    // Validar DNI (solo números y entre 7 y 8 caracteres)
    if (!/^\d{7,8}$/.test(dni)) {
        newErrors.dni = 'El DNI debe tener entre 7 y 8 dígitos';
    }
    // Validar domicilio (requerido)
    if (!domicilio.trim()) {
        newErrors.domicilio = 'El domicilio es obligatorio';
    }
    // Validar teléfono (requerido)
    if (!telefono.trim()) {
        newErrors.telefono = 'El teléfono es obligatorio';
    }
    // Validar fecha de nacimiento (requerido)
    if (!fechaNacimiento) {
        newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    }
    // Validar edad (requerido y debe ser un número positivo)
    if (!edad) {
        newErrors.edad = 'La edad es obligatoria';
    } else if (edad <= 0) {
        newErrors.edad = 'La edad debe ser un número positivo';
    }
    // Validar sexo (requerido)
    if (!sexo) {
        newErrors.sexo = 'El sexo es obligatorio';
    }

    return newErrors; // Retorna los errores
};
