document.addEventListener('DOMContentLoaded', function() {

const form = document.getElementById('form-signin');

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const correo = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    const response = await fetch('api/login',{
        method: "post",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify({
            correo:correo,
            password:password
        })
    })
    const res = await response.json();
    if(res.status == 200){
        Swal.fire({
            title: '¡Hola!',
            text: 'Te has logeado satisfactoriamente',
            icon: 'success'
        }).then((result) => {
            // Redireccionar después de hacer clic en Aceptar
            if (result.isConfirmed) {
              window.location.href = (res.redirect);
            }
          });
    }else{
        Swal.fire({
            title: '¡Hola!',
            text: 'no pudimos acceder al sitio :/ '+(res.message),
            icon: 'error'
        }).then((result) => {
            // Redireccionar después de hacer clic en Aceptar
            if (result.isConfirmed) {
              window.location.href = '/login';
            }
          });
    }
});

})

