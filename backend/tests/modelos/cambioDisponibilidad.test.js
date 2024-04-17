require('dotenv').config();
const db = require('../../modelos');

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

let transaction;
beforeEach(async () => {
    transaction = await db.sequelize.transaction();
});

afterEach(async () => {
    await transaction.rollback();
});

describe('CambioDisponibilidad Model', () => {
    describe('CRUD operations', () => {
        test('Create a new CambioDisponibilidad', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'Jane',
                PrimerApellido: 'Doe',
                Correo: 'janedoe@example.com'
            }, { transaction });

            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '2'
            }, { transaction });

            const actividad = await db.Actividad.create({
                Nombre: 'Seminar',
                Descripcion: 'Online educational seminar',
                Disponible: true
            }, { transaction });

            const cambioDisponibilidad = await db.CambioDisponibilidad.create({
                MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
                CuatrimestreID: cuatrimestre.CuatrimestreID,
                ActividadID: actividad.ActividadID,
                Ubicacion: 'Room 101',
                FechaHoraInicio: new Date(2024, 3, 15, 9, 0, 0),
                FechaHoraFinal: new Date(2024, 3, 15, 11, 0, 0)
            }, { transaction });

            expect(cambioDisponibilidad.MiembroRectoriaID).toBe(miembroRectoria.MiembroRectoriaID);
            expect(cambioDisponibilidad.Ubicacion).toBe('Room 101');
        });

        test('Read a CambioDisponibilidad', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'John',
                PrimerApellido: 'Doe',
                Correo: 'johndoe@example.com'
            }, { transaction });
            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '1'
            }, { transaction });
            const actividad = await db.Actividad.create({
                Nombre: 'Conference',
                Descripcion: 'Annual tech conference',
                Disponible: true
            }, { transaction });

            const cambioDisponibilidad = await db.CambioDisponibilidad.create({
                MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
                CuatrimestreID: cuatrimestre.CuatrimestreID,
                ActividadID: actividad.ActividadID,
                FechaHoraInicio: new Date(),
                FechaHoraFinal: new Date()
            }, { transaction });

            const foundCambioDisponibilidad = await db.CambioDisponibilidad.findByPk(cambioDisponibilidad.CambioDisponibilidadID, { transaction });
            expect(foundCambioDisponibilidad.ActividadID).toBe(actividad.ActividadID);
        });

        test('Update a CambioDisponibilidad', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'John',
                PrimerApellido: 'Doe',
                Correo: 'johndoe@example.com'
            }, { transaction });
            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '1'
            }, { transaction });
            const actividad = await db.Actividad.create({
                Nombre: 'Workshop',
                Disponible: true
            }, { transaction });

            const cambioDisponibilidad = await db.CambioDisponibilidad.create({
                MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
                CuatrimestreID: cuatrimestre.CuatrimestreID,
                ActividadID: actividad.ActividadID,
                FechaHoraInicio: new Date(),
                FechaHoraFinal: new Date(),
                Ubicacion: 'Room 102'
            }, { transaction });

            cambioDisponibilidad.Ubicacion = 'Updated Room 202';
            await cambioDisponibilidad.save({ transaction });

            const updatedCambioDisponibilidad = await db.CambioDisponibilidad.findByPk(cambioDisponibilidad.CambioDisponibilidadID, { transaction });
            expect(updatedCambioDisponibilidad.Ubicacion).toBe('Updated Room 202');
        });
    });

    describe('Relationships', () => {
        test('CambioDisponibilidad belongs to Actividad, MiembroRectoria, and Cuatrimestre', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'John',
                PrimerApellido: 'Doe',
                Correo: 'johndoe@example.com'
            }, { transaction });

            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '1'
            }, { transaction });

            const actividad = await db.Actividad.create({
                Nombre: 'Workshop',
                Disponible: true
            }, { transaction });

            const cambioDisponibilidad = await db.CambioDisponibilidad.create({
                MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
                CuatrimestreID: cuatrimestre.CuatrimestreID,
                ActividadID: actividad.ActividadID,
                FechaHoraInicio: new Date(),
                FechaHoraFinal: new Date()
            }, { transaction });

            const relatedCambioDisponibilidad = await db.CambioDisponibilidad.findOne({
                include: [
                    { model: db.MiembroRectoria, as: 'MiembroRectoria' },
                    { model: db.Cuatrimestre, as: 'Cuatrimestre' },
                    { model: db.Actividad, as: 'Actividad' }
                ],
                where: { CambioDisponibilidadID: cambioDisponibilidad.CambioDisponibilidadID },
                transaction
            });

            expect(relatedCambioDisponibilidad.MiembroRectoria.Nombre).toBe('John');
            expect(relatedCambioDisponibilidad.Cuatrimestre.Periodo).toBe('1');
            expect(relatedCambioDisponibilidad.Actividad.Nombre).toBe('Workshop');
        });
    });

    describe('Validations', () => {
        test('Fail to create CambioDisponibilidad with invalid data', async () => {
            await expect(db.CambioDisponibilidad.create({
                FechaHoraInicio: new Date(),
                FechaHoraFinal: new Date()
            }, { transaction })).rejects.toThrow();
        });
    });
});
