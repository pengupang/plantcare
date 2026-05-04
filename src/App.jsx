import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/clientes" />
      <Route path="/mediciones"  />
      <Route path="/dashboard"  />
    </Routes>
  )
}

export default App