// server/config/db.config.js
module.exports = {
  desarrollo: {
    database: process.env.BASE_DE_DATOS,
    username: process.env.USUARIO,
    password: process.env.CONTRASENA,
    host: process.env.HOST,
    port: process.env.PUERTO_DB || 3306,
    logging: false,
    dialect: 'mysql' 
  },
  pruebas: {
    database: process.env.BASE_DE_DATOS_PRUEBAS,
    username: process.env.USUARIO,
    password: process.env.CONTRASENA,
    host: process.env.HOST,
    port: process.env.PUERTO_DB || 3306,
    logging: false,
    dialect: 'mysql' 
  }
};