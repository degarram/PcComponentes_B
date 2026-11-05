import './LoginRegistro.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import useStore  from '../../../stateGlobal/zustandStateSlices';

function LoginRegistro(){
    
    //const stateGlobal = useStore(); //<--- hook de zustand q devuelve el state global y las funciones q lo modifican
    //no quiero toooooooodo el objeto del state-global, solo quiero:
    //- la funcion para meter los datos del usuario logueado
    //- la funcion para meter el token de usuario logueado
    const divErrores=useRef(null);
    const poppupGoogle=useRef(null);

    const { setDatosCliente, setAccessToken, setRefreshToken } = useStore(); //<--- hook de zustand q devuelve el state global y las funciones q lo modifican
    
    const navigate = useNavigate(); //<--- el hook useNavigate() de react-router devuelve una funcion q permite invocar al modulo enrutamiento con diferentes urls, historico, etc...
    const [enLogin, setEnLogin] = useState(false); // variable del state para determinar si estoy en login/registro <--- se cambia en click ultimo boton form
    const [ formData, setFormData ] = useState( 
        {
            nombre: '',
            email: '',
            password: '',
            repetirPassword: ''
        } 
    )

    useEffect(
        ()=>{ //funcion q se ejecuta cuando cambia alguna variable del array de dependencias, si devuelve algun valor
                //tiene que ser obligatoriamente una funcion(se llama "cleanup function") q se ejecuta cuando la funcion del efecto
                //acaba de ejecutarse
                function handlerMessageFromPopup(evento){
                    console.log('mensaje recibido del popup: ', evento);
                    const { codigo, mensaje,datos } = evento.data;
                    if(codigo==0){
                        //cierro el popup....
                        evento.source.close();
                        
                        //guardo en el state global los datos del cliente y el token de acceso
                        setDatosCliente(datos.cliente);
                        setAccessToken(datos.token);

                        //redirecciono a la pagina principal
                        navigate('/');
                    } else {
                        //cierro el popup....
                        evento.source.close();
                        //deberia limpiar el div-errores antes de mostrar nada, para q no se concatenen mensajes...
                        //muestro el mensaje de error en el div de errores del form
                        divErrores.current.innerHTML= `<div class="alert alert-danger" role="alert">${mensaje}</div>`;
                    }
                }

                window.addEventListener('message', handlerMessageFromPopup); //<--- escucho el mensaje q me manda el popup de google cuando termina de autentificarme
                return ()=>{
                    //esta funcion se ejecutara cuando el componente se desmonte...quito manejador
                    window.removeEventListener('message', handlerMessageFromPopup);
                    //deberia comprobar q si el popup sigue abierto, cerrarlo, para q no quede abierto en segundo plano
                    if(poppupGoogle.current && !poppupGoogle.current.closed){
                        poppupGoogle.current.close();
                    }
                }
            },
        [] //<---- array de variables de dependencias, si esta vacio EL EFECTO SOLO SE EJEUCUTA UNA VEZ AL INICIO DEL COMPONENTE
    )
 
 
 
    /*

       ---- variables del state individuales para mapear cada campo del formulario -----------
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');

    function changeInputs(ev){
        console.log('ahora estas en caja...', ev.target.id);
        console.log('el valor de esa caja es....', ev.target.value);
 
        switch(ev.target.id){
            case "Nombre": setNombre(ev.target.value); break;
            case "Email": setEmail(ev.target.value); break;
            case "Password": setPassword(ev.target.value); break;
            case "Repetir Password": setRepassword(ev.target.value); break;
        }
 
        console.log('valor de variables del state del componente: ', nombre, email, password, repassword);
    }

    */
    const camposFormulario=[
        { id: "nombre", label: "Nombre", type: "text", apareceEnLogin: false },
        { id: "email", label: "Email", type: "email", apareceEnLogin: true },        
        { id: "password", label: "Password", type: "password", apareceEnLogin: true },
        { id: "repetirPassword", label: "Repetir Password", type: "password", apareceEnLogin: false }
    ]

    function changeInputs(ev){
        console.log('ahora estas en caja...', ev.target.id);
        console.log('el valor de esa caja es....', ev.target.value);
        //como en el state tengo un objeto con las props. de cada campo, para modificarlo
        //debo CLONAR el objeto y CAMBIAR aquella propiedad que me interese...

        setFormData( { ...formData, [ev.target.id]: ev.target.value } );
        //  { ...formData } ----------------------> clona objeto q hay en el state
        //  { [ nombre_propiedad ]: valor  } -----> cambio la propiedad que me interesa
        console.log('nuevo valor del state modificado ....', formData)
    }

    async function handlerSubmitForm(){
        try{
            console.log('submit del form, datos del state: ', formData);
            //const _url= enLogin ? 'http://localhost:3000/api/Cliente/login' : 'http://localhost:3000/api/Cliente/Registro';
            const _url = `http://localhost:3000/api/Cliente/${ enLogin ? 'Login' : 'Registro' }`;
            const _petServer=await fetch(_url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const _respServer=await _petServer.json();
            
            console.log('respuesta del server: ', _respServer);
            if(_respServer.codigo !==0) throw new Error(_respServer.mensaje);
            setDatosCliente(_respServer.datos.cliente);
            setAccessToken(_respServer.datos.token);
            navigate('/'); //<--- redirijo a la pagina principal
        } catch (error) {
            console.error('Error al enviar el formulario: ', error);
        }
    }

    async function handlerLoginGoogle(){
        try{
            //lanzo peticion al servidor de nodejs para q me devuelva una url de google con la q poder autentificarme...
            const petServer=await fetch('http://localhost:3000/api/Cliente/LoginGoogle');
            //como respuesta me manda en la prop. datos <--- url a cargar
            const respServer=await petServer.json();
            if(respServer.codigo !==0) throw new Error(respServer.mensaje);

            poppupGoogle.current=window.open(respServer.datos.url,'login with google','width=600,height=600');

        } catch (error) {
            console.error('Error al iniciar sesión con Google: ', error);
        }
    }

    return <div className="container">
                <div className="row">
                    <div className="col-12 d-flex flex-row align-items-center justify-content-center">
                        <img src="/imagenes/logo_pccomponentes.png" alt="logo" className="img-fluid" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}/>
                    </div> 
                </div>

                <div className="row">
                    {/*imagen lateral al lado del form */}
                    <div className="col-6 d-flex flex-row align-items-center justify-content-center">
                        <img src="/imagenes/img_laterlal_loginregistro.png" alt="logo" className="img-fluid"/>
                    </div>

                    {/*formulario login/registro */}
                    <div className="col-6">
                        <div className="container">
                            <div className="row"><div className="col"><h4><strong> { enLogin ? "Iniciar sesión" : "Crear cuenta" }</strong></h4></div></div>
                            
                            {/* ..... div para mostrar mensajes de error del server ..... */}
                            <div className="row" ref={divErrores}></div>



                            <div className="row m-3">
                                <div className="col d-grid gap-1">
                                    <button type="button" 
                                            id="btnlogingmail"  
                                            className="btn btn-light btn-sm"
                                            onClick={ handlerLoginGoogle} >
                                                <img  src="/imagenes/boton_login_GMAIL.png"/>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="row"><div className="col m-4 d-flex flex-row align-items-center justify-content-center"><h6><span> O bien </span></h6></div></div>


                            <div className="row">
                                <div className="col-12">
                                {
                                    camposFormulario.filter( campo => enLogin ? campo.apareceEnLogin : true )
                                                    .map( campo => (
                                                                    <div className="form-floating m-4" key={campo.id}>
                                                                        <input type={campo.type} 
                                                                                id={campo.id} 
                                                                                className="form-control" 
                                                                                placeholder={`${campo.label}*`} 
                                                                                onChange={ changeInputs }/>
                                                                        <label  htmlFor={campo.id}>{campo.label}:</label>
                                                                    </div>
                                                                )
                                    )
                                }
                                {       
                                    ! enLogin &&
                                    <>                           
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                            <label className="form-check-label" for="flexCheckDefault">
                                                He leido y acepto la <a href="">politica de privacidad</a>
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                            <label className="form-check-label" for="flexCheckChecked">
                                                Recibir <strong>descuentos exclusivos</strong>, novedades y tendencias por e-mail. Me puedo dar de baja desde mi panel.
                                            </label>
                                        </div>                                
                                    </>
                                }
                                </div>
                            </div>

                            {/*---------------------------------- */}
                            <div className="row m-4">
                                <div className="col-12 d-flex flex-row align-items-center justify-content-center">
                                        <button className="btn pccomponentes-primary w-100" onClick={ handlerSubmitForm}>
                                            {
                                                ! enLogin ? "Crear cuenta" : "Iniciar Sesion"
                                            }
                                        </button>

                                </div>
                            </div>

                            <hr/>
                            <div className="row m-4">
                                <div className="col-12 d-flex flex-row align-items-center justify-content-center">
                                    <strong>
                                        {
                                            enLogin ? "¿Eres nuevo clilente?" : "Ya tengo una cuenta"
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="row m-4">
                                <div className="col-12 d-flex flex-row align-items-center justify-content-center">
                                        <button className="btn btn-outline-secondary w-100" onClick= { ()=> setEnLogin(!enLogin) }>
                                            {
                                                enLogin ? "Crear cuenta" : "Iniciar Sesion"
                                            }
                                        </button>

                                </div>
                            </div>




                        </div>
                    </div>

                </div>

          </div>
}

export default LoginRegistro;