import {useState, useEffect} from 'react';

export default function useGetCategorias(pathCat){

    const [ categorias, setCategorias] = useState([]);

    useEffect(
        ()=>{
            async function fetchCategorias(){
                try{
                    const requestCats=await fetch(`http://localhost:3000/api/Tienda/Categorias?pathCat=${pathCat}`);
                    const responseCats=await requestCats.json();

                    if(responseCats.codigo !==0) throw new Error(`Error en la respuesta de la API: ${responseCats.datos.mensaje}`);
                    
                    setCategorias(responseCats.datos.categorias);
                
                } catch(error){
                    console.error('Error al obtener las categorias:', error);
                    setCategorias([]);
                }            
            }
            
            fetchCategorias();

        },[pathCat]
    )

    return categorias
}