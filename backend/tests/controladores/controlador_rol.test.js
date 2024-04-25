require('dotenv').config();
const express = require('express');
const db = require('../../modelos'); // Import your Sequelize models
const routes = require('../../api/rol'); // Import the routes
const app = express();
const request = require('supertest');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use('/api', routes); // Use the imported routes

beforeAll(async () => {
    try {
        await db.sequelize.sync({ force: true });
    } catch (error) {
        console.error('Failed to sync the database:', error);
    }
});

afterAll(async () => {
    await db.sequelize.close();
});

describe('Tests de Controlador de Roles', () => {
    describe('POST /api/v1/rol', () => {
        let token;

        // Setup a valid token before each test
        beforeEach(() => {
            // Mock a user object and sign a token
            const userPayload = { id: 1, username: 'admin', rol: 'admin' };
            token = jwt.sign(userPayload, process.env.JWT_LLAVE_SECRETA, { expiresIn: '1h' });
        });

        test('Successfully creates a new role', async () => {
            const roleData = { NombreRol: 'Admin', Descripcion: 'Administrator role' };
            const response = await request(app)
                .post('/api/v1/rol')
                .set('Authorization', `Bearer ${token}`)
                .send(roleData);
                // .expect(201);

            expect(response.body.message).toBe('Role created successfully');
            expect(response.body.role).toHaveProperty('NombreRol', 'Admin');
        });

        test('Fails to create a role without required field', async () => {
            const roleData = { Descripcion: 'Missing name' };
            const response = await request(app)
                .post('/api/v1/rol')
                .set('Authorization', `Bearer ${token}`)
                .send(roleData)
                .expect(400);

            expect(response.body.message).toBe('NombreRol is required.');
        });

        test('Fails to create a role without authentication', async () => {
            const roleData = { NombreRol: 'TestRole', Descripcion: 'Some description' };
            const response = await request(app)
                .post('/api/v1/rol')
                .send(roleData)
                .expect(401);

            expect(response.body.mensaje).toBe('Token no proporcionado');
        });

        test('Fails to create a role with unauthorized user', async () => {
            // Simulating a non-admin user
            const userPayload = { id: 2, username: 'user', rol: 'user' };
            const userToken = jwt.sign(userPayload, process.env.JWT_LLAVE_SECRETA, { expiresIn: '1h' });

            const roleData = { NombreRol: 'User', Descripcion: 'Non-admin role' };
            const response = await request(app)
                .post('/api/v1/rol')
                .set('Authorization', `Bearer ${userToken}`)
                .send(roleData)
                .expect(403);

            expect(response.body.mensaje).toBe('Acceso denegado. Solo el administrador puede realizar esta operación.');
        });
    });

    describe('PUT /api/v1/rol/:id', () => {
        let token;
        let existingRoleId;

        beforeAll(async () => {
            const rol = await db.Rol.create({ NombreRol: 'Original', Descripcion: 'Original Description' });
            existingRoleId = rol.RolID;
        });
    
        beforeEach(async () => {
            // Set up a valid token and create a role for testing updates
            const userPayload = { id: 1, username: 'admin', rol: 'admin' };
            token = jwt.sign(userPayload, process.env.JWT_LLAVE_SECRETA, { expiresIn: '1h' });
        });
    
        test('Successfully updates an existing role', async () => {
            const updatedData = { NombreRol: 'UpdatedAdmin', Descripcion: 'Updated description' };
            const response = await request(app)
                .put(`/api/v1/rol/${existingRoleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Role updated successfully');
            expect(response.body.role).toHaveProperty('NombreRol', 'UpdatedAdmin');
        });
    
        test('Fails to update a role without required field "NombreRol"', async () => {
            const updatedData = { Descripcion: 'Missing name field' };
            const response = await request(app)
                .put(`/api/v1/rol/${existingRoleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData)
                .expect(400);
    
            expect(response.body.message).toBe('NombreRol is required.');
        });
    
        test('Fails to update a non-existing role', async () => {
            const updatedData = { NombreRol: 'Nonexistent', Descripcion: 'Nonexistent role' };
            const response = await request(app)
                .put(`/api/v1/rol/999`) // Assuming 999 is an ID that does not exist
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData)
                .expect(500);
    
            expect(response.body.message).toBe('Error updating role: Error al modificar la entidad \'Rol\': No se encontró la entidad \'Rol\' con ID 999.');
        });
    
        test('Fails to update a role without authentication', async () => {
            const updatedData = { NombreRol: 'TestRole', Descripcion: 'Some description' };
            const response = await request(app)
                .put(`/api/v1/rol/${existingRoleId}`)
                .send(updatedData)
                .expect(401);
    
            expect(response.body.mensaje).toBe('Token no proporcionado');
        });
    
        test('Fails to update a role with unauthorized user', async () => {
            // Simulating a non-admin user
            const userPayload = { id: 2, username: 'user', rol: 'user' };
            const userToken = jwt.sign(userPayload, process.env.JWT_LLAVE_SECRETA, { expiresIn: '1h' });
    
            const updatedData = { NombreRol: 'User', Descripcion: 'Non-admin role' };
            const response = await request(app)
                .put(`/api/v1/rol/${existingRoleId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updatedData)
                .expect(403);
    
            expect(response.body.mensaje).toBe('Acceso denegado. Solo el administrador puede realizar esta operación.');
        });
    });

    describe('GET /api/v1/rol/:id', () => {
        let token;
        let existingRoleId;
    
        // Setup before all tests run
        beforeAll(async () => {
            // Create a role for fetching
            const rol = await db.Rol.create({ NombreRol: 'TestRoleFetch', Descripcion: 'Description for fetching' });
            existingRoleId = rol.RolID;
            // Create token for admin
            const userPayload = { id: 1, username: 'admin', rol: 'admin' };
            token = jwt.sign(userPayload, process.env.JWT_LLAVE_SECRETA, { expiresIn: '1h' });
        });
    
        test('Successfully retrieves an existing role', async () => {
            const response = await request(app)
                .get(`/api/v1/rol/${existingRoleId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
    
            expect(response.body.role).toHaveProperty('NombreRol', 'TestRoleFetch');
            expect(response.body.message).toBe('Role retrieved successfully');
        });
    
        test('Fails to retrieve a role with a non-existing ID', async () => {
            const response = await request(app)
                .get('/api/v1/rol/999999') // Assuming 999999 does not exist
                .set('Authorization', `Bearer ${token}`)
                .expect(500);
    
            expect(response.body.message).toBe('Error retrieving role: Error al leer la entidad \'Rol\' con ID 999999: No se encontró la entidad \'Rol\' con ID 999999.');
        });
    
        test('Fails to retrieve a role without authentication', async () => {
            const response = await request(app)
                .get(`/api/v1/rol/${existingRoleId}`)
                .expect(401);
    
            expect(response.body.mensaje).toBe('Token no proporcionado');
        });
    
        test('Fails to retrieve a role with unauthorized user', async () => {
            const userPayload = { id: 2, username: 'user', rol: 'user' };
            const userToken = jwt.sign(userPayload, process.env.JWT_LLAVE_SECRETA, { expiresIn: '1h' });
    
            const response = await request(app)
                .get(`/api/v1/rol/${existingRoleId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403);
    
            expect(response.body.mensaje).toBe('Acceso denegado. Solo el administrador puede realizar esta operación.');
        });
    });

    describe('GET /api/v1/rol', () => {
        let token;
    
        // Setup before all tests
        beforeAll(() => {
            // Create token for admin
            const userPayload = { id: 1, username: 'admin', rol: 'admin' };
            token = jwt.sign(userPayload, process.env.JWT_LLAVE_SECRETA, { expiresIn: '1h' });
        });
    
        test('Successfully retrieves all roles', async () => {
            const response = await request(app)
                .get('/api/v1/rol')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
    
            expect(response.body.roles).toBeInstanceOf(Array);
            expect(response.body.message).toBe('Roles retrieved successfully');
        });
    
        test('Fails to retrieve roles without authentication', async () => {
            const response = await request(app)
                .get('/api/v1/rol')
                .expect(401);
    
            expect(response.body.mensaje).toBe('Token no proporcionado');
        });
    
        test('Fails to retrieve roles with unauthorized user', async () => {
            const userPayload = { id: 2, username: 'user', rol: 'user' };
            const userToken = jwt.sign(userPayload, process.env.JWT_LLAVE_SECRETA, { expiresIn: '1h' });
    
            const response = await request(app)
                .get('/api/v1/rol')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403);
    
            expect(response.body.mensaje).toBe('Acceso denegado. Solo el administrador puede realizar esta operación.');
        });
    });    
});
