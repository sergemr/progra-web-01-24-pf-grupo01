// tests/modelos/roles.test.js

require('dotenv').config();
const db = require('../../modelos');

beforeAll(async () => {
    // Force sync the db object
    try {
        await db.sequelize.sync({ force: true });
    } catch (error) {
        console.error('Failed to sync the database:', error);
    }
});

afterAll(async () => {
    // Close database connection
    await db.sequelize.close();
});

let transaction;
beforeEach(async () => {
    // Start a transaction
    transaction = await db.sequelize.transaction();
});

afterEach(async () => {
    // Rollback transaction to discard changes
    await transaction.rollback();
});

describe('Roles Model', () => {
    describe('CRUD operations', () => {
        test('Create a new Role', async () => {
            const role = await db.Rol.create({
                NombreRol: 'Administrator',
                Descripcion: 'Admin role with all permissions'
            }, { transaction });
            expect(role.NombreRol).toBe('Administrator');
            expect(role.Descripcion).toBe('Admin role with all permissions');
        });

        test('Read a Role', async () => {
            const role = await db.Rol.create({
                NombreRol: 'User',
                Descripcion: 'Standard user role'
            }, { transaction });
            const foundRole = await db.Rol.findByPk(role.RolID, { transaction });
            expect(foundRole.NombreRol).toBe('User');
        });

        test('Update a Role', async () => {
            const role = await db.Rol.create({
                NombreRol: 'Guest',
                Descripcion: 'Limited access'
            }, { transaction });
            role.NombreRol = 'Updated Guest';
            await role.save({ transaction });
            const updatedRole = await db.Rol.findByPk(role.RolID, { transaction });
            expect(updatedRole.NombreRol).toBe('Updated Guest');
        });
    });

    describe('Relationships', () => {
        test('Role has many Usuarios', async () => {
            const role = await db.Rol.create({
                NombreRol: 'Moderator',
                Descripcion: 'Moderator role'
            }, { transaction });

            const user1 = await db.Usuario.create({
                NombreUsuario: 'user1',
                HashContraseña: 'hash1',
                Correo: 'user1@example.com',
                RolID: role.RolID
            }, { transaction });

            const user2 = await db.Usuario.create({
                NombreUsuario: 'user2',
                HashContraseña: 'hash2',
                Correo: 'user2@example.com',
                RolID: role.RolID
            }, { transaction });

            const relatedRole = await db.Rol.findOne({
                include: [{
                    model: db.Usuario,
                    as: 'Usuarios'
                }],
                where: { RolID: role.RolID },
                transaction
            });
            expect(relatedRole.Usuarios.length).toBeGreaterThan(0);
            expect(relatedRole.Usuarios.map(user => user.NombreUsuario)).toEqual(expect.arrayContaining(['user1', 'user2']));
        });
    });

    describe('Validations', () => {
        test('Fail to create Role with missing NombreRol', async () => {
            await expect(db.Rol.create({
                Descripcion: 'Missing name role'
            }, { transaction })).rejects.toThrow();
        });

        test('Fail to create Role with duplicate NombreRol', async () => {
            await db.Rol.create({
                NombreRol: 'UniqueRole',
                Descripcion: 'Role to test uniqueness'
            }, { transaction });

            await expect(db.Rol.create({
                NombreRol: 'UniqueRole',
                Descripcion: 'Attempt to create duplicate role'
            }, { transaction })).rejects.toThrow();
        });
    });
});
