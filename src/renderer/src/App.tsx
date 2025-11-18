import { RouterProvider } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import router from './routes'
import { ToastContainer, Zoom } from 'react-toastify'
import UpdateOverlay from './components/UpdateOverlay'

function App(): React.JSX.Element {
  return (
    <>
      <AuthProvider>
        <UpdateOverlay />
        <RouterProvider router={router} />
        <ToastContainer
          position="bottom-center"
          autoClose={1000}
          hideProgressBar
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Zoom}
        />
      </AuthProvider>
    </>
  )
}

export default App
