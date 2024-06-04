
const reg = document.getElementById('register-form');

reg.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('Name').value;
  const lastname = document.getElementById('Lastname').value;
  const address = document.getElementById('Direction').value;
  const email = document.getElementById('Email').value;
  const phonenumber = document.getElementById('Phonenumber').value;
  const password = document.getElementById('Password').value;
  const repeatpassword = document.getElementById('Repeatpassword').value;

  if(name == '' || lastname == '' || address == '' || email == '' || phonenumber == '' || password == '' || repeatpassword == ''){
    Swal.fire({
      title: '¡Hola!',
      text: 'Ningun campo debe estar vacio',
      icon: 'error'
  });
  return
  }

  if(password != repeatpassword){
    Swal.fire({
      title: '¡Hola!',
      text: 'La contraseña no coincide con el campo de repetir',
      icon: 'error'
  });
  return
  }

  const respuesta = await fetch(
    "api/register",
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        lastname:lastname,
        address:address,
        email:email,
        phonenumber:phonenumber,
        password:password
      }),
    }
  );
  //->convertir respuesta a json:
  const res = await respuesta.json();
  if(res.status == 200){
    Swal.fire({
      title: '¡Hola!',
      text: 'La cuenta se ha creado de forma satisfactoria',
      icon: 'success'
  }).then((result) => {
    // Redireccionar después de hacer clic en Aceptar
    if (result.isConfirmed) {
      window.location.href = '/login';
    }
  });
  }else if(res.status == 400){
    Swal.fire({
      title: '¡Hola!',
      text: res.message,
      icon: 'info'
  }).then((result) => {
    // Redireccionar después de hacer clic en Aceptar
    if (result.isConfirmed) {
      window.location.href = '/login';
    }
  });
  }else{
    Swal.fire({
      title: '¡Hola!',
      text: 'Fallo en la creacion de cuenta ,'+res.message,
      icon: 'error'
    }).then((result) => {
    // Redireccionar después de hacer clic en Aceptar
      if (result.isConfirmed) {
        window.location.href = '/register';
      }
    });
  }
});