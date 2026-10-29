import './MiniProductoOffCanvas.css';

export default function MiniProductoOffCanvas({producto, cantidad, setCarrito}) {
    return (
        <div className="card mb-3" style="max-width: 540px;">
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={producto.imagenes[0] } className="img-fluid rounded-start" alt={'imagen de ' + producto.nombre} />
                </div>

                <div className="col-md-8">
                    <div className="card-body">
                        <div className="container">
                            <div className="row">
                                <div className="col-9">
                                    <p className="card-text"><small className="text-body-secondary">{producto.nombre}</small></p>
                                    <p className="card-text"><small><strong>{producto.precio}€</strong></small></p>
                                    <p className="card-text"><small className="text-body-secondary">Unidades: {cantidad}</small></p>
                                </div>
                                <div className="col-3">
                                    <button className="btn btn-outline-light btn-sm"
                                            onClick={()=>{
                                                setCarrito('eliminar', { producto: producto, cantidad: cantidad });
                                            }}>
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    )
}