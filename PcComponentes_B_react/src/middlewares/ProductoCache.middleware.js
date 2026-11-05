import { createContext } from 'react-router';

const productosCache = new Map();
export const productosCacheContext = createContext(productosCache); //<--- inicializo el contexto reservando espacio para un Map()

/*
       productosCacheContext
    +---- contexto: --------------+
    |          key:... value:...  |        para meter un valor: uso parametro 'context' de la funcion loader o middleware
    |  Map()-->key:... value:...  |  <=====   - el metodo .get() del parametro 'context' devuelve el valor de la key q le pases
    |           key:... value:... |                 ej:  context.get(nombre_contexto) <=== devolveria el valor del Map() que tiene
                                                                                el contexto, aqui tengo que buscar la key 'url' por si existe ya o no
    |-----------------------------+          
                                             - el metodo .set() del parametro 'context' permite meter un valor en el Map():
                                                    ej:  context.set(nombre_contexto, datosContexto) <=== mete en el Map() la instancia de datos
                                                                                                el objeto new Map()
*/


export async function productoCacheMiddleware({ context }, next) {
    console.log(`===> en funcion middleware productoCacheMiddleware() antes de llamar a next() context: ${context} <======`);
    console.log('....creando contexto con Map() de keys: url y values: datosProducto para q lo pueda usar el loader FetchProductoLoader().....');

    context.set(productosCacheContext, productosCache); // <--- con .set meto instancia del Map() en el contexto para ya usarlo

    await next();
    
    console.log('===> en funcion middleware productoCacheMiddleware() despues de llamar a next() context=', context);
}
