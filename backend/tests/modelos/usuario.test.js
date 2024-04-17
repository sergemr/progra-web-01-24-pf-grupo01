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

describe('Usuario Model', () => {
    describe('CRUD operations', () => {
        test('Create a new Usuario', async () => {
            const role = await db.Rol.create({
                NombreRol: 'Admin',
                Descripcion: 'Administrator role'
            }, { transaction });
            const usuario = await db.Usuario.create({
                NombreUsuario: 'johndoe',
                HashContraseña: 'hashed_password',
                Correo: 'johndoe@example.com',
                RolID: role.RolID
            }, { transaction });
            expect(usuario.NombreUsuario).toBe('johndoe');
            expect(usuario.Correo).toBe('johndoe@example.com');
        });

        test('Read a Usuario', async () => {
            const role = await db.Rol.create({
                NombreRol: 'User',
                Descripcion: 'Regular user role'
            }, { transaction });
            const usuario = await db.Usuario.create({
                NombreUsuario: 'janedoe',
                HashContraseña: 'hashed_password2',
                Correo: 'janedoe@example.com',
                RolID: role.RolID
            }, { transaction });
            const foundUsuario = await db.Usuario.findByPk(usuario.UsuarioID, { transaction });
            expect(foundUsuario.NombreUsuario).toBe('janedoe');
        });

        test('Update a Usuario', async () => {
            const role = await db.Rol.create({
                NombreRol: 'Editor',
                Descripcion: 'Editor role'
            }, { transaction });
            const usuario = await db.Usuario.create({
                NombreUsuario: 'alexdoe',
                HashContraseña: 'hashed_password3',
                Correo: 'alexdoe@example.com',
                RolID: role.RolID
            }, { transaction });
            usuario.NombreUsuario = 'updatedalexdoe';
            await usuario.save({ transaction });
            const updatedUsuario = await db.Usuario.findByPk(usuario.UsuarioID, { transaction });
            expect(updatedUsuario.NombreUsuario).toBe('updatedalexdoe');
        });
    });

    describe('Relationships', () => {
        test('Usuario belongs to Rol', async () => {
            const role = await db.Rol.create({
                NombreRol: 'Supervisor',
                Descripcion: 'Supervisor role'
            }, { transaction });
            const usuario = await db.Usuario.create({
                NombreUsuario: 'bethdoe',
                HashContraseña: 'hashed_password4',
                Correo: 'bethdoe@example.com',
                RolID: role.RolID
            }, { transaction });
            const relatedUsuario = await db.Usuario.findOne({
                include: [{ model: db.Rol, as: 'Rol' }],
                where: { UsuarioID: usuario.UsuarioID },
                transaction
            });
            expect(relatedUsuario.Rol.NombreRol).toBe('Supervisor');
        });
    });

    describe('Validations', () => {
        test('Fail to create Usuario with invalid data', async () => {
            await expect(db.Usuario.create({
                NombreUsuario: 'failuser',
                // Missing HashContraseña and Correo fields
                RolID: 1  // Assuming the role exists for the sake of validation failure
            }, { transaction })).rejects.toThrow();
        });
    });
});
