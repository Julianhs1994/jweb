import { getConnection } from "../mySql/connectionPool.js";

async function addProduct(Nombre,Descripcion,Precio,Cantidad,IdCategoria,Imagen){
    const {connection,pool} = await getConnection();
    try{
        let sql = `INSERT INTO Producto (Nombre,Descripcion,Precio,Cantidad,Imagen,IdCategoria) VALUES(?,?,?,?,?,?)`
        const query = await connection.query(sql,[Nombre,Descripcion,Precio,Cantidad,Imagen,IdCategoria])
        return true
    }catch(err){
        console.error(err);
        console.error('Error al insertar en la base de datos:');
        return false
    }
    finally{
        await pool.end()
    }
}

async function getAllProduct(req,res){
    const { connection,pool } = await getConnection();
    try{
        const currentPage = req.query.page || 1;
        const pageSize = req.query.length || 5;
        console.log(pageSize)
        //->paginar resultados de sql:Esto significa que, por ejemplo, si la página actual es 2 y el tamaño de la página es 5, el offset será 10 (2 - 1 = 1, 1 * 5 = 5, 10 - 1 = 9). Esto indica a la consulta SQL para seleccionar las 10 filas que siguen a la fila con el índice 9.
        const offset = (currentPage - 1) * pageSize;

        // Obtener el número total de filas
        const totalCountQuery = 'SELECT COUNT(*) AS total FROM Producto';
        const totalCountResult = await connection.query(totalCountQuery);
        //->Total filas:
        const totalRows = totalCountResult[0][0].total;

        //->Si se va a hacer una busqueda: 
        let query;
        let busqueda = req.query.search;
        if (busqueda.value != ''){
            query = `SELECT P.IdProducto,P.Nombre,P.Descripcion,P.Precio,P.Cantidad,P.Imagen, C.Nombre as NombreCat FROM Producto P INNER JOIN Categoria C ON P.IdCategoria = C.IdCategoria WHERE CONCAT(P.Nombre, ' ',Descripcion, ' ',Precio, ' ',Cantidad, ' ',Imagen, ' ' ) LIKE '%${busqueda.value}%'`
        }else{
        // Obtener los resultados paginados/->Cuando carga la tabla pone todos los datos:
        query = `SELECT  P.IdProducto,P.Nombre,P.Descripcion,P.Precio,P.Cantidad,P.Imagen, C.Nombre as NombreCat FROM Producto P INNER JOIN Categoria C ON P.IdCategoria = C.IdCategoria LIMIT ${offset}, ${pageSize}`;
        } 
        const result = await connection.query(query);
        // Calcular el número de páginas
        const totalPages = Math.ceil(totalRows / pageSize);
        // Retornar los resultados paginados y el número total de páginas como respuesta JSON
        res.json({
            data: result[0],
            recordsTotal: totalRows,
            recordsFiltered: totalRows,
            draw: req.query.draw,
            totalPages: totalPages,
            pageSize:pageSize
          });
    }catch(err){
        console.error(err)
    }
    finally{
        await pool.end()
    } 
}

async function getAllProductPost(req,res){
    const {connection,pool} = await getConnection();
    let id = req.body.IdProducto;
    try{
        let sql = `SELECT * FROM Producto WHERE IdProducto = ${id} `;
        let query = await connection.query(sql)
        res.status(200).send({status:200,message:'datos obtenidos',array:query[0]})
    }catch(err){
        console.error(err);
        res.status(400).send({status:400,message:'datos no obtenidos'})
    }
    finally{
        await pool.end()
    }
}

export const methods = {
    addProduct,
    getAllProduct,
    getAllProductPost
}