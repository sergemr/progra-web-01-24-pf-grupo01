const db = require('../modelos');


const modAccesoDatos = {
    // Funcion para leer una entidad de la base de datos por ID
    leerEntidad: async function(tipoEntidad, id) {
        try {
            const modelo = db[tipoEntidad];
            if (!modelo) {
                throw new Error(`Tipo de entidad '${tipoEntidad}' no válido.`);
            }
            
            const entidad = await db[tipoEntidad].findByPk(id);
            if (!entidad) {
                throw new Error(`No se encontró la entidad '${tipoEntidad}' con ID ${id}.`);
            }
        
            return entidad.toJSON();
        } catch (error) {
            throw new Error(`Error al leer la entidad '${tipoEntidad}' con ID ${id}: ${error.message}`);
        }
    },

    // Funcion para listar los datos de una entidad en la base de datos, aplicando un filtro
    listarEntidades: async function(tipoEntidad, filtro) {
        try {
            const modelo = db[tipoEntidad];
            if (!modelo) {
                throw new Error(`Tipo de entidad '${tipoEntidad}' no válido.`);
            }
            
            const entidades = await modelo.findAll({ where: filtro });
        
            return entidades.map(entidad => entidad.toJSON());
        } catch (error) {
            throw new Error(`Error al listar las entidades '${tipoEntidad}': ${error.message}`);
        }
    },

    // Funcion para crear una nueva entidad en la base de datos
    crearEntidad: async function(tipoEntidad, datos) {
        try {
            const modelo = db[tipoEntidad];
            if (!modelo) {
                throw new Error(`Tipo de entidad '${tipoEntidad}' no válido.`);
            }
            
            const entidadCreada = await modelo.create(datos);
            if (!entidadCreada) {
                throw new Error(`Entidad creada es nula '${tipoEntidad}'.`);
            }
        
            return entidadCreada;
        } catch (error) {
            throw new Error(`Error general al crear la entidad '${tipoEntidad}': ${error.message}`);
        }
    },

    // Funcion para modificar una entidad existente en la base de datos
    modificarEntidad: async function(tipoEntidad, id, datosModificar) {
        try {
            const modelo = db[tipoEntidad];
            if (!modelo) {
                throw new Error(`Tipo de entidad '${tipoEntidad}' no válido.`);
            }
            
            const entidad = await modelo.findByPk(id);
            if (!entidad) {
                throw new Error(`No se encontró la entidad '${tipoEntidad}' con ID ${id}.`);
            }
            
            entidadActualizada = await entidad.update(datosModificar);
            return entidadActualizada;
        } catch (error) {
            throw new Error(`Error al modificar la entidad '${tipoEntidad}': ${error.message}`);
        }
    },

    // Funcion para eliminar una entidad de la base de datos
    eliminarEntidad: async function(tipoEntidad, idEntidad) {
        try {
            const modelo = db[tipoEntidad];
            if (!modelo) {
                throw new Error(`Tipo de entidad '${tipoEntidad}' no válido.`);
            }
            
            const entidad = await modelo.findByPk(idEntidad);
            if (!entidad) {
                throw new Error(`No se encontró la entidad '${tipoEntidad}' con ID ${idEntidad}.`);
            }
            
            await entidad.destroy();
        } catch (error) {
            throw new Error(`Error al eliminar la entidad '${tipoEntidad}': ${error.message}`);
        }
    }


};

module.exports = modAccesoDatos;
