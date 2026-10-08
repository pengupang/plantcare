import { BrowserRouter ,Routes, Route , Navigate } from 'react-router-dom'
import PortalAcceso from './pages/PortalAcceso'
import LoginMaquinaria from './pages/LoginMaquinaria'
import LoginLecheria from './pages/LoginLecheria'
import DashboardMaquinaria from './pages/DashboardMaquinaria'
import DashboardLecheria from './pages/DashboardLecheria'
import LayoutLecheria from './layout/LayoutLecheria'
import LayoutMaquinaria from './layout/LayoutMaquinaria'
import VistaMaquinaria from './pages/VistaMaquinaria'
import VistaProveedores from './pages/VistaProveedores'
import VistaComidas from './pages/VistasComidas'
import DashboardPlantCare from './pages/DashboardPlantCare'
import VistaHistoricosGastos from './pages/HistoricoGastos'
import VistaCalendarioAnimales from './pages/CalendarioAnimales'


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
          <Route path='maquinas' element={<VistaMaquinaria/>}/>
        </Route>
        {/* Paginas de lecheria */}
        <Route path="/lecheria" element={<LayoutLecheria />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardLecheria />} />
          <Route path='comidas' element={<VistaComidas/>}/>
          <Route path='proveedores' element={<VistaProveedores/>}/>
          <Route path='plantcare' element={<DashboardPlantCare/>}/>
          <Route path="calendario" element={<VistaCalendarioAnimales />} />
          <Route path="historicos" element={<VistaHistoricosGastos />} />
        </Route> 
      </Routes>
    </BrowserRouter>
  )
}

export default App