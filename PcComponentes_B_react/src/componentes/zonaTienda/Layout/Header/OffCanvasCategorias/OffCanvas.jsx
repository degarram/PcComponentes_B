import './OffCanvas.css'
import { useNavigate } from 'react-router'
import { useState,useRef,useEffect} from 'react'
import ListaCategorias from './ListaCategorias/ListaCategorias.jsx'
import PanelSubcategorias from './PanelSubcategorias/PanelSubcategorias.jsx'


function OffCanvas(){
    //en props recibimos como objeto JS los valores pasados desde el comp.padre <Header></Header>
    //tiene este formato: { cats: [....], tipo: 'principales' }
    const navigate=useNavigate();
    const offcanvasRef=useRef(null);
    const [ categoriaSeleccionada, setCategoriaSeleccionada ]=useState(null);

    // Cuando bootstrap termina de cerrar el offcanvas, cerramos tambien el panel de subcategorias
    useEffect(() => {
        const offcanvasElement = offcanvasRef.current;
        const cerrarPanel = () => setCategoriaSeleccionada(null);

        offcanvasElement.addEventListener('hidden.bs.offcanvas', cerrarPanel);
        return () => offcanvasElement.removeEventListener('hidden.bs.offcanvas', cerrarPanel);
    }, []);


    return (
        <div className="mt-5 mb-4">
            <button className="btn btn-otuline-secondary" 
                    type="button" 
                    data-bs-toggle="offcanvas" 
                    data-bs-target="#offcanvasWithBothOptions" 
                    aria-controls="offcanvasWithBothOptions">
                        <i className="fa-solid fa-bars"></i> Todas las categorias
            </button>

            <div className="offcanvas offcanvas-start" 
                data-bs-scroll="true" 
                tabIndex="-1" 
                id="offcanvasWithBothOptions" 
                aria-labelledby="offcanvasWithBothOptionsLabel"
                ref={offcanvasRef}>

                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Campañas y ofertas</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <hr></hr>

                    <div className="offcanvas-body">
                        <h3><strong>Categorias</strong></h3>
                        <ListaCategorias pathCat='principales'
                                        categoriaSeleccionada={categoriaSeleccionada}
                                        setCategoriaSeleccionada={setCategoriaSeleccionada}/>

                    </div>
                    {/* .... componente panel para cargar categorias de 2º orden .... */}
                    {
                        categoriaSeleccionada &&
                                <PanelSubcategorias categoriaSeleccionada={categoriaSeleccionada} 
                                                    onClose={() => setCategoriaSeleccionada(null)} 
                                                    navigate={navigate}/>
                    }
            </div>        
        </div>
    )
}

export default OffCanvas;