import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router'

// import App from './App.jsx'
import LoginRegistro from './componentes/zonaCliente/LoginRegistro/LoginRegistro.jsx'
import Layout from './componentes/zonaTienda/Layout/Layout.jsx'
import Home from './componentes/zonaTienda/Home/Home.jsx'
import ProductosCat from './componentes/zonaTienda/Productos/ProductosCat.jsx'
//#region ------ configuracion modulo enrutamiento REACT-ROUTER-DOM ------
//1º configuramos el array de objetos Route q necesita el modulo de enrutamiento
//cada objeto Route define 'path' o ruta a interceptar y 'element'/'Component' componente a renderizar
//estos objetos se definen usando funcion createBrowserRouter() 

const routerObjects=createBrowserRouter(
  [
    {  
      element: <Layout/> ,
      children:[
        { path:'/' , element: <Home/> },
        //{ path: 'Productos/Categoria/:categoria', element: <ProductosCat/> }, <----- segmentos variables para usar hook useParams()
        { path: 'Productos/Categoria', element: <ProductosCat/> },
      ]
    },
    { path:'Cliente',
      children:[
                { path: 'LoginRegistro', element: <LoginRegistro/> },
            ]
        }
  ]
)

//2º hacemos q el array de objetos Route q define el modulo de enrutamiento sea usado por el componente RouterProvider 
// q es el q se encarga de interceptar el cambio de url en el navegador y renderizar los componentes asociados a cada ruta
// <RouterProvider router={routerObjects} />

//#endregion


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routerObjects} />
  </StrictMode>,
)