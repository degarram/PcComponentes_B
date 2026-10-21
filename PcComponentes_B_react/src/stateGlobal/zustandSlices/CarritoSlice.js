
const initialStateCarrito = {
    carrito:{
        itemsCarrito:[], //<--- array de objetos: { producto:{ nombre, id, precio, imagen, descuento}, cantidad: }
        subtotal:0,
        gastosEnvio:0,
        iva: 0.12,
        total:0
    },
    setCarrito: ()=>{},
    resetCarrito: ()=>{}
}

export const CarritoSlice=(get, set, store)=>{
    return {
        ...initialStateCarrito,
        setCarrito: (accion, newItem)=>{
            set (stateAnterior => {
                //accion puede ser: 'agregar', 'eliminar', 'modificar' <--- en funcion de esta accion tengo que modificar el array de itemsCarrito
                //del objeto carrito del state global, y recalcular subtotal, gastosEnvio, total
                //1º) debo clonar el array de itemsCarrito del state global, para no modificarlo directamente
                //2º) busco el itemCarrito en el array clonado para saber si existe...
                let _itemsCarritoClonado = [...stateAnterior.carrito.itemsCarrito];
                let _posicionItem = _itemsCarritoClonado.findIndex(item => item.producto._id === newItem.producto._id);
                switch(accion){
                    case 'agregar':
                        if(_posicionItem === -1){ //el item no existe en el array, lo agreto...
                            _itemsCarritoClonado.push( newItem );
                        } else {
                            //el item ya existe en el array, incremento la cantidad...
                            _itemsCarritoClonado[_posicionItem].cantidad += newItem.cantidad;
                        }
                        break;

                    case 'eliminar':
                        if(_posicionItem !== -1){ //el item existe en el array, lo elimino...
                            // Comentario: Elimina el item del array clonado
                            //_itemsCarritoClonado.splice(_posicionItem, 1);
                            _itemsCarritoClonado = _itemsCarritoClonado.filter(item => item.producto._id !== newItem.producto._id);
                        }   
                        break;
                    case 'modificar':
                        if(_posicionItem !== -1){ //el item existe en el array, modifico la cantidad...
                            _itemsCarritoClonado[_posicionItem].cantidad = newItem.cantidad;
                        }
                        break;
                }
                //recalculo subtotal, gastosEnvio, total
                //TODO: En el subtotal debo tener en cuenta el descuento del producto, si lo tiene, y aplicarlo al precio del producto antes de multiplicar por la cantidad
                let _subtotal = _itemsCarritoClonado.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
                let _gastosEnvio = 0; //<----- dependera de direccion de envio, peso, etc....
                let _total = _subtotal + _gastosEnvio + (_subtotal * stateAnterior.carrito.iva);

                return {
                    ...stateAnterior,
                    carrito: {
                        itemsCarrito: _itemsCarritoClonado,
                        subtotal: _subtotal,
                        gastosEnvio: _gastosEnvio,
                        total: _total
                    }
                }
            })

        },
        resetCarrito: () => set( stateAnterior => ({...stateAnterior, ...initialStateCarrito })),
    } //<--- objeto a incrustar en el state global
}
