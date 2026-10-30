import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const MainLayout = ({ children, navVariant = 'public', footer = true }) => {
    return (
        <div>
            <Navbar variant={navVariant} />
            <main>{children}</main>
            {footer && <Footer />}
        </div>
    )
}

export default MainLayout
