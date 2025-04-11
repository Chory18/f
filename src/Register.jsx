import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { register } from './apiAuth'; // Asegúrate de que esta ruta esté bien

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        contraseña: '',
    });

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
            newErrors.correo = 'Correo electrónico inválido';
        }
        if (!formData.contraseña) {
            newErrors.contraseña = 'La contraseña es requerida';
        } else if (formData.contraseña.length < 6) {
            newErrors.contraseña = 'Debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await register(formData.correo, formData.contraseña, formData.nombre);
            navigate('/login');
        } catch (err) {
            const msg = err?.detail || 'Error al registrar el usuario';
            setErrorMessage(msg);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Crear cuenta</Typography>
                {errorMessage && <Typography color="error" sx={{ mt: 1 }}>{errorMessage}</Typography>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="nombre"
                        label="Nombre completo"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        error={Boolean(errors.nombre)}
                        helperText={errors.nombre}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="correo"
                        label="Correo electrónico"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        error={Boolean(errors.correo)}
                        helperText={errors.correo}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="contraseña"
                        label="Contraseña"
                        type="password"
                        id="contraseña"
                        value={formData.contraseña}
                        onChange={handleChange}
                        error={Boolean(errors.contraseña)}
                        helperText={errors.contraseña}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Registrar
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
