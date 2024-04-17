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

describe('MiembroRectoria Model', () => {
    describe('CRUD operations', () => {
        test('Create a new MiembroRectoria', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'John',
                PrimerApellido: 'Smith',
                Correo: 'john.smith@example.com'
            }, { transaction });
            expect(miembroRectoria.Nombre).toBe('John');
            expect(miembroRectoria.PrimerApellido).toBe('Smith');
            expect(miembroRectoria.Correo).toBe('john.smith@example.com');
        });

        test('Read a MiembroRectoria', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'Jane',
                PrimerApellido: 'Doe',
                Correo: 'jane.doe@example.com'
            }, { transaction });
            const foundMiembroRectoria = await db.MiembroRectoria.findByPk(miembroRectoria.MiembroRectoriaID, { transaction });
            expect(foundMiembroRectoria.Nombre).toBe('Jane');
        });

        test('Update a MiembroRectoria', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'Alice',
                PrimerApellido: 'Wonderland',
                Correo: 'alice@example.com'
            }, { transaction });
            miembroRectoria.Nombre = 'Alice Updated';
            await miembroRectoria.save({ transaction });
            const updatedMiembroRectoria = await db.MiembroRectoria.findByPk(miembroRectoria.MiembroRectoriaID, { transaction });
            expect(updatedMiembroRectoria.Nombre).toBe('Alice Updated');
        });
    });

    describe('Relationships', () => {
        test('MiembroRectoria has many Disponibilidad', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'John',
                PrimerApellido: 'Doe',
                Correo: 'johndoe@example.com'
            }, { transaction });
            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '1'
            }, { transaction });
            const dia = await db.Dia.create({
                Nombre: 'Lunes'
            }, { transaction });
            const sede = await db.Sede.create({
                Nombre: 'Main Campus'
            }, { transaction });
            const actividad = await db.Actividad.create({
                Nombre: 'Seminar',
                Disponible: true
            }, { transaction });
            await db.Disponibilidad.create({
                MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
                CuatrimestreID: cuatrimestre.CuatrimestreID,
                DiaID: dia.DiaID,
                SedeID: sede.SedeID,
                ActividadID: actividad.ActividadID,
                HoraInicio: '10:00',
                HoraFinal: '12:00'
            }, { transaction });
            const relatedMiembroRectoria = await db.MiembroRectoria.findOne({
                include: [{
                    model: db.Disponibilidad,
                    as: 'Disponibilidad'
                }],
                where: { MiembroRectoriaID: miembroRectoria.MiembroRectoriaID },
                transaction
            });
            expect(relatedMiembroRectoria.Disponibilidad.length).toBeGreaterThan(0);
        });
    });

    describe('Validations', () => {
        test('Fail to create MiembroRectoria with invalid data', async () => {
            await expect(db.MiembroRectoria.create({
                // Missing 'Nombre' field
                PrimerApellido: 'Doe',
                Correo: 'johndoe@example.com'
            }, { transaction })).rejects.toThrow();
        });
    });
});
