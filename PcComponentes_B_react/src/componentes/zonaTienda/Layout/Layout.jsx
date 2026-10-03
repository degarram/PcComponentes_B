import './Layout.css';
import { Outlet } from 'react-router';

import Header from './Header/Header.jsx';
import Footer from './Footer/Footer.jsx';

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
    </div>
}

export default Layout;