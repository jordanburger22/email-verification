import React, { createContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext()

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    return config
})


const UserProvider = ({ children }) => {

    const initState = {
        user: JSON.parse(localStorage.getItem('user')) || {},
        token: localStorage.getItem('token') || "",
        errMsg: ''
    }

    const [userState, setUserState] = useState(initState)

    const [message, setMessage] = useState('')

    const [emailSent, setEmailSent] = useState(false)

    const navigate = useNavigate()

    const signup = async (credentials) => {
        try {
            const res = await axios.post('/auth/signup', credentials);
            setMessage(res.data.message)
            setEmailSent(true)
            navigate('/check-email')
        } catch (err) {
            handleAuthErr(err.response.data.errMsg);
        }
    };

    const login = async (credentials) => {
        try {
            const res = await axios.post('/auth/login', credentials);
            const { user, token } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUserState(prevUserState => ({
                ...prevUserState,
                user,
                token
            }));
        } catch (err) {
            handleAuthErr(err.response.data.errMsg);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserState({
            user: {},
            token: "",
            posts: []
        });
    };

    const handleAuthErr = (errMsg) => {
        setUserState(prevUserState => ({
            ...prevUserState,
            errMsg
        }));
    };

    const resetAuthErr = () => {
        setUserState(prevUserState => ({
            ...prevUserState,
            errMsg: ''
        }));
    };

    const handleFirstTimeSetup = async (userId, userInfo) => {
        try {
            const res = await userAxios.put(`/auth/setup/${userId}`, userInfo);
            // Update userState in context
            setUserState(prev => ({
                ...prev,
                user: res.data
            }));
            // Update user information in localStorage
            localStorage.setItem('user', JSON.stringify(res.data));
            console.log(res.data);

        } catch (err) {
            console.log(err);
        }
    }


    return (
        <UserContext.Provider value={{
            signup,
            login,
            resetAuthErr,
            logout,
            ...userState,
            message,
            emailSent,
            handleFirstTimeSetup
        }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;