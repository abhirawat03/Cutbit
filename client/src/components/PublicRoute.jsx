import { Navigate, Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import Api from "../api/axios"

function PublicRoute() {
//   const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await Api.get("/users/current-user")
        setIsAuth(true)
      } catch {
        setIsAuth(false)
      } finally {
        // setLoading(false)
      }
    }

    checkAuth()
  }, [])

//   if (loading) return <div>Loading...</div>

  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default PublicRoute