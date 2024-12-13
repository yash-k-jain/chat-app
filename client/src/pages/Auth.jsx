import React from 'react'
import Register from "../components/auth/Register"
import Login from "../components/auth/Login"

import { useParams } from 'react-router-dom'

const Auth = () => {
    const { type } = useParams()
  return (
    <>
      {type === 'login' ? <Login /> : <Register />}
    </>
  )
}

export default Auth
