const mysql = require("mysql2/promise");

const getConnection = async () => {
    const connection = await mysql.createConnection({
        host: "localhost",
        database: "recipessapp",
        user: process.env.USER_WORKBENCH,
        password: process.env.PASSWORD_WORKBENCH,
    });
    await connection.connect();

    console.log(
        `Conexión establecida con la base de datos (identificador=${connection.threadId})`
    );

    return connection;
};

module.exports = {
    getConnection,
};
