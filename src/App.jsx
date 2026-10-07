import { BrowserRouter ,Routes, Route , Navigate } from 'react-router-dom'
import PortalAcceso from './pages/PortalAcceso'
import LoginMaquinaria from './pages/LoginMaquinaria'
import LoginLecheria from './pages/LoginLecheria'
import DashboardMaquinaria from './pages/DashboardMaquinaria'
import DashboardLecheria from './pages/DashboardLecheria'
import LayoutLecheria from './layout/LayoutLecheria'
import LayoutMaquinaria from './layout/LayoutMaquinaria'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Portal de acceso */}
        <Route path="/" element={<PortalAcceso />} />
        {/* Logins */}
        <Route path="/maquinaria/login" element={<LoginMaquinaria />} />
        <Route path="/lecheria/login" element={<LoginLecheria />} />
        {/* paginas Maquinaria */}
        <Route path="/maquinaria" element={<LayoutMaquinaria />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardMaquinaria />} />
        </Route>
        {/* Paginas de lecheria */}
        <Route path="/lecheria" element={<LayoutLecheria />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardLecheria />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App