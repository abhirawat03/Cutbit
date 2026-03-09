import { Navigate, Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import Api from "../api/axios"

function PublicRoute() {
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await Api.get("/users/current-user")
        setIsAuth(true)
      } catch {
        setIsAuth(false)
      } 
    }

    checkAuth()
  }, [])

  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default PublicRoute