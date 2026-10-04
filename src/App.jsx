import { Routes, Route } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginMaquinaria from './pages/LoginMaquinaria'
import LoginLecheria from './pages/LoginLecheria'
import Clientes from './pages/Clientes'
import Mediciones from './pages/Mediciones'
import Dashboard from './pages/Dashboard'
import Mapa from './pages/Mapa'
import PortalAcceso from './pages/PortalAcceso'

function App() {
  return (
    <Routes>
      <Route path='/' element={<PortalAcceso/>} />
      <Route path="/maquinaria/login" element={<LoginMaquinaria />} />
      <Route path="/lecheria/login" element={<LoginLecheria />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/clientes" element={<Clientes />}/>
          <Route path="/mediciones" element={<Mediciones />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path='/mapa' element={<Mapa/>}/>
        </Route>
      </Route>
    </Routes>
  )
}

export default App