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

describe('Sede Model', () => {
    describe('CRUD operations', () => {
        test('Create a new Sede', async () => {
            const sede = await db.Sede.create({
                Nombre: 'Main Campus'
            }, { transaction });
            expect(sede.Nombre).toBe('Main Campus');
        });

        test('Read a Sede', async () => {
            const sede = await db.Sede.create({
                Nombre: 'Downtown Campus'
            }, { transaction });
            const foundSede = await db.Sede.findByPk(sede.SedeID, { transaction });
            expect(foundSede.Nombre).toBe('Downtown Campus');
        });

        test('Update a Sede', async () => {
            const sede = await db.Sede.create({
                Nombre: 'East Campus'
            }, { transaction });
            sede.Nombre = 'Updated East Campus';
            await sede.save({ transaction });
            const updatedSede = await db.Sede.findByPk(sede.SedeID, { transaction });
            expect(updatedSede.Nombre).toBe('Updated East Campus');
        });
    });

    describe('Relationships', () => {
        test('Sede has many Disponibilidades', async () => {
            const sede = await db.Sede.create({
                Nombre: 'West Campus'
            }, { transaction });
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'Jane Doe',
                PrimerApellido: 'Doe',
                Correo: 'janedoe@example.com'
            }, { transaction });
            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '1'
            }, { transaction });
            const dia = await db.Dia.create({
                Nombre: 'Lunes'
            }, { transaction });
            const actividad = await db.Actividad.create({
                Nombre: 'Workshop',
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
            const relatedSede = await db.Sede.findOne({
                include: [{
                    model: db.Disponibilidad,
                    as: 'Disponibilidades'
                }],
                where: { SedeID: sede.SedeID },
                transaction
            });
            expect(relatedSede.Disponibilidades.length).toBeGreaterThan(0);
            expect(relatedSede.Disponibilidades[0].HoraInicio).toBe('10:00:00');
        });
    });

    describe('Validations', () => {
        test('Fail to create Sede with invalid data', async () => {
            await expect(db.Sede.create({}, { transaction })).rejects.toThrow();
        });
    });
});
