let EditUser = document.getElementById("EditarUsuario")
  if(EditUser){
   
    EditUser.addEventListener("click",async()=>{
    //
    const nombre = document.getElementById("Nombre").value;
    const apellido = document.getElementById("Apellido").value;
    const correo = document.getElementById("Correo").value;
    const direccion = document.getElementById("Direccion").value;
    const celular = document.getElementById("Celular").value;
    const estado = document.getElementById("IdEstadoUsuario").value;
    const rol = document.getElementById("IdRol").value;
    //
    //console.log("name:"+nombre)
    const IdUsuario = document.getElementById("IdUsuario").value
      const response = await fetch("api/EditUser",{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({
          Nombre:nombre,
          Apellido:apellido,
          Correo:correo,
          Direccion:direccion,
          Celular:celular,
          IdEstadoUsuario:estado,
          IdRol:rol,
          IdUsuario:IdUsuario
        })
      })
      const res = await response.json();
      if(res.status==200){
        Swal.fire({
          title: '¡Hola!',
          text: res.message,
          icon: 'success'
      }).then((result) => {
          // Redireccionar después de hacer clic en Aceptar
          if (result.isConfirmed) {
            window.location.href = (res.redirect);
          }
        });
      }else{
        alert(res.message);
        window.location.href = (res.redirect);
      }
      
    })
  } 