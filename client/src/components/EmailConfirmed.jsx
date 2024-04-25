import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const EmailConfirmed = () => {
    return (
        <div className='email-confirmed'>
            <div>
                <h2>Email Confirmed!</h2>
                <p>Your email address has been successfully confirmed.</p>
                <Link to="/">
                    <Button variant='contained'>Go to Login Page</Button>
                </Link>
            </div>
        </div>
    );
}

export default EmailConfirmed;
