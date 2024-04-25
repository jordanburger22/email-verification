import { Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';


const Navbar = () => {

    const {logout} = useContext(UserContext)

    return ( 
        <nav>
            <h1>Email-Verification</h1>
            <Button variant='contained' onClick={logout}>Logout</Button>
        </nav>
     );
}
 
export default Navbar;