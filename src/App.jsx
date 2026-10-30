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

        {/* Arrendador */}
        <Route path='/arrendador/equipos' element={<MainLayout navVariant='arrendador' footer={false}><PanelArrendadorPage /></MainLayout>} />
        <Route path='/arrendador/equipos/nuevo' element={<MainLayout navVariant='arrendador' footer={false}><AgregarVehiculoPage /></MainLayout>} />
        <Route path='/arrendador/equipos/nuevo/revision' element={<MainLayout navVariant='arrendador' footer={false}><ValidacionPublicarPage /></MainLayout>} />
        <Route path='/arrendador/equipos/editar' element={<MainLayout navVariant='arrendador' footer={false}><EditarVehiculoPage /></MainLayout>} />
        <Route path='/arrendador/equipos/gestionar' element={<MainLayout navVariant='arrendador' footer={false}><GestionarPublicacionPage /></MainLayout>} />
        <Route path='/arrendador/equipos/eliminar' element={<MainLayout navVariant='arrendador' footerProps={{ links: 'Privacidad · Términos · Normas · Ayuda' }}><ConfirmarEliminacionPage /></MainLayout>} />

        {/* Cliente */}
        <Route path='/cliente' element={<MainLayout navVariant='cliente' footer={false}><MiEspacioClientePage /></MainLayout>} />
        <Route path='/cliente/favoritos' element={<MainLayout navVariant='cliente' footer={false}><SinFavoritosPage /></MainLayout>} />

        {/* Valoraciones */}
        <Route path='/valoraciones/politica' element={<MainLayout navVariant='cliente' footer={false}><AntesDeValorarPage /></MainLayout>} />
        <Route path='/valoraciones/cliente-a-arrendador' element={<MainLayout navVariant='cliente' footer={false}><ClienteCalificaArrendadorPage /></MainLayout>} />
        <Route path='/valoraciones/arrendador-a-cliente' element={<MainLayout navVariant='arrendador' footer={false}><ArrendadorCalificaClientePage /></MainLayout>} />

        {/* Administración */}
        <Route path='/admin/usuarios' element={<MainLayout navVariant='admin' footer={false}><AdminUsuariosPage /></MainLayout>} />
        <Route path='/admin/publicaciones' element={<MainLayout navVariant='admin' footer={false}><AdminPublicacionesPage /></MainLayout>} />
        <Route path='/admin/reportes' element={<MainLayout navVariant='admin' footer={false}><AdminReportesPage /></MainLayout>} />
        <Route path='/admin/moderacion' element={<MainLayout navVariant='admin' footer={false}><ModeracionMotivoPage /></MainLayout>} />

        {/* Estados del catálogo */}
        <Route path='/catalogo/sin-resultados' element={<MainLayout navVariant='publicTexto' footer={false}><CatalogoSinResultadosPage /></MainLayout>} />
        <Route path='/catalogo/error' element={<MainLayout navVariant='public' footer={false}><CatalogoErrorPage /></MainLayout>} />

        {/* Reportes de publicación y estado de cuenta */}
        <Route path='/reportar-publicacion' element={<MainLayout navVariant='clienteTexto' footer={false}><ReportarPublicacionPage /></MainLayout>} />
        <Route path='/reporte-enviado' element={<MainLayout navVariant='clienteTexto' footer={false}><ReporteEnviadoPage /></MainLayout>} />
        <Route path='/cuenta-suspendida' element={<MainLayout navVariant='suspendido' footerProps={{ links: 'Privacidad · Términos · Normas · Ayuda', copyright: '© 2026 Rentia · Hecho en Casanare', className: 'hidden md:block' }}><CuentaSuspendidaPage /></MainLayout>} />

        {/* Información legal */}
        <Route path='/terminos' element={<MainLayout navVariant='publicTexto' footer={false}><TerminosPage /></MainLayout>} />
        <Route path='/privacidad' element={<MainLayout navVariant='publicTexto' footer={false}><PrivacidadPage /></MainLayout>} />
        <Route path='/normas' element={<MainLayout navVariant='publicTexto' footer={false}><NormasPage /></MainLayout>} />

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App