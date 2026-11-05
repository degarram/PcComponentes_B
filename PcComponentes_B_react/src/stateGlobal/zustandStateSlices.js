//modulo de creacion del state global a nivel de aplicacion pero SUBDIVIDIDO en slices (rebanadas) de estado, cada slice es un modulo de estado global que se puede importar y usar en los componentes que lo necesiten, sin necesidad de importar todo el state global monolitico
import { create } from 'zustand'
import { SesionSlice } from './zustandSlices/SesionSlice.js'
import { ClienteSlice } from './zustandSlices/ClienteSlice.js'
import { CarritoSlice } from './zustandSlices/CarritoSlice.js'

const useStore=create(
    (set,get ,store)=>{
        console.log('dentro de funcion create() de zustandState.js, valores de set...: ', set.toString());
        console.log('dentro de funcion create() de zustandState.js, valores de get...: ', get.toString());
        console.log('dentro de funcion create() de zustandState.js, valores de store...: ', store);
   
        return {
            //incrusto objetos devueltos por los slices...
            ...SesionSlice(set,get,store),
            ...ClienteSlice(set,get,store),
            ...CarritoSlice(set,get,store)
        } //<---- este objeto es el STATE-GLOBAL...
    }

)   
    
    export default useStore;