import { Box, TextField, Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';



const UserInfoSetup = () => {

    const navigate = useNavigate()

    const { handleFirstTimeSetup, user, token } = useContext(UserContext)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        displayName: '',
        userInfoSet: true
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleFirstTimeSetup(user._id, formData)
        navigate('/home')
    }
    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    },[])

    return (
        <div className='user-setup'>
            
            <Box
                component='form'
                autoComplete='off'
                noValidate
                onSubmit={handleSubmit}
            >
                <h2>Finish setting up your account!</h2>
                <h3>Tell us a little more about yourself.</h3>
                <TextField
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder='First Name'
                    required
                    className='input'
                />
                <TextField
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder='Last Name'
                    required
                    className='input'
                />
                <TextField
                    name='displayName'
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder='Display Name'
                    required
                    className='input'
                />
                <Button type='submit' variant='contained' className='form-button'>Submit</Button>
            </Box>
        </div>
    );
}

export default UserInfoSetup;