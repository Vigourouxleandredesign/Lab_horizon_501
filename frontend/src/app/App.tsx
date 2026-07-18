import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import { appRouter } from './routes'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  )
}

export default App
