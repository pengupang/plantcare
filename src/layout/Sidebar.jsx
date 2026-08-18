import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white w-64 p-6 flex flex-col justify-between'>
      <div>
        <h1 className='text-xl font-bold mb-8'>PlantCare</h1>
        <div className='flex flex-col gap-2'>
          <Link to="/clientes" className='p-3 rounded-lg hover:bg-gray-700'>Clientes</Link>
          <Link to="/mediciones" className='p-3 rounded-lg hover:bg-gray-700'>Mediciones</Link>
          <Link to="/dashboard" className='p-3 rounded-lg hover:bg-gray-700'>Dashboard</Link>
          <Link to="/mapa" className='p-3 rounded-lg hover:bg-gray-700'>Mapa</Link>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className='p-3 rounded-lg hover:bg-gray-700 text-left text-gray-300'
      >
        Cerrar sesión
      </button>
    </div>
  )
}
export default Sidebar