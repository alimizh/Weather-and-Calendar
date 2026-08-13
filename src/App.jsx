import { SettingsProvider } from './context/SettingsContext'
import Dashboard from './components/Dashboard/Dashboard'

export default function App() {
  return (
    <SettingsProvider>
      <Dashboard />
    </SettingsProvider>
  )
}
