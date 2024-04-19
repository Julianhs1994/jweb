import mysql from 'mysql2/promise';
import config from './connection.js';

// Create the connection pool. The pool-specific settings are the defaults
async function createConnection(){
    const pool = mysql.createPool({
        user: config.user,
        password: config.password,
        host: config.host,
        port: config.port,
        database: config.database,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    });
    const connection = await pool.getConnection();
    pool.releaseConnection(connection);
    return {connection,pool}
}

const getConnection = () => createConnection();
export { getConnection }
