//exporto muncion q cuando se ejecuta devuelve el objeto a incrustar en el state global de zustand, 
const initialSessionState={
    accessToken:'',
    resfreshToken:'',
    sesionIniciada:false,
    setAccessToken: ()=>{},
    setRefreshToken: ()=>{},
    setSesionIniciada: ()=>{},
    resetSesion: ()=>{}
}


export const SesionSlice=(get, set, store)=>{
    return {
        ...initialSessionState,
        setAccessToken: (nuevoAccessToken) => set( stateAnterior => ({...stateAnterior, accessToken: nuevoAccessToken })),
        setRefreshToken: (nuevoRefreshToken) => set( stateAnterior => ({...stateAnterior, refreshToken: nuevoRefreshToken })),
        setSesionIniciada: (nuevoValorSesionIniciada) => set( stateAnterior => ({...stateAnterior, sesionIniciada: nuevoValorSesionIniciada })),
        resetSesion: () => set( stateAnterior => ({...stateAnterior, ...initialSessionState })),

    } //<<---- objeto a incrustar en el state global
}