import express from "express";
import dotenv from "dotenv";
dotenv.config();
//->Direname-Config:
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//->Ejs:
import expressEjsLayouts from "express-ejs-layouts";
//->imports methods of module functions:
import { methods as authentication } from "./controllers/authentication.controller.js";
import { methods as authorization } from "./middlewares/authorization.js";
import { methods as users } from "./controllers/users.controller.js";
import { methods as EstadoUsuario } from "./controllers/EstadoUsuario.controller.js";
import { methods as Roles} from "./controllers/Rol.controller.js";
import { methods as Category } from "./controllers/Category.controller.js";
import { methods as Product } from "./controllers/Product.controller.js";

//->imports sessions:
import session from "express-session";
import {MySQLSessionStore} from 'serverless-mysql-session-store';

const mysqlConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
};

//->imports multer:
import multer from "multer";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'app/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

//->fs:
//import { promises as fs } from "fs";
import * as fs from "fs";
/*import {stat} from "fs/promises"*/

//->Server:
const app = express();
const portNumber = 3000;
app.set('port',portNumber);
app.listen(app.get('port'));
console.log("Servidor escuchando en elpuerto: "+app.get('port'));
//->¡MANEJADOR JSON!:
app.use(express.json());
//->Ejs app config:
app.use(expressEjsLayouts);
/*buscar las views en: */ 
app.set("views",[path.join(__dirname,"pages")/*,path.join(....)*/]);
app.set("view engine","ejs");
//->CookieParser(captur-cookies):
import cookieParser from "cookie-parser";
app.use(cookieParser());

//->Static configuration Folders/Files:
app.use(express.static(__dirname + "/pages/img"));
app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/pages/css"));
app.use(express.static(__dirname + "/uploads"));

//->FileName:
const fileName = 'index.js|';

//->Config sessions:

/*export*/ const store = new MySQLSessionStore(mysqlConfig);

app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: false,
  store: store,
}));

//->Rutas:

app.get("/",authorization.soloMain,async (req,res)=>{
	const IsLoggedIn = req.session.Logeado ? true : false;
	const Rol = req.session.Rol || "Invitado";
  //const id = req.session.IdSession; 
  const AdminLayout = false; 
  const Categorias = await Category.getAllCategory(req,res);
  res.render("home",{IsLoggedIn,Rol,AdminLayout,Categorias})
})

app.get("/login",authorization.soloPublico,async (req,res)=>{
	const IsLoggedIn = req.session.Logeado ? true : false;
	const Rol = req.session.Rol || "Invitado";
  const AdminLayout = false;
  const Categorias = await Category.getAllCategory(req,res);
    res.render('login',{IsLoggedIn,Rol,AdminLayout,Categorias})
})

app.get("/register",async(req,res)=>{
  const IsLoggedIn = req.session.Logeado ? true : false;
	const Rol = req.session.Rol || "Invitado";
  const AdminLayout = false;
  const Categorias = await Category.getAllCategory(req,res);
    res.render("register",{IsLoggedIn,Rol,AdminLayout,Categorias})
})

app.get("/admin",async(req,res)=>{
  const IsLoggedIn = req.session.Logeado ? true : false;
	const Rol = req.session.Rol || "Invitado";
  const AdminLayout = true; 
  const Categorias = await Category.getAllCategory(req,res);
  res.render("admin",{IsLoggedIn,Rol,AdminLayout,Categorias})
})

app.get("/admin-users",async (req,res)=>{
  const IsLoggedIn = req.session.Logeado ? true : false;
  const Rol = req.session.Rol || "Invitado";
  const AdminLayout = true;
  const arrayEstado = await EstadoUsuario.getAllEstadoUsuario();
  const arrayRol = await Roles.getAllRol();
  const Categorias = await Category.getAllCategory(req,res);
  res.render("users",{IsLoggedIn,Rol,AdminLayout,arrayEstado,arrayRol,Categorias})
})

app.get("/admin-products",async (req,res) =>{
  const IsLoggedIn = req.session.Logeado ? true : false;
  const Rol = req.session.Rol || "Invitado";
  const AdminLayout = true;
  const arrayEstado = await EstadoUsuario.getAllEstadoUsuario();
  const arrayRol = await Roles.getAllRol();
  const Categorias = await Category.getAllCategory(req,res);
  res.render("products",{IsLoggedIn,Rol,AdminLayout,arrayEstado,arrayRol,Categorias})
})

//->Rutas get con Funcion + retorno:
//~agrega / antes de api...

app.get("/api/getAllEstadoUsuario", EstadoUsuario.getAllEstadoUsuario)
app.get("/api/getAllUsers", users.getAllUsers)
app.get("/api/getAllCategoryData", Category.getAllCategoryData)
app.get("/api/getAllProduct", Product.getAllProduct)

//->Rutas con post:
//~agrega / antes de api...

app.post("/api/getNameEstado", EstadoUsuario.getNameEstado)
app.post("/api/register",authentication.register)
app.post("/api/login", authentication.login)
app.post("/api/getDataModalEditUser", users.getDataModalEditUser)
app.post("/api/EditUser", users.editUser)
app.post("/api/DeleteUser", users.deleteUser)
app.post("/api/addCategory", Category.addCategory)
app.post("/api/getAllProdPost", Product.getAllProductPost)
app.post("/api/DeleteProduct", Product.deleteProduct)

async function logOut(req, res, sinS) {

  try {
    const session_id = (sinS);
    console.log(fileName + " sessionIdToDelete:"+session_id)
    let destroyInSql;
      await new Promise((resolve, reject) => {
          store.destroy(session_id, (err) => { // Utilizamos el store definido con MySQLSessionStore
              if (err) {
                  console.log("Ups,error eliminando session")
                  reject(err);
                  destroyInSql = false;
              } else {
                  destroyInSql = true
                  resolve();
              }
          });
      });
      console.log("Destroy in SQL:"+destroyInSql);
      return destroyInSql || false;
  } catch (error) {
      console.error('Error closing session:', error);
      res.status(500).send('Error al cerrar la sesión');
  }
}

app.post("/api/logOut",async (req, res) => {
  const cookies = req.headers['cookie'];
  const connectSid = cookies.split(';').find(cookie => cookie.trim().startsWith('connect.sid='));
  if (connectSid) {
    const cookieValue = connectSid.split('=')[1]; // Obtenemos el valor de la cookie
    const decodedCookie = cookieValue.replace(/ /g, '_').replace(/%[a-zA-Z0-9][a-zA-Z0-9]/g, decodeURIComponent);//-> Espacios en blanco son guiones bajos.
    const sessionId = decodedCookie.split('.')[0]; // Extraemos el identificador de sesión antes del primer punto
    //->quitar la 's':
    const sinS = sessionId.split('s:')[1];
    let resp = await /*authentication.*/logOut(req,res,sinS);
    console.log(fileName+' resp='+resp)
    if(resp == true){
      // Aquí también puedes limpiar otros recursos asociados a la sesión si es necesario
      req.sessionStore.destroy(sinS, (err) => {
        if (err) {
          console.error('Error al destruir la sesión:', err);
          return res.status(500).send('Error al cerrar sesión');
        }
        console.log('Sesión cerrada correctamente');
        res.clearCookie('connect.sid'); // Borra la cookie de sesión en el cliente
        res.status(201).send({status:201,message:'Sesión cerrada',redirect:"/"});
      });
    }else{
      console.log("No se pudocerrar la session")
    }
  }
});

app.post('/addProduct', upload.single('Imagen'),async function (req, res, next) {
  // req.file es el archivo del `Imagen`
  // req.body contendrá los campos de texto, si los hubiera.
  const {Nombre,Descripcion,Precio,Cantidad,IdCategoria} = req.body;
  if(Nombre == '' || Descripcion == '' || Precio == '' || Cantidad == '' || IdCategoria == '' ){res.send({message:"Ningún campo debe estar vacio"}) ;return}
  let Imagen;
  if(req.file && req.file.filename){
    Imagen = req.file.filename
    const insert = await Product.addProduct(Nombre,Descripcion,Precio,Cantidad,IdCategoria,Imagen)
    //console.log(fileName+insert)
    if(insert == true){
      res.send({message:"Inserción realizada"})
    }else{
      res.send({message:"Inserción no realizada"})
    }
    //COMMENT:AQUI CONTROLADOR
  }else{
    return res.send({message:"No se ha podido ejecutar la acción"})
  }
})


app.post("/editProduct", upload.single('Imagen_new'),async function (req,res){
  const {NombreEdit,DescripcionEdit,PrecioEdit,CantidadEdit,Imagen_old,IdCategoriaEdit,IdProductoEdit} = req.body;
  if(NombreEdit == '' || DescripcionEdit == '' || PrecioEdit == '' || CantidadEdit == '' || Imagen_old == '' || IdCategoriaEdit == '' || IdProductoEdit == ''){res.send({message:"Ningún campo debe estar vacio"}) ;return};

  let img;
  if (req.file && req.file.filename){
    img = req.file.filename;
    //->Eliminar imagen antigua:
    //await fs.unlink(`app/uploads/${Imagen_old}`)

    //let filePath = `app/uploads/${Imagen_old}`
    const filePath = path.join('app', 'uploads', Imagen_old);
    try {
      await fs.promises.stat(filePath);
      console.log(`El archivo ${Imagen_old} existe`);
      console.log("Eliminando...")
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Error al eliminar el archivo ${Imagen_old}: ${err.message}`);
        } else {
          console.log(`Archivo ${Imagen_old} eliminado con éxito`);
        }
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`El archivo ${Imagen_old} no existe`);
      } else {
        console.log(`Error al acceder al archivo ${Imagen_old}: ${error.message}`);
      }
    }
    

    
    
  }else{
    img = Imagen_old;
  }
  const boolean = await Product.editProduct(NombreEdit,DescripcionEdit,PrecioEdit,CantidadEdit,img,IdCategoriaEdit,IdProductoEdit);
  if(boolean == true){
    res.send({message:"Producto editado"})
  }else{
    fs.unlink(req.file.filename, (err) => {
      if (err) {
        console.log(`Error al eliminar el archivo ${req.file.filename}: ${err.message}`);
      } else {
        console.log(`Archivo ${req.file.filename} eliminado con éxito`);
      }
    });
    res.send({message:"No se pudo editar el producto"})
  }

})