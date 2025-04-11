import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { register } from '../services/auth'; // Tu función de registro

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
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

        if (!formData.fullName) newErrors.fullName = 'Requerido';
        if (!formData.email) newErrors.email = 'Requerido';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';

        if (!formData.password) newErrors.password = 'Requerido';
        else if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await register(formData.email, formData.password, formData.fullName);
            navigate('/login');
        } catch (err) {
            setErrorMessage('Error al registrar el usuario');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Crear cuenta
                </Typography>
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="fullName"
                        label="Nombre completo"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={Boolean(errors.fullName)}
                        helperText={errors.fullName}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Correo electrónico"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
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
