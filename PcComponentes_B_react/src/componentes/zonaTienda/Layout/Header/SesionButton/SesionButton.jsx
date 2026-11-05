


function SesionButton({funcNav:navigate, email, icono}) {

    return (
            <button className="btn btn-light btn-sm" onClick={ ()=> navigate('/Cliente/LoginRegistro')}>
                <i className="fa-regular fa-user"></i> Mi Cuenta
            </button>
    )
}

export default SesionButton