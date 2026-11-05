import './OffCanvasCarrito.css';
import MiniProductoOffCanvas from './MiniProductoOffCanvas/MiniProductoOffCanvas.jsx';
import useStore from '../../../../stateGlobal/zustandStateSlices.js';

export default function OffCanvasCarrito() {

    const { carrito, setCarrito } = useStore();

    return (
        <>
            <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasCarrito" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">Mi Cesta</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
    
                <hr></hr>
    
                <div className="offcanvas-body">
                    {
                        carrito.itemsCarrito.length > 0 ? (
                            <>
                                {
                                    carrito.itemsCarrito.map((item, index) => (
                                        <MiniProductoOffCanvas key={index} 
                                                                producto={item.producto} 
                                                                cantidad={item.cantidad}
                                                                setCarrito={setCarrito} />
                                    ))
                                }
                            </>
                        ) : (
                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                <i className="bi bi-search"></i>
                                <h5 className='text-center'>Tu carrito está vacío</h5>
                                <p className='text-center text-muted'>Explora multitud de artículos a buen precio</p>
                                <p className='text-center text-muted'>precio desde nuestra página principal</p>
                                <button className='btn btn-primary'
                                        style={ {backgroundColor: '#ff6000', borderColor: '#fff', color: '#fff'} }  
                                        data-bs-dismiss="offcanvas" 
                                        aria-label="Close">
                                            Explorar artículos
                                </button>
                            </div>
                        )


                    }
                </div>

            </div>        
        </>
    )
}