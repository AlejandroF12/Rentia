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
            <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] xl:pb-0">
                {children}
                {footer && <Footer {...footerProps} />}
            </div>
        </div>
    )
}

export default MainLayout
