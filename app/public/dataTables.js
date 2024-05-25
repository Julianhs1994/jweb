$(document).ready(function() {
  //->destroy if exists:
  
  //
    $('#tabla-datos').DataTable({
      serverSide: true, // Habilita el modo de procesamiento en el lado del servidor
      "language": {
        "url": "Spanish.json"
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
        "url": "Spanish.json"
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
    $('#tabla-producto').DataTable({
      serverSide: true, // Habilita el modo de procesamiento en el lado del servidor
      "language": {
        "url": "Spanish.json"
      },
      columnDefs: [
        {
          targets:1,
          className: 'descTable'
        },
        {
            targets: 4, // Índice de la columna (empezando por 0)
            className: 'centerTD' , // Ancho deseado para la columna
            id: 'centerTD'

        },
        {
          targets: 6,
          className: 'classEditar',
        },
        {
          targets: 7,
          className: 'classEliminar'
        }
    ],
    //scrollX: true,
      "lengthMenu": [2, 3, 4, 5], // Cambiar opciones de paginación
      /*"lengthMenuCallback": function(settings) {

        const select = $(settings.nTable).find('select[name="tabla-producto_length"]');
        $(select).on('change', function() {
          console.log('Cambiaste la selección');
          // Código a ejecutar cuando se cambia la selección
        });
      }*/
    
      ajax: {
        url: '/api/getAllProduct', // Ruta hacia tu función getAllUsers
        type: 'GET', // Método de solicitud
        data: function (data) {
          // Envía los parámetros necesarios para la paginación
          data.page = data.start / data.length + 1;
          //console.log(data.length)
          //->tamaño de paginacion:
          const div = document.getElementById('table-responsiveProd')
          const tabla = document.getElementById('tabla-producto')
          //->Eliminar/Limpiar clases antes de poner la que se debe: 
          div.classList.remove("prod2")
          tabla.classList.remove('prod2Table')
          div.classList.remove("prod3")
          tabla.classList.remove('prod3Table')
          div.classList.remove("prod4")
          tabla.classList.remove('prod4Table')
          if(data.length == 3){
            div.classList.add("prod2")
            tabla.classList.add('prod2Table')
          }
          if(data.length == 4){
            div.classList.add("prod3")
            tabla.classList.add('prod3Table')
          }
          if(data.length == 5){
            div.classList.add("prod4")
            tabla.classList.add('prod4Table')
          }
        }
      },
      columns: [
       //
        { data: 'Nombre' },
        { data: 'Descripcion' },
        { data: 'Precio' },
        { data: 'Cantidad' },
        /*{ data: 'Imagen' },*/
        {
          data: 'Imagen',
          render: function(data){
            return '<img class="none" id="imgProd" src=" '+data+' ">'
          }
        },
        //{ data: 'IdCategoria' },
        { data: 'NombreCat' },
        {
          data: 'IdProducto',
          
          render: function (data, type, row) {
            return '<button type="submit" class="editarProducto" id="editarProducto" value="' + data + '" data-idproducto="' + data + '">Editar</button>'
          }
        }, 
        {
          data: 'IdProducto',
          render: function (data, type, row) {
            return '<button type="submit" class="eliminarProducto" id="eliminarProducto" value="' + data + '">Eliminar</button>';
          }
        }  
      ]
      //
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

$('#tabla-producto').on('click', '.editarProducto', async function(e) {
  e.preventDefault();
  //
    //if ($('#ModalEditProduct').is(':visible')) {
  const valor = $(this).data('idproducto')
      /*console.log(valor);
      alert(valor)*/
  const response = await fetch("api/getAllProdPost",{
    method: "POST",
    headers:{
      "Content-type":"application/json"
    },
    body:JSON.stringify({
      IdProducto:valor
    })
  });
  const res = await response.json();
  if(res.status == 200){
    let Array = res.array;
    $('#ModalEditProduct').modal('show');
    if ($('#ModalEditProduct').is(':visible')) {
    //->Array:
    const a = Array[0];
    //->Sacar variables del array:
    let Nombre = a.Nombre;
    let Descripcion = a.Descripcion;
    let Precio = a.Precio;
    let Cantidad = a.Cantidad;
    let Imagen = a.Imagen;
    let IdCategoria = a.IdCategoria

    const n = getElementById('NombreEdit')
    n.value = ""+Nombre+"";
    const d = getElementById('DescripcionEdit')
    d.value = ""+Descripcion+"";
    const p = getElementById('PrecioEdit')
    p.value = ""+Precio+"";
    const c = getElementById('CantidadEdit')
    c.value = ""+Cantidad+"";
    const i = getElementById('Imagen_old')
    i.value = ""+Imagen+"";

    const selectElement2 = document.getElementById("IdCategoriaEdit");
    const optionToSelect = selectElement2.querySelector('[value="'+IdCategoria+'"]');
    if (optionToSelect) {
      optionToSelect.selected = true;
    }
    
    //
  }  
  }else{
    const message=res.message;
    alert(message)
  }
})

$('#ModalEditProduct').on('click', '.cerrar-modal', function(e) {
  e.preventDefault();
  $('#ModalEditProduct').modal('hide');
});

$('#ModalEditProduct').on('click', '.close', function(e) {
  e.preventDefault();
  $('#ModalEditProduct').modal('hide');
});

/*const EditarInModal = getElementById('EditarProducto');
if(EditarInModal){
  EditarInModal.addEventListener('click',async () =>{
    alert("yes")
  })
}*/