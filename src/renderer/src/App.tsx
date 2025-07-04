import { RouterProvider } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import router from './routes'
import { ToastContainer, Zoom } from 'react-toastify'

function App(): React.JSX.Element {
  return (
    <>
      <AuthProvider>
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
