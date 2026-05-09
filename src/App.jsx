import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Clientes from './pages/Clientes'
import Mediciones from './pages/Mediciones'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/clientes" element={<Clientes />}/>
      <Route path="/mediciones" element={<Mediciones />} />
      <Route path="/dashboard"  />
    </Routes>
  )
}

export default App