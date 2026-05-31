import { Routes, Route } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Login from './pages/Login'
import Clientes from './pages/Clientes'
import Mediciones from './pages/Mediciones'
import Dashboard from './pages/Dashboard'
import Mapa from './pages/Mapa'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<MainLayout />}>
      <Route path="/clientes" element={<Clientes />}/>
      <Route path="/mediciones" element={<Mediciones />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path='/mapa' element={<Mapa/>}/>
      </Route>
    </Routes>
  )
}

export default App