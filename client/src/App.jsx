import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import Login from "./pages/Login.jsx";
import './App.css'
import Signup from "./pages/Signup.jsx";
import DashLayout from "./components/DashLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Mylinks from "./pages/Mylinks.jsx";
import Analytics from "./pages/Analytics.jsx";
import LinkBrief from "./pages/LinkBrief.jsx";
import Settings from "./pages/Settings.jsx";
// import Link from "./pages/Link.jsx";
import LinkView from "./pages/Link.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import ProtectedRoute from "./components/PrivateRoute.jsx";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          {/* layout wrapper */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* AUTH PAGES */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          {/* DASHBOARD */}
          <Route element={<DashLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/links" element={<Mylinks />} />
            <Route path="/dashboard/link" element={<LinkView />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/analytics" element={<LinkBrief />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
