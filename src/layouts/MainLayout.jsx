import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

export const MainLayout = ({ children, navVariant, footer = true, footerProps = {} }) => {
    const { profile } = useAuth()
    const resolvedNavVariant = profile?.status === 'activo'
        ? profile.role
        : profile?.status === 'suspendido'
            ? 'suspendido'
            : navVariant || 'public'
    return (
        <div>
            <Navbar variant={resolvedNavVariant} />
            <main>{children}</main>
            {footer && <Footer {...footerProps} />}
        </div>
    )
}

export default MainLayout
