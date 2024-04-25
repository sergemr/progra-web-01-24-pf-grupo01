const modAccesoDatos = require('../modulos/modAccesoDatos');

const controladorRol = {
    crearRol: async (req, res) => {
        const { NombreRol, Descripcion } = req.body;
        if (!NombreRol) {
            return res.status(400).json({
                message: "NombreRol is required."
            });
        }
        try {
            const nuevoRol = await modAccesoDatos.crearEntidad('Rol', {
                NombreRol,
                Descripcion
            });
            res.status(201).json({
                message: "Role created successfully",
                role: nuevoRol
            });
        } catch (error) {
            res.status(500).json({
                message: `Error creating role: ${error.message}`
            });
        }
    },
    actualizarRol: async (req, res) => {
        const { id } = req.params;
        const { NombreRol, Descripcion } = req.body;
        if (!NombreRol) {
            return res.status(400).json({
                message: "NombreRol is required."
            });
        }
        try {
            const rolActualizado = await modAccesoDatos.modificarEntidad('Rol', id, {
                NombreRol,
                Descripcion
            });
            res.status(200).json({
                message: "Role updated successfully",
                role: rolActualizado
            });
        } catch (error) {
            res.status(500).json({
                message: `Error updating role: ${error.message}`
            });
        }
    },
    obtenerRol: async (req, res) => {
        const { id } = req.params;
        try {
            const rol = await modAccesoDatos.leerEntidad('Rol', id);
            if (!rol) {
                return res.status(404).json({ message: "Role not found." });
            }
            res.status(200).json({
                message: "Role retrieved successfully",
                role: rol
            });
        } catch (error) {
            res.status(500).json({
                message: `Error retrieving role: ${error.message}`
            });
        }
    },
    obtenerTodosLosRoles: async (req, res) => {
        try {
            const roles = await modAccesoDatos.listarEntidades('Rol', {});
            res.status(200).json({
                message: "Roles retrieved successfully",
                roles: roles
            });
        } catch (error) {
            res.status(500).json({
                message: `Error retrieving roles: ${error.message}`
            });
        }
    }
};

module.exports = controladorRol;
