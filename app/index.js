import express from "express";
//->Direname-Config:
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//->Ejs:
import expressEjsLayouts from "express-ejs-layouts";

//->Server:
const app = express();
const portNumber = 3000;
app.set('port',portNumber);
app.listen(app.get('port'));
console.log("Servidor escuchando en elpuerto: "+app.get('port'));
//->Ejs app config:
app.use(expressEjsLayouts);
/*buscar las views en: */ 
app.set("views",[path.join(__dirname,"pages")/*,path.join(....)*/]);
app.set("view engine","ejs");

//->Static configuration Folders/Files:
app.use(express.static(__dirname + "/pages/img"));
app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/pages/css"));

//->Rutas:

app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/login",(req,res)=>{
    res.render('login')
})
