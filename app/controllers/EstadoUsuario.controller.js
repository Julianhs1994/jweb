import { getConnection } from "../mySql/connectionPool.js";
const fileName = "EstadoUsuario.controller|"

async function getAllEstadoUsuario(){
    const {connection,pool} = await getConnection();
    try{
        const sql = 'SELECT * FROM EstadoUsuario';
        const query = await connection.query(sql);
        return query[0];
    }catch(err){
        console.error(err);
        return
    }
    finally{
        await pool.end()
    }
}

async function getNameEstado(req,res){
    const {connection,pool} = await getConnection();
    try{
        let data = req.body.data;
        let sql = `SELECT NombreEstado FROM EstadoUsuario WHERE IdEstadoUsuario=${data}`
        let query = await connection.query(sql);
        let estado = query[0][0].NombreEstado;
        //console.log("Enter")
        console.log(fileName+estado)
        return res.status(200).send({status:200,message:"Datos obtenidos",value:estado})
    }catch(err){
        console.error(err);
    }
    finally{
        await pool.end()
    }
}

export const methods = {
    getAllEstadoUsuario,
    getNameEstado
}