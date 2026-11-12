import { MainLayout } from './layouts/MainLayout'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })))
const CatalogoPage = lazy(() => import('./pages/CatalogoPage'))
const CrearCuentaPage = lazy(() => import('./pages/CrearCuentaPage'))
const DetalleEquipoPage = lazy(() => import('./pages/DetalleEquipoPage'))
const IngresarPage = lazy(() => import('./pages/IngresarPage'))
const InstruccionesRecuperacionPage = lazy(() => import('./pages/InstruccionesRecuperacionPage'))
const MenuAdministracionPage = lazy(() => import('./pages/MenuAdministracionPage'))
const MenuArrendadorPage = lazy(() => import('./pages/MenuArrendadorPage'))
const MenuClientePage = lazy(() => import('./pages/MenuClientePage'))
const MenuPublicoPage = lazy(() => import('./pages/MenuPublicoPage'))
const NuevaContrasenaPage = lazy(() => import('./pages/NuevaContrasenaPage'))
const PerfilPublicoPage = lazy(() => import('./pages/PerfilPublicoPage'))
const RecuperarAccesoPage = lazy(() => import('./pages/RecuperarAccesoPage'))
const PanelArrendadorPage = lazy(() => import('./pages/PanelArrendadorPage'))
const AgregarVehiculoPage = lazy(() => import('./pages/AgregarVehiculoPage'))
const EditarVehiculoPage = lazy(() => import('./pages/EditarVehiculoPage'))
const ValidacionPublicarPage = lazy(() => import('./pages/ValidacionPublicarPage'))
const GestionarPublicacionPage = lazy(() => import('./pages/GestionarPublicacionPage'))
const ConfirmarEliminacionPage = lazy(() => import('./pages/ConfirmarEliminacionPage'))
const MiEspacioClientePage = lazy(() => import('./pages/MiEspacioClientePage'))
const SinFavoritosPage = lazy(() => import('./pages/SinFavoritosPage'))
const AntesDeValorarPage = lazy(() => import('./pages/AntesDeValorarPage'))
const ClienteCalificaArrendadorPage = lazy(() => import('./pages/ClienteCalificaArrendadorPage'))
const ArrendadorCalificaClientePage = lazy(() => import('./pages/ArrendadorCalificaClientePage'))
const AdminUsuariosPage = lazy(() => import('./pages/AdminUsuariosPage'))
const AdminPublicacionesPage = lazy(() => import('./pages/AdminPublicacionesPage'))
const AdminReportesPage = lazy(() => import('./pages/AdminReportesPage'))
const AdminResumenPage = lazy(() => import('./pages/AdminResumenPage'))
const CatalogoSinResultadosPage = lazy(() => import('./pages/CatalogoSinResultadosPage'))
const CatalogoErrorPage = lazy(() => import('./pages/CatalogoErrorPage'))
const CuentaSuspendidaPage = lazy(() => import('./pages/CuentaSuspendidaPage'))
const ReportarPublicacionPage = lazy(() => import('./pages/ReportarPublicacionPage'))
const ReporteEnviadoPage = lazy(() => import('./pages/ReporteEnviadoPage'))
const ReportarValoracionPage = lazy(() => import('./pages/ReportarValoracionPage'))
const TerminosPage = lazy(() => import('./pages/TerminosPage'))
const PrivacidadPage = lazy(() => import('./pages/PrivacidadPage'))
const NormasPage = lazy(() => import('./pages/NormasPage'))
const ClientePerfilPage = lazy(() => import('./pages/ClientePerfilPage'))
const ClienteValoracionesPage = lazy(() => import('./pages/ClienteValoracionesPage'))
const ArrendadorValoracionesPage = lazy(() => import('./pages/ArrendadorValoracionesPage'))
const ArrendadorPerfilPage = lazy(() => import('./pages/ArrendadorPerfilPage'))
const ResumenArrendadorPage = lazy(() => import('./pages/ResumenArrendadorPage'))
const PreferenciasPage = lazy(() => import('./pages/PreferenciasPage'))
const AyudaPage = lazy(() => import('./pages/AyudaPage'))
const AdminApelacionesPage = lazy(() => import('./pages/AdminApelacionesPage'))

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

function NativeBackButton() {
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return undefined

    let listener
    let disposed = false
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back()
      } else {
        void CapacitorApp.exitApp()
      }
    }).then((handle) => {
      if (disposed) {
        void handle.remove()
      } else {
        listener = handle
      }
    }).catch((error) => {
      console.error('No se pudo registrar el botón Atrás de Android:', error)
    })

    return () => {
      disposed = true
      void listener?.remove()
    }
  }, [])

  return null
}

function RequireRole({ roles, children }) {
  const { loading, profile } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-surface" aria-busy="true" />
  }

  if (profile?.status === 'suspendido') {
    return <Navigate to="/cuenta-suspendida" replace />
  }

  if (!profile || profile.status !== 'activo') {
    return <Navigate to="/ingresar" replace />
  }

  if (!roles.includes(profile.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function RequireAuth({ children }) {
  const { loading, profile } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-surface" aria-busy="true" />
  }

  if (profile?.status === 'suspendido') {
    return <Navigate to="/cuenta-suspendida" replace />
  }

  if (!profile || profile.status !== 'activo') {
    return <Navigate to="/ingresar" replace />
  }

  return children
}

function RequireSuspended({ children }) {
  const { loading, profile } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-surface" aria-busy="true" />
  }

  if (!profile || profile.status !== 'suspendido') {
    return <Navigate to={profile?.status === 'activo' ? '/' : '/ingresar'} replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <NativeBackButton />
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-surface" aria-busy="true" />}>
        <Routes>
        <Route path='/' element={<MainLayout><Home /></MainLayout>} />
        <Route path='/catalogo' element={<MainLayout><CatalogoPage /></MainLayout>} />
        <Route path='/detalle-equipo' element={<MainLayout><DetalleEquipoPage /></MainLayout>} />
        <Route path='/perfil-publico' element={<RequireAuth><MainLayout><PerfilPublicoPage /></MainLayout></RequireAuth>} />
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
        <Route path='/arrendador/resumen' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><ResumenArrendadorPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/equipos/nuevo' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><AgregarVehiculoPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/equipos/nuevo/revision' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><ValidacionPublicarPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/equipos/editar' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><EditarVehiculoPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/equipos/gestionar' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><GestionarPublicacionPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/equipos/eliminar' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><ConfirmarEliminacionPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/valoraciones' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><ArrendadorValoracionesPage /></MainLayout></RequireRole>} />
        <Route path='/arrendador/perfil' element={<RequireRole roles={['arrendador']}><MainLayout navVariant='arrendador'><ArrendadorPerfilPage /></MainLayout></RequireRole>} />

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
        <Route path='/admin/resumen' element={<RequireRole roles={['admin']}><MainLayout navVariant='admin' footer={false}><AdminResumenPage /></MainLayout></RequireRole>} />
        <Route path='/admin/usuarios' element={<RequireRole roles={['admin']}><MainLayout navVariant='admin' footer={false}><AdminUsuariosPage /></MainLayout></RequireRole>} />
        <Route path='/admin/publicaciones' element={<RequireRole roles={['admin']}><MainLayout navVariant='admin' footer={false}><AdminPublicacionesPage /></MainLayout></RequireRole>} />
        <Route path='/admin/reportes' element={<RequireRole roles={['admin']}><MainLayout navVariant='admin' footer={false}><AdminReportesPage /></MainLayout></RequireRole>} />
        <Route path='/admin/apelaciones' element={<RequireRole roles={['admin']}><MainLayout navVariant='admin' footer={false}><AdminApelacionesPage /></MainLayout></RequireRole>} />
        <Route path='/admin/moderacion' element={<RequireRole roles={['admin']}><Navigate to='/admin/reportes' replace /></RequireRole>} />

        {/* Estados del catálogo */}
        <Route path='/catalogo/sin-resultados' element={<MainLayout navVariant='publicTexto'><CatalogoSinResultadosPage /></MainLayout>} />
        <Route path='/catalogo/error' element={<MainLayout navVariant='public'><CatalogoErrorPage /></MainLayout>} />

        {/* Reportes de publicación y estado de cuenta */}
        <Route path='/reportar-publicacion' element={<RequireRole roles={['cliente']}><MainLayout navVariant='clienteTexto'><ReportarPublicacionPage /></MainLayout></RequireRole>} />
        <Route path='/reportar-valoracion' element={<RequireRole roles={['cliente', 'arrendador']}><MainLayout navVariant='clienteTexto'><ReportarValoracionPage /></MainLayout></RequireRole>} />
        <Route path='/reporte-enviado' element={<RequireRole roles={['cliente', 'arrendador']}><MainLayout navVariant='clienteTexto'><ReporteEnviadoPage /></MainLayout></RequireRole>} />
        <Route path='/cuenta-suspendida' element={<RequireSuspended><MainLayout navVariant='suspendido' footerProps={{ copyright: '© 2026 Rentia · Hecho en Casanare', className: 'hidden md:block' }}><CuentaSuspendidaPage /></MainLayout></RequireSuspended>} />

        {/* Información legal */}
        <Route path='/terminos' element={<MainLayout navVariant='publicTexto'><TerminosPage /></MainLayout>} />
        <Route path='/privacidad' element={<MainLayout navVariant='publicTexto'><PrivacidadPage /></MainLayout>} />
        <Route path='/normas' element={<MainLayout navVariant='publicTexto'><NormasPage /></MainLayout>} />
        <Route path='/ayuda' element={<MainLayout navVariant='publicTexto'><AyudaPage /></MainLayout>} />
        <Route path='/configuracion' element={<MainLayout><PreferenciasPage /></MainLayout>} />

        <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App