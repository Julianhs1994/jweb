document.addEventListener('DOMContentLoaded', function() {
const loba = document.getElementById('login');
if (loba){
    loba.addEventListener('click',async()=>{
        window.location.href = '/login';
    })
}

const reg = document.getElementById('register')
if(reg){
reg.addEventListener('click',async()=>{
    window.location.href = '/register';
})
}

const log = document.getElementById('logOut')
if(log){
log.addEventListener('click',async()=>{
    //console.log("logOut-js")
    //document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    const respuesta = await fetch("api/logOut",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
    })
    const res = await respuesta.json();
    if(res.status == 201){
        document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = res.redirect;
    }
})
}
})

//->Funcion para el boton hamburguesa:

$(document).ready(function() {
    // Selector del botón de menú
    const toggleButton = $('.navbar-toggler');
    // Selector del menú de navegación
    const navbarNav = $('.navbar-collapse');
  
    // Función que se ejecuta cuando se hace clic en el botón de menú
    toggleButton.click(function() {
      // Si el menú está oculto, muéstralo
      if (navbarNav.hasClass('show')) {
        navbarNav.removeClass('show').addClass('collapse navbar-collapse');
      } else {
        // De lo contrario, oculta el menú
        navbarNav.removeClass('collapse').addClass('show');
      }
      //
      //if(navbarNav.hasClass('navbar-collapse')){

      //}

    });
  });