import { Navigate, Route, Routes } from 'react-router'

import { DashboardPage } from './pages/app/DashboardPage'
import { SettingsPage } from './pages/app/Settings'

function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/app/dashboard" replace />} />
      <Route index path='/dashboard' Component={DashboardPage} />
      <Route index path='/settings' Component={SettingsPage} />
    </Routes>
  )
}

export default App
