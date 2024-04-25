import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';


const Home = () => {

    const { user } = useContext(UserContext)

    const [firstLogin, setFirstLogin] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (user && !user.userInfoSet) {
            setFirstLogin(true)
        } else {
            setFirstLogin(false)
        }
    }, [])

    if (firstLogin) {
        navigate('/setup-info')
    }

    return (
        <div className='home'>
            <h1>Welcome {user.displayName}.</h1>
        </div>
    );
}

export default Home;