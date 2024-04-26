import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const fileName = 'authorizations.js/'

//->solo Adm:
async function soloAdmin(req,res,next){
    const Login = verificarCookie(req)
}

//->Si no esta logeado puede acceder a algunos sitios como el login o el register,de lo contrario irá al home si intenta acceder a ellos.
async function soloPublico(req,res,next){
    const Login = verificarCookie(req);
    console.log("authorizations/Login:"+Login)
    //->Si no esta logeado:
    if(!Login){
        return next()
    //->Si está logeado:
    }else{
        return res.redirect("/")
    }

}

//->Solo main:
function soloMain(req,res,next){
  const Login = verificarCookie(req)
  if(Login == true){
    //console.log(fileName+' '+'ENTER SOLOMAIN')
    req.session.Logeado = true;
    const rol = req.session.rol;
    console.log(fileName+ " Rol:"+rol)
  }
  next();
}

//->verificar session:
function getDecCookie(req) {
    const cookies = req.headers.cookie ? req.headers.cookie.split('; ') : []; // Dividir las cookies en un arreglo
    
    const jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt=')); // Buscar la cookie con el nombre 'jwt='
    
    if (jwtCookie) { // Verificar si se encontró la cookie 'jwt='
      //console.log("that cook:" + jwtCookie);
      
      // Decodificar el contenido de la cookie 'jwt='
      const cookieJWT = jwtCookie.slice(4); // Obtener el valor de la cookie 'jwt=' (sin el prefijo 'jwt=')
      const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
      //console.log("decodificada: "+decodificada)
      console.log(fileName+" user: "+decodificada.user);
      console.log(fileName+" rol: "+decodificada.rol);
      if (!decodificada) {
        // Manejar el caso en que el token no es válido
        console.log('Token no válido o ha sido modificado.');
        // Añade aquí tus acciones adicionales en caso de token inválido
        return false;
      }   
      if (!req.session) {
        req.session = {};
      }
      console.log("raro:"+req.sessionID);
      req.session.Rol = (decodificada.rol);
      req.session.IdSession = req.sessionID;
      return true;  
      
    } else {
      //req.session.rol = "Invitado*";
      return false;
    }
  }

function verificarCookie(req){
    const CookieDecodificada = getDecCookie(req);
    return CookieDecodificada;
}

export const methods = {
  soloPublico,
  soloMain
}