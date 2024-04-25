import React, { useContext, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { UserContext } from '../context/UserContext';

const SignupForm = () => {
    const { signup, errMsg } = useContext(UserContext);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        dob: ''
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

    const isFormValid = () => {
        return formData.email !== '' && formData.dob !== '' && /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(formData);
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
                type='date'
                name='dob'
                value={formData.dob}
                label='Date of Birth'
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={handleChange}
                required
                margin='normal'
                variant='standard'
                className='input'
            />

            <TextField
                className='input'
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
                helperText={
                    <ul>
                        <li>Password must be at least 8 characters long.</li>
                        <li>Password must contain at least one number.</li>
                        <li>Password must contain at least one uppercase letter.</li>
                    </ul>
                }
            />
            <Button type='submit' variant='contained' className='form-button' disabled={!isFormValid()}>
                Signup
            </Button>
            <p>{errMsg}</p>
        </Box>
    );
}

export default SignupForm;
