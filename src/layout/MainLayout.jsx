import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import WeatherWidget from '../components/WeatherWidget'

function MainLayout() {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1'>
        <Outlet />
      </div>
      <WeatherWidget />
    </div>
  )
}
export default MainLayout