import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';


const CheckEmail = () => {

    const { message } = useContext(UserContext)

    return (
        <div className='check-email'>
            <main className='message-container'>
                <h1>Thanks for signing up!</h1>
                <h1>{message}</h1>
                <p>You can close this page now.</p>
            </main>
        </div>
    );
}

export default CheckEmail;