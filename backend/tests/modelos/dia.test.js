// tests/modelos/dia.test.js

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

describe('Dia Model', () => {
    describe('CRUD operations', () => {
        test('Create a new Dia', async () => {
            const dia = await db.Dia.create({
                Nombre: 'Lunes'
            }, { transaction });
            expect(dia.Nombre).toBe('Lunes');
        });

        test('Read a Dia', async () => {
            const dia = await db.Dia.create({
                Nombre: 'Martes'
            }, { transaction });
            const foundDia = await db.Dia.findByPk(dia.DiaID, { transaction });
            expect(foundDia.Nombre).toBe('Martes');
        });

        test('Update a Dia', async () => {
            const dia = await db.Dia.create({
                Nombre: 'Miércoles'
            }, { transaction });
            dia.Nombre = 'Jueves';
            await dia.save({ transaction });
            const updatedDia = await db.Dia.findByPk(dia.DiaID, { transaction });
            expect(updatedDia.Nombre).toBe('Jueves');
        });
    });

    describe('Relationships', () => {
        test('Dia has many Disponibilidades', async () => {
            const dia = await db.Dia.create({
                Nombre: 'Viernes'
            }, { transaction });

            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'John Doe',
                PrimerApellido: 'Doe',
                Correo: 'johndoe@example.com'
            }, { transaction });

            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '1'
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

            const relatedDia = await db.Dia.findOne({
                include: [{
                    model: db.Disponibilidad,
                    as: 'disponibilidades'
                }],
                where: { DiaID: dia.DiaID },
                transaction
            });

            expect(relatedDia.disponibilidades.length).toBeGreaterThan(0);
            expect(relatedDia.disponibilidades[0].HoraInicio).toBe('09:00:00');
        });
    });

    describe('Validations', () => {
        test('Fail to create Dia with invalid data', async () => {
            await expect(db.Dia.create({}, { transaction })).rejects.toThrow();
        });
    });
});
