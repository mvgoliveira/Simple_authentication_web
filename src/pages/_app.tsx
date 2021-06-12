import { AuthProvider } from '../context/authContext'
import { ToastContainer } from 'react-toastify';
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ToastContainer enableMultiContainer autoClose={3000} />
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
