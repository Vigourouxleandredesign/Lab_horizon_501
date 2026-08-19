import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import { LocaleProvider } from '../i18n/LocaleContext'
import { appRouter } from './routes'

function App() {
  return (
    <AuthProvider>
      <LocaleProvider>
        <RouterProvider router={appRouter} />
      </LocaleProvider>
    </AuthProvider>
  )
}

export default App
