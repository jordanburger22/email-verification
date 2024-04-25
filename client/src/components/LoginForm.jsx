import React, { useContext, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { UserContext } from '../context/UserContext';

const LoginForm = () => {

    const { login, errMsg } = useContext(UserContext)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData)
    };

    return (
        <Box
            component='form'
            autoComplete='off'
            noValidate
            onSubmit={handleSubmit}
        >
            <TextField
                type='text'
                name='email'
                value={formData.email}
                placeholder='Email'
                onChange={handleChange}
                required
                margin='normal'
                variant='standard'
                className='input'
            />
            <TextField
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                placeholder='Password'
                onChange={handleChange}
                required
                InputProps={{
                    endAdornment: (
                        <Button
                            onClick={handleTogglePasswordVisibility}
                            variant="contained"
                            className='form-button'
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </Button>
                    )
                }}
                margin='normal'
                variant='standard'
                className='input'
            />
            <Button type='submit' variant='contained' className='form-button' >
                Login
            </Button>
            <p>{errMsg}</p>
        </Box>
    );
}

export default LoginForm;
