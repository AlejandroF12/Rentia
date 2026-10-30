import { MainLayout } from './layouts/MainLayout'
import { Home } from './pages/Home'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
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
import PanelArrendadorPage from './pages/PanelArrendadorPage'
import AgregarVehiculoPage from './pages/AgregarVehiculoPage'
import EditarVehiculoPage from './pages/EditarVehiculoPage'
import ValidacionPublicarPage from './pages/ValidacionPublicarPage'
import GestionarPublicacionPage from './pages/GestionarPublicacionPage'
import ConfirmarEliminacionPage from './pages/ConfirmarEliminacionPage'
import MiEspacioClientePage from './pages/MiEspacioClientePage'
import SinFavoritosPage from './pages/SinFavoritosPage'
import AntesDeValorarPage from './pages/AntesDeValorarPage'
import ClienteCalificaArrendadorPage from './pages/ClienteCalificaArrendadorPage'
import ArrendadorCalificaClientePage from './pages/ArrendadorCalificaClientePage'
import AdminUsuariosPage from './pages/AdminUsuariosPage'
import AdminPublicacionesPage from './pages/AdminPublicacionesPage'
import AdminReportesPage from './pages/AdminReportesPage'
import ModeracionMotivoPage from './pages/ModeracionMotivoPage'
import CatalogoSinResultadosPage from './pages/CatalogoSinResultadosPage'
import CatalogoErrorPage from './pages/CatalogoErrorPage'
import CuentaSuspendidaPage from './pages/CuentaSuspendidaPage'
import ReportarPublicacionPage from './pages/ReportarPublicacionPage'
import ReporteEnviadoPage from './pages/ReporteEnviadoPage'
import TerminosPage from './pages/TerminosPage'
import PrivacidadPage from './pages/PrivacidadPage'
import NormasPage from './pages/NormasPage'
import ClientePerfilPage from './pages/ClientePerfilPage'
import ClienteValoracionesPage from './pages/ClienteValoracionesPage'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      target?.scrollIntoView()
      return
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function RequireRole({ roles, children }) {
  const { loading, profile } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-surface" aria-busy="true" />
  }

  if (!profile || profile.status !== 'activo') {
    return <Navigate to="/ingresar" replace />
  }

  if (!roles.includes(profile.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
          <Route path='/menu-cliente' element={<RequireRole roles={['cliente']}><MenuClientePage /></RequireRole>} />
          <Route path='/menu-arrendador' element={<RequireRole roles={['arrendador']}><MenuArrendadorPage /></RequireRole>} />
          <Route path='/menu-administracion' element={<RequireRole roles={['admin']}><MenuAdministracionPage /></RequireRole>} />

        {/* Arrendador */}
        <Route path='/arrendador/equipos' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><PanelArrendadorPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/equipos/nuevo' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><AgregarVehiculoPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/equipos/nuevo/revision' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><ValidacionPublicarPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/equipos/editar' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><EditarVehiculoPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/equipos/gestionar' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><GestionarPublicacionPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/equipos/eliminar' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><ConfirmarEliminacionPage /></MainLayout></RequireRole>} />

        {/* Cliente */}
        <Route path='/cliente' element={<RequireRole roles={['cliente']}><MainLayout navVariant='cliente'><MiEspacioClientePage /></MainLayout></RequireRole>} />
        <Route path='/cliente/favoritos' element={<RequireRole roles={['cliente']}><MainLayout navVariant='cliente'><SinFavoritosPage /></MainLayout></RequireRole>} />
        <Route path='/cliente/valoraciones' element={<RequireRole roles={['cliente']}><MainLayout navVariant='cliente'><ClienteValoracionesPage /></MainLayout></RequireRole>} />
        <Route path='/cliente/perfil' element={<RequireRole roles={['cliente']}><MainLayout navVariant='cliente'><ClientePerfilPage /></MainLayout></RequireRole>} />

        {/* Valoraciones */}
        <Route path='/valoraciones/politica' element={<RequireRole roles={['cliente']}><MainLayout navVariant='cliente'><AntesDeValorarPage /></MainLayout></RequireRole>} />
        <Route path='/valoraciones/cliente-a-arrendador' element={<RequireRole roles={['cliente']}><MainLayout navVariant='cliente'><ClienteCalificaArrendadorPage /></MainLayout></RequireRole>} />
        <Route path='/valoraciones/arrendador-a-cliente' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><ArrendadorCalificaClientePage /></MainLayout></RequireRole>} />

        {/* Administración */}
        <Route path='/admin/usuarios' element={<RequireRole roles={['admin']}><MainLayout navVariant='admin' footer={false}><AdminUsuariosPage /></MainLayout></RequireRole>} />
        <Route path='/admin/publicaciones' element={<RequireRole roles={['admin']}><MainLayout navVariant='admin' footer={false}><AdminPublicacionesPage /></MainLayout></RequireRole>} />
        <Route path='/admin/reportes' element={<RequireRole roles={['admin']}><MainLayout navVariant='admin' footer={false}><AdminReportesPage /></MainLayout></RequireRole>} />
        <Route path='/admin/moderacion' element={<RequireRole roles={['admin']}><MainLayout navVariant='admin' footer={false}><ModeracionMotivoPage /></MainLayout></RequireRole>} />

        {/* Estados del catálogo */}
        <Route path='/catalogo/sin-resultados' element={<MainLayout navVariant='publicTexto'><CatalogoSinResultadosPage /></MainLayout>} />
        <Route path='/catalogo/error' element={<MainLayout navVariant='public'><CatalogoErrorPage /></MainLayout>} />

        {/* Reportes de publicación y estado de cuenta */}
        <Route path='/reportar-publicacion' element={<RequireRole roles={['cliente']}><MainLayout navVariant='clienteTexto'><ReportarPublicacionPage /></MainLayout></RequireRole>} />
        <Route path='/reporte-enviado' element={<RequireRole roles={['cliente']}><MainLayout navVariant='clienteTexto'><ReporteEnviadoPage /></MainLayout></RequireRole>} />
        <Route path='/cuenta-suspendida' element={<MainLayout navVariant='suspendido' footerProps={{ copyright: '© 2026 Rentia · Hecho en Casanare', className: 'hidden md:block' }}><CuentaSuspendidaPage /></MainLayout>} />

        {/* Información legal */}
        <Route path='/terminos' element={<MainLayout navVariant='publicTexto'><TerminosPage /></MainLayout>} />
        <Route path='/privacidad' element={<MainLayout navVariant='publicTexto'><PrivacidadPage /></MainLayout>} />
        <Route path='/normas' element={<MainLayout navVariant='publicTexto'><NormasPage /></MainLayout>} />

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App