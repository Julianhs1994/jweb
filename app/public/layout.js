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
  const toggleButton1 = $('#navbarToggler1');
  const navbarNav1 = $('.navbar-collapse');

  toggleButton1.click(function() {
      if (navbarNav1.hasClass('show')) {
          navbarNav1.removeClass('show').addClass('collapse navbar-collapse');
      } else {
          navbarNav1.removeClass('collapse').addClass('show');
      }
  });
})  

/*  $(document).ready(function() {
    const toggleButton = $('#navbarToggler2');
    const navbarNav = $('.sidebar-sticky');
  
    toggleButton.click(function() {
        if (navbarNav.hasClass('sidebar-sticky-show')) {
            navbarNav.removeClass('sidebar-sticky-show').addClass('sidebar-sticky-collapse');
        } else {
            navbarNav.removeClass('sidebar-sticky-collapse').addClass('sidebar-sticky-show');
        }
    });
  });
})*/ 

$(document).ready(function() {
    const toggleButton = $('#navbarToggler2');
    const navbarNav = $('.sidebar-sticky');
    const row = $('#rowDesplegable'); // Reemplaza 'yourRowId' por el ID del div "row"
  
    toggleButton.click(function() {
      if (navbarNav.hasClass('sidebar-sticky-show')) {
        navbarNav.removeClass('sidebar-sticky-show').addClass('sidebar-sticky-collapse');
        row.hide(); // Oculta el div "row"
      } else {
        navbarNav.removeClass('sidebar-sticky-collapse').addClass('sidebar-sticky-show');
        row.show(); // Muestra el div "row"
      }
    });
  
    $(window).resize(function() {
      if ($(window).width() >= 768) {
        navbarNav.removeClass('sidebar-sticky-collapse').addClass('sidebar-sticky-show');
        row.show(); // Muestra el div "row"
      } else {
        navbarNav.removeClass('sidebar-sticky-show').addClass('sidebar-sticky-collapse');
        row.hide(); // Oculta el div "row"
      }
    });
  
    // Evento para mostrar el div "row" al hacer click en el botón desplegable
    row.click(function() {
      if ($(this).is(":hidden")) { // Verifica si el div "row" está oculto
        navbarNav.removeClass('sidebar-sticky-collapse').addClass('sidebar-sticky-show');
        row.show(); // Muestra el div "row"
      } else {
        // No hace nada, ya que el div "row" ya está visible
      }
    });
  });