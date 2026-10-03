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


