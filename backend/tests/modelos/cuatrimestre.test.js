// Import necessary configurations and database models
require('dotenv').config();
const db = require('../../modelos');

// Setup to run before and after all tests
beforeAll(async () => {
    try {
        // Force synchronize the database
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
    // Start a transaction before each test
    transaction = await db.sequelize.transaction();
});

afterEach(async () => {
    // Roll back transaction after each test to discard changes
    await transaction.rollback();
});

describe('Cuatrimestre Model', () => {
    describe('CRUD operations', () => {
        test('Create a new Cuatrimestre', async () => {
            const newCuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '1'
            }, { transaction });

            expect(newCuatrimestre.Anho).toBe(2024);
            expect(newCuatrimestre.Periodo).toBe('1');
        });

        test('Read a Cuatrimestre', async () => {
            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2025,
                Periodo: '2'
            }, { transaction });

            const foundCuatrimestre = await db.Cuatrimestre.findByPk(cuatrimestre.CuatrimestreID, { transaction });
            expect(foundCuatrimestre.Anho).toBe(2025);
            expect(foundCuatrimestre.Periodo).toBe('2');
        });

        test('Update a Cuatrimestre', async () => {
            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2026,
                Periodo: '3'
            }, { transaction });

            cuatrimestre.Anho = 2027;
            await cuatrimestre.save({ transaction });

            const updatedCuatrimestre = await db.Cuatrimestre.findByPk(cuatrimestre.CuatrimestreID, { transaction });
            expect(updatedCuatrimestre.Anho).toBe(2027);
        });
    });

    describe('Relationships', () => {
        test('Cuatrimestre has many Disponibilidades', async () => {
            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '1'
            }, { transaction });

            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'John Doe',
                PrimerApellido: 'Doe',
                Correo: 'johndoe@example.com'
            }, { transaction });

            const dia = await db.Dia.create({
                Nombre: 'Lunes'
            }, { transaction });

            const sede = await db.Sede.create({
                Nombre: 'Main Campus'
            }, { transaction });

            const actividad = await db.Actividad.create({
                Nombre: 'Lecture',
                Disponible: true
            }, { transaction });

            await db.Disponibilidad.create({
                MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
                CuatrimestreID: cuatrimestre.CuatrimestreID,
                DiaID: dia.DiaID,
                SedeID: sede.SedeID,
                ActividadID: actividad.ActividadID,
                HoraInicio: '09:00',
                HoraFinal: '17:00'
            }, { transaction });

            const relatedCuatrimestre = await db.Cuatrimestre.findOne({
                include: [{
                    model: db.Disponibilidad,
                    as: 'Disponibilidades'
                }],
                where: { CuatrimestreID: cuatrimestre.CuatrimestreID },
                transaction
            });

            expect(relatedCuatrimestre.Disponibilidades.length).toBeGreaterThan(0);
        });
    });

    describe('Validations', () => {
        test('Fail to create Cuatrimestre with invalid data', async () => {
            await expect(db.Cuatrimestre.create({
                Anho: 2028
                // Missing 'Periodo' field
            }, { transaction })).rejects.toThrow();
        });
    });
});
