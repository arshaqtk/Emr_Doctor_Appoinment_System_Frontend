import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './routes'
import './styles/globals.css'

function App() {
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <RouterProvider router={router} />
        </>
    )
}

export default App
