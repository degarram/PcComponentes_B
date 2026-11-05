/*
    modulo de codigo para generear almacen global de variables para todos los comp. de la app
    en el almacen global, me gustaria almacenar:
{
    datosCliente: { nombre:'', apellidos:'', cuenta:{ email:'', password:'',... }, direcciones:[], ... },
    accessToken:'...jwt de acceso...',
    refreshToken:'...jwt de refresco...',
    carritoCompra: { itemsPedido:[ {producto:..., cantidad:....}, ...], subtotal:0, gastosEnvio:0, total:0 },   

}


*/
import { create } from 'zustand'

const initialState={
    datosCliente: { 
                    nombre:'', 
                    apellidos:'', 
                    cuenta:{ 
                            email:'', 
                            password:'', 
                            activada: false, 
                            fechaCreacion:0, 
                            imagenAvatar:'' 
                        }, 
                    direcciones:[], 
                    pedidos:[], 
                    opiniones:[], 
                    favoritos:[] 
                },
    accessToken:'', //<--- jwt de acceso
    refreshToken:'', //<--- jwt de refresco
    carritoCompra: { itemsPdido:[], subtotal:0, gastosEnvio:0, total:0 },
    setDatosCliente: ()=>{},
    setAccessToken: ()=>{},
    setRefreshToken: ()=>{},
    setCarritoCompra: ()=>{}
}



const useStore = create(

    (set, get, store)=>{
        console.log('dentro de funcion create() de zustandState.js, valores de set...: ', set.toString());
        console.log('dentro de funcion create() de zustandState.js, valores de get...: ', get.toString());
        console.log('dentro de funcion create() de zustandState.js, valores de store...: ', store);
        
        return {
            // datosCliente: initialState.datosCliente,
            // accessToken: initialState.accessToken,
            // refreshToken: initialState.refreshToken,
            // carritoCompra: initialState.carritoCompra,
            ...initialState,
            setDatosCliente: (nuevosDatos) => set( stateAnterios => ({...stateAnterios, datosCliente: { ...stateAnterios.cliente, ...nuevosDatos }})),

        }
    }

)

export default useStore; //<----- hook a emplear por los componentes para acceder a variables del almacen global