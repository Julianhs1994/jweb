//import connection from "../mySql/connection.js";
import { getConnection} from "../mySql/connectionPool.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
dotenv.config();

const fileName = 'authentication.controller.js/'

async function register(req, res) {
    const {connection,pool} = await getConnection();
    try{
    const { name, lastname, address, email, phonenumber, password } =
      req.body;
      
      if(!name || !lastname || !address || !email || !phonenumber || !password){
        return res.status(400).send({status:400,message:"Todos los campos son necesarios"})
      }

    //->Seccion BCRYPTJS & HASH:  
      const salt = await bcryptjs.genSalt(5);
      const hashpassword = await bcryptjs.hash(password, salt);
    //
    const sqlStatement = `INSERT INTO Usuario (Nombre,Apellido,Correo,Contrasena,Direccion,Celular,IdEstadoUsuario,IdRol) VALUES(?,?,?,?,?,?,?,?)`;
    const result = await connection.query(sqlStatement,[name,lastname,email,hashpassword,address,phonenumber,1,1]);

    console.log("ID insertada"+result[0].insertId)
    res.status(200).send({status:200,message:"Exito al registrarse"});  
    /*console.log(name);
    console.log(lastname);
    console.log(direction);
    console.log(email);
    console.log(phonenumber);
    console.log(password);
    console.log("Enter")*/
  
    }catch(error){
      console.error(error);
      //->Error custom:
      if (
        error &&
        error.code === "ER_DUP_ENTRY" &&
        error.sqlMessage.includes("unique_email")
      ) {
        return res.status(400).send({ message: "El correo ya está en uso" });
      } else {
        return res
          .status(500)
          .send({ status: "Error", message: "Error en el servidor" });
      }
    }
    finally{
     await pool.end()
    }
  }

async function login(req,res){
  console.log("Enter Login");
  const {connection,pool} = await getConnection();
  try{
    const {correo,password} = req.body;
    if (!correo || !password) {
      return res.status(400).send({
        status: 400,
        message: "Campos incompletos",
      });
    }

    const result = await connection.query("SELECT * FROM Usuario WHERE Correo=?",[correo]);
    const length = result[0].length;
    if(length == 0){
      return res.status(400).send({status:400,message:"Este usuario no existe",redirect:"/login"});
    } 


    const usuarioArevisar = result[0][0];
    //->La siguiente funcion retorna true o false segun sea el caso:
    const loginCorrecto = await bcryptjs.compare(
      password,usuarioArevisar.Contrasena
    )

    if (!loginCorrecto) {
      return res.status(400).send({
        status: 400,
        message: "Contraseña incorrecta",
      });
    }

    //->Obtener rol de la consulta para aplicar al token jwt:
    const Id = usuarioArevisar.IdRol;
    const sqlStatement = 'SELECT NombreRol FROM Rol WHERE IdRol =?';
    const result2 = await connection.query(sqlStatement,[Id]);
    //console.log("result2: " +result2[0][0].NombreRol)
    const NombreRol = result2[0][0].NombreRol;

    //->JSONWEB TOKEN:
    const token = jsonwebtoken.sign(
      {
        user: usuarioArevisar.Correo,
        rol:NombreRol
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    //->COOKIE-PARSER:
    const cookieOption = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      path: "/",
    };

    res.cookie("jwt", token, cookieOption);
    res.status(200).send({ status: 200, message: "Usuario logeado", redirect: "/" });
    
    
    /*
    //console.log("Revision",usuarioArevisar)

    if (usuarioArevisar.IdEstadoUsuario !== 2) {
      return res.status(401).json({ message: "Usuario no activo" });
    }*/


  }catch(err){
    console.error(err);
  }
  finally{
    await pool.end();
    console.log("Login finalizado")
  }
}

import { sessionStore } from "../index.js";

async function closeSession(session_id){
  return new Promise((resolve, reject) => {
    sessionStore.destroy(session_id, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("his close");
        resolve();
      }
    });
  });
};

async function logOut(req, res) {
  // Cerrar sesión de express-session
  const session_id = req.sessionID;
  console.log(session_id);

  try {
    await new Promise((resolve, reject) => {
      sessionStore.destroy(session_id, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(fileName+ 'Enter close')
          // Eliminar el cookie JWT
          //res.clearCookie('jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;');
          res.status(201).send({status:201,message:"Sesion finalizada",redirect:"/"})
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Error closing session:', error);
  }
}
  
export const methods = {
    register,
    login,
    logOut
}  