import { getConnection } from "../mySql/connectionPool.js";

async function getAllRol(req,res){
    const {connection,pool} = await getConnection();
    if(connection){
        try{
            const sql = 'SELECT * FROM Rol';
            const query = await connection.query(sql)
            return query[0]
        }catch(err){
            console.error(err)
        }
        finally{
            await pool.end()
        }
    }
}

export const methods = {
    getAllRol
}