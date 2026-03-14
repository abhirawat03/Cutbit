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
import LinkBrief from "./pages/LinkBrief.jsx";
import Settings from "./pages/Settings.jsx";
// import Link from "./pages/Link.jsx";
import LinkView from "./pages/Link.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import RedirectError from "./pages/RedirectError.jsx";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        {/* layout wrapper */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/link-error/:type" element={<RedirectError />} />
        </Route>
        <Route element={<PublicRoute />}>
          {/* AUTH PAGES */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="links" element={<Mylinks />} />
            <Route path="links/:id" element={<LinkView />} />
            <Route path="links/:id/analytics" element={<LinkBrief />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
