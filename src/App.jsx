import { MainLayout } from './layouts/MainLayout'
import { Home } from './pages/Home'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CatalogoPage from './pages/CatalogoPage'
import CrearCuentaPage from './pages/CrearCuentaPage'
import DetalleEquipoPage from './pages/DetalleEquipoPage'
import IngresarPage from './pages/IngresarPage'
import InstruccionesRecuperacionPage from './pages/InstruccionesRecuperacionPage'
import MenuAdministracionPage from './pages/MenuAdministracionPage'
import MenuArrendadorPage from './pages/MenuArrendadorPage'
import MenuClientePage from './pages/MenuClientePage'
import MenuPublicoPage from './pages/MenuPublicoPage'
import NuevaContrasenaPage from './pages/NuevaContrasenaPage'
import PerfilPublicoPage from './pages/PerfilPublicoPage'
import RecuperarAccesoPage from './pages/RecuperarAccesoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout><Home /></MainLayout>} />
        <Route path='/catalogo' element={<MainLayout><CatalogoPage /></MainLayout>} />
        <Route path='/detalle-equipo' element={<MainLayout><DetalleEquipoPage /></MainLayout>} />
        <Route path='/perfil-publico' element={<MainLayout><PerfilPublicoPage /></MainLayout>} />
        <Route path='/crear-cuenta' element={<CrearCuentaPage />} />
        <Route path='/ingresar' element={<IngresarPage />} />
        <Route path='/recuperar-acceso' element={<RecuperarAccesoPage />} />
        <Route path='/instrucciones-recuperacion' element={<InstruccionesRecuperacionPage />} />
        <Route path='/nueva-contrasena' element={<NuevaContrasenaPage />} />
          <Route path='/menu-publico' element={<MenuPublicoPage />} />
          <Route path='/menu-cliente' element={<MenuClientePage />} />
          <Route path='/menu-arrendador' element={<MenuArrendadorPage />} />
          <Route path='/menu-administracion' element={<MenuAdministracionPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App