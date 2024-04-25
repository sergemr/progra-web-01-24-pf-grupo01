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

describe('Puesto Model', () => {
    describe('CRUD operations', () => {
        test('Create a new Puesto', async () => {
            const puesto = await db.Puesto.create({
                Nombre: 'Director'
            }, { transaction });
            expect(puesto.Nombre).toBe('Director');
        });

        test('Read a Puesto', async () => {
            const puesto = await db.Puesto.create({
                Nombre: 'Coordinator'
            }, { transaction });
            const foundPuesto = await db.Puesto.findByPk(puesto.PuestoID, { transaction });
            expect(foundPuesto.Nombre).toBe('Coordinator');
        });

        test('Update a Puesto', async () => {
            const puesto = await db.Puesto.create({
                Nombre: 'Assistant'
            }, { transaction });
            puesto.Nombre = 'Senior Assistant';
            await puesto.save({ transaction });
            const updatedPuesto = await db.Puesto.findByPk(puesto.PuestoID, { transaction });
            expect(updatedPuesto.Nombre).toBe('Senior Assistant');
        });
    });

    describe('Relationships', () => {
        test('Puesto has many MiembroRectoria', async () => {
            const puesto = await db.Puesto.create({
                Nombre: 'Vice President'
            }, { transaction });

            const miembroRectoria1 = await db.MiembroRectoria.create({
                Nombre: 'Alice',
                PrimerApellido: 'Smith',
                Correo: 'alice.smith@example.com',
                PuestoID: puesto.PuestoID
            }, { transaction });

            const miembroRectoria2 = await db.MiembroRectoria.create({
                Nombre: 'Bob',
                PrimerApellido: 'Johnson',
                Correo: 'bob.johnson@example.com',
                PuestoID: puesto.PuestoID
            }, { transaction });

            const relatedPuesto = await db.Puesto.findOne({
                include: [{
                    model: db.MiembroRectoria,
                    as: 'MiembrosRectoria'
                }],
                where: { PuestoID: puesto.PuestoID },
                transaction
            });

            expect(relatedPuesto.MiembrosRectoria.length).toBeGreaterThan(0);
            expect(relatedPuesto.MiembrosRectoria.map(m => m.Nombre)).toEqual(expect.arrayContaining(['Alice', 'Bob']));
        });
    });

    describe('Validations', () => {
        test('Fail to create Puesto with invalid data', async () => {
            await expect(db.Puesto.create({}, { transaction })).rejects.toThrow();
        });
    });
});
