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


*/
//#endregion ------------------------------------------------------------------------------------------------
const express = require('express');
const webServer = express(); //<--- de la ejecucion de la funcion express() se obtiene un objeto que representa el servidor web
// es un objeto Application de express: https://expressjs.com/en/5x/api/application/

webServer.use(cookieParser()); //middleware para parsear cookies de la peticion del cliente
webServer.use(express.json()); //middleware para parsear el body de la peticion del cliente en formato JSON
webServer.use(express.urlencoded({ extended: true })); //middleware para parsear el body de la peticion del cliente en formato URL-encoded
webServer.use(cors()); //middleware para permitir peticiones CORS desde cualquier origen

webServer.use(
    function (req, res, next) {
        console.log('Peticion recibida: ', req.method, req.url);
        res.status(200).send('Hola cliente de React....bienvenido a nuestro servidor express')
        next(); //si no se invoca a next(), el pipeline de express se corta y no se ejecutan los siguientes middlewares
    }
);

webServer.get(
    '/api/Tienda/Categorias',
    function (req, res, next) {
        console.log('Peticion recibida: ', req.method, req.url);
        res.status(200).send('Hola cliente de React....bienvenido a nuestro servidor express, estas en la ruta /api/Tienda/Categorias');
        next(); //si no se invoca a next(), el pipeline de express se corta y no se ejecutan los siguientes middlewares
    }
);

//para ponerlo en funcionamiento, debemos invocar al metodo .listen() de la clase Application
//-1º argumento: el puerto a abrir para los clientes y poder aceptar peticiones HTTP
//-2º argumento: una funcion callback que se ejecuta cuando el servidor web ha sido iniciado y esta escuchando peticiones
webServer.listen(
    3000,
    error => {
        if (error) {
            console.log('Error al iniciar el servidor web express: ', error);
        } else {
            console.log('---- Servidor web express iniciado correctamente, escuchando peticiones en el puerto 3000 --- ')
        }
    }
);