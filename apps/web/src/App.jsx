import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { ToastContainer } from 'react-bootstrap'

import NavbarComponent from './components/Navbar.jsx'

function App() {

  return (
    <>
      <NavbarComponent />

      <ToastContainer position="bottom-end" className="p-3" />
    </>
  )
}

export default App
