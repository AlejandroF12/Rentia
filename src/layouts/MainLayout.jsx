import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

export const MainLayout = ({ children, navVariant, footer = true, footerProps = {} }) => {
    const { profile } = useAuth()
    const activeRole = profile?.status === 'activo' ? profile.role : 'public'
    return (
        <div>
            <Navbar variant={navVariant || activeRole} />
            <main>{children}</main>
            {footer && <Footer {...footerProps} />}
        </div>
    )
}

export default MainLayout
