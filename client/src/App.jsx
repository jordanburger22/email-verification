import { useContext } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './components/Auth'
import CheckEmail from './components/CheckEmail'
import { UserContext } from './context/UserContext'
import Home from './components/Home'
import UserInfoSetup from './components/UserInfoSetup'
import Navbar from './components/Navbar'
import EmailConfirmed from './components/EmailConfirmed'

function App() {
  const { token, emailSent, user } = useContext(UserContext)


  return (
    <>
    {token && <Navbar />}
      <Routes>
        <Route path='/' element={!token ? <Auth /> : <Navigate to='/home' />} />
        <Route path='/check-email' element={emailSent ? <CheckEmail /> : <Navigate to='/' />} />
        <Route path='/home' element={token ? <Home /> : <Navigate to='/' />} />
        <Route path='/setup-info' element={user && !user.userInfoSet ? <UserInfoSetup /> : <Navigate to='/home' />} />
        <Route path='/email-confirmed' element={<EmailConfirmed />}/>
      </Routes>
    </>
  )
}

export default App

