import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Button } from '@mui/material';


const Auth = () => {

    const [isLogin, setIsLogin] = useState(true)

    const handleToggle = () => {
        setIsLogin(!isLogin)
    }

    return (
        <div className='auth-container'>
            <h1>Welcome!</h1>
            {isLogin ?
                <LoginForm />
                :
                <SignupForm />}
            <Button onClick={handleToggle}>{isLogin ? 'Need to Signup?' : 'Need to Login?'}</Button>
        </div>
    );
}

export default Auth;