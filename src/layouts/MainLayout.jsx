import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState } from 'react'

export const MainLayout = ({ children, navVariant, footer = true, footerProps = {} }) => {
    const [storedRole] = useState(() => window.localStorage.getItem('rentia.demoUser') || 'public')
    return (
        <div>
            <Navbar variant={navVariant || storedRole} />
            <main>{children}</main>
            {footer && <Footer {...footerProps} />}
        </div>
    )
}

export default MainLayout
