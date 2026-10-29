import './PanelSubcategorias.css';
import { useState, useEffect } from 'react';
import useGetCategorias from '../../../../../../customHooks/FetchCategorias.Hook.js';
import DropDownSubcategorias from '../DropDownSubcategorias/DropDownSubcategorias.jsx';


export default function PanelSubcategorias({ categoriaSeleccionada:categoriaPadre, onClose, navigate }) {
    
    const subcategorias = useGetCategorias(categoriaPadre?.pathCat);

    const [subcategoriaAbierta, setSubcategoriaAbierta] = useState(null)
    //----------------- este bloque de codigo para obtener categorias se repite en ListaCategorias, PanelSubcategorias y DropDownSubcategorias, deberiamos extraerlo a un hook personalizado -----------------
    // const [subcategorias, setSubcategorias] = useState([]);

    // useEffect(
    //     ()=>{
    //         async function fetchCategorias(){
    //             try{
    //                 const requestCats=await fetch(`http://localhost:3000/api/Tienda/Categorias?pathCat=${categoriaPadre.pathCat}`);
    //                 const responseCats=await requestCats.json();

    //                 if(responseCats.codigo !==0) throw new Error(`Error en la respuesta de la API: ${responseCats.datos.mensaje}`);
                    
    //                 setSubcategorias(responseCats.datos.categorias);
                
    //             } catch(error){
    //                 console.error('Error al obtener las categorias:', error);
    //                 setSubcategorias([]);
    //             }            
    //         }
            
    //         fetchCategorias();

    //     },[categoriaPadre.pathCat]
    // )    
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    return (
        <aside className={`panel-subcategorias ${categoriaPadre ? 'abierto' : ''}`} aria-hidden={!categoriaPadre}>

            {
                categoriaPadre && (
                    <>
                        <div className="panel-subcategorias-header">
                            <h5>{categoriaPadre.nombre}</h5>
                            <button type="button"
                                    className="btn-close"
                                    aria-label="Cerrar subcategorias"
                                    onClick={onClose} />
                        </div>
                        <hr />
                        <div className="panel-subcategorias-body">
                                <ul className="list-unstyled m-0">
                                {subcategorias.map(subcategoria => (
                                    <DropDownSubcategorias
                                        key={subcategoria._id}
                                        subcategoria={subcategoria}
                                        abierta={subcategoriaAbierta?._id === subcategoria._id}
                                        onClick={
                                            () => {
                                                    setSubcategoriaAbierta(actual => (actual?._id === subcategoria._id ? null : subcategoria));
                                                    navigate(`/Productos?pathCat=${subcategoria.pathCat}`);
                                            }
                                        }
                                    />
                                ))}
                            </ul>

                        </div>
                    </>
                )
            }

        </aside>
    )
}

