import { getConnection } from "../mySql/connectionPool.js";
const fileName = 'users.controller|'

async function getAllUsers(req,res){
    const {connection,pool} = await getConnection();
    try{
        // Obtener los parámetros de paginación
        const currentPage = req.query.page || 1;
        //console.log(fileName+"Current:"+currentPage)
        //->Tamaño de pagina:
        const pageSize = req.query.length || 5;
        //->paginar resultados de sql:Esto significa que, por ejemplo, si la página actual es 2 y el tamaño de la página es 5, el offset será 10 (2 - 1 = 1, 1 * 5 = 5, 10 - 1 = 9). Esto indica a la consulta SQL para seleccionar las 10 filas que siguen a la fila con el índice 9.
        const offset = (currentPage - 1) * pageSize;

        // Obtener el número total de filas
        const totalCountQuery = 'SELECT COUNT(*) AS total FROM Usuario';
        const totalCountResult = await connection.query(totalCountQuery);
        //->Total filas:
        const totalRows = totalCountResult[0][0].total;
        
        //->Si se va a hacer una busqueda: 
        let query;
        let busqueda = req.query.search;
        if (busqueda.value != ''){
            query = `SELECT U.Nombre,U.Apellido,U.Correo,U.Direccion,U.Celular,U.IdUsuario,E.NombreEstado,R.NombreRol FROM Usuario U INNER JOIN Rol R ON U.IdRol = R.IdRol INNER JOIN EstadoUsuario E ON U.IdEstadoUsuario = E.IdEstadoUsuario WHERE CONCAT(Nombre, ' ', Apellido, ' ', Correo, ' ', Direccion, ' ', NombreEstado, ' ', NombreRol ) LIKE '%${busqueda.value}%'`;
        }else{
        // Obtener los resultados paginados/->Cuando carga la tabla pone todos los datos:
        query = `SELECT U.Nombre,U.Apellido,U.Correo,U.Direccion,U.Celular,U.Celular,U.IdUsuario,E.NombreEstado,R.NombreRol FROM Usuario U INNER JOIN Rol R ON U.IdRol = R.IdRol INNER JOIN EstadoUsuario E ON U.IdEstadoUsuario = E.IdEstadoUsuario LIMIT ${offset}, ${pageSize}`;
        } 
        const result = await connection.query(query);
        //console.log(result[0])
        // Calcular el número de páginas
        const totalPages = Math.ceil(totalRows / pageSize);
        // Retornar los resultados paginados y el número total de páginas como respuesta JSON
        res.json({
            data: result[0],
            recordsTotal: totalRows,
            recordsFiltered: totalRows,
            draw: req.query.draw,
            totalPages: totalPages
          });
    }catch(err){
        console.error(err)
    }
    finally{
        await pool.end();
        console.log(fileName+'Conexion getAllUser cerrada!')
    }
}

async function getDataModalEditUser(req,res){
    const {connection,pool} = await getConnection();
    let IdUsuario = req.body.IdUsuario;
    //console.log(fileName+IdUsuario)
    try{
        let sql = `SELECT * FROM Usuario WHERE IdUsuario = ?`;
        let query = await connection.query(sql,[IdUsuario]);
        res.status(200).send({status:200,message:"Datos encontrados",arr:query[0]});
    }catch(err){
        console.error("error"+err)
    }
    finally{
        await pool.end();
    }
}

async function editUser(req,res){
    const {connection,pool} = await getConnection();
    const {Nombre,Apellido,Correo,Direccion,Celular,IdEstadoUsuario,IdRol,IdUsuario} = req.body;
    //console.log(fileName+Nombre)
    try{
        let sql = `UPDATE Usuario SET Nombre=?,Apellido=?,Correo=?,Direccion=?,Celular=?,IdEstadoUsuario=?,IdRol=? WHERE IdUsuario=?`
        let query = await connection.query(sql,[Nombre,Apellido,Correo,Direccion,Celular,IdEstadoUsuario,IdRol,IdUsuario]);
        res.status(200).send({status:200,message:"Usuario editado",redirect:"/admin-users"}) 
    }catch(err){
        console.error(err)
        res.status(400).send({status:400,message:"Error al editar usuario",redirect:"/admin-users"})
    }
    finally{
        await pool.end()
    }
}

async function deleteUser(req,res){
    const {connection,pool} = await getConnection();
    const IdUsuario = req.body.IdUsuario;
    //console.log(fileName+" id:"+IdUsuario)
    try{
        const sql = `DELETE FROM Usuario WHERE IdUsuario=${IdUsuario}`;
        const query = await connection.query(sql);
        res.status(200).send({status:200,message:"Usuario Eliminado",redirect:"/admin-users"}) 
    }catch(err){
        res.status(400).send({status:200,message:"Error al eliminar",redirect:"/admin-users"}) 
        console.error(err)
    }
    finally{
        await pool.end()
    }
}

export const methods = {
    getAllUsers,
    getDataModalEditUser,
    editUser,
    deleteUser
}