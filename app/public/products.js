const btn = document.getElementById("addCategory");

if(btn){
    btn.addEventListener("click",async ()=>{
        //alert("test")
        $('#ModalAddCategory').modal('show');
    })
}

$('#ModalAddCategory').on('click', '.cerrar-modal', function(e) {
  e.preventDefault();
  $('#ModalAddCategory').modal('hide');
});

  $('#ModalAddCategory').on('click', '.close', function(e) {
    e.preventDefault();
    $('#ModalAddCategory').modal('hide');
  });

const btn2 = document.getElementById("AgregarCategoria")
if(btn2){
    btn2.addEventListener("click",async ()=>{
        let Nombre = document.getElementById("Nombre").value;
        const response = await fetch("api/addCategory",{
            method: "POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                nombre:Nombre
            })
        });
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

const btn3 = document.getElementById("addProduct");
if(btn3){
  btn3.addEventListener("click",async()=>{
    $('#ModalAddProduct').modal('show');
  })
}

$('#ModalAddProduct').on('click', '.cerrar-modal', function(e) {
  e.preventDefault();
  $('#ModalAddProduct').modal('hide');
});

  $('#ModalAddProduct').on('click', '.close', function(e) {
    e.preventDefault();
    $('#ModalAddProduct').modal('hide');
  });

  document.getElementById('formulario').addEventListener('submit',async (e) => {

    const formData = new FormData(document.getElementById('formulario'));
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/addProduct',
        data: formData,
        processData: false,
        contentType: false
    })
    .done((data) => {
        Swal.fire(data.message);
        $('#ModalAddProduct').modal('hide');
    });
});

//->Response formularioEdit:
document.getElementById('formularioEdit').addEventListener('submit',async (e) => {

  const formDatas = new FormData(document.getElementById('formularioEdit'));
  e.preventDefault();
  $.ajax({
      type: 'POST',
      url: '/editProduct',
      data: formDatas,
      processData: false,
      contentType: false
  })
  .done((data) => {
      Swal.fire(data.message);
      $('#ModalEditProduct').modal('hide');
  });
});
