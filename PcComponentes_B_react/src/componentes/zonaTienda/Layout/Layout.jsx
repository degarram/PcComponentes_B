import './Layout.css';
import { Outlet } from 'react-router';

import Header from './Header/Header.jsx';
import Footer from './Footer/Footer.jsx';
import OffCanvasCarrito from '../Carrito/OffCanvasCarrito/OffCanvasCarrito.jsx';

function Layout(){
    return <div className="container">
        <div className="row">
            <div className="col">
                {/*...header  ...*/}
                <Header />
            </div>
        </div>    

        <div className="row">
            <div className="col">
                {/*...contenido variable del layout en funcion de la ruta ...*/}
                <Outlet />
            </div>
        </div>

        <div className="row">
            <div className="col">
                {/*...footer ...*/}
                <Footer />
            </div>
        </div>    

        {/* .... offcanvas del carrito disponible para que pueda ser abierto por cualquier componente de la aplicacion */}
        <OffCanvasCarrito />
        
    </div>
}

export default Layout;