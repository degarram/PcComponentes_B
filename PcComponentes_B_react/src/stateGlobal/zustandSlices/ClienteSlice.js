const initialStateCliente = {
    datosCliente:{
        nombre:'',
        apellidos:'',
        cuenta:{
            email:'',
            password:'',
            activada: false,
            fechaCreacion: 0,
            imagenAvatar:''
        },
        direcciones:[],
        pedidos:[],
        opiniones:[],
        favoritos:[]
    },
    setDatosCliente: ()=>{},
    resetDatosCliente: ()=>{}

}

export const ClienteSlice=(get, set, store)=>{

    return {
        ...initialStateCliente,
        setDatosCliente: (nuevosDatos) => set( stateAnterior => ({...stateAnterior, datosCliente: { ...stateAnterior.datosCliente, ...nuevosDatos }})),
        resetDatosCliente: () => set( stateAnterior => ({...stateAnterior, ...initialStateCliente })),
    } //<--- objeto a incrustar en el state global
}