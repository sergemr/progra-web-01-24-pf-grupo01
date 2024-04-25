const express = require('express');
const controladorRol = require('../controladores/controlador_rol');

const router = express.Router();

// Existing route for creating a role
router.post('/v1/rol', controladorRol.crearRol);

// New route for updating a role
router.put('/v1/rol/:id', controladorRol.actualizarRol);

// Define the route for getting a specific role
router.get('/v1/rol/:id', controladorRol.obtenerRol);

// New route for getting all roles
router.get('/v1/rol', controladorRol.obtenerTodosLosRoles);

module.exports = router;
