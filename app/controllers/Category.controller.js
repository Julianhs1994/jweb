import { getConnection } from "../mySql/connectionPool.js";

async function addCategory(req,res){
    const {connection,pool} = await getConnection()
    let Nombre = req.body.nombre;
    try{
        const sql = `INSERT INTO Categoria (Nombre) VALUES(?)`;
        const query = await connection.query(sql,[Nombre])
        res.status(200).send({status:200,message:"Categoria agregada",redirect:"/admin-products"})
    }catch(err){
        console.error(err);
        res.status(400).send({status:400,message:"No se pudo realizar la insercion",redirect:"/admin-products"})
    }
    finally{
        await pool.end()
    }
}

async function getAllCategory(){
    const { connection,pool } = await getConnection();
    try{
        const sql = "SELECT * FROM Categoria";
        const query = await connection.query(sql);
        //console.log(query[0])
        return query[0]
    }catch(err){
        console.error(err)
    }
    finally{
        await pool.end()
    }
}

async function getAllCategoryData(req,res){
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
        const totalCountQuery = 'SELECT COUNT(*) AS total FROM Categoria';
        const totalCountResult = await connection.query(totalCountQuery);
        //->Total filas:
        const totalRows = totalCountResult[0][0].total;
        
        //->Si se va a hacer una busqueda: 
        let query;
        let busqueda = req.query.search;
        if (busqueda.value != ''){
            /*query = `SELECT U.Nombre,U.Apellido,U.Correo,U.Direccion,U.Celular,U.IdUsuario,E.NombreEstado,R.NombreRol FROM Usuario U INNER JOIN Rol R ON U.IdRol = R.IdRol INNER JOIN EstadoUsuario E ON U.IdEstadoUsuario = E.IdEstadoUsuario WHERE CONCAT(Nombre, ' ', Apellido, ' ', Correo, ' ', Direccion, ' ', NombreEstado, ' ', NombreRol ) LIKE '%${busqueda.value}%'`;*/
            query = `SELECT * FROM Categoria WHERE CONCAT(Nombre, ' ') LIKE '%${busqueda.value}%'`
        }else{
        // Obtener los resultados paginados/->Cuando carga la tabla pone todos los datos:
        query = `SELECT * FROM Categoria LIMIT ${offset}, ${pageSize}`;
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
        //console.log(fileName+'Conexion getAllUser cerrada!')
    }
}

export const methods = {
    addCategory,
    getAllCategory,
    getAllCategoryData
}