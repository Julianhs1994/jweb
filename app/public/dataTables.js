$(document).ready(function() {
  //->destroy if exists:
  
  //
    $('#tabla-datos').DataTable({
      serverSide: true, // Habilita el modo de procesamiento en el lado del servidor
      "language": {
        "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
      columnDefs: [
        {
            targets: 3, // Índice de la columna (empezando por 0)
            width: '200px' // Ancho deseado para la columna
        }
    ],
      "lengthMenu": [2, 3, 4, 5], // Cambiar opciones de paginación
    
      ajax: {
        url: '/api/getAllUsers', // Ruta hacia tu función getAllUsers
        type: 'GET', // Método de solicitud
        data: function (data) {
          // Envía los parámetros necesarios para la paginación
          data.page = data.start / data.length + 1;
        }
      },
      columns: [
       // { data: 'usr_id' },
        { data: 'Nombre' },
        { data: 'Apellido' },
        { data: 'Correo' },
        { data: 'Direccion'},
        { data: 'Celular'},
        { 
          data: 'NombreEstado',
          
        },
        { data: 'NombreRol'},
        {
          data: 'IdUsuario',
          
          render: function (data, type, row) {
            return '<button type="submit" class="editar" id="editar" data-toggle="modal" data-target="#myModal" data-id="" value="' + data + '">Editar</button>'
          }
        }, 
        {
          data: 'IdUsuario',
          render: function (data, type, row) {
            return '<button type="submit" class="eliminar" id="EliminarUsuario" value="' + data + '">Eliminar</button>';
          }
        }  
      ]
    });
    $('#tabla-categoria').DataTable({
      serverSide: true, // Habilita el modo de procesamiento en el lado del servidor
      "language": {
        "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
      columnDefs: [
        {
            targets: 0, // Índice de la columna (empezando por 0)
            width: '200px', // Ancho deseado para la columna
            targets: 1,
            width: '200px'
        }
    ],
      "lengthMenu": [2, 3, 4, 5], // Cambiar opciones de paginación
    
      ajax: {
        url: '/api/getAllCategoryData', // Ruta hacia tu función getAllUsers
        type: 'GET', // Método de solicitud
        data: function (data) {
          // Envía los parámetros necesarios para la paginación
          data.page = data.start / data.length + 1;
        }
      },
      columns: [
       // { data: 'usr_id' },
        { data: 'Nombre' },
        /*{
          data: 'IdCategoria',
          
          render: function (data, type, row) {
            return '<button type="submit" class="editarCategoria" id="editarCategoria" value="' + data + '">Editar</button>'
          }
        }, */
        {
          data: 'IdCategoria',
          render: function (data, type, row) {
            return '<button type="submit" class="eliminarCategoria" id="EliminarCategoria value="' + data + '">Eliminar</button>';
          }
        }  
      ]
    });
  });

  //->Modal users:

  function getElementById(id) {
    return document.getElementById(id);
  }  

  $('#tabla-datos').on('click', '.editar', async function(e) {
    e.preventDefault();
    //console.log("Hola mundop");
    $('#myModal').modal('show');
      if ($('#myModal').is(':visible')) {
        // Obtener el valor del botón clickeado
        let valorBoton = $(this).val();
        //console.log("DATAVALUE:"+valorBoton)
        //console.log('El modal está abierto');
        const response = await fetch('api/getDataModalEditUser',{
          method: "POST",
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({
            IdUsuario:valorBoton
          })
        })
        const res = await response.json();
        if(res.status == 200){
          let inputs = ["Nombre", "Apellido", "Correo", "Direccion", "Celular", "IdEstadoUsuario", "IdRol","IdUsuario"];
          let array = res.arr;
          let A = array[0];
          //console.log(A)
          //let Nombre = A.Nombre;
          let varia ;
          for(let i=0;i<(inputs.length);i++){
            //console.log(A[inputs[i]])//nombre
            //->Obtener el elemento por su id definidos en el array inputs
            console.log(inputs[i])
            const selectElement = document.getElementById("IdEstadoUsuario");
            if(inputs[i]=="IdEstadoUsuario"){
              const optionToSelect = selectElement.querySelector('[value="'+A[inputs[i]]+'"]');
              //console.log("Desa")
              if (optionToSelect) {
                optionToSelect.selected = true;
              }              
            }
            const selectElement2 = document.getElementById("IdRol");
            if(inputs[i]=="IdRol"){
              const optionToSelect2 = selectElement2.querySelector('[value="'+A[inputs[i]]+'"]');
              //console.log("D
              if (optionToSelect2) {
                optionToSelect2.selected = true;
              }              
            }
            varia = getElementById(inputs[i]);
            //console.log(i+" "+varia)
            //->A[inputs[i] obtiene el valor del array en i y como ya encontramos el elemento en la variable "varia" lo introduce inmediatamente
            varia.value = ""+(A[inputs[i]])+"";
          }
          
        }
      } 
  })


  $('#myModal').on('click', '.cerrar-modal', function(e) {
    e.preventDefault();
    $('#myModal').modal('hide');
  });

  $('#myModal').on('click', '.close', function(e) {
    e.preventDefault();
    $('#myModal').modal('hide');
  });

  /*const DeleteUser = document.getElementById('EliminarUsuario')
  if (DeleteUser){
  DeleteUser.addEventListener('click',async function() {
    const IdUsuario = document.getElementById("IdUsuario").value;
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("api/DeleteUser",{
          method:"POST",
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({
            IdUsuario:IdUsuario
          })
        })
        const res = await response.json();
        let icono = '';
        if(res.status==200){
          icono = 'success'
        }else if(res.status==400){
          icono= 'warning'
        }else{
          icono = 'question'
        }
        Swal.fire({
          title: '¡Hola!',
          text: res.message,
          icon: icono
        })
        
      }
    })   
  });
}*/

//->Eliminar USUARIO "onClick":
$('#tabla-datos').on('click', '.eliminar', async function() {
  const btnEliminar = document.querySelectorAll('.eliminar'); 
  btnEliminar.forEach(btn => {     
    // Obtener el valor del botón clickeado
    let valorBoton = $(this).val();
    btn.addEventListener('click',async function () {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const IdUsuario = valorBoton;
          const response = await fetch("api/DeleteUser",{
            method:"POST",
            headers:{
              "Content-type":"application/json"
            },
            body:JSON.stringify({
              IdUsuario:IdUsuario
            })
          })
          const res = await response.json();
          let icono = '';
          if(res.status==200){
            icono = 'success'
          }else if(res.status==400){
            icono= 'warning'
          }else{
            icono = 'question'
          }
          Swal.fire({
            title: '¡Hola!',
            text: res.message,
            icon: icono
          })
          window.location.href = (res.redirect)
          
        }
      })   
    });
  })
})  


//->DataTables Productos:

