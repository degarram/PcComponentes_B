import { productosCacheContext } from '../middlewares/ProductoCache.middleware.js';

//modulo de codigo que exporta una funcion que se comporta como un loader de react-router
//como parametros recibe un unico objeto que tiene como propiedades: context, params, request, url, pattern
// - context: objeto q contiene informacion de contexto a compartir entre loaders, middleware y actions del objeto route
// - params: objeto q contiene los parametros de la ruta interceptada, por ejemplo si la ruta es /Producto/:idproducto
//            params.idproducto contendria el valor del segmento variable de la ruta
// - request: objeto de tipo Request q contiene informacion de la peticion HTTP q va a disparar el loader  (si la hace)
// - url: objeto de tipo URL q contiene informacion de la url interceptada del objeto Route 
// - pattern: cadena de texto q representa el patron o expresion regular a aplicar sobre la url de la ruta interceptada

// export default async function FetchProductoLoader( objetoParams ){
//     console.log('FetchProductoLoader() objetoParams=',objetoParams);
//     const { context, params, request, url, pattern } = objetoParams;
// } 



export default async function FetchProductoLoader({ context, request, params, url, pattern }) {
    
    try {

        console.log('FetchProductoLoader() objetoParams=',{context, request, params, url, pattern});
        
        const { idproducto } = params; //<--- lo mismo q hacer: const idProducto = params.idproducto; 
        const productosCache = context.get(productosCacheContext); //<----- en productosCache tengo la instancia del Map() creado por el middleware
        const cacheKey = url.toString();

        console.log('====> en funcion loader FetchProductoLoader() antes de hacer fetch() viendo lo q contiene elcontext=', context);

        if (productosCache.has(cacheKey)) {
            console.log('✅✅ Producto encontrado en cache, no hace falta hacer fetch()!!!!!');  
            return productosCache.get(cacheKey);
        }

        const petGetProducto = await fetch(`http://localhost:3000/api/Tienda/Producto/${idproducto}`);
        
        const { codigo, mensaje, datos } = await petGetProducto.json();
        
        if(codigo !==0) throw new Error(`Error en FetchProductoLoader: ${mensaje}`);
        
        productosCache.set(cacheKey, datos.producto); //<---- actualizo el Map() con el valor de esa url y el producto q he recibido del fetch
        return datos.producto;

    } catch (error) {
        
        console.error('Error en FetchProductoLoader:', error);
        return null;
    }


}