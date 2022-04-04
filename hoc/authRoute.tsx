import React, { ReactNode } from "react"
import { useRouter } from "next/router"
import {useAuth} from '../context/AuthContext';
const AuthRoute = ({children}:{children:ReactNode}) => {
const {currentUser} = useAuth();
const Router = useRouter()

  if (currentUser) {
    return <>{children}</>
  } else {
    Router.push("/")
    return <></>
  }
}

export default AuthRoute
