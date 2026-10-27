import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const MainLayout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    )
}

export default MainLayout
