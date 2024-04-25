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

describe('TelefonoDepartamento Model', () => {
    describe('CRUD operations', () => {
        test('Create a new TelefonoDepartamento', async () => {
            const telefonoDepartamento = await db.TelefonoDepartamento.create({
                Telefono: '555-1234'
            }, { transaction });
            expect(telefonoDepartamento.Telefono).toBe('555-1234');
        });

        test('Read a TelefonoDepartamento', async () => {
            const telefonoDepartamento = await db.TelefonoDepartamento.create({
                Telefono: '555-5678'
            }, { transaction });
            const foundTelefonoDepartamento = await db.TelefonoDepartamento.findByPk(telefonoDepartamento.TelefonoDepartamentoID, { transaction });
            expect(foundTelefonoDepartamento.Telefono).toBe('555-5678');
        });

        test('Update a TelefonoDepartamento', async () => {
            const telefonoDepartamento = await db.TelefonoDepartamento.create({
                Telefono: '555-0000'
            }, { transaction });
            telefonoDepartamento.Telefono = '555-9999';
            await telefonoDepartamento.save({ transaction });
            const updatedTelefonoDepartamento = await db.TelefonoDepartamento.findByPk(telefonoDepartamento.TelefonoDepartamentoID, { transaction });
            expect(updatedTelefonoDepartamento.Telefono).toBe('555-9999');
        });
    });

    describe('Relationships', () => {
        test('TelefonoDepartamento has many MiembroRectoria', async () => {
            const telefonoDepartamento = await db.TelefonoDepartamento.create({
                Telefono: '555-2222'
            }, { transaction });
            const miembro1 = await db.MiembroRectoria.create({
                Nombre: 'Alice',
                PrimerApellido: 'Smith',
                Correo: 'alice@example.com',
                TelefonoDepartamentoID: telefonoDepartamento.TelefonoDepartamentoID
            }, { transaction });
            const miembro2 = await db.MiembroRectoria.create({
                Nombre: 'Bob',
                PrimerApellido: 'Jones',
                Correo: 'bob@example.com',
                TelefonoDepartamentoID: telefonoDepartamento.TelefonoDepartamentoID
            }, { transaction });
            const relatedTelefonoDepartamento = await db.TelefonoDepartamento.findOne({
                include: [{
                    model: db.MiembroRectoria,
                    as: 'MiembrosRectoria'
                }],
                where: { TelefonoDepartamentoID: telefonoDepartamento.TelefonoDepartamentoID },
                transaction
            });
            expect(relatedTelefonoDepartamento.MiembrosRectoria.length).toBe(2);
            expect(relatedTelefonoDepartamento.MiembrosRectoria[0].Nombre).toBe('Alice');
            expect(relatedTelefonoDepartamento.MiembrosRectoria[1].Nombre).toBe('Bob');
        });
    });

    describe('Validations', () => {
        test('Fail to create TelefonoDepartamento with invalid data', async () => {
            await expect(db.TelefonoDepartamento.create({
                // No phone number provided
            }, { transaction })).rejects.toThrow();
        });
    });
});
