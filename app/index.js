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
//->imports sessions:
import session from "express-session";
//import MySQLStore ;
//import MySQLStore from "connect-mysql2";
import {MySQLSessionStore} from 'serverless-mysql-session-store';
const mysqlConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
};


/*
  
*/
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

//->Static configuration Folders/Files:
app.use(express.static(__dirname + "/pages/img"));
app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/pages/css"));

//->FileName:
const fileName = 'index.js';

//->Config sessions:

/*export const sessionStore = new MySQLStore({
	expiration: 24 * 60 * 60 * 1000,//Expira las sesiones despues de 24 horas
	host: process.env.HOST,//'bvm2sdmfdfugrwqzj6em-mysql.services.clever-cloud.com',
	user: process.env.USER,//'u9nr2w0obvibn86f',
	password: process.env.PASSWORD,//
	database: process.env.DATABASE,//'bvm2sdmfdfugrwqzj6em',
    tableName: 'session',
});	

app.use(
    session({
      secret: 'testProof',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Expira las sesiones después de 24 horas
      },
    })
  );
*/

/*const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});*/

//const Sequelize = require('sequelize'
const store = new MySQLSessionStore(mysqlConfig);

app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: true,
  store: store
}));
//->Rutas:

app.get("/",authorization.soloMain,(req,res)=>{
	const IsLoggedIn = true //req.session.Logeado ? true : false;
	const Rol = 'noc' //req.session.Rol || "Invitado";
	console.log(IsLoggedIn);
	console.log(fileName+" Rol:"+Rol);
    res.render("home",{IsLoggedIn,Rol})
})

app.get("/login",authorization.soloPublico,(req,res)=>{
	const IsLoggedIn = req.session.Logeado ? true : false;
	const Rol = req.session.Rol || "Invitado";
    res.render('login',{IsLoggedIn,Rol})
})

app.get("/register",(req,res)=>{
  const IsLoggedIn = req.session.Logeado ? true : false;
	const Rol = req.session.Rol || "Invitado";
    res.render("register",{IsLoggedIn,Rol})
})

//->Rutas con post:
//~agrega / antes de api...

app.post("/api/register",authentication.register)
app.post("/api/login", authentication.login)
//app.post("/api/logOut",authentication.logOut)