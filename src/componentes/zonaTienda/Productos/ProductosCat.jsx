import './Productos.css';
import { useSearchParams } from 'react-router';

function ProductosCat(){
    // let parametrosUrl=useParams(); //<--- objeto con formato { categoria: '....' }
    // console.log('parametrosUrl.categoria: ',parametrosUrl);
    const [ queryParams, setQueryParams ]=useSearchParams();  //<---- devuelve un array con 2 elementos: [ objetoURLSearchParams, funcion_modificadora_objeto ]
    console.log('valor devuelto 1º posicion array, objeto URLSearchParams:', queryParams);
    console.log('valor devuelto 2º posicion array, funcion modificadora:', setQueryParams);


    return <div className="container">
        <div className="row">
            <div className="col-12 d-flex flex-column align-items-center justify-content-center">
                {/* <h1>Categoria: <strong>{parametrosUrl.categoria}</strong></h1>
                <p>...cargamos desde bd los productos de la categoria {parametrosUrl.categoria}...</p> */}
            </div>
        </div>
    </div>
}

export default ProductosCat;