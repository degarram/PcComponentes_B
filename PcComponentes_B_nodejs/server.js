//#region ---------------- MODULO PRINCIPAL DE ENTRADA DE LA APP. DE NODE.JS---------------------------------
/*
    express funciona mediante la secuenciacion de una seria de modulos middleware (en realidad son funciones js) que
    se ejecutan en orden, uno tras otro:
                                    |----------------pipeline de express-----------------------------------------------------...
    peticion del cliente REACT ----> funcion middle-1(req, res, next) ---next()---> funcion middle-2(req, res, next) --next()---> funcion middle-3(req, res, next) -----> ... -----> funcion middle-n(req, res, next)
                                        ||                                                      ||
                                    en parametro "req" objeto HTTP-REQUEST              en parametro "req" objeto HTTP-REQUEST                                                         !!OJO!! la ultima funcion middle-n
                                    del cliente                                         de funcion middle-1 o el original si no lo ha tocado                                    debe generar respuesta al cliente usando
                                    en parametro "res" objeto HTTP-RESPONSE             en parametro "res" objeto HTTP-RESPONSE                                                 su parametro "res"
                    <-----------------------------|                                                 |
                    <-------------------------------------------------------------------------------|

    para configurar el pipeline de express se emplean metodos de la clase Application de express:
        .use( ['/ruta'], function(req, res, next){ ...... } )) ----> el metodo .use() registra una funcion middleware que
                            se ejecutara cuando la ruta de la peticion del cliente coincida con la ruta indicada en el primer argumento
                            si no se pone ruta, la funcion middleware se ejecutara para cualquier ruta de peticion del cliente

        .get( ['/ruta'], function(req, res, next){ ...... } )) 
        .post( ['/ruta'], function(req, res, next){ ...... } )) 
        ...

    REGLA CONFIG PIPELINE EXPRESS:
    ------------------------------
     - poner las funciones middleware que se ejecutan para cualquier ruta al principio de la pipeline
      (pq suelen servir para añadir variables al objeto "req" o comprobar cabeceras de la pet.cliente,etc) No generan respuesta.
    
    - poner las funciones middleware que se ejecutan para rutas concretas al final de la pipeline, especificando el metodo HTTP
    por el que se accede a la ruta (get, post, put, delete, etc). Estas funciones middleware suelen generar respuesta al cliente.


*/      
//#endregion ------------------------------------------------------------------------------------------------
require('dotenv').config(); //<---- lee el fichero .env y crea variables de entorno, accesible mediante objeto "process.env",
                            // por ejemplo process.env.MONGODB_URL

const mongodb=require('mongodb'); //<--- el modulo mongodb exporta un objeto que contiene la clase MongoClient y otras clases y funciones
const express=require('express'); 
const cookieParser=require('cookie-parser');  //<--- el modulo cookie-parser exporta una funcion q al ejecutarse devuelve una funcion
                                              //middleware q extrae de la cabecera HTTP-REQUEST del cliente las cookies y las pone en
                                              // el objeto "req" en propiedad .cookies" en forma de objeto javascript
                                              
const cors=require('cors'); //<--- el modulo cors exporta una funcion q al ejecutarse devuelve una funcion
                           //middleware q añade cabeceras HTTP-RESPONSE a la respuesta del servidor web para permitir
                           //que el cliente REACT pueda hacer peticiones HTTP al servidor web express aunque este
                           //se encuentre en un dominio distinto al del cliente REACT

const bcrypt=require('bcrypt'); //<--- el modulo bcrypt exporta un objeto que contiene funciones para generar hash de passwords y comprobarlos
const jsonwebtoken=require('jsonwebtoken'); //<--- el modulo jsonwebtoken exporta un objeto que contiene funciones para generar y comprobar tokens JWT

const webServer=express(); //<--- de la ejecucion de la funcion express() se obtiene un objeto que representa el servidor web
                           // es un objeto Application de express: https://expressjs.com/en/5x/api/application/

const mongoCliente=new mongodb.MongoClient(process.env.MONGODB_URL); //<--- cliente para conectarnos a mongodb

//---------------------- CONFIG PIPELINE EXPRESS -----------------------------

webServer.use(cookieParser()); //<--- 1º funcion middleware de la PIPELINE    
webServer.use(express.json()); //<--- 2º funcion middleware de la PIPELINE, mete en el objeto "req" una propiedad ".body" con el
                               // contenido del body de la peticion HTTP-REQUEST del cliente, si es JSON    
webServer.use(express.urlencoded({extended:true})); //<--- 3º funcion middleware de la PIPELINE, mete en el objeto "req" una 
                                                            //propiedad ".query" con el valor de los parametros de la query string 
                                                            // de la peticion HTTP-REQUEST del cliente, si es URL-encoded
webServer.use(cors()); //<--- 4º funcion middleware de la PIPELINE habilita CORS

// webServer.use( 
//                 function(req, res,next){ 
//                     console.log('Peticion recibida: ', req.method, req.url);
//                     //res.status(200).send('Hola cliente de React....bienvenido a nuestro servidor express')
//                     next();
//                 } 
//             );

webServer.post(
    '/api/Cliente/Registro',
    async function(req,res,next){
        try{
            const { nombre, email, password }=req.body;
            console.log('datos recibidos desde cliente react...', nombre, email, password);

            //1º paso: conectarse a la base de datos mongodb usando el cliente mongoCliente
            await mongoCliente.connect(); 
            
            //2º paso: en req.body recibo { nombre:'...', email:'...', password:'....'} comprobamos q no existe una cuenta ya
            //   con ese email en la coleccion 'clientes' de la bd, si existe ---> enviar respuesta de error
            const _cliente=await mongoCliente.db(process.env.MONGODB_DBNAME)
                                            .collection('clientes')
                                            .findOne({ 'cuenta.email': email});
            if( _cliente ) throw new Error(`Ya existe una cuenta con el email ${email}`);

            //3º paso: si no existe, generamos hash de la password usando bcrypt.hashSync() 
            //  y creamos un objeto cliente y lo insertamos en coleccion 'clientes' de la bd
            const _resInsert=await mongoCliente.db(process.env.MONGODB_DBNAME)
                                                .collection('clientes')
                                                .insertOne(
                                                    {
                                                        nombre: nombre,
                                                        apellidos:'',
                                                        cuenta:{
                                                            email: email,
                                                            password: bcrypt.hashSync(password, 10), //<--- generamos hash de la password con 10 bytes extra de "sal"
                                                            activada: false,
                                                            telefono:''
                                                        },
                                                        direcciones:[],
                                                        listasFavoritos:[],
                                                        opiniones:[]
                                                    }
                                                );
            console.log('resultado de la insercion en coleccion clientes: ', _resInsert);
            //4º paso: generamos JWT de un solo uso para q el cliente active la cuenta, se manda por email al cliente
            //#region ---------------- envio de email usando mailjet API --------------------------------
            /*
                envio de email: https://dev.mailjet.com/openapi/openapi-mailjet/send-emails/postsendv3
                - hay q mandar en cabecera Authorization: Basic <base64(public_key:private_key)>
                - en el body del POST de la peticion hay q mandar un objeto JSON con el formato que especifica la API
                    {
                    "FromEmail":"pilot@mailjet.com", <---- pmr.aiki@gmail.com (poner el usuario registrado en mailjet)
                    "FromName":"Your Mailjet Pilot", <---- Admin PcComponentes (poner el nombre de la cuenta registrada en mailjet)
                    "Recipients":[
                        {
                        "Email":"passenger@mailjet.com", <--- email del cliente q hemos registrado en la coleccion clientes de la bd
                        "Name":"Passenger 1" <--------------- nombre del cliente
                        }
                    ],
                    "Subject":"Your email flight plan!", <----mensaje de bienvenida al portal, y activacion de cuenta
                    "Text-part":"Dear passenger, welcome to Mailjet! May the delivery force be with you!", <-----------------  no lo rellenamos
                    "Html-part":"<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!" <---- logo de la tienda, con link con JWT para activar la cuenta
                    }          
            */
            //#endregion --------------------------------------------------------------------------------

            const _codBase64ClavesMailjet=Buffer.from(`${process.env.MAILJET_PUBLIC_KEY}:${process.env.MAILJET_PRIVATE_KEY}`)
                                                .toString('base64');
            
            const _tokenActivacion=jsonwebtoken.sign(
                {
                    email: _cliente.cuenta.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '10min'
                }
            );

            const _bodyMail={
                "FromEmail":"dgarram@outlook.com",
                "FromName":"Admin PcComponentes",
                "Recipients":[
                    {
                        "Email":_cliente.cuenta.email,
                        "Name":_cliente.datos.nombre
                    }
                ],
                "Subject":"Bienvenido a PcComponentes",
                "Html-part":`
                    <div>
                        <h1>Bienvenido a PcComponentes</h1>
                        <p>Gracias por registrarte en nuestra tienda.</p>
                    </div>
                    <div>
                        <p> Gracias por registrarte en PcComponentes. Tu cuenta ha sido creada correctamente.</p>
                        <p> Para finalizar el proceso de registro, debes ACTIVAR TU CUENTA. Para ello, haz click en el siuiente</p>
                        <p> enlace: 
                            <a href="http://localhost:3000/api/Cliente/ActivarCuenta?token=${_tokenActivacion}&email=${_cliente.cuenta.email}&idCliente=${_cliente._id}">
                                Activar Cuenta
                            </a>
                        </p>
                    </div>
                `
            }

            const peticionMailjet=await fetch(
                'https://api.mailjet.com/v3/send',
                {
                    method:'POST',
                    headers:{
                        'Authorization': `Basic ${_codBase64ClavesMailjet}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_bodyMail)
                }
            );
            console.log('resultado de la peticion a mailjet: ', peticionMailjet);

            if( peticionMailjet.status !== 201 ) throw new Error(`Error al enviar email de activacion de cuenta, status: ${peticionMailjet.status}`);




            //5º paso: generar respuesta al cliente para q revise su bandeja de entrada
            res.status(200).send({ codigo:0, mensaje:'Registro ok, consulta bandeja de entrada de tu email para activar la cuenta' });
        }catch(error){
            console.log('Error al procesar la peticion POST /api/Cliente/Registro: ', error);
            res.status(200).send( { codigo: 1, mensaje: `Error al procesar la peticion de registro: ${error.message}` } );             
        }
    } 
)


webServer.post(
    '/api/Cliente/Login',
    async function(req,res,next){
        try{
            //el cliente de REACT envia en el body un objeto { email: '....', password: '....'}, el middleware express.json() global
            //lo ha metido en req.body
            const { email, password }=req.body;
            console.log('datos recibidos desde cliente react...', email, password);
            
            //1º paso: contecarse a la bd usando el cliente mongoCliente
            await mongoCliente.connect();

            //2º paso: buscar en la coleccion 'clientes' un documento q tenga ese email, SI NO EXISTE ---> enviar respuesta de error            
            const _cliente=await mongoCliente.db(process.env.MONGODB_DBNAME)
                                            .collection('clientes')
                                            .findOne({ 'cuenta.email': email});
            if( ! _cliente ) throw new Error(`No existe ninguna cuenta con el email ${email}`);
            
            console.log('cliente encontrado en bd: ', _cliente);


            //3º paso: si existe la cuenta, comprobamos la password sacando su hash y comprobandolo con el existente en la bd
            //         usando la funcion bcrypt.compareSync(), SI NO COINCIDEN ----> enviar respuesta de error de password incorrecta
            if (! bcrypt.compareSync(password, _cliente.cuenta.password)) throw new Error('password incorrecta...');
                                
            //4º paso: genero estado de sesion para el cliente logueado, formas posibles:
            // - cookies (estableces en cabecera http-response una cabecera Set-Cookie con valor las variables q quieras almacenar,
            //          p.e el email, _id del cliente en coleccion clientes, ...) <--- cuando la vuelva a mandar el cliente de vuelta,
            //         el middleware cookie-parser lo pondra en req.cookies en formato de objeto javascript
            // - token JWT (json-web-token) string hasheado y firmado con una clave secreta en el servidor <---- usando el modulo
            //         jsonwebtoken.sign() y se devolvera al cliente en la respuesta para q lo almacene. Se tiene q encargar de mandarlo
            //         cuando requiera acciones especiales en el servidor
            // - usando servidores externos meidante OAuth2.0 (google, facebook,...)
            const _token=jsonwebtoken.sign(
                {
                    email: _cliente.cuenta.email,
                    _id: _cliente._id
                },
                process.env.JWT_SECRET,
                { issuer: 'PcComponentes-NODESERVER', expiresIn:'30min'}
            );
            console.log('token generado para el cliente logueado: ', _token);
            
            
            
            //5º paso: generar respuesta al cliente mandando JWT y datos del cliente q nos interesen para q los muestre en la app
            res.status(200)
                .send( 
                        { 
                            codigo: 0, 
                            mensaje:'login correcot', 
                            token:_token, 
                            datosCliente: _cliente
                        }
                );

        } catch(error){
            console.log('Error al procesar la peticion POST /api/Cliente/Login: ', error);
            res.status(200).send( { codigo: 1, mensaje: `Error al procesar la peticion de login: ${error.message}` } )
        }
    }
)

webServer.get(
    '/api/Cliente/ActivarCuenta',
    async function(req,res,next){
        try{
            //en la url del mail de activacion, en la querystring:  ? token=... & email=.... & idCliente=....
            //el middleware express.urlencoded() global ha metido en req.query un objeto javascript con esas propiedades:
            const { token, email, idCliente }=req.query;
            
            //1º paso: comprobar q el token JWT recibido es correcto y no ha caducado, usando jsonwebtoken.verify()
            //2º paso: modificar en coleccion "clientes" de la bd, el documento con _id y email recuperados y cambiar
            //         la propiedad cuenta.activada a true
            //3º paso: generar respuesta al cliente de activacion de cuenta correcta si todo ha ido bien


        } catch(error){
            console.log('Error al procesar la peticion GET /api/Cliente/ActivarCuenta: ', error);
            res.status(200).send( { codigo: 1, mensaje: `Error al procesar la peticion de activacion de cuenta: ${error.message}` } )
        }
    }
)

webServer.get(
               '/api/Tienda/Categorias', 
                async function(req, res, next){
                    try{
                        //1º paso: conectarse a la base de datos mongodb usando el cliente mongoCliente
                        let resultConexion=await mongoCliente.connect();
                        console.log('Conexion a mongodb realizada correctamente: ', resultConexion);
                        //2º paso: obtener de la coleccion 'categorias' los documentos/objetos categoria que me pida el cliente 
                        //3º paso: enviar al cliente la respuesta HTTP-RESPONSE con el array de categorias en formato JSON
                    
                    }catch(error){
                        console.log('Error al procesar la peticion GET /api/Tienda/Categorias: ', error);
                        res.status(200).send( { codigoOperacion: 1, mensaje: `Error al obtener las categorias: ${error.message}` } )
                    }

                }
)
                

//para ponerlo en funcionamiento, debemos invocar al metodo .listen() de la clase Application
//-1º argumento: el puerto a abrir para los clientes y poder aceptar peticiones HTTP
//-2º argumento: una funcion callback que se ejecuta cuando el servidor web ha sido iniciado y esta escuchando peticiones
webServer.listen(
    3000,
    error => {
        if(error){
            console.log('Error al iniciar el servidor web express: ', error);
        } else {
            console.log('---- Servidor web express iniciado correctamente, escuchando peticiones en el puerto 3000 --- ')
        }
    }
);


